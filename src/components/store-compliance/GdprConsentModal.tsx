import React, { useState } from 'react';
import { X, ShieldCheck, Download, Trash2, Check, Lock, Bell, Activity } from 'lucide-react';
import { exportUserDataAsJSON, triggerHaptic } from '../../utils/nativeMobileServices';
import { AuthUser } from '../../types/auth';

interface GdprConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onOpenAccountDeletion: () => void;
}

export const GdprConsentModal: React.FC<GdprConsentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAccountDeletion,
}) => {
  const [telemetryEnabled, setTelemetryEnabled] = useState(() => {
    return localStorage.getItem('sportpulse_consent_telemetry') !== 'false';
  });

  const [notificationsConsent, setNotificationsConsent] = useState(() => {
    return localStorage.getItem('sportpulse_consent_notifications') !== 'false';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSavePreferences = async () => {
    await triggerHaptic('success');
    localStorage.setItem('sportpulse_consent_telemetry', String(telemetryEnabled));
    localStorage.setItem('sportpulse_consent_notifications', String(notificationsConsent));
    localStorage.setItem('sportpulse_consent_timestamp', new Date().toISOString());

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleExportData = async () => {
    await triggerHaptic('selection');
    const data = {
      timestamp: new Date().toISOString(),
      user: currentUser || { role: 'spectator_guest', name: 'Guest' },
      offlineQueue: localStorage.getItem('sportpulse_offline_scoring_queue_v2') || '[]',
      playerStats: localStorage.getItem('sportpulse_player_stats_v2') || '[]',
      consents: {
        telemetry: telemetryEnabled,
        notifications: notificationsConsent,
        essentialStorage: true,
      },
    };
    await exportUserDataAsJSON(data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="consent-title" className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white">
                Privacy & Data Consent
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your statutory data rights under GDPR & CCPA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Consent Settings"
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            You retain full control over how SportPulse processes your telemetry and match information. We never monetize or sell personal data.
          </p>

          {/* Consent Item 1: Essential Local Storage */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Essential Offline Storage</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono-code uppercase font-semibold">Always Required</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Stores live match scorecards and offline scoring queues so play continues during signal loss.
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pr-2">Enabled</span>
          </div>

          {/* Consent Item 2: Anonymous Performance Telemetry */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Anonymous Diagnostics & Frame-Rate Telemetry
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Helps us optimize scoring responsiveness and battery consumption on diverse mobile chipsets.
                </div>
              </div>
            </div>
            <button
              onClick={() => setTelemetryEnabled(!telemetryEnabled)}
              role="switch"
              aria-checked={telemetryEnabled}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                telemetryEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                  telemetryEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Consent Item 3: Match Alerts & Push Notifications */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Live Match Alerts & Wicket Bells
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Allows push notifications for live boundaries, goals, and AI-generated highlight drops.
                </div>
              </div>
            </div>
            <button
              onClick={() => setNotificationsConsent(!notificationsConsent)}
              role="switch"
              aria-checked={notificationsConsent}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                notificationsConsent ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                  notificationsConsent ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Statutory Actions: Export & Delete */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={handleExportData}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export Personal Data</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAccountDeletion();
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-500/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 sm:px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePreferences}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
