import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Trophy, Scale } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="tos-title">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="tos-title" className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white">
                Terms of Service & Tournament Code
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official rules for grassroots scoring, broadcast overlays, and sportsmanship
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Terms of Service"
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-300 text-xs flex items-center justify-between">
            <span><strong>Last Updated:</strong> January 2025 • Grassroots League Edition</span>
            <span className="font-mono-code font-bold uppercase text-[11px] bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded">
              Standard Agreement
            </span>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-blue-500" />
              1. Official Scoring Integrity & Scorer Code of Conduct
            </h3>
            <p>
              SportPulse provides digital scoring tools for competitive sports tournaments including Cricket, Football, Basketball, Kabaddi, and Badminton. Users acting as match scorers agree to record match deliveries, points, cards, and milestones truthfully, without bias, and in real time. Deliberate falsification of scores or tampering with tournament standings is strictly prohibited and subject to immediate administrative revocation.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              2. Broadcast Graphics & Live Stream Overlays
            </h3>
            <p>
              SportPulse generates live broadcast graphic overlays (lower-thirds, scorebugs, ball-by-ball tickers, and MVP splash cards). You are granted a worldwide, non-exclusive license to use these graphics on your community YouTube, Twitch, Facebook, or cable feeds for matches scored using our software, provided SportPulse brand attribution remains intact.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              3. Offline Operation & Disclaimers
            </h3>
            <p>
              While SportPulse includes robust offline queueing designed to maintain uninterrupted operation in rural and cellular-deprived environments, tournament organizers are encouraged to verify final scorecards before awarding official medals, prize payouts, or advancement in knockouts. SportPulse is not liable for network dropouts caused by third-party telecom carriers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              4. Termination & Account Removal
            </h3>
            <p>
              Users may terminate their account at any time directly within the application via the Account Deletion feature. We reserve the right to suspend or ban accounts that repeatedly violate sportsmanship or post abusive comments.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 sm:px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            I Agree to Terms
          </button>
        </div>
      </div>
    </div>
  );
};
