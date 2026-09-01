import React, { useState } from 'react';
import { BUILTIN_CHARMS } from '../charms/charmRegistry';
import { CharmCanvasPreview } from './QuickCharmDrawer';
import { useDangleSettings } from '../store/settingsStore';
import { soundEffects } from '../audio/SoundEffects';

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [settings, updateSettings] = useDangleSettings();

  const handleNext = () => {
    soundEffects.playTapSound();
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateSettings({
        general: { ...settings.general, onboardingCompleted: true },
      });
      onComplete();
    }
  };

  const handlePrev = () => {
    soundEffects.playTapSound();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="onboarding-backdrop" style={{ pointerEvents: 'auto' }}>
      <div className="onboarding-card">
        {/* Progress Dots */}
        <div className="onboarding-progress">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`onboarding-dot ${s === step ? 'active' : s < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Screen 1: Meet DeskDangle */}
        {step === 1 && (
          <div className="onboarding-step-content">
            <div className="onboarding-badge">Welcome</div>
            <h2 className="onboarding-title">Meet DeskDangle</h2>
            <p className="onboarding-subtitle">A tiny, interactive physics charm on your desktop.</p>
            <div className="onboarding-hero-preview">
              <div className="onboarding-charm-halo">
                <CharmCanvasPreview
                  charm={BUILTIN_CHARMS.find((c) => c.id === settings.selectedCharmId) || BUILTIN_CHARMS[0]}
                  size={90}
                />
              </div>
            </div>
            <p className="onboarding-desc">
              DeskDangle hangs smoothly from the top of your Windows screen. Grab, drag, throw, and watch it swing with natural physical momentum.
            </p>
          </div>
        )}

        {/* Screen 2: Choose your charm */}
        {step === 2 && (
          <div className="onboarding-step-content">
            <div className="onboarding-badge">Personalize</div>
            <h2 className="onboarding-title">Choose your starter charm</h2>
            <p className="onboarding-subtitle">Select any charm to hang from your screen.</p>
            <div className="onboarding-charms-grid">
              {BUILTIN_CHARMS.map((charm) => (
                <button
                  key={charm.id}
                  className={`onboarding-charm-btn ${settings.selectedCharmId === charm.id ? 'active' : ''}`}
                  onClick={() => {
                    soundEffects.playCharmSwitchSound();
                    updateSettings({ selectedCharmId: charm.id });
                  }}
                >
                  <CharmCanvasPreview charm={charm} size={38} />
                  <span>{charm.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen 3: Ready */}
        {step === 3 && (
          <div className="onboarding-step-content">
            <div className="onboarding-badge">Ready</div>
            <h2 className="onboarding-title">You're all set!</h2>
            <p className="onboarding-subtitle">DeskDangle is ready to hang from your screen.</p>
            <div className="onboarding-ready-box">
              <div className="onboarding-charm-halo">
                <CharmCanvasPreview
                  charm={BUILTIN_CHARMS.find((c) => c.id === settings.selectedCharmId) || BUILTIN_CHARMS[0]}
                  size={84}
                />
              </div>
              <div className="onboarding-shortcuts-summary">
                <div><code>Ctrl + Shift + D</code> Show / Hide DeskDangle</div>
                <div><code>Ctrl + Shift + P</code> Pause / Resume Physics</div>
                <div><code>Right-Click Charm</code> Quick menu & settings</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="onboarding-footer">
          {step > 1 ? (
            <button className="onboarding-btn-secondary" onClick={handlePrev}>
              Back
            </button>
          ) : (
            <div />
          )}

          <button className="onboarding-btn-primary" onClick={handleNext}>
            {step === 3 ? 'Start DeskDangle ✨' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

