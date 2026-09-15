import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Trophy, 
  Award, 
  Flame, 
  Zap, 
  Download, 
  RotateCcw, 
  Edit3, 
  Check, 
  X, 
  TrendingUp,
  Shield,
  Activity,
  Target,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PlayerStatsRecord } from '../types/playerStats';
import { SportId } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';
import { INITIAL_PLAYER_STATS_RECORDS } from '../utils/playerStatsStorage';

interface PlayerStatsHubProps {
  players: PlayerStatsRecord[];
  onUpdatePlayers: (players: PlayerStatsRecord[]) => void;
  onSelectPlayerForAIClip?: (playerName: string) => void;
}

export const PlayerStatsHub: React.FC<PlayerStatsHubProps> = ({
  players,
  onUpdatePlayers,
  onSelectPlayerForAIClip
}) => {
  const [selectedSport, setSelectedSport] = useState<SportId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'batsman' | 'bowler' | 'all-rounder'>('all');
  const [activePlayerDetail, setActivePlayerDetail] = useState<PlayerStatsRecord | null>(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerStatsRecord | null>(null);
  const [showExportToast, setShowExportToast] = useState(false);

  // New Player Form State
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    team: '',
    sport: 'cricket' as SportId,
    role: 'Opening Batsman',
    jerseyNumber: 10,
    runs: 0,
    wickets: 0,
    matches: 1,
    goals: 0,
    raidPoints: 0
  });

  // Filtered players
  const filteredPlayers = players.filter(p => {
    if (selectedSport !== 'all' && p.sport !== selectedSport) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTeam = p.team.toLowerCase().includes(q);
      const matchRole = p.role.toLowerCase().includes(q);
      if (!matchName && !matchTeam && !matchRole) return false;
    }
    if (selectedRole !== 'all') {
      const r = p.role.toLowerCase();
      if (selectedRole === 'batsman' && !r.includes('bat') && !r.includes('opener')) return false;
      if (selectedRole === 'bowler' && !r.includes('bowl') && !r.includes('pace') && !r.includes('spin')) return false;
      if (selectedRole === 'all-rounder' && !r.includes('all-rounder')) return false;
    }
    return true;
  });

  // Top stats aggregates
  const cricketPlayers = players.filter(p => p.sport === 'cricket');
  const topRunScorer = [...cricketPlayers].sort((a, b) => b.runs - a.runs)[0];
  const topWicketTaker = [...cricketPlayers].sort((a, b) => b.wickets - a.wickets)[0];
  const totalRunsLogged = players.reduce((sum, p) => sum + p.runs, 0);
  const totalWicketsLogged = players.reduce((sum, p) => sum + p.wickets, 0);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name.trim() || !newPlayer.team.trim()) return;

    const record: PlayerStatsRecord = {
      id: 'ath_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      name: newPlayer.name.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=160&auto=format&fit=crop&q=80`,
      sport: newPlayer.sport,
      team: newPlayer.team.trim(),
      role: newPlayer.role,
      jerseyNumber: Number(newPlayer.jerseyNumber) || 7,
      verified: true,
      mvpAwards: 0,
      winRate: 65,
      matches: Number(newPlayer.matches) || 1,
      innings: Number(newPlayer.matches) || 1,
      runs: Number(newPlayer.runs) || 0,
      ballsFaced: Math.round((Number(newPlayer.runs) || 0) * 0.75),
      fours: Math.floor((Number(newPlayer.runs) || 0) / 10),
      sixes: Math.floor((Number(newPlayer.runs) || 0) / 25),
      fifties: (Number(newPlayer.runs) || 0) >= 50 ? 1 : 0,
      hundreds: (Number(newPlayer.runs) || 0) >= 100 ? 1 : 0,
      highestScore: Number(newPlayer.runs) || 0,
      notOuts: 0,
      strikeRate: 130.0,
      battingAvg: Number(newPlayer.runs) || 0,
      ballsBowled: (Number(newPlayer.wickets) || 0) * 18,
      oversBowledFormatted: `${Math.floor(((Number(newPlayer.wickets) || 0) * 18) / 6)}.0`,
      maidens: 0,
      runsConceded: (Number(newPlayer.wickets) || 0) * 15,
      wickets: Number(newPlayer.wickets) || 0,
      economy: 7.2,
      bowlingAvg: (Number(newPlayer.wickets) || 0) > 0 ? 15.0 : 0,
      bestBowling: (Number(newPlayer.wickets) || 0) > 0 ? `${newPlayer.wickets}/24` : '-',
      goals: Number(newPlayer.goals) || 0,
      raidPoints: Number(newPlayer.raidPoints) || 0,
      recentPerformances: [
        {
          id: 'perf_init_' + Date.now(),
          date: 'Just Added',
          matchTitle: 'Roster Registration',
          summary: 'Newly enrolled into team roster with stored career statistics.',
          badge: 'Registered'
        }
      ]
    };

    const updated = [record, ...players];
    onUpdatePlayers(updated);
    setShowAddModal(false);
    setNewPlayer({
      name: '',
      team: '',
      sport: 'cricket',
      role: 'Opening Batsman',
      jerseyNumber: 10,
      runs: 0,
      wickets: 0,
      matches: 1,
      goals: 0,
      raidPoints: 0
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;

    // Recalculate strike rate & averages
    const updatedRecord = { ...editingPlayer };
    if (updatedRecord.ballsFaced > 0) {
      updatedRecord.strikeRate = Number(((updatedRecord.runs / updatedRecord.ballsFaced) * 100).toFixed(1));
    }
    const batDiv = Math.max(1, updatedRecord.innings - updatedRecord.notOuts);
    updatedRecord.battingAvg = Number((updatedRecord.runs / batDiv).toFixed(1));

    if (updatedRecord.ballsBowled > 0) {
      updatedRecord.economy = Number(((updatedRecord.runsConceded / updatedRecord.ballsBowled) * 6).toFixed(2));
    }
    if (updatedRecord.wickets > 0) {
      updatedRecord.bowlingAvg = Number((updatedRecord.runsConceded / updatedRecord.wickets).toFixed(1));
    }

    const updated = players.map(p => p.id === updatedRecord.id ? updatedRecord : p);
    onUpdatePlayers(updated);
    if (activePlayerDetail?.id === updatedRecord.id) {
      setActivePlayerDetail(updatedRecord);
    }
    setEditingPlayer(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all player stats to default seeded records? All recent live scoring ball increments will be re-initialized.')) {
      onUpdatePlayers(INITIAL_PLAYER_STATS_RECORDS);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(players, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sportpulse_player_stats_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Stats Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                Player Statistics Database
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono-code font-bold">
                {players.length} Stored Athletes
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Live-synchronized database tracking each and every player's career runs, wickets, boundaries, strike rates, and match milestones.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-add-player"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2]" />
              <span>Register Player</span>
            </button>

            <button
              id="btn-export-stats"
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 active:scale-95"
              title="Download full player database JSON"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Data</span>
            </button>

            <button
              id="btn-reset-stats"
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-800"
              title="Reset player stats to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4 Overview Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Top Run Scorer</span>
            </span>
            <div className="mt-1">
              <span className="text-base sm:text-lg font-display font-semibold text-white truncate block">
                {topRunScorer?.name || 'Aarav Sharma'}
              </span>
              <span className="text-xs text-emerald-400 font-mono-code font-medium">
                {topRunScorer?.runs || 0} Runs ({topRunScorer?.strikeRate || 0} SR)
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Leading Wicket Taker</span>
            </span>
            <div className="mt-1">
              <span className="text-base sm:text-lg font-display font-semibold text-white truncate block">
                {topWicketTaker?.name || 'Jaspreet Gill'}
              </span>
              <span className="text-xs text-rose-400 font-mono-code font-medium">
                {topWicketTaker?.wickets || 0} Wickets ({topWicketTaker?.economy || 0} Econ)
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Runs Stored</span>
            </span>
            <div className="mt-1">
              <span className="text-base sm:text-lg font-display font-semibold text-white block">
                {totalRunsLogged.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-mono-code">
                Across all registered batsmen
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Total Wickets Stored</span>
            </span>
            <div className="mt-1">
              <span className="text-base sm:text-lg font-display font-semibold text-white block">
                {totalWicketsLogged.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-mono-code">
                Updated in live scoring
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-player"
            placeholder="Search by player name, team, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sport Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSport === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
            }`}
          >
            All Sports ({players.length})
          </button>
          {(['cricket', 'football', 'kabaddi', 'badminton', 'tennis'] as SportId[]).map((sportKey) => {
            const count = players.filter(p => p.sport === sportKey).length;
            const cfg = SPORT_CONFIGS[sportKey];
            return (
              <button
                key={sportKey}
                onClick={() => setSelectedSport(sportKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  selectedSport === sportKey
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-850'
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.name}</span>
                <span className="text-[10px] opacity-75 font-mono-code">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => {
          const isCricket = player.sport === 'cricket';
          const isFootball = player.sport === 'football';
          const isKabaddi = player.sport === 'kabaddi';

          return (
            <div
              key={player.id}
              id={`player-card-${player.id}`}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all shadow-md group relative flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Avatar, Name, Team, Sport Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-400 transition-colors"
                      />
                      {player.jerseyNumber && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 text-emerald-400 text-[10px] font-mono-code font-bold flex items-center justify-center">
                          #{player.jerseyNumber}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                          {player.name}
                        </h3>
                        {player.verified && (
                          <span className="text-emerald-400 text-xs" title="Verified Grassroots Athlete">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{player.team}</p>
                      <span className="text-[11px] text-slate-500 font-mono-code">{player.role}</span>
                    </div>
                  </div>

                  <span className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-base" title={SPORT_CONFIGS[player.sport]?.name}>
                    {SPORT_CONFIGS[player.sport]?.icon}
                  </span>
                </div>

                {/* Primary Stats Grid */}
                {isCricket && (
                  <div className="space-y-2.5 my-3 pt-3 border-t border-slate-800/80">
                    {/* Batting highlights */}
                    <div className="grid grid-cols-4 gap-1 text-center bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 block">Runs</span>
                        <span className="text-sm font-semibold text-white font-mono-code">{player.runs}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 block">HS</span>
                        <span className="text-sm font-medium text-slate-300 font-mono-code">{player.highestScore}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 block">SR</span>
                        <span className="text-sm font-medium text-emerald-400 font-mono-code">{player.strikeRate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 block">4s / 6s</span>
                        <span className="text-xs font-medium text-slate-300 font-mono-code">{player.fours} / {player.sixes}</span>
                      </div>
                    </div>

                    {/* Bowling highlights if bowler or all-rounder */}
                    {(player.wickets > 0 || player.ballsBowled > 0) && (
                      <div className="grid grid-cols-4 gap-1 text-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-850">
                        <div>
                          <span className="text-[10px] font-mono-code text-slate-400 block">Wickets</span>
                          <span className="text-sm font-semibold text-rose-400 font-mono-code">{player.wickets}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono-code text-slate-400 block">Econ</span>
                          <span className="text-sm font-bold text-slate-300 font-mono-code">{player.economy}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono-code text-slate-400 block">Overs</span>
                          <span className="text-xs font-bold text-slate-300 font-mono-code">{player.oversBowledFormatted}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono-code text-slate-400 block">Best</span>
                          <span className="text-xs font-bold text-amber-400 font-mono-code">{player.bestBowling}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isFootball && (
                  <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950 p-2.5 rounded-xl border border-slate-850 my-3">
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-400 block">Goals</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono-code">{player.goals || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-400 block">Assists</span>
                      <span className="text-base font-bold text-blue-400 font-mono-code">{player.assists || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-400 block">Matches</span>
                      <span className="text-base font-bold text-slate-300 font-mono-code">{player.matches}</span>
                    </div>
                  </div>
                )}

                {isKabaddi && (
                  <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950 p-2.5 rounded-xl border border-slate-850 my-3">
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-400 block">Raid Pts</span>
                      <span className="text-base font-extrabold text-orange-400 font-mono-code">{player.raidPoints || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-400 block">Tackle Pts</span>
                      <span className="text-base font-bold text-emerald-400 font-mono-code">{player.tacklePoints || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code text-slate-400 block">Super Raids</span>
                      <span className="text-base font-bold text-purple-400 font-mono-code">{player.superRaids || 0}</span>
                    </div>
                  </div>
                )}

                {/* Recent performance snippet */}
                {player.recentPerformances?.[0] && (
                  <div className="mt-2 text-xs text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-850/60">
                    <span className="text-[10px] text-emerald-400 font-mono-code font-bold uppercase tracking-wider block mb-0.5">
                      Recent: {player.recentPerformances[0].badge}
                    </span>
                    <p className="truncate text-slate-300">{player.recentPerformances[0].summary}</p>
                  </div>
                )}
              </div>

              {/* Bottom Actions: View Full Profile & Edit */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  id={`btn-view-${player.id}`}
                  onClick={() => setActivePlayerDetail(player)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Stats</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {onSelectPlayerForAIClip && (
                    <button
                      onClick={() => onSelectPlayerForAIClip(player.name)}
                      className="p-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:bg-purple-900 text-xs flex items-center gap-1"
                      title="Generate AI highlight clip for player"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[11px] font-semibold">AI Clip</span>
                    </button>
                  )}

                  <button
                    id={`btn-edit-${player.id}`}
                    onClick={() => setEditingPlayer(player)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                    title="Edit player statistics"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPlayers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
            <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-sm text-slate-300">No players match the current filter</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or register a new player above.</p>
          </div>
        )}
      </div>

      {/* Full Player Detail Drawer / Modal */}
      {activePlayerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setActivePlayerDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-5 mb-5">
              <img
                src={activePlayerDetail.avatar}
                alt={activePlayerDetail.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold text-white">
                    {activePlayerDetail.name}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono-code font-bold">
                    #{activePlayerDetail.jerseyNumber || 7}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{activePlayerDetail.team} • {activePlayerDetail.role}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-mono-code">
                  <span>Matches: <strong className="text-slate-200">{activePlayerDetail.matches}</strong></span>
                  <span>Innings: <strong className="text-slate-200">{activePlayerDetail.innings}</strong></span>
                  <span>MVP Awards: <strong className="text-amber-400">{activePlayerDetail.mvpAwards} 🏆</strong></span>
                </div>
              </div>
            </div>

            {/* Complete Batting Card */}
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <h4 className="text-xs font-mono-code font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Comprehensive Batting Ledger</span>
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-center">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Runs</span>
                    <span className="text-base font-extrabold text-white font-mono-code">{activePlayerDetail.runs}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Balls</span>
                    <span className="text-base font-bold text-slate-300 font-mono-code">{activePlayerDetail.ballsFaced}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Strike Rate</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono-code">{activePlayerDetail.strikeRate}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Average</span>
                    <span className="text-base font-bold text-slate-300 font-mono-code">{activePlayerDetail.battingAvg}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Fours (4s)</span>
                    <span className="text-base font-bold text-blue-400 font-mono-code">{activePlayerDetail.fours}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Sixes (6s)</span>
                    <span className="text-base font-bold text-purple-400 font-mono-code">{activePlayerDetail.sixes}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center mt-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Highest Score</span>
                    <span className="text-sm font-bold text-amber-400 font-mono-code">{activePlayerDetail.highestScore}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">50s / 100s</span>
                    <span className="text-sm font-bold text-slate-200 font-mono-code">{activePlayerDetail.fifties} / {activePlayerDetail.hundreds}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Not Outs</span>
                    <span className="text-sm font-bold text-slate-200 font-mono-code">{activePlayerDetail.notOuts}</span>
                  </div>
                </div>
              </div>

              {/* Complete Bowling Card */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <h4 className="text-xs font-mono-code font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Comprehensive Bowling Ledger</span>
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-center">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Wickets</span>
                    <span className="text-base font-extrabold text-rose-400 font-mono-code">{activePlayerDetail.wickets}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Overs</span>
                    <span className="text-base font-bold text-slate-300 font-mono-code">{activePlayerDetail.oversBowledFormatted}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Economy</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono-code">{activePlayerDetail.economy}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Runs Conceded</span>
                    <span className="text-base font-bold text-slate-300 font-mono-code">{activePlayerDetail.runsConceded}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Maidens</span>
                    <span className="text-base font-bold text-blue-400 font-mono-code">{activePlayerDetail.maidens}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 font-mono-code block">Best Bowling</span>
                    <span className="text-base font-bold text-amber-400 font-mono-code">{activePlayerDetail.bestBowling}</span>
                  </div>
                </div>
              </div>

              {/* Match Contributions History */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <h4 className="text-xs font-mono-code font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Match Contributions Log
                </h4>
                <div className="space-y-2">
                  {activePlayerDetail.recentPerformances?.map((perf) => (
                    <div key={perf.id} className="p-3 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-200 font-semibold block">{perf.matchTitle}</span>
                        <span className="text-slate-400">{perf.summary}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono-code font-bold text-[10px]">
                          {perf.badge || 'Finished'}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{perf.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingPlayer(activePlayerDetail);
                  setActivePlayerDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit These Stats</span>
              </button>
              <button
                onClick={() => setActivePlayerDetail(null)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Player Stats Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdit}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-white text-lg">
                Edit Player Stats: {editingPlayer.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlayer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Career Runs</label>
                <input
                  type="number"
                  value={editingPlayer.runs}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, runs: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Balls Faced</label>
                <input
                  type="number"
                  value={editingPlayer.ballsFaced}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, ballsFaced: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Fours (4s)</label>
                <input
                  type="number"
                  value={editingPlayer.fours}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, fours: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Sixes (6s)</label>
                <input
                  type="number"
                  value={editingPlayer.sixes}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, sixes: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Career Wickets</label>
                <input
                  type="number"
                  value={editingPlayer.wickets}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, wickets: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Runs Conceded</label>
                <input
                  type="number"
                  value={editingPlayer.runsConceded}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, runsConceded: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Total Matches</label>
                <input
                  type="number"
                  value={editingPlayer.matches}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, matches: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Best Bowling Figures</label>
                <input
                  type="text"
                  value={editingPlayer.bestBowling}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, bestBowling: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPlayer(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddPlayer}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-lg">
                  Register New Athlete
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Athlete Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hardik Patel"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Team / Club *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Shivaji Park Lions"
                    value={newPlayer.team}
                    onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Sport</label>
                  <select
                    value={newPlayer.sport}
                    onChange={(e) => setNewPlayer({ ...newPlayer, sport: e.target.value as SportId })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="cricket">Cricket</option>
                    <option value="football">Football</option>
                    <option value="kabaddi">Kabaddi</option>
                    <option value="badminton">Badminton</option>
                    <option value="tennis">Tennis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Playing Role</label>
                  <input
                    type="text"
                    placeholder="e.g., All-Rounder / Top Order"
                    value={newPlayer.role}
                    onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Jersey Number</label>
                  <input
                    type="number"
                    value={newPlayer.jerseyNumber}
                    onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Initial Career Runs</label>
                  <input
                    type="number"
                    value={newPlayer.runs}
                    onChange={(e) => setNewPlayer({ ...newPlayer, runs: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Initial Wickets</label>
                  <input
                    type="number"
                    value={newPlayer.wickets}
                    onChange={(e) => setNewPlayer({ ...newPlayer, wickets: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
              >
                Register & Store Player
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Export Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl font-semibold text-xs flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Player database JSON downloaded successfully!</span>
        </div>
      )}
    </div>
  );
};
