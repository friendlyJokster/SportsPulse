import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Award, Trophy, Sparkles, FileText } from 'lucide-react';
import { shareContent, triggerHaptic } from '../utils/nativeMobileServices';
import { Match, Tournament } from '../types/sport';
import { PlayerStatsRecord } from '../types/playerStats';

export type ShareType = 'scorecard' | 'tournament' | 'player' | 'highlight';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ShareType;
  match?: Match | null;
  tournament?: Tournament | null;
  player?: PlayerStatsRecord | null;
  highlightText?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  type,
  match,
  tournament,
  player,
  highlightText,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getSharePayload = () => {
    switch (type) {
      case 'scorecard': {
        const teamA = match?.teamA.name || 'Team A';
        const teamB = match?.teamB.name || 'Team B';
        const scoreA = `${match?.teamA.score || 0}/${match?.teamA.wickets || 0}`;
        const scoreB = `${match?.teamB.score || 0}/${match?.teamB.wickets || 0}`;
        const overs = match?.currentOver ? `(${match.currentOver} ov)` : '';
        const title = `🏏 ${teamA} vs ${teamB} - Live Score on SportPulse`;
        const text = `🔥 LIVE MATCH UPDATE:\n${teamA}: ${scoreA} ${overs}\n${teamB}: ${scoreB}\nTournament: ${match?.tournamentName || 'SportPulse Championship'}\n\nFollow live ball-by-ball coverage and automated AI highlights on SportPulse!`;
        return { title, text, icon: <FileText className="w-5 h-5 text-emerald-500" /> };
      }
      case 'tournament': {
        const tName = tournament?.name || 'SportPulse Premier League';
        const title = `🏆 ${tName} - Tournament Standings`;
        const text = `📊 Tournament Update for ${tName}!\nCheck out the updated standings, points table, and upcoming knockout brackets on SportPulse.`;
        return { title, text, icon: <Trophy className="w-5 h-5 text-amber-500" /> };
      }
      case 'player': {
        const pName = player?.name || 'SportPulse Star Athlete';
        const title = `⭐ ${pName} - Player Profile & Stats`;
        const text = `🏅 Athlete Performance Card: ${pName} (${player?.primarySport || 'Cricket'})\nMatches: ${player?.matchesPlayed || 0} • Runs: ${player?.runsScored || 0} • Wickets: ${player?.wicketsTaken || 0} • MVP Badges: ${player?.mvpAwards || 0}\nView full career analytics on SportPulse!`;
        return { title, text, icon: <Award className="w-5 h-5 text-purple-500" /> };
      }
      case 'highlight': {
        const title = `⚡ AI Match Moment Highlight - SportPulse`;
        const text = `🎬 Check out this thrilling highlight:\n"${highlightText || 'Sensational boundary in the final over!'}"\nGenerated instantly by SportPulse AI Commentary!`;
        return { title, text, icon: <Sparkles className="w-5 h-5 text-blue-500" /> };
      }
    }
  };

  const payload = getSharePayload();

  const handleNativeShare = async () => {
    await triggerHaptic('medium');
    const success = await shareContent({
      title: payload.title,
      text: payload.text,
      url: window.location.href,
      dialogTitle: 'Share with Community',
    });
    if (success) {
      onClose();
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`${payload.title}\n\n${payload.text}\n\n${window.location.href}`);
      await triggerHaptic('success');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="share-title">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-md">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {payload.icon}
            </div>
            <div>
              <h3 id="share-title" className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                Share via Mobile Sheet
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Share scorecard, standings & highlights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Share Dialog"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-mono-code leading-relaxed text-slate-700 dark:text-slate-300">
            <div className="font-bold text-slate-900 dark:text-white font-display">{payload.title}</div>
            <div className="whitespace-pre-line text-[11px] text-slate-600 dark:text-slate-400">{payload.text}</div>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Native Mobile Share Sheet Button */}
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Open Native Share Sheet (iOS / Android)</span>
            </button>

            {/* Copy to Clipboard fallback */}
            <button
              onClick={handleCopyText}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Formatted Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
