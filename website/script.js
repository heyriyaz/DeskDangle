/**
 * Desk Dangle - Realistic In-Browser Physics & Multi-Canvas Controller
 * 100% Matching main app RopePhysics.ts & CharmRegistry.ts rendering
 */

// Charms Catalog with exact metadata & anchor offsets from main app
const CHARMS = [
  {
    id: 'evil-eye',
    name: 'Evil Eye',
    file: 'assets/charms/evil-eye.png',
    scale: 1.25,
    anchorOffset: 52,
    aspect: 1,
    renderOffset: (radius) => {
      const drawSize = radius * 3.4;
      const topOffset = 52 * 0.9;
      return { w: drawSize, h: drawSize, x: -drawSize / 2, y: -topOffset };
    }
  },
  {
    id: 'banana-cat',
    name: 'Banana Cat',
    file: 'assets/charms/banana-cat.png',
    scale: 1.25,
    anchorOffset: 52,
    aspect: 724 / 958,
    renderOffset: (radius) => {
      const drawH = radius * 3.5;
      const drawW = drawH * (724 / 958);
      const topOffset = 52 * 0.9;
      return { w: drawW, h: drawH, x: -drawW / 2, y: -topOffset - drawH * (24 / 958) };
    }
  },
  {
    id: 'cherry',
    name: 'Ruby Cherries',
    file: 'assets/charms/cherry.png',
    scale: 1.25,
    anchorOffset: 48,
    aspect: 959 / 1024,
    renderOffset: (radius) => {
      const drawH = radius * 3.3;
      const drawW = drawH * (959 / 1024);
      const topOffset = 48 * 0.9;
      return { w: drawW, h: drawH, x: -drawW / 2, y: -topOffset - drawH * (4 / 1024) };
    }
  },
  {
    id: 'glass-heart',
    name: 'Pink Heart',
    file: 'assets/charms/glass-heart.png',
    scale: 1.25,
    anchorOffset: 48,
    aspect: 959 / 1024,
    renderOffset: (radius) => {
      const drawW = radius * 3.2;
      const drawH = drawW * (959 / 1024);
      const topOffset = 48 * 0.9;
      return { w: drawW, h: drawH, x: -drawW / 2, y: -topOffset - drawH * (4 / 959) };
    }
  },
  {
    id: 'chonky-cat',
    name: 'Chonky Cat',
    file: 'assets/charms/chonky-cat.png',
    scale: 1.25,
    anchorOffset: 46,
    aspect: 675 / 786,
    renderOffset: (radius) => {
      const drawW = radius * 3.3;
      const drawH = drawW * (675 / 786);
      const topOffset = 46 * 0.9;
      return { w: drawW, h: drawH, x: -drawW / 2, y: -topOffset - drawH * (84 / 675) };
    }
  },
  {
    id: 'fluffy-kitten',
    name: 'Fluffy Kitten',
    file: 'assets/charms/fluffy-kitten.png',
    scale: 1.25,
    anchorOffset: 56,
    aspect: 881 / 913,
    renderOffset: (radius) => {
      const drawH = radius * 3.4;
      const drawW = drawH * (881 / 913);
      const topOffset = 56 * 0.9;
      return { w: drawW, h: drawH, x: -drawW / 2, y: -topOffset - drawH * (30 / 913) };
    }
  },
  {
    id: 'nimbu-mirchi',
    name: 'Nimbu Mirchi',
    file: 'assets/charms/nimbu-mirchi.png',
    scale: 1.25,
    anchorOffset: 52,
    aspect: 1,
    renderOffset: (radius) => {
      const drawSize = radius * 3.6;
      const topOffset = 52 * 0.9;
      return { w: drawSize, h: drawSize, x: -drawSize / 2, y: -topOffset };
    }
  },
  {
    id: 'hamsa-hand',
    name: 'Hamsa Hand',
    file: 'assets/charms/hamsa-hand.png',
    scale: 1.25,
    anchorOffset: 52,
    aspect: 1,
    renderOffset: (radius) => {
      const drawSize = radius * 3.4;
      const topOffset = 52 * 0.9;
      return { w: drawSize, h: drawSize, x: -drawSize / 2, y: -topOffset };
    }
  },
  {
    id: 'pink-cassette',
    name: 'Pink Cassette',
    file: 'assets/charms/pink-cassette.png',
    scale: 1.25,
    anchorOffset: 46,
    aspect: 682 / 1024,
    renderOffset: (radius) => {
      const drawW = radius * 3.5;
      const drawH = drawW * (682 / 1024);
      const topOffset = 46 * 0.9;
      return { w: drawW, h: drawH, x: -drawW / 2, y: -topOffset - drawH * (4 / 682) };
    }
  },
  {
    id: 'orange-cat',
    name: 'Orange Cat',
    file: 'assets/charms/orange-cat.png',
    scale: 1.25,
    anchorOffset: 46,
    aspect: 786 / 755,
    renderOffset: (radius) => {
      const drawW = radius * 3.3;
      const drawH = drawW * (786 / 755);
      const topOffset = 46 * 0.9;
      return { w: drawW, h: drawH, x: -drawW / 2, y: -topOffset - drawH * (163 / 786) };
    }
  }
];

// Preload high-resolution charm images
const loadedImages = {};
CHARMS.forEach((c) => {
  const img = new Image();
  img.src = c.file;
  loadedImages[c.id] = img;
});

// Shared state for the Sandbox
let sandboxCharm = CHARMS[0]; // Evil Eye as shown in screenshot
let sandboxScale = 1.15;
let sandboxAnchorPercent = 0.75; // 'Right' active as in screenshot

/**
 * Catmull-Rom to Cubic Bezier Spline Tracing (from RopePhysics.ts)
 */
function traceSpline(ctx, points) {
  if (points.length < 2) return;
  ctx.moveTo(points[0].x, points[0].y);

  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y);
    return;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

// Top bracket removed - rope connects cleanly & directly from top screen edge

// Rope connects directly to charm eyelet, matching main app RopePhysics.ts & CharmRegistry.ts

// ============================================================================
// Verlet Physics Engine with Main-App Realism
// ============================================================================
class RealisticDangleSimulation {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.getCharm = options.getCharm || (() => CHARMS[0]);
    this.getScale = options.getScale || (() => 1.0);
    this.getAnchorXPercent = options.getAnchorXPercent || (() => 0.5);

    this.numSegments = options.numSegments || 8;
    this.segmentLength = options.segmentLength || 17;
    this.gravity = 0.48;
    this.damping = 0.985;
    this.wind = 0.035;
    this.windTime = Math.random() * 10;

    this.points = [];
    this.sticks = [];
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.lastPos = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };

    this.resize();
    this.initRope();
    this.bindEvents();

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? 1.5 : 2.0;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.currentAnchorX = this.width * this.getAnchorXPercent();
  }

  initRope() {
    this.points = [];
    this.sticks = [];
    const targetX = this.width * this.getAnchorXPercent();
    this.currentAnchorX = targetX;

    // Anchor node directly at top edge
    this.points.push({
      x: targetX,
      y: 0,
      oldX: targetX,
      oldY: 0,
      pinned: true
    });

    for (let i = 1; i <= this.numSegments; i++) {
      const pX = targetX + Math.sin(i * 0.3) * 4;
      const pY = i * this.segmentLength;
      this.points.push({
        x: pX,
        y: pY,
        oldX: pX,
        oldY: pY,
        pinned: false
      });

      this.sticks.push({
        p0: this.points[i - 1],
        p1: this.points[i],
        length: this.segmentLength
      });
    }
  }

  updatePhysics() {
    // Smooth gliding of anchor X when position button is toggled
    const targetAnchorX = this.width * this.getAnchorXPercent();
    this.currentAnchorX += (targetAnchorX - this.currentAnchorX) * 0.15;
    this.points[0].x = this.currentAnchorX;
    this.points[0].oldX = this.currentAnchorX;

    this.windTime += 0.022;
    const currentWind = Math.sin(this.windTime) * this.wind;

    // 1. Verlet point integration
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if (p.pinned) continue;

      if (this.isDragging && i === this.points.length - 1) {
        continue;
      }

      const vx = (p.x - p.oldX) * this.damping;
      const vy = (p.y - p.oldY) * this.damping;

      p.oldX = p.x;
      p.oldY = p.y;

      p.x += vx + currentWind;
      p.y += vy + this.gravity;
    }

    // 2. Constraint relaxation (efficient 4-pass on mobile, 6-pass on desktop)
    const iterations = window.innerWidth < 768 ? 4 : 6;
    for (let iter = 0; iter < iterations; iter++) {
      for (const stick of this.sticks) {
        const dx = stick.p1.x - stick.p0.x;
        const dy = stick.p1.y - stick.p0.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const diff = (stick.length - dist) / dist;

        const offsetX = dx * diff * 0.5;
        const offsetY = dy * diff * 0.5;

        if (!stick.p0.pinned) {
          stick.p0.x -= offsetX;
          stick.p0.y -= offsetY;
        }
        if (!stick.p1.pinned && !(this.isDragging && stick.p1 === this.points[this.points.length - 1])) {
          stick.p1.x += offsetX;
          stick.p1.y += offsetY;
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const isMobile = window.innerWidth < 768;

    // 1. Realistic 3-Pass Rope directly from top screen edge (Identical to RopePhysics.ts)
    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    const cordThickness = 2.8;

    // Pass A: Soft natural depth drop shadow (optimized for mobile fill-rate)
    this.ctx.save();
    this.ctx.beginPath();
    traceSpline(this.ctx, this.points);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    this.ctx.lineWidth = cordThickness + 1.8;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
    this.ctx.shadowBlur = isMobile ? 2 : 6;
    this.ctx.shadowOffsetY = isMobile ? 1.5 : 3;
    this.ctx.stroke();
    this.ctx.restore();

    // Pass B: Base natural jute cord
    this.ctx.beginPath();
    traceSpline(this.ctx, this.points);
    this.ctx.strokeStyle = '#141413';
    this.ctx.lineWidth = cordThickness;
    this.ctx.stroke();

    // Pass C: Twisted cord fiber highlight
    this.ctx.save();
    this.ctx.beginPath();
    traceSpline(this.ctx, this.points);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    this.ctx.lineWidth = 0.9;
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.restore();

    // 3. Charm & Connector calculation
    const bob = this.points[this.points.length - 1];
    const prev = this.points[this.points.length - 2];
    const angle = Math.atan2(bob.y - prev.y, bob.x - prev.x) - Math.PI / 2;

    const currentCharm = this.getCharm();
    const img = loadedImages[currentCharm.id];
    const globalScale = this.getScale();
    const baseRadius = 30;

    // 4. Draw Photorealistic Charm
    this.ctx.save();
    this.ctx.translate(bob.x, bob.y);
    this.ctx.rotate(angle);

    const finalScale = (currentCharm.scale || 1.25) * globalScale;
    this.ctx.scale(finalScale, finalScale);

    // Natural charm shadow (GPU-friendly on mobile)
    this.ctx.shadowColor = this.isDragging ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.22)';
    this.ctx.shadowBlur = this.isDragging ? (isMobile ? 8 : 18) : (isMobile ? 4 : 12);
    this.ctx.shadowOffsetY = this.isDragging ? (isMobile ? 5 : 12) : (isMobile ? 3 : 7);

    if (img && img.complete && img.naturalWidth > 0) {
      if (currentCharm.renderOffset) {
        const offset = currentCharm.renderOffset(baseRadius);
        this.ctx.drawImage(img, offset.x, offset.y, offset.w, offset.h);
      } else {
        const size = baseRadius * 2.8;
        this.ctx.drawImage(img, -size / 2, 0, size, size);
      }
    }

    this.ctx.restore();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initRope();
    });

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : (e.clientX || 0);
      const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : (e.clientY || 0);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        clientX,
        clientY
      };
    };

    const onStart = (e) => {
      if (!this.points || this.points.length === 0) return;
      const rect = this.canvas.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const pos = getPos(e);
      const bob = this.points[this.points.length - 1];
      const dx = pos.x - bob.x;
      const dy = pos.y - (bob.y + 25);
      const dist = Math.hypot(dx, dy);

      // Generous hit radius: 115px on mobile phones, 85px on desktop
      const isMobile = window.innerWidth < 768;
      const hitRadius = isMobile ? 115 : 85;

      if (dist < hitRadius) {
        this.isDragging = true;
        this.dragOffset = { x: bob.x - pos.x, y: bob.y - pos.y };
        this.lastPos = pos;
        this.touchStartTime = Date.now();
        this.dragDist = 0;
        this.canvas.style.pointerEvents = 'auto';

        // Playful spring reaction on initial touch
        bob.oldX = bob.x - (dx * 0.35);
        bob.oldY = bob.y - (dy * 0.35);

        if (e.cancelable && e.type.startsWith('touch')) {
          e.preventDefault();
        }
      }
    };

    const onMove = (e) => {
      if (this.isDragging) {
        const pos = getPos(e);
        const bob = this.points[this.points.length - 1];
        bob.x = pos.x + this.dragOffset.x;
        bob.y = pos.y + this.dragOffset.y;

        const moveDx = pos.x - this.lastPos.x;
        const moveDy = pos.y - this.lastPos.y;
        this.dragDist = (this.dragDist || 0) + Math.hypot(moveDx, moveDy);

        this.velocity = {
          x: moveDx * 1.6,
          y: moveDy * 1.6
        };
        this.lastPos = pos;

        if (e.cancelable && e.type.startsWith('touch')) {
          e.preventDefault(); // Prevents page jiggle while dragging charm
        }
      }
    };

    const onEnd = () => {
      if (this.isDragging) {
        this.isDragging = false;
        const bob = this.points[this.points.length - 1];
        const elapsed = Date.now() - (this.touchStartTime || 0);

        // If tapped/touched quickly without big drag, trigger a springy elastic swing!
        if (elapsed < 320 && (this.dragDist || 0) < 18) {
          const tapImpulseX = (Math.random() > 0.5 ? 1 : -1) * (26 + Math.random() * 12);
          bob.oldX = bob.x - tapImpulseX;
          bob.oldY = bob.y - 15;
        } else {
          // Energetic fling release with natural momentum
          const flingX = Math.min(Math.max((this.velocity ? this.velocity.x : 0) * 2.2, -45), 45);
          const flingY = Math.min(Math.max((this.velocity ? this.velocity.y : 0) * 2.2, -45), 45);
          bob.oldX = bob.x - flingX;
          bob.oldY = bob.y - flingY;
        }

        if (window.innerWidth >= 768) {
          this.canvas.style.pointerEvents = 'none';
        }
      }
    };

    // Mouse listeners
    this.canvas.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Global touch listeners with passive: false so gestures are never missed
    window.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
  }

  nudge(force = 15) {
    const bob = this.points[this.points.length - 1];
    bob.oldX = bob.x - force;
  }

  loop() {
    if (!this.isPaused) {
      this.updatePhysics();
      this.draw();
    }
    requestAnimationFrame(this.loop);
  }
}

// ============================================================================
// INITIALIZE
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Canvas Simulation with Preloaded Charm for 0ms Instant Mobile Load
  const heroCanvas = document.getElementById('heroCanvas');
  let heroSim = null;
  let currentHeroCharm = CHARMS[0]; // Evil Eye (preloaded in head for 0-delay instant display)
  const charmNameEl = document.getElementById('heroCharmName');
  if (charmNameEl) charmNameEl.textContent = currentHeroCharm.name;

  if (heroCanvas) {
    heroSim = new RealisticDangleSimulation(heroCanvas, {
      getCharm: () => currentHeroCharm,
      getScale: () => (window.innerWidth < 768 ? 0.95 : 1.15),
      getAnchorXPercent: () => {
        if (window.innerWidth < 992) {
          // Hang charmingly from the top-right screen corner on mobile (never covers notch or text)
          return Math.max(0.75, (window.innerWidth - 65) / window.innerWidth);
        }
        const targetPixelX = Math.min(window.innerWidth - 180, Math.max(window.innerWidth / 2 + 120, window.innerWidth * 0.72));
        return targetPixelX / window.innerWidth;
      },
      numSegments: window.innerWidth < 768 ? 7 : 8,
      segmentLength: window.innerWidth < 768 ? 16 : 22
    });
  }

  // Shuffle button to roll another random charm
  const shuffleBtn = document.getElementById('randomizeCharmBtn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      let nextCharm;
      do {
        nextCharm = CHARMS[Math.floor(Math.random() * CHARMS.length)];
      } while (nextCharm.id === currentHeroCharm.id && CHARMS.length > 1);
      currentHeroCharm = nextCharm;
      if (charmNameEl) charmNameEl.textContent = currentHeroCharm.name;
      if (heroSim) heroSim.nudge(20);
    });
  }

  // Smart dynamic pointer-events so heroCanvas hangs in front of the navbar but never blocks its buttons
  if (heroCanvas) {
    window.addEventListener('mousemove', (e) => {
      if (!heroSim || !heroSim.points || heroSim.points.length === 0) return;
      if (heroSim.isDragging) {
        heroCanvas.style.pointerEvents = 'auto';
        heroCanvas.style.cursor = 'grabbing';
        return;
      }
      const rect = heroCanvas.getBoundingClientRect();
      const bob = heroSim.points[heroSim.points.length - 1];
      const charmScreenX = rect.left + bob.x;
      const charmScreenY = rect.top + bob.y;
      const dist = Math.hypot(e.clientX - charmScreenX, e.clientY - charmScreenY);

      if (dist < 110) {
        heroCanvas.style.pointerEvents = 'auto';
        heroCanvas.style.cursor = 'grab';
      } else {
        heroCanvas.style.pointerEvents = 'none';
        heroCanvas.style.cursor = 'default';
      }
    });

    // Realistic inertial swing when scrolling down or up the page
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (heroSim && heroSim.points && heroSim.points.length > 0 && !heroSim.isDragging) {
        const bob = heroSim.points[heroSim.points.length - 1];
        const impulse = Math.max(-20, Math.min(20, deltaY * 0.22));
        bob.x += impulse * 0.75;
        bob.y -= Math.abs(impulse) * 0.25;
      }
    }, { passive: true });

    // Double-click charm directly on screen to shuffle anytime
    let lastCharmClickTime = 0;
    heroCanvas.addEventListener('click', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      const bob = heroSim?.points[heroSim.points.length - 1];
      if (!bob) return;
      const dist = Math.hypot((e.clientX - rect.left) - bob.x, (e.clientY - rect.top) - bob.y);
      if (dist < 80) {
        const now = performance.now();
        if (now - lastCharmClickTime < 450) {
          shuffleBtn?.click();
        }
        lastCharmClickTime = now;
      }
    });
  }

  // 2. Sandbox Canvas
  const sandboxCanvas = document.getElementById('sandboxCanvas');
  let sandboxSim = null;
  if (sandboxCanvas) {
    sandboxSim = new RealisticDangleSimulation(sandboxCanvas, {
      getCharm: () => sandboxCharm,
      getScale: () => sandboxScale,
      getAnchorXPercent: () => sandboxAnchorPercent,
      numSegments: 7,
      segmentLength: 18
    });

    // Performance optimization: Pause simulation loop when off-screen to save 100% GPU/CPU on mobile
    if ('IntersectionObserver' in window) {
      const sbObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (sandboxSim) sandboxSim.isPaused = !entry.isIntersecting;
        });
      }, { rootMargin: '80px' });
      sbObserver.observe(sandboxCanvas);
    }
  }

  // 3. Render Charm Avatars in Sandbox
  const avatarRow = document.getElementById('sandboxAvatarRow');
  if (avatarRow) {
    const previewList = [CHARMS[1], CHARMS[2], CHARMS[4], CHARMS[3], CHARMS[0], CHARMS[5]];
    previewList.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = `dangle-avatar-btn ${c.id === sandboxCharm.id ? 'active' : ''}`;
      btn.title = c.name;
      btn.innerHTML = `<img src="${c.file}" alt="${c.name}" loading="lazy" />`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dangle-avatar-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        sandboxCharm = c;
        if (sandboxSim) sandboxSim.nudge(16);
      });
      avatarRow.appendChild(btn);
    });
  }

  // 4. Sandbox Size Slider
  const sizeSlider = document.getElementById('sandboxSizeSlider');
  const sizeVal = document.getElementById('sandboxSizeVal');
  if (sizeSlider && sizeVal) {
    sizeSlider.value = Math.round(sandboxScale * 100);
    sizeVal.textContent = sizeSlider.value + '%';
    sizeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      sizeVal.textContent = val + '%';
      sandboxScale = val / 100;
    });
  }

  // 5. Sandbox Position Segmented Buttons
  const posButtons = document.querySelectorAll('.pos-btn');
  posButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      posButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const pos = btn.getAttribute('data-pos');
      if (pos === 'left') sandboxAnchorPercent = 0.25;
      else if (pos === 'right') sandboxAnchorPercent = 0.75;
      else sandboxAnchorPercent = 0.5;

    });
  });

  // 6. Segmented Pill Menu with Smooth Sliding Glider & Hover Animation
  const pillNav = document.getElementById('navSegmentedPill');
  const pillGlider = document.getElementById('pillGlider');
  const pillLinks = document.querySelectorAll('.nav-segmented-pill .pill-item');
  let currentActivePill = null;

  function updateGlider(targetItem) {
    if (!pillGlider || !targetItem || !pillNav) return;
    const navRect = pillNav.getBoundingClientRect();
    const itemRect = targetItem.getBoundingClientRect();
    const leftOffset = itemRect.left - navRect.left;
    pillGlider.style.transform = `translateX(${leftOffset - 4}px)`;
    pillGlider.style.width = `${itemRect.width}px`;

    pillLinks.forEach((l) => {
      if (l === targetItem) {
        l.classList.add('is-selected');
        l.style.color = '#ffffff';
        l.style.fontWeight = '650';
      } else {
        l.classList.remove('is-selected');
        l.style.color = 'var(--text-body)';
        l.style.fontWeight = '500';
      }
    });
  }

  if (pillLinks.length > 0) {
    currentActivePill = document.querySelector('.nav-segmented-pill .pill-item.is-selected') || pillLinks[0];
    if (currentActivePill) {
      setTimeout(() => updateGlider(currentActivePill), 60);
    }

    pillLinks.forEach((link) => {
      // Hover animation: glider smoothly tracks whichever text button the cursor is in
      link.addEventListener('mouseenter', () => {
        updateGlider(link);
      });

      // Click: locks into place as active
      link.addEventListener('click', () => {
        pillLinks.forEach((l) => l.classList.remove('is-selected'));
        link.classList.add('is-selected');
        currentActivePill = link;
        updateGlider(link);
      });
    });

    // When cursor leaves the menu container, glide smoothly back to the active tab
    pillNav?.addEventListener('mouseleave', () => {
      if (currentActivePill) {
        updateGlider(currentActivePill);
      }
    });

    window.addEventListener('resize', () => {
      if (currentActivePill) updateGlider(currentActivePill);
    });

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 200;
      const sections = [
        { id: 'try-demo', link: document.querySelector('.nav-segmented-pill a[href="#try-demo"]') },
        { id: 'gallery', link: document.querySelector('.nav-segmented-pill a[href="#gallery"]') },
        { id: 'how-it-works', link: document.querySelector('.nav-segmented-pill a[href="#how-it-works"]') },
        { id: 'faq', link: document.querySelector('.nav-segmented-pill a[href="#faq"]') }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i].id);
        if (sec && sec.offsetTop <= scrollPos) {
          const matchedLink = sections[i].link;
          if (matchedLink && matchedLink !== currentActivePill) {
            pillLinks.forEach((l) => l.classList.remove('is-selected'));
            matchedLink.classList.add('is-selected');
            currentActivePill = matchedLink;
            updateGlider(matchedLink);
          }
          break;
        }
      }
    }, { passive: true });
  }

  // 7. FAQ Accordion Interaction
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (item) {
        item.classList.toggle('active');
      }
    });
  });

  // 8. Mac Waitlist Popover Interactions
  const macBtnWrap = document.getElementById('macBtnWrap');
  const openMacCardBtn = document.getElementById('openMacCardBtn');
  const closeMacPopoverBtn = document.getElementById('closeMacPopoverBtn');
  const macVoteBtn = document.getElementById('macVoteBtn');
  const macSuccessMsg = document.getElementById('macSuccessMsg');

  function toggleMacPopover() {
    macBtnWrap?.classList.toggle('open');
  }

  function closeMacPopover() {
    macBtnWrap?.classList.remove('open');
  }

  openMacCardBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMacPopover();
  });

  closeMacPopoverBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMacPopover();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (macBtnWrap && !macBtnWrap.contains(e.target)) {
      closeMacPopover();
    }
  });

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && macBtnWrap?.classList.contains('open')) {
      closeMacPopover();
    }
  });

  macVoteBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (macVoteBtn) macVoteBtn.style.display = 'none';
    if (macSuccessMsg) macSuccessMsg.style.display = 'inline-flex';
    
    setTimeout(() => {
      const subject = encodeURIComponent("I want the Mac version of Desk Dangle!");
      const body = encodeURIComponent("Hey Riyaz,\n\nI'd love to see Desk Dangle on macOS!\n\nBest,");
      window.location.href = `mailto:heyriodesign@gmail.com?subject=${subject}&body=${body}`;
    }, 450);
  });

  // 9. Mobile Sidebar Drawer Controls
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
  const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');

  function openSidebar() {
    document.body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
  }

  mobileMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openSidebar();
  });

  closeSidebarBtn?.addEventListener('click', closeSidebar);
  mobileSidebarOverlay?.addEventListener('click', closeSidebar);

  sidebarNavItems.forEach((item) => {
    item.addEventListener('click', closeSidebar);
  });

  // 10. Terms Modal Controls
  const termsLink = document.getElementById('termsLink');
  const closeTermsBtn = document.getElementById('closeTermsBtn');
  const termsModalOverlay = document.getElementById('termsModalOverlay');

  function openTerms(e) {
    if (e) e.preventDefault();
    document.body.classList.add('terms-open');
  }

  function closeTerms() {
    document.body.classList.remove('terms-open');
  }

  termsLink?.addEventListener('click', openTerms);
  closeTermsBtn?.addEventListener('click', closeTerms);
  termsModalOverlay?.addEventListener('click', closeTerms);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.body.classList.contains('sidebar-open')) closeSidebar();
      if (document.body.classList.contains('terms-open')) closeTerms();
    }
  });
});
