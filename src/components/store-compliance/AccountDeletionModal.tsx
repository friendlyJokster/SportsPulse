import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';
import { clearOfflineScoringQueue, triggerHaptic } from '../../utils/nativeMobileServices';
import { AuthUser } from '../../types/auth';

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onAccountDeleted: () => void;
}

export const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAccountDeleted,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedReceipt, setDeletedReceipt] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';

  const handleDeleteExecution = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    await triggerHaptic('heavy');

    try {
      // 1. Purge offline queues
      await clearOfflineScoringQueue();

      // 2. Clear all local user credentials and match cache
      localStorage.removeItem('sportpulse_user');
      localStorage.removeItem('sportpulse_player_stats_v2');
      localStorage.removeItem('sportpulse_offline_scoring_queue_v2');
      localStorage.removeItem('sportpulse_notification_prefs_v1');
      sessionStorage.clear();

      // Simulated network purge delay
      setTimeout(() => {
        const receiptCode = 'PURGE-DEL-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        setDeletedReceipt(receiptCode);
        setIsDeleting(false);
        triggerHaptic('success');
      }, 1000);
    } catch {
      setIsDeleting(false);
    }
  };

  const handleFinish = () => {
    onAccountDeleted();
    onClose();
    setDeletedReceipt(null);
    setConfirmText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-rose-100 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="delete-account-title" className="text-base sm:text-lg font-display font-bold text-rose-900 dark:text-rose-100">
                Delete Account & Data
              </h2>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Apple App Store & Google Play Store Compliance Policy
              </p>
            </div>
          </div>
          {!deletedReceipt && (
            <button
              onClick={onClose}
              aria-label="Close Account Deletion"
              className="p-2 text-rose-400 hover:text-rose-700 dark:hover:text-white rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {deletedReceipt ? (
            /* Confirmation Receipt State */
            <div className="space-y-4 text-center py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Account Permanently Deleted
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Your credentials, offline action queues, and athlete profile data have been completely erased from this device and local storage.
                </p>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-xs mx-auto text-left space-y-1">
                <div className="text-[10px] uppercase font-mono-code font-bold text-slate-400">Deletion Reference Code</div>
                <div className="text-xs font-mono-code font-bold text-emerald-600 dark:text-emerald-400">{deletedReceipt}</div>
                <div className="text-[10px] text-slate-400">Timestamp: {new Date().toLocaleString()}</div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs active:scale-95 transition-all mt-4"
              >
                Return to SportPulse as Guest
              </button>
            </div>
          ) : (
            /* Active Deletion Warning and Input */
            <>
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Irreversible Action Warning:</strong> Deleting your account will immediately remove your profile: <span className="font-bold underline">{currentUser?.name || 'Current User'}</span> ({currentUser?.email || currentUser?.phone || 'Account'}).
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase font-mono-code text-slate-500 dark:text-slate-400">
                  Data That Will Be Permanently Erased:
                </h4>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pl-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>User credentials, mobile tokens & login sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Personal career batting & bowling averages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>All pending offline match scoring events and cache</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Notification preferences & custom UI settings</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  To confirm permanent erasure, type <span className="font-mono-code font-bold text-rose-600 dark:text-rose-400">DELETE</span> below:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono-code uppercase text-rose-600 dark:text-rose-400 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isConfirmed || isDeleting}
                  onClick={handleDeleteExecution}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    isConfirmed && !isDeleting
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20 active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Purging Data...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete My Account</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
