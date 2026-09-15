import React from 'react';
import { X, Check, ArrowRight, Trophy } from 'lucide-react';
import { SportId, Match } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';
import { triggerHaptic } from '../utils/nativeMobileServices';

interface SportSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSport: SportId;
  onSelectSport: (sportId: SportId) => void;
  matches?: Match[];
}

export const SportSelectorModal: React.FC<SportSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedSport,
  onSelectSport,
  matches = []
}) => {
  if (!isOpen) return null;

  const sports = Object.keys(SPORT_CONFIGS) as SportId[];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="sport-selector-modal"
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                Select Sport
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose active sport scoring engine and match board
              </p>
            </div>
          </div>
          <button
            id="btn-close-sport-menu"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close sport menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sports List (Spacious, Clear & Touch-friendly) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {sports.map((sportId) => {
            const config = SPORT_CONFIGS[sportId];
            const isSelected = selectedSport === sportId;
            const sportMatches = matches.filter((m) => m.sportId === sportId);
            const liveCount = sportMatches.filter((m) => m.status === 'LIVE').length;

            return (
              <button
                key={sportId}
                id={`select-sport-card-${sportId}`}
                onClick={() => {
                  triggerHaptic('medium');
                  onSelectSport(sportId);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/80 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-13 h-13 rounded-2xl text-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-blue-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {config.name}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white font-mono-code">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {sportId === 'cricket' && 'Balls, Overs, Wickets, Boundaries & Strike Rates'}
                      {sportId === 'football' && '90 Min Regulation, Goals, Cards & Extra Time'}
                      {sportId === 'kabaddi' && 'Raids, Tackles, Super Raids & All-Outs'}
                      {sportId === 'basketball' && 'Quarters, 24s Shot Clock, 3-Pointers & Fouls'}
                      {sportId === 'badminton' && '21-Pt Games, Rallies, Smashes & Set Points'}
                      {sportId === 'tennis' && 'Games, Sets, Deuce, Advantage & Tiebreaks'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {liveCount > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono-code bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      {liveCount} Live
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono-code hidden sm:inline">
                      {sportMatches.length} matches
                    </span>
                  )}

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Tap any sport to switch scoreboard &amp; rule engine</span>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
