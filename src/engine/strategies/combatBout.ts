import { Match, SportEvent, StrategyRuleSet } from '../../types/sport';

export const mmaCombatStrategy: StrategyRuleSet = {
  sportId: 'mma',
  category: 'COMBAT_BOUT',
  getPeriodLabel: (match: Match) => {
    if (match.combatState?.termination) {
      return `Ended: ${match.combatState.termination.method} (R${match.combatState.termination.round})`;
    }
    return `Round ${match.currentPeriod} of 3 (Title Bout)`;
  },
  formatScore: (match: Match) => {
    const cs = match.combatState;
    if (cs?.termination) {
      const winnerName = cs.termination.winnerTeamId === match.teamA.id ? match.teamA.shortName : match.teamB.shortName;
      return {
        primaryA: cs.termination.winnerTeamId === match.teamA.id ? 'WIN' : 'LOSS',
        primaryB: cs.termination.winnerTeamId === match.teamB.id ? 'WIN' : 'LOSS',
        secondaryA: `Strikes: ${cs.strikes.teamA} | KD: ${cs.knockdowns.teamA}`,
        secondaryB: `Strikes: ${cs.strikes.teamB} | KD: ${cs.knockdowns.teamB}`
      };
    }
    const scoreA = cs ? cs.roundScores.reduce((acc, curr) => acc + curr.teamA, 0) : 0;
    const scoreB = cs ? cs.roundScores.reduce((acc, curr) => acc + curr.teamB, 0) : 0;

    return {
      primaryA: String(scoreA),
      primaryB: String(scoreB),
      secondaryA: `Strikes: ${cs?.strikes.teamA || 0} | TD: ${cs?.takedowns.teamA || 0}`,
      secondaryB: `Strikes: ${cs?.strikes.teamB || 0} | TD: ${cs?.takedowns.teamB || 0}`
    };
  },
  formatGameClock: (match: Match) => {
    if (match.combatState?.termination) {
      return `STOPPAGE: ${match.combatState.termination.time}`;
    }
    const roundDuration = 5 * 60; // 5 minute MMA rounds
    const remaining = Math.max(0, roundDuration - (match.clockSeconds % roundDuration));
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;
    return `R${match.currentPeriod} ${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },
  getAvailableActions: (match: Match) => {
    if (match.combatState?.termination || match.status === 'COMPLETED') {
      return [];
    }
    return [
      { id: 'sig_strike', label: 'Sig Strike 💥', type: 'SIGNIFICANT_STRIKE', teamIdTarget: 'both', pointDelta: 0, color: 'bg-red-600 hover:bg-red-500 text-white', highlightWorthy: false },
      { id: 'takedown', label: 'Takedown 🤼', type: 'TAKEDOWN', teamIdTarget: 'both', pointDelta: 0, color: 'bg-amber-600 hover:bg-amber-500 text-white', highlightWorthy: true },
      { id: 'knockdown', label: 'Knockdown! ⚡', type: 'KNOCKDOWN', teamIdTarget: 'both', pointDelta: 0, color: 'bg-purple-600 hover:bg-purple-500 text-white', highlightWorthy: true },
      // TERMINATION OVERRIDES (Instantly overrides score and completes match)
      { id: 'ko_override', label: 'TERMINATION: Knockout (KO) 🛑', type: 'KO_TERMINATION', teamIdTarget: 'both', pointDelta: 0, color: 'bg-rose-950 border border-rose-500 text-rose-300 font-bold', highlightWorthy: true },
      { id: 'sub_override', label: 'TERMINATION: Submission (Tap) 🥋', type: 'SUBMISSION_TERMINATION', teamIdTarget: 'both', pointDelta: 0, color: 'bg-indigo-950 border border-indigo-500 text-indigo-300 font-bold', highlightWorthy: true },
      { id: 'end_round', label: 'Score Round (10-9 Must)', type: 'ROUND_SCORE', teamIdTarget: 'both', pointDelta: 0, color: 'bg-slate-700 hover:bg-slate-600 text-white', highlightWorthy: false }
    ];
  },
  applyEvent: (match: Match, eventData: Partial<SportEvent> & { type: string; teamId: string }) => {
    const updated = JSON.parse(JSON.stringify(match)) as Match;
    if (!updated.combatState) {
      updated.combatState = {
        currentRound: 1,
        roundScores: [],
        strikes: { teamA: 0, teamB: 0 },
        takedowns: { teamA: 0, teamB: 0 },
        knockdowns: { teamA: 0, teamB: 0 }
      };
    }

    const cs = updated.combatState;
    const isTeamA = eventData.teamId === updated.teamA.id;
    const side = isTeamA ? 'teamA' : 'teamB';
    const athleteName = isTeamA ? updated.teamA.name : updated.teamB.name;

    let isHighlight = false;
    let label = eventData.label || eventData.type;

    if (eventData.type === 'SIGNIFICANT_STRIKE') {
      cs.strikes[side] += 1;
    } else if (eventData.type === 'TAKEDOWN') {
      cs.takedowns[side] += 1;
      isHighlight = true;
      label = `Explosive Takedown by ${athleteName}`;
    } else if (eventData.type === 'KNOCKDOWN') {
      cs.knockdowns[side] += 1;
      isHighlight = true;
      label = `MASSIVE KNOCKDOWN! ${athleteName} drops opponent!`;
    } else if (eventData.type === 'KO_TERMINATION') {
      cs.termination = {
        method: 'KO',
        winnerTeamId: eventData.teamId,
        round: updated.currentPeriod,
        time: mmaCombatStrategy.formatGameClock(match)
      };
      updated.status = 'COMPLETED';
      isHighlight = true;
      label = `🚨 BOUT OVERRIDE: KNOCKOUT VICTORY for ${athleteName}!`;
    } else if (eventData.type === 'SUBMISSION_TERMINATION') {
      cs.termination = {
        method: 'SUBMISSION',
        winnerTeamId: eventData.teamId,
        round: updated.currentPeriod,
        time: mmaCombatStrategy.formatGameClock(match)
      };
      updated.status = 'COMPLETED';
      isHighlight = true;
      label = `🚨 BOUT OVERRIDE: SUBMISSION (Tapout) VICTORY for ${athleteName}!`;
    } else if (eventData.type === 'ROUND_SCORE') {
      // Add 10-9 round
      const rScore = isTeamA ? { teamA: 10, teamB: 9 } : { teamA: 9, teamB: 10 };
      cs.roundScores.push(rScore);
      if (updated.currentPeriod < 3) {
        updated.currentPeriod += 1;
        cs.currentRound += 1;
      } else {
        updated.status = 'COMPLETED';
      }
      label = `Judge Scorecard: Round ${updated.currentPeriod - (updated.status === 'COMPLETED' ? 0 : 1)} awarded to ${athleteName} (10-9)`;
    }

    const newEvent: SportEvent = {
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      matchId: match.id,
      timestamp: new Date().toISOString(),
      gameTime: mmaCombatStrategy.formatGameClock(match),
      period: match.currentPeriod,
      type: eventData.type,
      label,
      teamId: eventData.teamId,
      playerId: eventData.playerId,
      playerName: eventData.playerName || athleteName,
      pointDelta: 0,
      details: eventData.details,
      highlightWorthy: Boolean(isHighlight || eventData.highlightWorthy),
    };

    updated.events.unshift(newEvent);
    return updated;
  }
};
