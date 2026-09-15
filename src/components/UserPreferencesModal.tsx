import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Smartphone, 
  Check, 
  X, 
  RotateCcw, 
  Vibrate, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { 
  AppTheme, 
  AppFont, 
  THEME_OPTIONS, 
  FONT_OPTIONS 
} from '../types/preferences';
import { triggerHaptic } from '../utils/nativeMobileServices';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  currentFont: AppFont;
  onSelectFont: (font: AppFont) => void;
  hapticsEnabled: boolean;
  onToggleHaptics: (enabled: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onResetDefaults: () => void;
}

export const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  currentFont,
  onSelectFont,
  hapticsEnabled,
  onToggleHaptics,
  soundEnabled,
  onToggleSound,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'typography' | 'device'>('theme');
  const [testHapticCount, setTestHapticCount] = useState(0);

  if (!isOpen) return null;

  const isLight = currentTheme === 'light' || currentTheme === 'calm' || currentTheme === 'sapphire' || currentTheme === 'terracotta' || currentTheme === 'amethyst';

  const handleTestHaptic = () => {
    triggerHaptic('heavy');
    setTestHapticCount(prev => prev + 1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="user-preferences-modal"
        className="w-full max-w-2xl rounded-3xl border border-theme-primary bg-theme-modal text-theme-primary shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-theme-primary bg-theme-bg-tertiary">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-theme-primary">
                User Preferences
              </h2>
              <p className="text-xs text-theme-muted">
                Themes, typography, adaptive OS appearance, and haptics
              </p>
            </div>
          </div>
          <button
            id="btn-close-preferences"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-theme-card-hover text-theme-muted transition-colors"
            aria-label="Close preferences"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-theme-primary px-5 sm:px-6 gap-2 pt-2.5 bg-theme-bg-secondary">
          <button
            id="pref-tab-theme"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('theme');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'theme'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-theme-muted hover:text-theme-primary'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme & Comfort ({THEME_OPTIONS.length})</span>
          </button>

          <button
            id="pref-tab-typography"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('typography');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'typography'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-theme-muted hover:text-theme-primary'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Typography ({FONT_OPTIONS.length})</span>
          </button>

          <button
            id="pref-tab-device"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('device');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'device'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-theme-muted hover:text-theme-primary'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Feedback</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: THEMES */}
          {activeTab === 'theme' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-bold">Select Visual Atmosphere</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose a theme tailored to your lighting and sensory comfort.
                  </p>
                </div>
                <span className="text-[11px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {THEME_OPTIONS.find(t => t.id === currentTheme)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEME_OPTIONS.map((theme) => {
                  const isSelected = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      id={`theme-card-${theme.id}`}
                      onClick={() => {
                        triggerHaptic('selection');
                        onSelectTheme(theme.id);
                      }}
                      className={`text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                      style={{ backgroundColor: theme.previewBg }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span 
                            className="text-xs font-bold font-display"
                            style={{ color: theme.previewText }}
                          >
                            {theme.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="text-[10px] font-mono-code font-semibold px-2 py-0.5 rounded-full border"
                              style={{ 
                                backgroundColor: theme.previewSurface,
                                color: theme.previewAccent,
                                borderColor: theme.previewBorder
                              }}
                            >
                              {theme.badge}
                            </span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        </div>

                        <p 
                          className="text-[11px] leading-snug mb-3 line-clamp-2"
                          style={{ color: theme.previewText, opacity: 0.75 }}
                        >
                          {theme.description}
                        </p>
                      </div>

                      {/* Palette Preview Swatches */}
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.previewBorder }}>
                        <span 
                          className="text-[10px] font-mono-code font-bold uppercase tracking-wider"
                          style={{ color: theme.previewAccent }}
                        >
                          {theme.tagline}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: theme.previewBg, borderColor: theme.previewBorder }} title="Background" />
                          <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: theme.previewSurface, borderColor: theme.previewBorder }} title="Surface" />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.previewAccent }} title="Accent" />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.previewText }} title="Text" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Eye Comfort Note */}
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs">
                <Eye className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-300">
                    Comfort & Anti-Glare Recommendation
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Working prolonged multi-hour matches under midday sun? Use <strong>Calm Warm Paper</strong> for low eye-strain or <strong>Clean Daylight</strong> for intense sun visibility. During evening games, <strong>Nordic Twilight</strong> softens contrast to prevent halation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-bold">Select Interface Typography</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Changes headings, score readouts, and match feeds across the entire app.
                  </p>
                </div>
                <span className="text-[11px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {FONT_OPTIONS.find(f => f.id === currentFont)?.name}
                </span>
              </div>

              <div className="space-y-2.5">
                {FONT_OPTIONS.map((font) => {
                  const isSelected = currentFont === font.id;
                  return (
                    <button
                      key={font.id}
                      id={`font-card-${font.id}`}
                      onClick={() => {
                        triggerHaptic('selection');
                        onSelectFont(font.id);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30'
                          : isLight
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                          : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="text-base font-bold"
                            style={{ fontFamily: font.cssFamily }}
                          >
                            {font.name}
                          </span>
                          {font.isDefault && (
                            <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              Default
                            </span>
                          )}
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono-code">
                            • {font.tagline}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                          {font.description}
                        </p>
                        
                        {/* Live Font Sample */}
                        <div 
                          className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200"
                          style={{ fontFamily: font.cssFamily }}
                        >
                          {font.sample}
                        </div>
                      </div>

                      <div className="flex items-center justify-end sm:justify-center shrink-0">
                        {isSelected ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white">
                            Select Font
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MOBILE FEEDBACK */}
          {activeTab === 'device' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold">Hardware & Tactile Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure native device vibrations, swipe transitions, and auditory feedback.
                </p>
              </div>

              {/* Haptics Switch */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
                    <Vibrate className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">Haptic Feedback Vibration</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Vibrates on ball scoring, wicket triggers, and horizontal tab swipes.
                    </p>
                    <button
                      id="btn-test-haptic"
                      onClick={handleTestHaptic}
                      className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Test Vibration ({testHapticCount > 0 ? `${testHapticCount} tested` : 'Tap to feel'})</span>
                    </button>
                  </div>
                </div>

                <button
                  id="btn-toggle-haptics-switch"
                  onClick={() => {
                    triggerHaptic('medium');
                    onToggleHaptics(!hapticsEnabled);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    hapticsEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={hapticsEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Cues Switch */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-500 flex items-center justify-center shrink-0">
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">Audio Cues on Landmarks</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Subtle synthesizer chime for boundaries, goals, super raids, and AI highlight triggers.
                    </p>
                  </div>
                </div>

                <button
                  id="btn-toggle-sound-switch"
                  onClick={() => {
                    triggerHaptic('light');
                    onToggleSound(!soundEnabled);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    soundEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={soundEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Swipe Gesture Info */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Horizontal Swipe Navigation Active</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  Swipe horizontally on your touch screen or drag with your mouse between <strong>Home</strong>, <strong>Matches</strong>, and <strong>Live Scoring</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-theme-primary bg-theme-bg-secondary flex items-center justify-between">
          <button
            id="btn-reset-preferences"
            onClick={() => {
              triggerHaptic('medium');
              onResetDefaults();
            }}
            className="flex items-center gap-1.5 text-xs text-theme-muted hover:text-theme-primary font-medium py-1 px-2 rounded-lg hover:bg-theme-card-hover transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            id="btn-done-preferences"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
