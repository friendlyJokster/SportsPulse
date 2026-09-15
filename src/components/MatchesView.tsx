import React, { useState } from 'react';
import { 
  Trophy, 
  Plus, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Filter, 
  Play, 
  CheckCircle2, 
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { Match, SportId, Tournament } from '../types/sport';
import { SPORT_CONFIGS, SportStrategyEngine } from '../engine/strategyRegistry';
import { triggerHaptic } from '../utils/nativeMobileServices';

interface MatchesViewProps {
  matches: Match[];
  tournaments: Tournament[];
  onSelectMatch: (matchId: string) => void;
  onNavigateToScoring: () => void;
  onOpenCreateModal: () => void;
  selectedSport: SportId;
  onSelectSport: (sport: SportId) => void;
  onOpenSportMenu?: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  tournaments,
  onSelectMatch,
  onNavigateToScoring,
  onOpenCreateModal,
  selectedSport,
  onSelectSport,
  onOpenSportMenu
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'COMPLETED'>('ALL');
  const [activeTab, setActiveTab] = useState<'fixtures' | 'brackets'>('fixtures');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSportCfg = SPORT_CONFIGS[selectedSport] || SPORT_CONFIGS.cricket;

  const filteredMatches = matches.filter(m => {
    const matchesSport = selectedSport ? m.sportId === selectedSport : true;
    const matchesStatus = statusFilter === 'ALL' ? true : m.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      m.teamA.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.teamB.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tournamentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-6 animate-fade-in">
      {/* Top Header & New Match Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono-code uppercase tracking-wider text-blue-500 font-bold">
            Fixtures &amp; Tournaments
          </span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
            Match Central
          </h1>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenCreateModal();
          }}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Match</span>
        </button>
      </div>

      {/* Selected Sport Banner - Other sports hidden, accessible via menu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 flex items-center justify-center text-2xl shadow-xs shrink-0">
            {currentSportCfg.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {currentSportCfg.name}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-mono-code">
                Selected Sport
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing {filteredMatches.length} match{filteredMatches.length === 1 ? '' : 'es'} • Tap button to select another sport
            </p>
          </div>
        </div>

        {onOpenSportMenu && (
          <button
            id="btn-matches-open-sport-menu"
            onClick={() => {
              triggerHaptic('selection');
              onOpenSportMenu();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/80 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <span>Switch Sport</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sub-Tabs: Fixtures vs Mobile Bracket Explorer */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          id="tab-btn-fixtures"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('fixtures');
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeTab === 'fixtures'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Match Fixtures ({filteredMatches.length})
        </button>
        <button
          id="tab-btn-brackets"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('brackets');
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeTab === 'brackets'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Tournament Brackets ({tournaments.length})
        </button>
      </div>

      {activeTab === 'fixtures' ? (
        <div className="space-y-4">
          {/* Search and Status Filters */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team, tournament, or venue..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              {(['ALL', 'LIVE', 'SCHEDULED', 'COMPLETED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    triggerHaptic('selection');
                    setStatusFilter(st);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono-code text-[11px] font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Matches List (Mobile-Optimized Expandable Cards) */}
          <div className="space-y-3">
            {filteredMatches.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
                No matches found matching criteria.
              </div>
            ) : (
              filteredMatches.map((m) => {
                const strategy = SportStrategyEngine.getStrategy(m.sportId);
                const scoreDisplay = strategy.formatScore(m);
                const clockDisplay = strategy.formatGameClock(m);
                const isExpanded = expandedMatchId === m.id;

                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all"
                  >
                    {/* Header Row */}
                    <div 
                      onClick={() => {
                        triggerHaptic('selection');
                        setExpandedMatchId(isExpanded ? null : m.id);
                      }}
                      className="p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[60%]">
                          {m.tournamentName}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                            m.status === 'LIVE'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : m.status === 'COMPLETED'
                              ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}>
                            {m.status === 'LIVE' ? `LIVE • ${clockDisplay}` : m.status}
                          </span>
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {/* Main Teams Matchup */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {m.teamA.name}
                            </span>
                            <span className="text-base font-mono-code font-bold text-slate-900 dark:text-blue-400">
                              {scoreDisplay.primaryA}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {m.teamB.name}
                            </span>
                            <span className="text-base font-mono-code font-bold text-slate-900 dark:text-blue-400">
                              {scoreDisplay.primaryB}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details Tray */}
                    {isExpanded && (
                      <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 text-xs space-y-3 animate-fade-in">
                        <div className="grid grid-cols-2 gap-2 text-slate-500 dark:text-slate-400">
                          <div>
                            <span className="block text-[10px] uppercase font-mono-code">Venue</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{m.venue}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-mono-code">Officials</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{m.officials.umpire1 || 'Official Scorer'}</span>
                          </div>
                        </div>

                        {/* Recent Events Snippet */}
                        {m.events && m.events.length > 0 && (
                          <div>
                            <span className="block text-[10px] uppercase font-mono-code text-slate-400 mb-1">Recent Activity</span>
                            <div className="space-y-1">
                              {m.events.slice(0, 2).map((ev) => (
                                <div key={ev.id} className="text-[11px] font-mono-code text-slate-600 dark:text-slate-300 truncate">
                                  • {ev.label} ({ev.gameTime})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Direct Scoring Console Launch */}
                        <div className="pt-2 flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              triggerHaptic('medium');
                              onSelectMatch(m.id);
                              onNavigateToScoring();
                            }}
                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-transform"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Open Scoring Console</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Mobile Touch Tournament Brackets */
        <div className="space-y-4">
          {tournaments.map((tourn) => (
            <div
              key={tourn.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {tourn.format.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{tourn.title}</h3>
                </div>
                <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
              </div>

              {/* Touch Mobile Bracket Simulation */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="text-[11px] font-mono-code font-semibold text-slate-400 uppercase">Knockout Progression</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-mono-code text-slate-400 block mb-1">Quarter-Final</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Mumbai Tigers vs Delhi Strikers</div>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Winner: Mumbai Tigers</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-mono-code text-slate-400 block mb-1">Semi-Final</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Mumbai Tigers vs Bengaluru Bulls</div>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Winner: Mumbai Tigers</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[10px] font-mono-code text-amber-600 dark:text-amber-400 block mb-1 font-bold">Championship Final</span>
                    <div className="font-semibold text-slate-900 dark:text-white">Mumbai Tigers vs Chennai Super Warriors</div>
                    <span className="text-[10px] text-amber-500 font-bold">LIVE IN PLAY</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
