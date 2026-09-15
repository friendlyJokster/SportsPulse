import React, { useState, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Tv, 
  Radio, 
  Volume2, 
  VolumeX, 
  RotateCw,
  Sparkles
} from 'lucide-react';
import { Match } from '../types/sport';
import { SportStrategyEngine, SPORT_CONFIGS } from '../engine/strategyRegistry';
import { triggerHaptic } from '../utils/nativeMobileServices';

interface BroadcastModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
}

export const BroadcastModeModal: React.FC<BroadcastModeModalProps> = ({
  isOpen,
  onClose,
  match
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(0);

  const sponsors = ['POWERED BY SPORTPULSE ULTRA', 'OFFICIAL TIMING BY OMNICORE', 'GRASSROOTS SPORTS LEAGUE 2026'];

  useEffect(() => {
    const interval = setInterval(() => {
      setSponsorIndex(prev => (prev + 1) % sponsors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const strategy = SportStrategyEngine.getStrategy(match.sportId);
  const sportConfig = SPORT_CONFIGS[match.sportId];
  const scoreDisplay = strategy.formatScore(match);
  const clockDisplay = strategy.formatGameClock(match);
  const periodLabel = strategy.getPeriodLabel(match);

  const toggleFullscreen = () => {
    triggerHaptic('light');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden animate-fade-in text-white">
      {/* Top Telemetry & Controls */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600/90 text-white font-mono-code font-bold text-xs uppercase tracking-widest animate-pulse shadow-lg shadow-rose-600/40">
            <Radio className="w-3.5 h-3.5" />
            <span>ON AIR • HDMI STREAM</span>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono-code text-slate-400">
            {match.tournamentName || 'Championship Series'} • {match.venue}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsMuted(!isMuted);
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:bg-slate-800 text-slate-300"
            title="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:bg-slate-800 text-slate-300"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl bg-rose-900/40 border border-rose-700/60 hover:bg-rose-800 text-rose-300"
            title="Exit Broadcast Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Jumbotron Stadium Display */}
      <div className="flex-1 flex flex-col justify-center items-center my-4 max-w-5xl mx-auto w-full">
        {/* Match Title & Format */}
        <div className="text-center mb-4 sm:mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
            <span>{sportConfig.icon}</span>
            <span>{sportConfig.name} Live Broadcast</span>
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
            {match.teamA.name} <span className="text-slate-500 font-light">vs</span> {match.teamB.name}
          </h1>
        </div>

        {/* Stadium Scoreboard Block */}
        <div className="w-full bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(16,185,129,0.15)] relative overflow-hidden">
          {/* Subtle field grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 sm:gap-8 relative z-10">
            {/* Team A */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center text-2xl sm:text-3xl font-display font-bold text-emerald-400 mb-3 shadow-lg">
                {match.teamA.shortName}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{match.teamA.name}</h2>
              <div className="mt-2 text-4xl sm:text-6xl md:text-7xl font-mono-code font-bold text-emerald-400 tracking-tight">
                {scoreDisplay.primaryA}
              </div>
              {scoreDisplay.secondaryA && (
                <span className="text-sm font-mono-code text-slate-400 mt-1">{scoreDisplay.secondaryA}</span>
              )}
            </div>

            {/* Center Live Timing & Period */}
            <div className="text-center flex flex-col items-center justify-center py-4 border-y md:border-y-0 md:border-x border-slate-800/80 px-4">
              <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code font-semibold uppercase mb-2">
                {periodLabel}
              </div>
              <div className="text-3xl sm:text-5xl font-mono-code font-bold text-white tracking-wider">
                {clockDisplay}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${match.clockRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span className="text-xs font-mono-code uppercase tracking-wider text-slate-300">
                  {match.clockRunning ? 'Clock Running' : 'Stoppage / Break'}
                </span>
              </div>
            </div>

            {/* Team B */}
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center text-2xl sm:text-3xl font-display font-bold text-blue-400 mb-3 shadow-lg">
                {match.teamB.shortName}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{match.teamB.name}</h2>
              <div className="mt-2 text-4xl sm:text-6xl md:text-7xl font-mono-code font-bold text-blue-400 tracking-tight">
                {scoreDisplay.primaryB}
              </div>
              {scoreDisplay.secondaryB && (
                <span className="text-sm font-mono-code text-slate-400 mt-1">{scoreDisplay.secondaryB}</span>
              )}
            </div>
          </div>

          {/* Cricket Active Batsmen Bar */}
          {match.cricketState && (
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code">
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-semibold">{match.cricketState.currentStriker}*</span>
                </div>
                <span className="text-emerald-400 font-bold">{match.cricketState.strikerScore}</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">{match.cricketState.currentNonStriker}</span>
                </div>
                <span className="text-slate-300">{match.cricketState.nonStrikerScore}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lower-Third Animated Broadcast Ticker */}
      <div className="w-full max-w-5xl mx-auto z-10">
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="truncate text-xs sm:text-sm font-mono-code">
              <span className="text-amber-400 font-bold mr-2">LAST PLAY:</span>
              <span className="text-slate-200">
                {match.events[0]?.label || 'Match underway with high intensity at ' + match.venue}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase tracking-widest shrink-0">
            <Tv className="w-3.5 h-3.5 text-emerald-400" />
            <span>{sponsors[sponsorIndex]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
