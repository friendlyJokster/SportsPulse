import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Flame, 
  Sparkles, 
  Code2, 
  ShieldAlert, 
  Trophy, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Info,
  Plus,
  Crown,
  Shield,
  Undo2,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { Match, SportEvent, SportId } from '../types/sport';
import { SportStrategyEngine, SPORT_CONFIGS } from '../engine/strategyRegistry';
import { AuthUser } from '../types/auth';

interface LiveScoringEngineProps {
  currentMatch: Match;
  onUpdateMatch: (updatedMatch: Match) => void;
  onTriggerHighlight: (event: SportEvent) => void;
  allMatches: Match[];
  onSelectMatch: (matchId: string) => void;
  onOpenCreateModal?: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
}

export const LiveScoringEngine: React.FC<LiveScoringEngineProps> = ({
  currentMatch,
  onUpdateMatch,
  onTriggerHighlight,
  allMatches,
  onSelectMatch,
  onOpenCreateModal,
  currentUser,
  onOpenAuthModal
}) => {
  const [showCodeInspector, setShowCodeInspector] = useState(false);
  const [selectedPlayerTarget, setSelectedPlayerTarget] = useState<'teamA' | 'teamB'>('teamA');
  const [customDetail, setCustomDetail] = useState('');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const strategy = SportStrategyEngine.getStrategy(currentMatch.sportId);
  const sportConfig = SPORT_CONFIGS[currentMatch.sportId];
  const scoreDisplay = strategy.formatScore(currentMatch);
  const clockDisplay = strategy.formatGameClock(currentMatch);
  const periodLabel = strategy.getPeriodLabel(currentMatch);
  const availableActions = strategy.getAvailableActions(currentMatch);

  // Clock toggle handler
  const handleToggleClock = () => {
    onUpdateMatch({
      ...currentMatch,
      clockRunning: !currentMatch.clockRunning,
      status: !currentMatch.clockRunning ? 'LIVE' : 'PAUSED'
    });
  };

  const handleResetClock = () => {
    onUpdateMatch({
      ...currentMatch,
      clockSeconds: 0,
      clockRunning: false,
      status: 'PAUSED'
    });
  };

  // Quick event trigger via active Strategy Pattern
  const handleTriggerAction = (action: typeof availableActions[0], teamTarget: 'teamA' | 'teamB') => {
    const targetTeamObj = teamTarget === 'teamA' ? currentMatch.teamA : currentMatch.teamB;
    const targetPlayerName = targetTeamObj.players[0]?.name || (teamTarget === 'teamA' ? currentMatch.teamA.name : currentMatch.teamB.name);

    const updated = strategy.applyEvent(currentMatch, {
      type: action.type,
      label: action.label,
      teamId: targetTeamObj.id,
      playerName: targetPlayerName,
      pointDelta: action.pointDelta,
      highlightWorthy: action.highlightWorthy,
      details: customDetail || undefined
    });

    setCustomDetail('');
    onUpdateMatch(updated);

    // If highlight worthy, trigger notification
    if (action.highlightWorthy && updated.events[0]) {
      onTriggerHighlight(updated.events[0]);
    }
  };

  // Admin Override: Undo Last Event
  const handleAdminUndoLastEvent = () => {
    if (!currentMatch.events || currentMatch.events.length === 0) {
      setAdminNotice('No past events to undo.');
      setTimeout(() => setAdminNotice(null), 3000);
      return;
    }
    const lastEvent = currentMatch.events[0];
    const newEvents = currentMatch.events.slice(1);

    let updatedMatch = { ...currentMatch, events: newEvents };

    // Revert score if pointDelta exists
    if (lastEvent.pointDelta && lastEvent.teamId) {
      if (lastEvent.teamId === currentMatch.teamA.id) {
        updatedMatch.teamA = {
          ...updatedMatch.teamA,
          score: Math.max(0, updatedMatch.teamA.score - lastEvent.pointDelta)
        };
      } else {
        updatedMatch.teamB = {
          ...updatedMatch.teamB,
          score: Math.max(0, updatedMatch.teamB.score - lastEvent.pointDelta)
        };
      }
    }

    // If cricket, roll back ball from recentBalls
    if (updatedMatch.cricketState) {
      const cState = { ...updatedMatch.cricketState };
      if (cState.recentBalls.length > 0) {
        const removedBall = cState.recentBalls[cState.recentBalls.length - 1];
        cState.recentBalls = cState.recentBalls.slice(0, -1);
        if (removedBall === 'W') {
          cState.wickets = Math.max(0, cState.wickets - 1);
        } else if (lastEvent.pointDelta) {
          cState.runs = Math.max(0, cState.runs - lastEvent.pointDelta);
        }
        if (cState.balls > 0) {
          cState.balls -= 1;
        } else if (cState.overs > 0) {
          cState.overs -= 1;
          cState.balls = 5;
        }
      }
      updatedMatch.cricketState = cState;
    }

    onUpdateMatch(updatedMatch);
    setAdminNotice(`Official Umpire Undo: Rolled back "${lastEvent.label}"`);
    setTimeout(() => setAdminNotice(null), 3000);
  };

  // Admin Override: Rotate Strike in Cricket
  const handleAdminRotateStrike = () => {
    if (!currentMatch.cricketState) return;
    const { currentStriker, currentNonStriker } = currentMatch.cricketState;
    const updated = {
      ...currentMatch,
      cricketState: {
        ...currentMatch.cricketState,
        currentStriker: currentNonStriker,
        currentNonStriker: currentStriker,
      }
    };
    onUpdateMatch(updated);
    setAdminNotice(`Strike Rotated: ${currentNonStriker} is now on strike`);
    setTimeout(() => setAdminNotice(null), 3000);
  };

  // Admin Override: Finalize Match
  const handleAdminFinalizeMatch = () => {
    const updated = {
      ...currentMatch,
      status: 'COMPLETED' as const,
      clockRunning: false,
    };
    onUpdateMatch(updated);
    setAdminNotice(`Official Result Certified: Match status marked as COMPLETED.`);
    setTimeout(() => setAdminNotice(null), 3500);
  };

  // Mobile Fast Cricket Ball Handler
  const handleFastCricketBall = (type: '0' | '1' | '2' | '3' | '4' | '6' | 'W' | 'Wd' | 'Nb') => {
    const actionMatch = availableActions.find(a => {
      if (type === '0') return a.label.includes('Dot');
      if (type === '1') return a.label.includes('1 Run');
      if (type === '2') return a.label.includes('2 Runs');
      if (type === '3') return a.label.includes('3 Runs');
      if (type === '4') return a.label.includes('Four');
      if (type === '6') return a.label.includes('Six');
      if (type === 'W') return a.label.includes('Wicket');
      if (type === 'Wd') return a.label.includes('Wide');
      if (type === 'Nb') return a.label.includes('No Ball');
      return false;
    });

    if (actionMatch) {
      handleTriggerAction(actionMatch, selectedPlayerTarget);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Sticky Score Header (visible on < sm screens for fast glance while scrolling) */}
      <div id="mobile-sticky-score" className="block sm:hidden sticky top-16 z-30 -mx-3 -mt-2 mb-3 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-3.5 py-2 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{sportConfig.icon}</span>
            <div className="flex items-baseline gap-1.5 font-display font-bold text-sm text-white">
              <span>{currentMatch.teamA.shortName}</span>
              <span className="text-emerald-400 font-mono-code">{scoreDisplay.primaryA}</span>
              <span className="text-slate-500 font-normal">v</span>
              <span>{currentMatch.teamB.shortName}</span>
              <span className="text-emerald-400 font-mono-code">{scoreDisplay.primaryB}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-500/20 text-emerald-400">
              {currentMatch.status}
            </span>
            <button
              id="mobile-sticky-btn-target"
              onClick={() => setSelectedPlayerTarget(selectedPlayerTarget === 'teamA' ? 'teamB' : 'teamA')}
              className="px-2 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-200 active:scale-95"
            >
              Aim: {selectedPlayerTarget === 'teamA' ? currentMatch.teamA.shortName : currentMatch.teamB.shortName}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Execution Feedback Banner */}
      {adminNotice && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between gap-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{adminNotice}</span>
          </div>
          <button 
            onClick={() => setAdminNotice(null)}
            className="text-amber-400 hover:text-white text-xs font-mono-code px-1.5 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Official Admin / Umpire Command Center */}
      {currentUser?.role === 'admin' ? (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl dark-surface">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-display font-bold text-white">
                    Official Match Admin & Umpire Controls
                  </h3>
                  <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 font-mono-code border border-amber-500/30">
                    CERTIFIED ADMIN
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Signed in as <strong>{currentUser.name}</strong>. You have authoritative privilege to undo events, rotate striker, and certify final match results.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-500/20">
            {/* Undo Last Event */}
            <button
              id="admin-btn-undo"
              onClick={handleAdminUndoLastEvent}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold active:scale-95 transition-all shadow-sm"
              title="Undo the last recorded event or ball from the match log"
            >
              <Undo2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Undo Last Ball/Event</span>
            </button>

            {/* Strike Rotation for Cricket */}
            {currentMatch.cricketState && (
              <button
                id="admin-btn-rotate-strike"
                onClick={handleAdminRotateStrike}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold active:scale-95 transition-all shadow-sm"
                title="Swap batsman on strike"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rotate Strike ({currentMatch.cricketState.currentNonStriker} on strike)</span>
              </button>
            )}

            {/* Toggle Pause / Live Clock */}
            <button
              id="admin-btn-toggle-clock"
              onClick={handleToggleClock}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold active:scale-95 transition-all shadow-sm"
            >
              {currentMatch.clockRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Official Clock</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume Official Clock</span>
                </>
              )}
            </button>

            {/* Finalize Match */}
            {currentMatch.status !== 'COMPLETED' && (
              <button
                id="admin-btn-finalize"
                onClick={handleAdminFinalizeMatch}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold active:scale-95 transition-all shadow-md ml-auto"
                title="Conclude the fixture and lock the score in official tournament records"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Certify Result & Complete Match</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Prompt for Spectators / Athletes if they want to access Admin powers */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Operating in <strong>{currentUser ? 'Player / Scorer' : 'Guest'} Mode</strong>. Official score rollbacks and match certifications require Admin credentials.
            </span>
          </div>
          <button
            id="btn-switch-admin-mode"
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold border border-amber-500/30 whitespace-nowrap active:scale-95 transition-all"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Switch to Admin Umpire</span>
          </button>
        </div>
      )}

      {/* Top Paradigm & Match Switcher Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Strategy Paradigm: {sportConfig.category.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                Tournament: {currentMatch.tournamentName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
              <span>{sportConfig.icon}</span>
              <span>{currentMatch.teamA.name}</span>
              <span className="text-slate-500 text-lg">vs</span>
              <span>{currentMatch.teamB.name}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>📍 {currentMatch.venue}</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono-code font-semibold">
                Sponsor: {currentMatch.sponsor.name}
              </span>
            </p>
          </div>

          {/* Match Switcher Dropdown & Create Action */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Switch Fixture:</span>
            <select
              id="select-match-fixture"
              value={currentMatch.id}
              onChange={(e) => onSelectMatch(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {allMatches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.teamA.shortName} vs {m.teamB.shortName} ({SPORT_CONFIGS[m.sportId].name})
                </option>
              ))}
            </select>

            {onOpenCreateModal && (
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                title="Create a new live match or launch a tournament"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+ New Match / Tournament</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Scoreboard HUD */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Glow ambient background accent */}
        <div 
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: currentMatch.teamA.color }}
        />
        <div 
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: currentMatch.teamB.color }}
        />

        {/* Live Status Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono-code uppercase tracking-wider flex items-center gap-1.5 ${
              currentMatch.status === 'LIVE' 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
              {currentMatch.status}
            </div>
            <span className="text-sm font-semibold text-slate-300 font-display">
              {periodLabel}
            </span>
          </div>

          {/* Match Clock Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono-code font-bold text-sm sm:text-base text-emerald-400 tracking-wider">
              {clockDisplay}
            </div>

            {sportConfig.category !== 'SET_AND_RALLY' && (
              <div className="flex items-center gap-1">
                <button
                  id="btn-toggle-clock"
                  onClick={handleToggleClock}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                    currentMatch.clockRunning 
                      ? 'bg-amber-600/80 hover:bg-amber-500 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  title={currentMatch.clockRunning ? 'Pause Clock' : 'Start Clock'}
                >
                  {currentMatch.clockRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  id="btn-reset-clock"
                  onClick={handleResetClock}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
                  title="Reset Period Clock"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dual Team Score Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Team A */}
          <div className={`p-4 rounded-xl border transition-all ${
            selectedPlayerTarget === 'teamA' ? 'bg-slate-800/60 border-emerald-500/50' : 'bg-slate-950/40 border-slate-800/80'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: currentMatch.teamA.color }}
                />
                <span className="font-display font-bold text-lg text-white">
                  {currentMatch.teamA.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono-code">
                  {currentMatch.teamA.shortName}
                </span>
              </div>
              <button
                id="btn-select-team-a"
                onClick={() => setSelectedPlayerTarget('teamA')}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedPlayerTarget === 'teamA'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {selectedPlayerTarget === 'teamA' ? '✓ Selected' : 'Select Target'}
              </button>
            </div>

            {/* Score Display */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                {scoreDisplay.primaryA}
              </span>
              {scoreDisplay.secondaryA && (
                <span className="text-sm font-mono-code text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                  {scoreDisplay.secondaryA}
                </span>
              )}
            </div>

            {/* Star Athlete in Roster */}
            {currentMatch.teamA.players[0] && (
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2">
                <img 
                  src={currentMatch.teamA.players[0].avatar} 
                  alt={currentMatch.teamA.players[0].name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs text-slate-300 font-medium">
                  {currentMatch.teamA.players[0].name}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono-code">
                  {currentMatch.teamA.players[0].role}
                </span>
              </div>
            )}
          </div>

          {/* Team B */}
          <div className={`p-4 rounded-xl border transition-all ${
            selectedPlayerTarget === 'teamB' ? 'bg-slate-800/60 border-emerald-500/50' : 'bg-slate-950/40 border-slate-800/80'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: currentMatch.teamB.color }}
                />
                <span className="font-display font-bold text-lg text-white">
                  {currentMatch.teamB.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono-code">
                  {currentMatch.teamB.shortName}
                </span>
              </div>
              <button
                id="btn-select-team-b"
                onClick={() => setSelectedPlayerTarget('teamB')}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedPlayerTarget === 'teamB'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {selectedPlayerTarget === 'teamB' ? '✓ Selected' : 'Select Target'}
              </button>
            </div>

            {/* Score Display */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                {scoreDisplay.primaryB}
              </span>
              {scoreDisplay.secondaryB && (
                <span className="text-sm font-mono-code text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                  {scoreDisplay.secondaryB}
                </span>
              )}
            </div>

            {/* Star Athlete in Roster or Seeded */}
            <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
              Opposing Contender • Ready for strategy scoring events
            </div>
          </div>
        </div>

        {/* Set or Combat Termination Indicators */}
        {currentMatch.tennisState && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono-code">
            <span className="text-slate-400">Sets Recorded:</span>
            {currentMatch.tennisState.sets.map((set, idx) => (
              <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-200">
                S{idx + 1}: {set.teamA}-{set.teamB}
              </span>
            ))}
            {currentMatch.tennisState.isDeuce && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold animate-pulse">
                ⚡ DEUCE ADVANTAGE ACTIVE
              </span>
            )}
            {currentMatch.tennisState.breakPoint && (
              <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold animate-pulse">
                🔥 BREAK POINT CHANCE
              </span>
            )}
          </div>
        )}

        {/* Cricket Ball-by-Ball Innings Scorebug & Pitch Card */}
        {currentMatch.cricketState && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            {/* Chase & Run Rate Bar */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono-code font-bold">
                  {currentMatch.cricketState.innings === 1 ? '1st Innings' : '2nd Innings'}
                </span>
                {currentMatch.cricketState.target && (
                  <span className="text-slate-200 font-bold font-display">
                    Target: {currentMatch.cricketState.target} (Need {Math.max(0, currentMatch.cricketState.target - currentMatch.cricketState.runs)} runs from {Math.max(0, currentMatch.cricketState.totalOvers * 6 - (currentMatch.cricketState.overs * 6 + currentMatch.cricketState.balls))} balls)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 font-mono-code text-slate-400">
                <span>CRR: <strong className="text-white">{currentMatch.cricketState.crr}</strong></span>
                {currentMatch.cricketState.rrr !== undefined && (
                  <span>RRR: <strong className="text-amber-400">{currentMatch.cricketState.rrr}</strong></span>
                )}
                <span>Overs: <strong className="text-white">{currentMatch.cricketState.overs}.{currentMatch.cricketState.balls} / {currentMatch.cricketState.totalOvers}</strong></span>
              </div>
            </div>

            {/* Pitch Status: Batsmen & Bowler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Batting Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-2 border-b border-slate-850 pb-1">
                  <span>BATSMAN</span>
                  <div className="flex gap-4 font-mono-code">
                    <span>R (B)</span>
                    <span>4s</span>
                    <span>6s</span>
                    <span>SR</span>
                  </div>
                </div>
                {/* Striker */}
                <div className="flex items-center justify-between py-1 text-slate-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-emerald-400 font-bold">🏏*</span>
                    <span className="text-white font-bold">{currentMatch.cricketState.currentStriker}</span>
                    <span className="text-[10px] text-emerald-400 font-mono-code bg-emerald-950/60 px-1 rounded">Strike</span>
                  </div>
                  <div className="flex gap-4 font-mono-code text-right">
                    <span className="text-white font-bold w-12 text-right">
                      {currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentStriker]?.runs || 0} ({currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentStriker]?.balls || 0})
                    </span>
                    <span className="w-4 text-center">{currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentStriker]?.fours || 0}</span>
                    <span className="w-4 text-center">{currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentStriker]?.sixes || 0}</span>
                    <span className="w-10 text-right text-emerald-400">
                      {currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentStriker]?.balls 
                        ? ((currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentStriker].runs / currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentStriker].balls) * 100).toFixed(1)
                        : '0.0'}
                    </span>
                  </div>
                </div>
                {/* Non-Striker */}
                <div className="flex items-center justify-between py-1 text-slate-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-slate-500">🏏</span>
                    <span>{currentMatch.cricketState.currentNonStriker}</span>
                  </div>
                  <div className="flex gap-4 font-mono-code text-right">
                    <span className="text-slate-300 w-12 text-right">
                      {currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentNonStriker]?.runs || 0} ({currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentNonStriker]?.balls || 0})
                    </span>
                    <span className="w-4 text-center">{currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentNonStriker]?.fours || 0}</span>
                    <span className="w-4 text-center">{currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentNonStriker]?.sixes || 0}</span>
                    <span className="w-10 text-right text-slate-400">
                      {currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentNonStriker]?.balls 
                        ? ((currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentNonStriker].runs / currentMatch.cricketState.batsmenStats[currentMatch.cricketState.currentNonStriker].balls) * 100).toFixed(1)
                        : '0.0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bowler & This Over */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-2 border-b border-slate-850 pb-1">
                    <span>BOWLER</span>
                    <div className="flex gap-4 font-mono-code">
                      <span>O</span>
                      <span>M</span>
                      <span>R</span>
                      <span>W</span>
                      <span>ECON</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 text-slate-200">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-rose-400">🎯</span>
                      <span className="text-white font-bold">{currentMatch.cricketState.currentBowler}</span>
                    </div>
                    <div className="flex gap-4 font-mono-code text-right">
                      <span className="w-6 text-center">{currentMatch.cricketState.bowlerStats[currentMatch.cricketState.currentBowler]?.overs || '0.0'}</span>
                      <span className="w-4 text-center">{currentMatch.cricketState.bowlerStats[currentMatch.cricketState.currentBowler]?.maidens || 0}</span>
                      <span className="w-4 text-center">{currentMatch.cricketState.bowlerStats[currentMatch.cricketState.currentBowler]?.runs || 0}</span>
                      <span className="w-4 text-center font-bold text-rose-400">{currentMatch.cricketState.bowlerStats[currentMatch.cricketState.currentBowler]?.wickets || 0}</span>
                      <span className="w-10 text-right text-slate-300">{currentMatch.cricketState.bowlerStats[currentMatch.cricketState.currentBowler]?.economy || 0}</span>
                    </div>
                  </div>
                </div>

                {/* This Over Balls Badge Strip */}
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">This Over:</span>
                  <div className="flex items-center gap-1.5">
                    {currentMatch.cricketState.recentBalls.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">No balls bowled yet in over</span>
                    ) : (
                      currentMatch.cricketState.recentBalls.map((ball, bIdx) => {
                        let badgeStyle = 'bg-slate-800 text-white font-bold border-slate-700';
                        if (ball === '4') badgeStyle = 'bg-emerald-600 text-white font-bold border-emerald-400';
                        else if (ball === '6') badgeStyle = 'bg-purple-600 text-white font-bold border-purple-300 animate-pulse';
                        else if (ball === 'W') badgeStyle = 'bg-rose-600 text-white font-bold border-rose-400';
                        else if (ball.includes('Wd') || ball.includes('Nb')) badgeStyle = 'bg-amber-600 text-white font-bold border-amber-400';
                        else if (ball === '0') badgeStyle = 'bg-slate-700 text-white font-bold border-slate-600';
                        else badgeStyle = 'bg-blue-600 text-white font-bold border-blue-400';

                        return (
                          <span
                            key={bIdx}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono-code border ${badgeStyle}`}
                          >
                            {ball}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kabaddi Raid Clock & Point Indicators */}
        {currentMatch.kabaddiState && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono-code font-bold">
                🤼 30s Raid Clock: {currentMatch.kabaddiState.raidClock}s
              </span>
              <span className="text-slate-300">
                Active Raider: <strong className="text-white">{currentMatch.kabaddiState.activeRaider}</strong>
              </span>
              {currentMatch.kabaddiState.isDoOrDie && (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold animate-pulse">
                  ⚡ DO-OR-DIE RAID
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 font-mono-code text-slate-400">
              <span>Raid: <strong className="text-white">{currentMatch.kabaddiState.raidPoints.teamA}-{currentMatch.kabaddiState.raidPoints.teamB}</strong></span>
              <span>Tackle: <strong className="text-white">{currentMatch.kabaddiState.tacklePoints.teamA}-{currentMatch.kabaddiState.tacklePoints.teamB}</strong></span>
              <span>All-Outs: <strong className="text-amber-400">{currentMatch.kabaddiState.allOuts.teamA}-{currentMatch.kabaddiState.allOuts.teamB}</strong></span>
            </div>
          </div>
        )}

        {currentMatch.combatState?.termination && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider">Bout Terminated by {currentMatch.combatState.termination.method}</span>
              <span className="text-slate-300 ml-2">
                Round {currentMatch.combatState.termination.round} at {currentMatch.combatState.termination.time}. Contest is finalized.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Action Pad Powered by Strategy Pattern */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <span>Modular Event Action Pad</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono-code">
                Target: {selectedPlayerTarget === 'teamA' ? currentMatch.teamA.shortName : currentMatch.teamB.shortName}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Each tap generates an immutable Event object, auto-applies strategy rule scoring, updates the timeline, and triggers AI highlight clipping.
            </p>
          </div>

          <button
            id="btn-inspect-strategy-code"
            onClick={() => setShowCodeInspector(!showCodeInspector)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-code transition-all"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>{showCodeInspector ? 'Hide Strategy Code' : 'Inspect Strategy Pattern'}</span>
          </button>
        </div>

        {/* Mobile Fast Cricket Keypad (Ultra responsive single-tap ball scoring for cricket scorers on mobile) */}
        {currentMatch.cricketState && (
          <div className="block sm:hidden mb-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <span>🏏</span>
                <span>Fast Ball Keypad:</span>
                <span className="text-emerald-400 font-mono-code font-bold">
                  {currentMatch.cricketState.currentStriker.split(' ')[0]}*
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono-code">
                Over {currentMatch.cricketState.overs}.{currentMatch.cricketState.balls}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-1.5">
              <button
                id="btn-fast-ball-0"
                onClick={() => handleFastCricketBall('0')}
                className="h-12 rounded-xl bg-slate-800 border border-slate-600 text-white font-mono-code font-extrabold text-base flex items-center justify-center active:scale-90 active:bg-slate-700 transition-all shadow-sm"
              >
                0
              </button>
              <button
                id="btn-fast-ball-1"
                onClick={() => handleFastCricketBall('1')}
                className="h-12 rounded-xl bg-blue-700 border border-blue-500 text-white font-mono-code font-extrabold text-base flex items-center justify-center active:scale-90 active:bg-blue-600 transition-all shadow-sm"
              >
                1
              </button>
              <button
                id="btn-fast-ball-2"
                onClick={() => handleFastCricketBall('2')}
                className="h-12 rounded-xl bg-blue-800 border border-blue-600 text-white font-mono-code font-extrabold text-base flex items-center justify-center active:scale-90 active:bg-blue-700 transition-all shadow-sm"
              >
                2
              </button>
              <button
                id="btn-fast-ball-3"
                onClick={() => handleFastCricketBall('3')}
                className="h-12 rounded-xl bg-indigo-700 border border-indigo-500 text-white font-mono-code font-extrabold text-base flex items-center justify-center active:scale-90 active:bg-indigo-600 transition-all shadow-sm"
              >
                3
              </button>
              <button
                id="btn-fast-ball-4"
                onClick={() => handleFastCricketBall('4')}
                className="h-12 rounded-xl bg-emerald-600 border border-emerald-400 text-white font-mono-code font-black text-lg flex items-center justify-center active:scale-90 shadow-md shadow-emerald-500/30"
              >
                4
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <button
                id="btn-fast-ball-6"
                onClick={() => handleFastCricketBall('6')}
                className="h-12 rounded-xl bg-purple-600 border border-purple-400 text-white font-mono-code font-black text-lg flex items-center justify-center active:scale-90 shadow-md shadow-purple-500/30"
              >
                6
              </button>
              <button
                id="btn-fast-ball-w"
                onClick={() => handleFastCricketBall('W')}
                className="h-12 rounded-xl bg-rose-600 border border-rose-400 text-white font-mono-code font-black text-base flex items-center justify-center active:scale-90 shadow-md shadow-rose-500/30"
              >
                OUT W
              </button>
              <button
                id="btn-fast-ball-wd"
                onClick={() => handleFastCricketBall('Wd')}
                className="h-12 rounded-xl bg-amber-600 border border-amber-400 text-white font-mono-code font-bold text-xs flex items-center justify-center active:scale-90 shadow-md shadow-amber-500/20"
              >
                Wide (Wd)
              </button>
              <button
                id="btn-fast-ball-nb"
                onClick={() => handleFastCricketBall('Nb')}
                className="h-12 rounded-xl bg-orange-600 border border-orange-400 text-white font-mono-code font-bold text-xs flex items-center justify-center active:scale-90 shadow-md shadow-orange-500/20"
              >
                No Ball (Nb)
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {availableActions.map((action) => (
            <button
              key={action.id}
              id={`action-${action.id}`}
              onClick={() => handleTriggerAction(action, selectedPlayerTarget)}
              className={`p-3 min-h-[52px] sm:min-h-0 rounded-xl text-xs font-bold text-center flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md ${action.color}`}
            >
              <span>{action.label}</span>
              {action.highlightWorthy && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI Clip
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Optional Event Detail note */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
          <input 
            type="text"
            id="input-event-detail"
            value={customDetail}
            onChange={(e) => setCustomDetail(e.target.value)}
            placeholder="Optional context (e.g., 'Curler from 25 yards', '188 km/h ace down the T')"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-[11px] text-slate-500 self-center">
            Appends tactical telemetry to the generated Event object.
          </span>
        </div>
      </div>

      {/* Code Inspector Drawer (Strategy Pattern Demonstration) */}
      {showCodeInspector && (
        <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl font-mono-code text-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Active Strategy Class:</span>
              <span className="text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {strategy.category}Strategy ({strategy.sportId})
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Decoupled Game Rules Engine</span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-4 overflow-x-auto text-slate-300 text-[11px] leading-relaxed border border-slate-800">
            <span className="text-purple-400">interface</span> <span className="text-amber-300">StrategyRuleSet</span> &#123;<br/>
            &nbsp;&nbsp;sportId: <span className="text-emerald-300">'{strategy.sportId}'</span>;<br/>
            &nbsp;&nbsp;category: <span className="text-emerald-300">'{strategy.category}'</span>;<br/>
            &nbsp;&nbsp;getPeriodLabel(match): <span className="text-blue-300">string</span>; <span className="text-slate-500">// Returns "{periodLabel}"</span><br/>
            &nbsp;&nbsp;formatScore(match): <span className="text-blue-300">&#123; primaryA: "{scoreDisplay.primaryA}", primaryB: "{scoreDisplay.primaryB}" &#125;</span>;<br/>
            &nbsp;&nbsp;applyEvent(match, event): <span className="text-blue-300">Match</span>;<br/>
            &#125;
          </div>
          <p className="mt-3 text-xs text-slate-400">
            💡 <strong>Why this strategy pattern is essential:</strong> While legacy single-sport scoring tools are hardcoded for one specific rulebook, SportPulse uses this interchangeable Strategy Pattern. The Core App Engine remains uniform and rock-solid while specialized sport rules are dynamically injected per match!
          </p>
        </div>
      )}

      {/* Real-time Match Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-display font-bold text-white">
              Event-Driven Match Timeline ({currentMatch.events.length} Events)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click any event to inspect or generate AI highlight
          </span>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {currentMatch.events.map((event, idx) => (
            <div
              key={event.id}
              id={`timeline-event-${event.id}`}
              onClick={() => onTriggerHighlight(event)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-code font-bold text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 min-w-[54px] text-center">
                  {event.gameTime}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {event.label}
                    </span>
                    {event.highlightWorthy && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Clip Ready
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {event.playerName ? `By ${event.playerName}` : 'Match Event'}
                    {event.details ? ` • ${event.details}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 group-hover:text-emerald-400 flex items-center gap-1">
                  <span>View Replay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}

          {currentMatch.events.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No events logged yet. Use the Action Pad above to score points or events!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
