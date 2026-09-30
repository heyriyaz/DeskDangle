import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { CharmRegistry } from '../charms/charmRegistry';
import { DebugOverlay, DebugMetrics } from './DebugOverlay';
import { QuickContextMenu } from './QuickContextMenu';
import { QuickCharmDrawer } from './QuickCharmDrawer';
import { ParticleSystem } from './ParticleSystem';
import { useDangleSettings } from '../store/settingsStore';

import { soundEffects } from '../audio/SoundEffects';

export const DangleCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const physicsRef = useRef<PhysicsWorld | null>(null);
  const particleSystemRef = useRef<ParticleSystem>(new ParticleSystem());
  const animFrameRef = useRef<number>(0);

  // Settings
  const [settings, updateSettings] = useDangleSettings();

  // Overlay states
  const [showDebug, setShowDebug] = useState(false);
  const [showWireframes, setShowWireframes] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [showQuickDrawer, setShowQuickDrawer] = useState(false);

  // Metrics
  const [metrics, setMetrics] = useState<DebugMetrics>({
    fps: 60,
    isPaused: false,
    isDragging: false,
    charmPos: { x: window.innerWidth / 2, y: 220 },
    charmVel: { x: 0, y: 0 },
    charmSpeed: 0,
    charmAngle: 0,
    segmentCount: 7,
  });

  // Event & throttle refs
  const isHoveredRef = useRef(false);
  const isNearAnchorRef = useRef(false);
  const isMouseIgnoredRef = useRef(true);
  const fpsFramesRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  const lastMetricsUpdateRef = useRef(0);
  const lastBoundsUpdateRef = useRef(0);
  const lastReportedBoundsRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const prevRenderBoxRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const forceFullClearRef = useRef(true);
  const currentFpsRef = useRef(60);
  const lastPointerDownTimeRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const lastPointerMoveTimeRef = useRef(performance.now());
  const lastPointerPosRef = useRef({ x: 0, y: 0 });

  // Current active charm
  const currentCharm = CharmRegistry.getCharmById(settings.selectedCharmId);

  // Sync active UI state with Electron
  useEffect(() => {
    const hasUI = contextMenuPos !== null || showQuickDrawer;
    window.electronAPI?.setActiveUI(hasUI);
  }, [contextMenuPos, showQuickDrawer]);

  // Set Electron Mouse Pass-through Helper
  const setMousePassThrough = useCallback((ignore: boolean) => {
    if (isMouseIgnoredRef.current !== ignore) {
      isMouseIgnoredRef.current = ignore;
      window.electronAPI?.setIgnoreMouseEvents(ignore, true);
    }
  }, []);

  // Update physics world live when settings change
  useEffect(() => {
    if (physicsRef.current) {
      physicsRef.current.updatePhysicsSettings(settings.physics);
      physicsRef.current.updateCharm(currentCharm, settings.charmScale);
      physicsRef.current.updateRopeSettings(settings.rope);
      if (settings.general.anchorXPercent !== undefined) {
        const newX = Math.round((window.innerWidth || 1920) * settings.general.anchorXPercent);
        physicsRef.current.setAnchorPosition(newX, 0);
      }
    }
  }, [settings, currentCharm]);

  // Main Canvas & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth || 1920;
    let height = window.innerHeight || 1080;

    // Initialize Physics World with full-screen bounds
    const physics = new PhysicsWorld(
      width,
      height,
      currentCharm,
      settings.charmScale,
      settings.rope,
      settings.physics
    );
    physicsRef.current = physics;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isDestroyed = false;

    // High-DPI Canvas scaling for full-screen display
    const updateCanvasResolution = () => {
      width = window.innerWidth || 1920;
      height = window.innerHeight || 1080;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      physics.resize(width, height);
    };

    updateCanvasResolution();
    window.addEventListener('resize', updateCanvasResolution);

    // Animation & Physics Loop
    const loop = (time: number) => {
      if (isDestroyed) return;

      const now = time || performance.now();
      fpsFramesRef.current++;
      if (now - lastFpsTimeRef.current >= 500) {
        currentFpsRef.current = Math.round(
          (fpsFramesRef.current * 1000) / (now - lastFpsTimeRef.current)
        );
        fpsFramesRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      // Step Physics with 120Hz/60Hz substepping accumulator
      physics.step(now);

      // Update particle effects
      particleSystemRef.current.update();

      const nodes = physics.rope.getNodePoints(physics.charm);
      const charmPos = physics.charm.getPosition();
      const charmAngle = physics.charm.getAngle();
      const dragging = physics.getIsDragging();
      const hovered = isHoveredRef.current;
      const charmRadius = physics.charm.radius + 24;
      const anchorX = physics.rope.anchorX;

      // 1. Calculate current frame render bounding box
      let minX = Math.min(anchorX, charmPos.x - charmRadius);
      let maxX = Math.max(anchorX, charmPos.x + charmRadius);
      let minY = 0;
      let maxY = charmPos.y + charmRadius;

      for (const node of nodes) {
        if (node.x < minX) minX = node.x;
        if (node.x > maxX) maxX = node.x;
        if (node.y < minY) minY = node.y;
        if (node.y > maxY) maxY = node.y;
      }

      const pBounds = particleSystemRef.current.getBounds();
      if (pBounds) {
        if (pBounds.minX < minX) minX = pBounds.minX;
        if (pBounds.maxX > maxX) maxX = pBounds.maxX;
        if (pBounds.minY < minY) minY = pBounds.minY;
        if (pBounds.maxY > maxY) maxY = pBounds.maxY;
      }

      const pad = 36;
      const curBox = {
        x: Math.max(0, Math.floor(minX - pad)),
        y: Math.max(0, Math.floor(minY)),
        width: Math.min(width, Math.ceil(maxX - minX + pad * 2)),
        height: Math.min(height, Math.ceil(maxY - minY + pad * 2)),
      };

      // 2. Clear only dirty union rectangle for huge GPU fill-rate performance gains
      const prevBox = prevRenderBoxRef.current;
      if (prevBox && !forceFullClearRef.current) {
        const dirtyX = Math.max(0, Math.min(prevBox.x, curBox.x));
        const dirtyY = Math.max(0, Math.min(prevBox.y, curBox.y));
        const dirtyRight = Math.min(width, Math.max(prevBox.x + prevBox.width, curBox.x + curBox.width));
        const dirtyBottom = Math.min(height, Math.max(prevBox.y + prevBox.height, curBox.y + curBox.height));
        ctx.clearRect(dirtyX, dirtyY, dirtyRight - dirtyX, dirtyBottom - dirtyY);
      } else {
        ctx.clearRect(0, 0, width, height);
        forceFullClearRef.current = false;
      }
      prevRenderBoxRef.current = curBox;

      // 3. Draw Rope Cord
      physics.rope.draw(ctx, nodes);

      // 4. Draw Subtle Top Anchor Slide Handle when hovered near top edge
      if (isNearAnchorRef.current || isHoveredRef.current) {
        drawTopAnchorHandle(ctx, physics.rope.anchorX);
      }

      // 5. Draw Charm
      CharmRegistry.renderCharm(
        ctx,
        physics.charm.charm,
        charmPos.x,
        charmPos.y,
        charmAngle,
        hovered,
        dragging,
        settings.charmScale
      );

      // 6. Draw Particles (if active and enabled)
      if (settings.general.particlesEnabled !== false) {
        particleSystemRef.current.draw(ctx);
      }

      // 7. Draw Debug Wireframes
      if (showWireframes) {
        drawDebugWireframes(ctx, physics, nodes);
      }

      // 8. Throttled & Deduplicated Bounds Reporting to Electron Main Process
      if (now - lastBoundsUpdateRef.current > 35) {
        lastBoundsUpdateRef.current = now;
        const interactiveBox = {
          x: Math.max(0, minX - charmRadius - 20),
          y: Math.max(0, minY),
          width: Math.max(80, maxX - minX + (charmRadius + 20) * 2),
          height: Math.max(80, maxY - minY + charmRadius + 20),
        };

        const anchorBox = {
          x: Math.max(0, anchorX - 50),
          y: 0,
          width: 100,
          height: 38,
        };

        const prev = lastReportedBoundsRef.current;
        const changed =
          !prev ||
          Math.abs(prev.x - interactiveBox.x) > 1.5 ||
          Math.abs(prev.y - interactiveBox.y) > 1.5 ||
          Math.abs(prev.width - interactiveBox.width) > 2 ||
          Math.abs(prev.height - interactiveBox.height) > 2;

        if (changed) {
          lastReportedBoundsRef.current = interactiveBox;
          window.electronAPI?.updateInteractiveBounds([interactiveBox, anchorBox]);
        }
      }

      // 9. Throttled Metrics (only when Debug HUD is active)
      if (showDebug && now - lastMetricsUpdateRef.current > 100) {
        lastMetricsUpdateRef.current = now;
        setMetrics({
          fps: currentFpsRef.current,
          isPaused: physics.getIsPaused(),
          isDragging: dragging,
          charmPos,
          charmVel: physics.charm.getVelocity(),
          charmSpeed: physics.charm.getSpeed(),
          charmAngle,
          segmentCount: physics.rope.segments.length,
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    // Electron IPC Subscriptions
    const unsubTogglePhysics = window.electronAPI?.onTogglePhysics(() => {
      if (physicsRef.current) {
        const isPaused = physicsRef.current.togglePause();
        setMetrics((m) => ({ ...m, isPaused }));
      }
    });

    const unsubToggleDebug = window.electronAPI?.onToggleDebug(() => {
      setShowDebug((prev) => !prev);
    });

    const unsubRandomCharm = window.electronAPI?.onRandomCharm(() => {
      const random = CharmRegistry.getRandomCharm(settings.selectedCharmId);
      soundEffects.playCharmSwitchSound();
      updateSettings({ selectedCharmId: random.id });
    });

    const unsubVisibility = window.electronAPI?.onToggleVisibility((visible) => {
      if (physicsRef.current) {
        physicsRef.current.setPaused(!visible);
      }
    });

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (physicsRef.current) {
          const isPaused = physicsRef.current.togglePause();
          setMetrics((m) => ({ ...m, isPaused }));
        }
      }
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'x') ||
        e.key === 'F3'
      ) {
        e.preventDefault();
        setShowDebug((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        const random = CharmRegistry.getRandomCharm(settings.selectedCharmId);
        soundEffects.playCharmSwitchSound();
        updateSettings({ selectedCharmId: random.id });
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        window.electronAPI?.openSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', updateCanvasResolution);
      window.removeEventListener('keydown', handleKeyDown);
      unsubTogglePhysics?.();
      unsubToggleDebug?.();
      unsubRandomCharm?.();
      unsubVisibility?.();
      physics.destroy();
    };
  }, [showWireframes]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const physics = physicsRef.current;
    if (!physics) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle Right Click -> Context Menu
    if (e.button === 2) {
      if (physics.isPointOnCharm(x, y) || physics.isPointNearInteractiveZone(x, y)) {
        setContextMenuPos({ x: e.clientX, y: e.clientY });
        setMousePassThrough(false);
      }
      return;
    }

    if (e.button === 0) {
      const now = performance.now();
      const timeSinceLast = now - lastPointerDownTimeRef.current;
      const distSinceLast = Math.hypot(
        x - pointerDownPosRef.current.x,
        y - pointerDownPosRef.current.y
      );

      lastPointerDownTimeRef.current = now;
      pointerDownPosRef.current = { x, y };

      if (physics.isPointNearInteractiveZone(x, y)) {
        if (physics.isPointOnCharm(x, y) && timeSinceLast < 320 && distSinceLast < 18) {
          // Double Click Action
          if (settings.general.doubleClickAction === 'settings') {
            window.electronAPI?.openSettings();
          } else if (settings.general.doubleClickAction === 'random') {
            const random = CharmRegistry.getRandomCharm(settings.selectedCharmId);
            soundEffects.playCharmSwitchSound();
            updateSettings({ selectedCharmId: random.id });
          } else if (settings.general.doubleClickAction === 'quick-drawer') {
            setShowQuickDrawer(true);
          } else {
            // Default: 'delight-burst'
            const charmPos = physics.charm.getPosition();
            if (settings.general.particlesEnabled !== false) {
              particleSystemRef.current.burst(charmPos.x, charmPos.y, 18, 'mixed');
            }
            physics.triggerDelightImpulse();
            soundEffects.playDelightChime();
          }
          return;
        }

        // Start Physics Drag across full screen (on top anchor, rope, or charm)
        e.currentTarget.setPointerCapture(e.pointerId);
        physics.startDrag(x, y);
        window.electronAPI?.setDragState(true);
        setContextMenuPos(null);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const physics = physicsRef.current;
    if (!physics) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerMoveTimeRef.current);
    const vx = (x - lastPointerPosRef.current.x) / dt;
    const vy = (y - lastPointerPosRef.current.y) / dt;
    lastPointerMoveTimeRef.current = now;
    lastPointerPosRef.current = { x, y };

    if (physics.getIsDragging()) {
      physics.updateDrag(x, y);
    } else {
      // Natural aerodynamic air displacement breeze
      if (settings.physics.airDisplacement !== false) {
        physics.applyAirDisplacement(x, y, vx, vy);
      }

      const nearAnchor = physics.isPointNearAnchor(x, y);
      const nearInteractive =
        physics.isPointNearInteractiveZone(x, y) ||
        contextMenuPos !== null ||
        showQuickDrawer;

      if (isNearAnchorRef.current !== nearAnchor) {
        isNearAnchorRef.current = nearAnchor;
      }

      if (isHoveredRef.current !== nearInteractive) {
        isHoveredRef.current = nearInteractive;
      }

      if (canvasRef.current) {
        canvasRef.current.style.cursor = nearAnchor ? 'ew-resize' : nearInteractive ? 'grab' : 'default';
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const physics = physicsRef.current;
    if (!physics) return;

    if (physics.getIsDragging()) {
      const result = physics.endDrag();
      window.electronAPI?.setDragState(false);

      if (result.newAnchorXPercent !== undefined) {
        updateSettings({
          general: {
            ...settings.general,
            anchorXPercent: result.newAnchorXPercent,
          },
        });
      }
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture release
      }
    }
  };

  const handlePointerLeave = () => {
    const physics = physicsRef.current;
    if (!physics || physics.getIsDragging()) return;

    isHoveredRef.current = false;
    isNearAnchorRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleResetPosition = () => {
    if (!physicsRef.current) return;
    const width = window.innerWidth || 1920;
    const height = window.innerHeight || 1080;
    physicsRef.current.destroy();
    const newPhysics = new PhysicsWorld(
      width,
      height,
      currentCharm,
      settings.charmScale,
      settings.rope,
      settings.physics
    );
    physicsRef.current = newPhysics;
  };

  return (
    <div
      ref={containerRef}
      className="dangle-container"
      onContextMenu={handleContextMenu}
    >
      <canvas
        ref={canvasRef}
        className="dangle-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />

      {/* Floating Context Menu */}
      {contextMenuPos && (
        <QuickContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          isPaused={physicsRef.current?.getIsPaused() || false}
          onSelectChangeCharm={() => setShowQuickDrawer(true)}
          onRandomCharm={() => {
            const random = CharmRegistry.getRandomCharm(settings.selectedCharmId);
            soundEffects.playCharmSwitchSound();
            updateSettings({ selectedCharmId: random.id });
          }}
          onTogglePause={() => {
            if (physicsRef.current) {
              const isPaused = physicsRef.current.togglePause();
              setMetrics((m) => ({ ...m, isPaused }));
            }
          }}
          onOpenSettings={() => {
            window.electronAPI?.openSettings();
          }}
          onHide={() => {
            window.electronAPI?.onToggleVisibility?.(() => {});
          }}
          onClose={() => setContextMenuPos(null)}
        />
      )}

      {/* Quick Charm Selector Drawer */}
      {showQuickDrawer && (
        <QuickCharmDrawer
          onClose={() => setShowQuickDrawer(false)}
          onOpenSettings={() => {
            window.electronAPI?.openSettings();
          }}
        />
      )}

      {/* Developer Debug HUD */}
      {showDebug && (
        <DebugOverlay
          metrics={metrics}
          showWireframes={showWireframes}
          onToggleWireframes={() => setShowWireframes((prev) => !prev)}
          onTogglePause={() => {
            if (physicsRef.current) {
              const isPaused = physicsRef.current.togglePause();
              setMetrics((m) => ({ ...m, isPaused }));
            }
          }}
          onResetPosition={handleResetPosition}
          onClose={() => setShowDebug(false)}
        />
      )}
    </div>
  );
};


// ==================== RENDERING HELPERS ====================

function drawTopAnchorHandle(ctx: CanvasRenderingContext2D, anchorX: number) {
  ctx.save();
  // Sleek subtle horizontal slider indicator dot at top edge
  ctx.beginPath();
  ctx.arc(anchorX, 1.5, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(anchorX - 10, 0, 20, 2.5, 1);
  ctx.fillStyle = 'rgba(234, 179, 8, 0.6)';
  ctx.fill();
  ctx.restore();
}

function drawDebugWireframes(
  ctx: CanvasRenderingContext2D,
  physics: PhysicsWorld,
  nodes: Array<{ x: number; y: number }>
) {
  ctx.save();
  for (let i = 0; i < nodes.length; i++) {
    ctx.beginPath();
    ctx.arc(nodes[i].x, nodes[i].y, 3, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? '#ef4444' : i === nodes.length - 1 ? '#eab308' : '#38bdf8';
    ctx.fill();
  }

  for (const seg of physics.rope.segments) {
    ctx.beginPath();
    ctx.arc(seg.position.x, seg.position.y, 3.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const charmPos = physics.charm.getPosition();
  const charmRadius = physics.charm.radius;
  ctx.beginPath();
  ctx.arc(charmPos.x, charmPos.y, charmRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const vel = physics.charm.getVelocity();
  const arrowScale = 6;
  ctx.beginPath();
  ctx.moveTo(charmPos.x, charmPos.y);
  ctx.lineTo(charmPos.x + vel.x * arrowScale, charmPos.y + vel.y * arrowScale);
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}
