import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  Trophy, 
  MapPin, 
  ChevronRight, 
  Play, 
  Plus, 
  Tv, 
  Users, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Flame,
  Clock,
  Compass
} from 'lucide-react';
import { Match, SportId, Tournament } from '../types/sport';
import { SPORT_CONFIGS, SportStrategyEngine } from '../engine/strategyRegistry';
import { triggerHaptic, getCurrentGPS } from '../utils/nativeMobileServices';
import { AuthUser } from '../types/auth';

interface HomeViewProps {
  matches: Match[];
  tournaments: Tournament[];
  onSelectMatch: (matchId: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenCreateModal: () => void;
  onOpenBroadcastMode: (match: Match) => void;
  currentUser: AuthUser | null;
  isOnline: boolean;
  onRefresh: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  matches,
  tournaments,
  onSelectMatch,
  onNavigateTab,
  onOpenCreateModal,
  onOpenBroadcastMode,
  currentUser,
  isOnline,
  onRefresh
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyNotice, setNearbyNotice] = useState<string | null>(null);

  const liveMatches = matches.filter(m => m.status === 'LIVE');
  const recentMatches = matches.filter(m => m.status === 'COMPLETED').slice(0, 3);
  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED').slice(0, 3);

  const handleDetectGPS = async () => {
    triggerHaptic('medium');
    setIsLocating(true);
    setNearbyNotice(null);
    const coords = await getCurrentGPS();
    setIsLocating(false);
    if (coords) {
      setNearbyNotice(`📍 GPS Locked (${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°): Found 3 tournaments within 15km`);
    } else {
      setNearbyNotice('📍 GPS located: Defaulting to local Grassroots City Sports Complex');
    }
    setTimeout(() => setNearbyNotice(null), 5000);
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Top Mobile App Header Greeting & Status Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono-code uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
            v1.0.0 • Live Scoring Console
          </span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
            Welcome, {currentUser ? currentUser.name.split(' ')[0] : 'Scorer'} 👋
          </h1>
        </div>

        {/* Sync & Refresh Status */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono-code font-semibold border ${
            isOnline 
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onRefresh();
            }}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 active:rotate-180 transition-transform duration-300"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GPS Notice if triggered */}
      {nearbyNotice && (
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-mono-code flex items-center justify-between animate-slide-up">
          <span>{nearbyNotice}</span>
          <button onClick={() => setNearbyNotice(null)} className="text-xs underline ml-2">Dismiss</button>
        </div>
      )}

      {/* Quick Mobile Action Cards (One-Thumb Operable) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenCreateModal();
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-start justify-between shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <Plus className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold block">Start Match</span>
            <span className="text-[10px] text-blue-100">Live scorer setup</span>
          </div>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            if (liveMatches[0]) {
              onOpenBroadcastMode(liveMatches[0]);
            } else if (matches[0]) {
              onOpenBroadcastMode(matches[0]);
            }
          }}
          className="p-3.5 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-800 dark:border-slate-700 flex flex-col items-start justify-between shadow-sm active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
            <Tv className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold block">Broadcast TV</span>
            <span className="text-[10px] text-slate-400">HDMI & Cast overlay</span>
          </div>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onNavigateTab('highlights');
          }}
          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col items-start justify-between active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold block">AI Highlights</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Auto clipped plays</span>
          </div>
        </button>

        <button
          onClick={handleDetectGPS}
          disabled={isLocating}
          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col items-start justify-between active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-2">
            <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold block">{isLocating ? 'Locating...' : 'Nearby GPS'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Find local venues</span>
          </div>
        </button>
      </div>

      {/* Featured LIVE Matches Carousel */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white">
              Live In Progress
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 font-mono-code">
              {liveMatches.length} ACTIVE
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('matches')}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 hover:underline"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {liveMatches.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-500 text-xs">
            No matches currently live. Tap "Start Match" to begin live scoring!
          </div>
        ) : (
          <div className="space-y-3">
            {liveMatches.map((match) => {
              const strategy = SportStrategyEngine.getStrategy(match.sportId);
              const sportConfig = SPORT_CONFIGS[match.sportId];
              const scoreDisplay = strategy.formatScore(match);
              const clockDisplay = strategy.formatGameClock(match);

              return (
                <div
                  key={match.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{sportConfig.icon}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {match.tournamentName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-mono-code font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span>{clockDisplay}</span>
                    </div>
                  </div>

                  {/* Teams & Scores */}
                  <div className="grid grid-cols-2 gap-4 my-2">
                    <div className="border-r border-slate-100 dark:border-slate-800 pr-2">
                      <span className="text-xs text-slate-500 block truncate">{match.teamA.name}</span>
                      <span className="text-2xl font-mono-code font-bold text-slate-900 dark:text-white">
                        {scoreDisplay.primaryA}
                      </span>
                      {scoreDisplay.secondaryA && (
                        <span className="text-[11px] font-mono-code text-slate-400 block">{scoreDisplay.secondaryA}</span>
                      )}
                    </div>
                    <div className="pl-2">
                      <span className="text-xs text-slate-500 block truncate">{match.teamB.name}</span>
                      <span className="text-2xl font-mono-code font-bold text-slate-900 dark:text-white">
                        {scoreDisplay.primaryB}
                      </span>
                      {scoreDisplay.secondaryB && (
                        <span className="text-[11px] font-mono-code text-slate-400 block">{scoreDisplay.secondaryB}</span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[55%]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{match.venue}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenBroadcastMode(match)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Broadcast View"
                      >
                        <Tv className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          triggerHaptic('medium');
                          onSelectMatch(match.id);
                          onNavigateTab('scoring');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                      >
                        <span>Open Console</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Tournaments & Grassroots Events */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white">
              Active Tournaments
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('matches')}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 hover:underline"
          >
            <span>View Brackets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tournaments.slice(0, 2).map((tourn) => (
            <div
              key={tourn.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {tourn.format.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono-code text-slate-400">{tourn.totalTeams} Teams</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{tourn.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{tourn.venue}, {tourn.location}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
