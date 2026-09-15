import React from 'react';
import { X, ShieldCheck, Lock, Download, Trash2, Mail, ExternalLink, Globe, FileText } from 'lucide-react';
import { exportUserDataAsJSON } from '../../utils/nativeMobileServices';
import { AuthUser } from '../../types/auth';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AuthUser | null;
  onOpenAccountDeletion?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAccountDeletion,
}) => {
  if (!isOpen) return null;

  const handleExportData = async () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      service: 'SportPulse Cross-Platform Network',
      user: currentUser || { role: 'guest_spectator', name: 'Guest User' },
      deviceSession: {
        platform: typeof window !== 'undefined' ? navigator.platform : 'Mobile',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
      offlineEventsLogged: localStorage.getItem('sportpulse_offline_scoring_queue_v2') || '[]',
      savedPreferences: {
        theme: localStorage.getItem('sportpulse_theme_v2') || 'light',
        font: localStorage.getItem('sportpulse_font_v1') || 'plus-jakarta',
        haptics: localStorage.getItem('sportpulse_haptics_enabled') || 'true',
      },
    };
    await exportUserDataAsJSON(exportData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="privacy-policy-title">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="privacy-policy-title" className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white">
                Privacy Policy & GDPR Disclosure
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compliant with Apple App Store Guidelines, Google Play Data Safety, GDPR & CCPA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Privacy Policy"
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Version banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
            <span><strong>Effective Date:</strong> January 2025 • Version 2.4.0-mobile</span>
            <span className="font-mono-code font-bold uppercase text-[11px] bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
              GDPR & CCPA Compliant
            </span>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              1. Our Fundamental Commitment: No Data Selling
            </h3>
            <p>
              SportPulse is built for grassroots sports athletes, scorers, and fans. <strong>We do not sell, rent, or monetize your personal data or gameplay statistics to third-party data brokers or advertising networks.</strong> Your match history and athlete performance records exist purely to power live tournament scoring and community sports engagement.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              2. Information We Collect
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Account Credentials:</strong> Name, verified email, and phone number (if you sign in via SMS OTP, Google, or Apple ID). Guest spectators may browse without providing any personal identifiers.</li>
              <li><strong>Athlete & Match Data:</strong> Runs scored, wickets taken, points, fouls, ball-by-ball event timestamps, player avatars, and jersey numbers.</li>
              <li><strong>Optional Hardware Telemetry:</strong> Approximate geolocation solely to tag the ground/venue when creating a fixture, and camera access solely for player photo capture.</li>
              <li><strong>Offline Queue & Storage:</strong> Ball-by-ball scoring events cached in local persistent memory (Capacitor Preferences / Filesystem) to ensure continuous operation in zero-connectivity stadiums.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              3. AI & Highlight Processing (Gemini AI Disclosures)
            </h3>
            <p>
              SportPulse utilizes Google Gemini AI to analyze ball-by-ball scoring events and generate automated match highlight commentary and broadcast summaries. Only anonymous match event logs (e.g. "Six hit on over 18.2 by Aarav Sharma") are transmitted to the AI engine; no private user identity details or passwords are submitted.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              4. Your GDPR & CCPA Rights
            </h3>
            <p className="text-xs">
              Under Articles 15–22 of the GDPR and the California Consumer Privacy Act (CCPA), you hold full authority over your data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong>Right to Access & Portability:</strong> Instantly export a full machine-readable JSON copy of all your records.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong>Right to Erasure (Be Forgotten):</strong> Permanently delete your account and all associated match data at any time.
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" />
              5. Data Protection Officer (DPO) Contact
            </h3>
            <p className="text-xs">
              If you have inquiries regarding this policy or wish to exercise your statutory rights, contact our Data Protection Office at: <span className="font-mono-code text-emerald-600 dark:text-emerald-400 font-semibold">privacy@sportpulse.io</span>.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 sm:px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export My Data (JSON)</span>
            </button>

            {onOpenAccountDeletion && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAccountDeletion();
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-500/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
