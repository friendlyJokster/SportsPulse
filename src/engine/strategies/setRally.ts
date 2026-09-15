import { Match, SportEvent, StrategyRuleSet } from '../../types/sport';

const TENNIS_POINTS = ['0', '15', '30', '40'];

export const tennisStrategy: StrategyRuleSet = {
  sportId: 'tennis',
  category: 'SET_AND_RALLY',
  getPeriodLabel: (match: Match) => {
    return `Set ${match.currentPeriod}`;
  },
  formatScore: (match: Match) => {
    const ts = match.tennisState;
    if (!ts) {
      return { primaryA: '0', primaryB: '0' };
    }
    // Primary is sets won
    const setsWonA = ts.sets.filter(s => s.teamA > s.teamB && (s.teamA >= 6 && s.teamA - s.teamB >= 2 || s.teamA === 7)).length;
    const setsWonB = ts.sets.filter(s => s.teamB > s.teamA && (s.teamB >= 6 && s.teamB - s.teamA >= 2 || s.teamB === 7)).length;

    // Secondary is current games and points
    const currentGamesA = ts.games.teamA;
    const currentGamesB = ts.games.teamB;
    const ptsA = ts.currentPoints.teamA;
    const ptsB = ts.currentPoints.teamB;

    return {
      primaryA: `${setsWonA}`,
      primaryB: `${setsWonB}`,
      secondaryA: `G: ${currentGamesA} (${ptsA})`,
      secondaryB: `G: ${currentGamesB} (${ptsB})`
    };
  },
  formatGameClock: (match: Match) => {
    const ts = match.tennisState;
    const serverLabel = ts?.server === 'teamA' ? `• Srv: ${match.teamA.shortName}` : `• Srv: ${match.teamB.shortName}`;
    return `Set ${match.currentPeriod} ${serverLabel}`;
  },
  getAvailableActions: (match: Match) => [
    { id: 'point_a', label: `Point ${match.teamA.shortName} 🎾`, type: 'POINT', teamIdTarget: 'teamA', pointDelta: 1, color: 'bg-emerald-600 hover:bg-emerald-500 text-white', highlightWorthy: false },
    { id: 'point_b', label: `Point ${match.teamB.shortName} 🎾`, type: 'POINT', teamIdTarget: 'teamB', pointDelta: 1, color: 'bg-blue-600 hover:bg-blue-500 text-white', highlightWorthy: false },
    { id: 'ace', label: 'Ace Serve ⚡', type: 'ACE', teamIdTarget: 'both', pointDelta: 1, color: 'bg-amber-600 hover:bg-amber-500 text-white', highlightWorthy: true },
    { id: 'double_fault', label: 'Double Fault ⚠️', type: 'DOUBLE_FAULT', teamIdTarget: 'both', pointDelta: 0, color: 'bg-rose-700 hover:bg-rose-600 text-white', highlightWorthy: false },
    { id: 'break_point', label: 'Break Point Winner 💥', type: 'BREAK_WINNER', teamIdTarget: 'both', pointDelta: 1, color: 'bg-purple-600 hover:bg-purple-500 text-white', highlightWorthy: true }
  ],
  applyEvent: (match: Match, eventData: Partial<SportEvent> & { type: string; teamId: string }) => {
    const updated = JSON.parse(JSON.stringify(match)) as Match;
    if (!updated.tennisState) {
      updated.tennisState = {
        server: 'teamA',
        currentPoints: { teamA: '0', teamB: '0' },
        games: { teamA: 0, teamB: 0 },
        sets: [{ teamA: 0, teamB: 0 }],
        isDeuce: false,
        breakPoint: false
      };
    }

    const ts = updated.tennisState;
    const scoringSide = eventData.teamId === updated.teamA.id ? 'teamA' : 'teamB';
    const otherSide = scoringSide === 'teamA' ? 'teamB' : 'teamA';

    // Point progression logic
    let wonGame = false;
    const currentPt = ts.currentPoints[scoringSide];
    const opponentPt = ts.currentPoints[otherSide];

    if (currentPt === '0') {
      ts.currentPoints[scoringSide] = '15';
    } else if (currentPt === '15') {
      ts.currentPoints[scoringSide] = '30';
    } else if (currentPt === '30') {
      ts.currentPoints[scoringSide] = '40';
      if (opponentPt === '40') {
        ts.isDeuce = true;
      }
    } else if (currentPt === '40') {
      if (opponentPt === '40') {
        // Deuce -> Advantage
        ts.currentPoints[scoringSide] = 'AD';
        ts.isDeuce = false;
      } else if (opponentPt === 'AD') {
        // Opponent has AD, back to Deuce
        ts.currentPoints[otherSide] = '40';
        ts.isDeuce = true;
      } else {
        // Game won!
        wonGame = true;
      }
    } else if (currentPt === 'AD') {
      // Won from Advantage
      wonGame = true;
    }

    if (wonGame) {
      ts.games[scoringSide] += 1;
      ts.currentPoints.teamA = '0';
      ts.currentPoints.teamB = '0';
      ts.isDeuce = false;
      // Switch server
      ts.server = ts.server === 'teamA' ? 'teamB' : 'teamA';

      // Check if set won (first to 6 by 2 or 7-6)
      const gWinner = ts.games[scoringSide];
      const gLoser = ts.games[otherSide];
      if ((gWinner >= 6 && gWinner - gLoser >= 2) || gWinner === 7) {
        // Set completed
        ts.sets[updated.currentPeriod - 1] = { teamA: ts.games.teamA, teamB: ts.games.teamB };
        if (scoringSide === 'teamA') updated.teamA.score += 1;
        else updated.teamB.score += 1;

        if (updated.teamA.score === 2 || updated.teamB.score === 2) {
          updated.status = 'COMPLETED';
        } else {
          updated.currentPeriod += 1;
          ts.games.teamA = 0;
          ts.games.teamB = 0;
          ts.sets.push({ teamA: 0, teamB: 0 });
        }
      }
    }

    // Check break point state
    const isReceiverScoring = (ts.server === 'teamA' && scoringSide === 'teamB') || (ts.server === 'teamB' && scoringSide === 'teamA');
    ts.breakPoint = isReceiverScoring && (ts.currentPoints[scoringSide] === '40' || ts.currentPoints[scoringSide] === 'AD');

    const newEvent: SportEvent = {
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      matchId: match.id,
      timestamp: new Date().toISOString(),
      gameTime: `Set ${match.currentPeriod} [${ts.games.teamA}-${ts.games.teamB}] (${ts.currentPoints.teamA}-${ts.currentPoints.teamB})`,
      period: match.currentPeriod,
      type: eventData.type,
      label: wonGame ? `Game Won by ${eventData.teamId === updated.teamA.id ? updated.teamA.shortName : updated.teamB.shortName}` : (eventData.label || 'Point'),
      teamId: eventData.teamId,
      playerId: eventData.playerId,
      playerName: eventData.playerName || (eventData.teamId === updated.teamA.id ? updated.teamA.name : updated.teamB.name),
      pointDelta: 1,
      details: wonGame ? `Takes game ${ts.games.teamA}-${ts.games.teamB}` : undefined,
      highlightWorthy: Boolean(wonGame || eventData.type === 'ACE' || eventData.type === 'BREAK_WINNER'),
    };

    updated.events.unshift(newEvent);
    return updated;
  }
};

export const badmintonStrategy: StrategyRuleSet = {
  sportId: 'badminton',
  category: 'SET_AND_RALLY',
  getPeriodLabel: (match: Match) => `Game ${match.currentPeriod} (Best of 3)`,
  formatScore: (match: Match) => ({
    primaryA: String(match.teamA.score), // sets won
    primaryB: String(match.teamB.score),
    secondaryA: `Pts: ${match.teamA.secondaryScore || 0}`,
    secondaryB: `Pts: ${match.teamB.secondaryScore || 0}`
  }),
  formatGameClock: (match: Match) => `Game ${match.currentPeriod} Rally`,
  getAvailableActions: (match: Match) => [
    { id: 'rally_point_a', label: `Point ${match.teamA.shortName} 🏸`, type: 'RALLY_POINT', teamIdTarget: 'teamA', pointDelta: 1, color: 'bg-emerald-600 hover:bg-emerald-500 text-white', highlightWorthy: false },
    { id: 'rally_point_b', label: `Point ${match.teamB.shortName} 🏸`, type: 'RALLY_POINT', teamIdTarget: 'teamB', pointDelta: 1, color: 'bg-blue-600 hover:bg-blue-500 text-white', highlightWorthy: false },
    { id: 'smash_winner', label: 'Down-the-Line Smash ⚡', type: 'SMASH_WINNER', teamIdTarget: 'both', pointDelta: 1, color: 'bg-purple-600 hover:bg-purple-500 text-white', highlightWorthy: true },
    { id: 'service_fault', label: 'Service Fault', type: 'FAULT', teamIdTarget: 'both', pointDelta: 0, color: 'bg-rose-700 hover:bg-rose-600 text-white', highlightWorthy: false },
  ],
  applyEvent: (match: Match, eventData: Partial<SportEvent> & { type: string; teamId: string }) => {
    const updated = JSON.parse(JSON.stringify(match)) as Match;
    const isTeamA = eventData.teamId === updated.teamA.id;
    const targetTeam = isTeamA ? updated.teamA : updated.teamB;
    const otherTeam = isTeamA ? updated.teamB : updated.teamA;

    targetTeam.secondaryScore = (targetTeam.secondaryScore || 0) + 1;

    let gameWon = false;
    const myPts = targetTeam.secondaryScore;
    const oppPts = otherTeam.secondaryScore || 0;

    // First to 21 with 2 lead, or first to 30
    if ((myPts >= 21 && myPts - oppPts >= 2) || myPts === 30) {
      gameWon = true;
      targetTeam.score += 1;
      targetTeam.secondaryScore = 0;
      otherTeam.secondaryScore = 0;

      if (targetTeam.score >= 2) {
        updated.status = 'COMPLETED';
      } else {
        updated.currentPeriod += 1;
      }
    }

    const newEvent: SportEvent = {
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      matchId: match.id,
      timestamp: new Date().toISOString(),
      gameTime: `Game ${match.currentPeriod} [${updated.teamA.secondaryScore || 0}-${updated.teamB.secondaryScore || 0}]`,
      period: match.currentPeriod,
      type: eventData.type,
      label: gameWon ? `Game ${match.currentPeriod} won by ${targetTeam.name}` : (eventData.label || 'Rally Point'),
      teamId: eventData.teamId,
      playerId: eventData.playerId,
      playerName: eventData.playerName || targetTeam.name,
      pointDelta: 1,
      highlightWorthy: Boolean(gameWon || eventData.type === 'SMASH_WINNER'),
    };

    updated.events.unshift(newEvent);
    return updated;
  }
};
