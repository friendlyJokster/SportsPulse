import { Match, SportEvent, StrategyRuleSet } from '../../types/sport';

export const footballStrategy: StrategyRuleSet = {
  sportId: 'football',
  category: 'CLOCK_AND_ACCUMULATE',
  getPeriodLabel: (match: Match) => {
    if (match.currentPeriod === 1) return '1st Half';
    if (match.currentPeriod === 2) return '2nd Half';
    if (match.currentPeriod === 3) return 'Extra Time 1';
    if (match.currentPeriod === 4) return 'Extra Time 2';
    return 'Full Time';
  },
  formatScore: (match: Match) => ({
    primaryA: String(match.teamA.score),
    primaryB: String(match.teamB.score)
  }),
  formatGameClock: (match: Match) => {
    const min = Math.floor(match.clockSeconds / 60);
    const sec = match.clockSeconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },
  getAvailableActions: (match: Match) => [
    { id: 'goal', label: 'Goal ⚽', type: 'GOAL', teamIdTarget: 'both', pointDelta: 1, color: 'bg-emerald-600 hover:bg-emerald-500 text-white', highlightWorthy: true },
    { id: 'shot_on_target', label: 'Shot on Target', type: 'SHOT_SAVED', teamIdTarget: 'both', pointDelta: 0, color: 'bg-blue-600/80 hover:bg-blue-500 text-white', highlightWorthy: true },
    { id: 'yellow_card', label: 'Yellow Card 🟨', type: 'YELLOW_CARD', teamIdTarget: 'both', pointDelta: 0, color: 'bg-amber-600/80 hover:bg-amber-500 text-white', highlightWorthy: false },
    { id: 'red_card', label: 'Red Card 🟥', type: 'RED_CARD', teamIdTarget: 'both', pointDelta: 0, color: 'bg-rose-600 hover:bg-rose-500 text-white', highlightWorthy: true },
    { id: 'corner', label: 'Corner Kick', type: 'CORNER', teamIdTarget: 'both', pointDelta: 0, color: 'bg-slate-700 hover:bg-slate-600 text-white', highlightWorthy: false },
    { id: 'foul', label: 'Foul Whistle', type: 'FOUL', teamIdTarget: 'both', pointDelta: 0, color: 'bg-slate-800 hover:bg-slate-700 text-slate-200', highlightWorthy: false },
  ],
  applyEvent: (match: Match, eventData: Partial<SportEvent> & { type: string; teamId: string }) => {
    const updated = JSON.parse(JSON.stringify(match)) as Match;
    const isTeamA = eventData.teamId === updated.teamA.id;
    const targetTeam = isTeamA ? updated.teamA : updated.teamB;

    if (eventData.type === 'GOAL') {
      targetTeam.score += 1;
    }

    const newEvent: SportEvent = {
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      matchId: match.id,
      timestamp: new Date().toISOString(),
      gameTime: footballStrategy.formatGameClock(match),
      period: match.currentPeriod,
      type: eventData.type,
      label: eventData.label || eventData.type,
      teamId: eventData.teamId,
      playerId: eventData.playerId,
      playerName: eventData.playerName || (isTeamA ? updated.teamA.players[0]?.name : updated.teamB.players[0]?.name) || 'Player',
      pointDelta: eventData.pointDelta || (eventData.type === 'GOAL' ? 1 : 0),
      details: eventData.details,
      highlightWorthy: Boolean(eventData.highlightWorthy || eventData.type === 'GOAL' || eventData.type === 'RED_CARD'),
    };

    updated.events.unshift(newEvent);
    return updated;
  }
};

export const basketballStrategy: StrategyRuleSet = {
  sportId: 'basketball',
  category: 'CLOCK_AND_ACCUMULATE',
  getPeriodLabel: (match: Match) => `Quarter ${match.currentPeriod}`,
  formatScore: (match: Match) => ({
    primaryA: String(match.teamA.score),
    primaryB: String(match.teamB.score)
  }),
  formatGameClock: (match: Match) => {
    // 12-minute quarters countdown
    const quarterTotal = 12 * 60;
    const remaining = Math.max(0, quarterTotal - (match.clockSeconds % quarterTotal));
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },
  getAvailableActions: (match: Match) => [
    { id: 'two_pointer', label: '+2 Field Goal 🏀', type: 'POINT_2', teamIdTarget: 'both', pointDelta: 2, color: 'bg-orange-600 hover:bg-orange-500 text-white', highlightWorthy: false },
    { id: 'three_pointer', label: '+3 Downtown 🎯', type: 'POINT_3', teamIdTarget: 'both', pointDelta: 3, color: 'bg-emerald-600 hover:bg-emerald-500 text-white', highlightWorthy: true },
    { id: 'free_throw', label: '+1 Free Throw', type: 'POINT_1', teamIdTarget: 'both', pointDelta: 1, color: 'bg-amber-600 hover:bg-amber-500 text-white', highlightWorthy: false },
    { id: 'dunk', label: 'Monster Dunk 🔥', type: 'POINT_2', teamIdTarget: 'both', pointDelta: 2, color: 'bg-rose-600 hover:bg-rose-500 text-white', highlightWorthy: true },
    { id: 'foul', label: 'Personal Foul', type: 'FOUL', teamIdTarget: 'both', pointDelta: 0, color: 'bg-slate-700 hover:bg-slate-600 text-white', highlightWorthy: false },
    { id: 'timeout', label: 'Timeout ⏱️', type: 'TIMEOUT', teamIdTarget: 'both', pointDelta: 0, color: 'bg-indigo-600 hover:bg-indigo-500 text-white', highlightWorthy: false }
  ],
  applyEvent: (match: Match, eventData: Partial<SportEvent> & { type: string; teamId: string }) => {
    const updated = JSON.parse(JSON.stringify(match)) as Match;
    const isTeamA = eventData.teamId === updated.teamA.id;
    const targetTeam = isTeamA ? updated.teamA : updated.teamB;

    const delta = eventData.pointDelta || 0;
    targetTeam.score += delta;

    const newEvent: SportEvent = {
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      matchId: match.id,
      timestamp: new Date().toISOString(),
      gameTime: basketballStrategy.formatGameClock(match),
      period: match.currentPeriod,
      type: eventData.type,
      label: eventData.label || `${delta > 0 ? `+${delta}` : ''} ${eventData.type}`,
      teamId: eventData.teamId,
      playerId: eventData.playerId,
      playerName: eventData.playerName || (isTeamA ? updated.teamA.players[0]?.name : updated.teamB.players[0]?.name) || 'Athlete',
      pointDelta: delta,
      details: eventData.details,
      highlightWorthy: Boolean(eventData.highlightWorthy || delta === 3 || eventData.type.includes('DUNK')),
    };

    updated.events.unshift(newEvent);
    return updated;
  }
};
