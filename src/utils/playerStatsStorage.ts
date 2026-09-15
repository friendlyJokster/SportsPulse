import { PlayerStatsRecord } from '../types/playerStats';
import { SportId } from '../types/sport';

export const STORAGE_KEY_PLAYERS = 'sportpulse_player_stats_v2';

export const INITIAL_PLAYER_STATS_RECORDS: PlayerStatsRecord[] = [
  {
    id: 'ath_aarav_sharma',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    sport: 'cricket',
    team: 'Mumbai Tigers CC',
    jerseyNumber: 18,
    role: 'Right-Hand Opener / Sixer Specialist',
    verified: true,
    mvpAwards: 18,
    winRate: 84,
    matches: 112,
    innings: 104,
    runs: 2840,
    ballsFaced: 1723,
    fours: 288,
    sixes: 142,
    fifties: 16,
    hundreds: 4,
    highestScore: 118,
    notOuts: 14,
    strikeRate: 164.8,
    battingAvg: 48.2,
    ballsBowled: 72,
    oversBowledFormatted: '12.0',
    maidens: 1,
    runsConceded: 98,
    wickets: 4,
    economy: 8.16,
    bowlingAvg: 24.5,
    bestBowling: '2/14',
    recentPerformances: [
      {
        id: 'perf_1',
        date: 'Today',
        matchTitle: 'MUM vs DEL • TATA Grassroots QF',
        summary: '64* off 38 balls (7x4, 3x6) in active run chase',
        badge: 'Active Striker'
      },
      {
        id: 'perf_2',
        date: 'Last Week',
        matchTitle: 'MUM vs PNE • Group Stage',
        summary: '82 off 46 balls (9x4, 4x6) • MoM Award',
        badge: 'Match Winner'
      },
      {
        id: 'perf_3',
        date: '2 weeks ago',
        matchTitle: 'MUM vs BNG • Round 4',
        summary: '51 off 31 balls (5x4, 2x6)',
        badge: 'Fifty'
      }
    ]
  },
  {
    id: 'ath_rohan_verma',
    name: 'Rohan Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    sport: 'cricket',
    team: 'Mumbai Tigers CC',
    jerseyNumber: 45,
    role: 'Top-Order Anchor Batsman',
    verified: true,
    mvpAwards: 7,
    winRate: 76,
    matches: 68,
    innings: 62,
    runs: 1620,
    ballsFaced: 1285,
    fours: 164,
    sixes: 38,
    fifties: 11,
    hundreds: 1,
    highestScore: 102,
    notOuts: 8,
    strikeRate: 126.1,
    battingAvg: 30.0,
    ballsBowled: 0,
    oversBowledFormatted: '0.0',
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    bowlingAvg: 0,
    bestBowling: '-',
    recentPerformances: [
      {
        id: 'perf_rv1',
        date: 'Today',
        matchTitle: 'MUM vs DEL • TATA Grassroots QF',
        summary: '28* off 22 balls (3x4) • Building crucial 2nd wicket partnership',
        badge: 'Non-Striker'
      },
      {
        id: 'perf_rv2',
        date: 'Last Week',
        matchTitle: 'MUM vs PNE • Group Stage',
        summary: '44 off 36 balls',
        badge: 'Solid Knock'
      }
    ]
  },
  {
    id: 'ath_vikram_rao',
    name: 'Vikram Rao',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
    sport: 'cricket',
    team: 'Mumbai Tigers CC',
    jerseyNumber: 77,
    role: 'Middle-Order Power Hitter',
    verified: false,
    mvpAwards: 5,
    winRate: 72,
    matches: 45,
    innings: 41,
    runs: 940,
    ballsFaced: 630,
    fours: 82,
    sixes: 46,
    fifties: 5,
    hundreds: 0,
    highestScore: 68,
    notOuts: 6,
    strikeRate: 149.2,
    battingAvg: 26.8,
    ballsBowled: 0,
    oversBowledFormatted: '0.0',
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    bowlingAvg: 0,
    bestBowling: '-',
    recentPerformances: [
      {
        id: 'perf_vr1',
        date: 'Today',
        matchTitle: 'MUM vs DEL • TATA Grassroots QF',
        summary: '32 off 19 balls (4x4, 1x6) • c Long-on b Jaspreet Gill',
        badge: 'Rapid 32'
      }
    ]
  },
  {
    id: 'ath_jaspreet_gill',
    name: 'Jaspreet Gill',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    sport: 'cricket',
    team: 'Delhi Grassroots CC',
    jerseyNumber: 93,
    role: 'Right-Arm Express Fast Bowler',
    verified: true,
    mvpAwards: 16,
    winRate: 81,
    matches: 88,
    innings: 34,
    runs: 240,
    ballsFaced: 195,
    fours: 18,
    sixes: 8,
    fifties: 0,
    hundreds: 0,
    highestScore: 31,
    notOuts: 12,
    strikeRate: 123.0,
    battingAvg: 10.9,
    ballsBowled: 1824, // 304 overs
    oversBowledFormatted: '304.0',
    maidens: 28,
    runsConceded: 2120,
    wickets: 134,
    economy: 6.97,
    bowlingAvg: 15.8,
    bestBowling: '5/18',
    recentPerformances: [
      {
        id: 'perf_jg1',
        date: 'Today',
        matchTitle: 'MUM vs DEL • TATA Grassroots QF',
        summary: '3.2-0-28-2 • Clocking 138 km/h • Clean yorker dismissal',
        badge: 'Current Bowler'
      },
      {
        id: 'perf_jg2',
        date: 'Last Week',
        matchTitle: 'DEL vs KOL • Super 8',
        summary: '4-1-19-4 • Player of the Match spell',
        badge: '4-Wicket Haul'
      }
    ]
  },
  {
    id: 'ath_tariq_khan',
    name: 'Tariq Khan',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    sport: 'cricket',
    team: 'Delhi Grassroots CC',
    jerseyNumber: 23,
    role: 'Left-Arm Orthodox Spinner',
    verified: false,
    mvpAwards: 8,
    winRate: 70,
    matches: 52,
    innings: 20,
    runs: 160,
    ballsFaced: 140,
    fours: 12,
    sixes: 4,
    fifties: 0,
    hundreds: 0,
    highestScore: 24,
    notOuts: 7,
    strikeRate: 114.2,
    battingAvg: 12.3,
    ballsBowled: 1152, // 192 overs
    oversBowledFormatted: '192.0',
    maidens: 14,
    runsConceded: 1380,
    wickets: 76,
    economy: 7.18,
    bowlingAvg: 18.1,
    bestBowling: '4/22',
    recentPerformances: [
      {
        id: 'perf_tk1',
        date: 'Today',
        matchTitle: 'MUM vs DEL • TATA Grassroots QF',
        summary: '4.0-1-32-1 • Economical middle-overs squeeze',
        badge: '1 Wicket'
      }
    ]
  },
  {
    id: 'ath_pradeep_kumar',
    name: 'Pradeep Kumar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    sport: 'kabaddi',
    team: 'Haryana Yoddhas',
    jerseyNumber: 7,
    role: 'Star Raider / Right In',
    verified: true,
    mvpAwards: 14,
    winRate: 88,
    matches: 74,
    innings: 74,
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    fifties: 0,
    hundreds: 0,
    highestScore: 0,
    notOuts: 0,
    strikeRate: 0,
    battingAvg: 0,
    ballsBowled: 0,
    oversBowledFormatted: '0.0',
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    bowlingAvg: 0,
    bestBowling: '-',
    raidPoints: 680,
    tacklePoints: 48,
    superRaids: 24,
    recentPerformances: [
      {
        id: 'perf_pk1',
        date: 'Today',
        matchTitle: 'HAR vs PUN • Pro Kabaddi Semi-Final',
        summary: '14 Raid Points • 2 Super Raids • Active on Mat',
        badge: 'Super 10'
      }
    ]
  },
  {
    id: 'ath_farhan_akhtar',
    name: 'Farhan Akhtar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    sport: 'football',
    team: 'Kerala Blasters Youth Academy',
    jerseyNumber: 10,
    role: 'Left Inverted Winger / #10',
    verified: true,
    mvpAwards: 11,
    winRate: 77,
    matches: 58,
    innings: 58,
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    fifties: 0,
    hundreds: 0,
    highestScore: 0,
    notOuts: 0,
    strikeRate: 0,
    battingAvg: 0,
    ballsBowled: 0,
    oversBowledFormatted: '0.0',
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    bowlingAvg: 0,
    bestBowling: '-',
    goals: 38,
    assists: 24,
    recentPerformances: [
      {
        id: 'perf_fa1',
        date: 'Yesterday',
        matchTitle: 'KER vs GOA • State Youth Cup',
        summary: '2 Goals (1 Free-kick), 1 Assist',
        badge: 'Brace'
      }
    ]
  },
  {
    id: 'ath_leo_vance',
    name: 'Leo Vance',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&auto=format&fit=crop&q=80',
    sport: 'football',
    team: 'North London Strikers FC',
    jerseyNumber: 9,
    role: 'Central Striker / #9',
    verified: true,
    mvpAwards: 14,
    winRate: 78,
    matches: 84,
    innings: 84,
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    fifties: 0,
    hundreds: 0,
    highestScore: 0,
    notOuts: 0,
    strikeRate: 0,
    battingAvg: 0,
    ballsBowled: 0,
    oversBowledFormatted: '0.0',
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    bowlingAvg: 0,
    bestBowling: '-',
    goals: 62,
    assists: 29,
    recentPerformances: [
      {
        id: 'perf_lv1',
        date: '3 days ago',
        matchTitle: 'LON vs MAN • Grassroots League',
        summary: 'Hattrick (3 Goals) • 34.2 km/h top sprint speed',
        badge: 'Hattrick'
      }
    ]
  },
  {
    id: 'ath_ananya_sen',
    name: 'Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    sport: 'badminton',
    team: 'Bengaluru Smashers',
    role: 'Women Singles Seed #1',
    verified: true,
    mvpAwards: 15,
    winRate: 86,
    matches: 68,
    innings: 68,
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    fifties: 0,
    hundreds: 0,
    highestScore: 0,
    notOuts: 0,
    strikeRate: 0,
    battingAvg: 0,
    ballsBowled: 0,
    oversBowledFormatted: '0.0',
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    bowlingAvg: 0,
    bestBowling: '-',
    aces: 148,
    recentPerformances: [
      {
        id: 'perf_as1',
        date: '4 days ago',
        matchTitle: 'BNG vs HYD • Singles Championship',
        summary: 'Won 21-18, 21-16 • 342 km/h steep smash recorded',
        badge: 'Champion'
      }
    ]
  },
  {
    id: 'ath_elena_rostova',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    sport: 'tennis',
    team: 'Midtown Tennis Club',
    role: 'Singles Seed #1',
    verified: true,
    mvpAwards: 19,
    winRate: 84,
    matches: 62,
    innings: 62,
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    fifties: 0,
    hundreds: 0,
    highestScore: 0,
    notOuts: 0,
    strikeRate: 0,
    battingAvg: 0,
    ballsBowled: 0,
    oversBowledFormatted: '0.0',
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    bowlingAvg: 0,
    bestBowling: '-',
    aces: 188,
    recentPerformances: [
      {
        id: 'perf_er1',
        date: 'Last Week',
        matchTitle: 'Austin Open • Finals',
        summary: '6-4, 7-5 • 12 Aces, 74% Break points saved',
        badge: 'Title Winner'
      }
    ]
  }
];

export function loadAllPlayerStats(): PlayerStatsRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLAYERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed loading player stats from storage:', e);
  }
  // Initialize default and save
  saveAllPlayerStats(INITIAL_PLAYER_STATS_RECORDS);
  return INITIAL_PLAYER_STATS_RECORDS;
}

export function saveAllPlayerStats(players: PlayerStatsRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
  } catch (e) {
    console.warn('Failed saving player stats to storage:', e);
  }
}

/**
 * Updates a player's batting and bowling stats in real-time when scoring cricket actions
 */
export function updateCricketLivePlayerStats(
  players: PlayerStatsRecord[],
  strikerName: string,
  bowlerName: string,
  runsScored: number,
  isLegalBall: boolean,
  isWicket: boolean,
  isFour: boolean,
  isSix: boolean
): PlayerStatsRecord[] {
  let updated = [...players];

  // 1. Find or create Striker Record
  let strikerIndex = updated.findIndex(
    p => p.name.toLowerCase().trim() === strikerName.toLowerCase().trim()
  );

  if (strikerIndex === -1) {
    // Create new player entry on the fly
    const newStriker: PlayerStatsRecord = {
      id: 'ath_' + strikerName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36),
      name: strikerName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      sport: 'cricket',
      team: 'Current Batting Team',
      role: 'Batsman',
      mvpAwards: 0,
      winRate: 60,
      matches: 1,
      innings: 1,
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      fifties: 0,
      hundreds: 0,
      highestScore: 0,
      notOuts: 0,
      strikeRate: 0,
      battingAvg: 0,
      ballsBowled: 0,
      oversBowledFormatted: '0.0',
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      bowlingAvg: 0,
      bestBowling: '-',
      recentPerformances: []
    };
    updated.push(newStriker);
    strikerIndex = updated.length - 1;
  }

  const striker = { ...updated[strikerIndex] };
  if (isLegalBall) {
    striker.ballsFaced += 1;
  }
  striker.runs += runsScored;
  if (isFour) striker.fours += 1;
  if (isSix) striker.sixes += 1;
  if (striker.runs > striker.highestScore) {
    striker.highestScore = striker.runs;
  }
  if (striker.runs >= 50 && striker.runs < 100 && (striker.runs - runsScored) < 50) {
    striker.fifties += 1;
  }
  if (striker.runs >= 100 && (striker.runs - runsScored) < 100) {
    striker.hundreds += 1;
  }
  striker.strikeRate = striker.ballsFaced > 0 
    ? Number(((striker.runs / striker.ballsFaced) * 100).toFixed(1))
    : 0;
  const divisor = Math.max(1, striker.innings - striker.notOuts);
  striker.battingAvg = Number((striker.runs / divisor).toFixed(1));

  updated[strikerIndex] = striker;

  // 2. Find or create Bowler Record
  if (bowlerName) {
    let bowlerIndex = updated.findIndex(
      p => p.name.toLowerCase().trim() === bowlerName.toLowerCase().trim()
    );

    if (bowlerIndex === -1) {
      const newBowler: PlayerStatsRecord = {
        id: 'ath_' + bowlerName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36),
        name: bowlerName,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80',
        sport: 'cricket',
        team: 'Current Bowling Team',
        role: 'Bowler',
        mvpAwards: 0,
        winRate: 60,
        matches: 1,
        innings: 0,
        runs: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        fifties: 0,
        hundreds: 0,
        highestScore: 0,
        notOuts: 0,
        strikeRate: 0,
        battingAvg: 0,
        ballsBowled: 0,
        oversBowledFormatted: '0.0',
        maidens: 0,
        runsConceded: 0,
        wickets: 0,
        economy: 0,
        bowlingAvg: 0,
        bestBowling: '-',
        recentPerformances: []
      };
      updated.push(newBowler);
      bowlerIndex = updated.length - 1;
    }

    const bowler = { ...updated[bowlerIndex] };
    if (isLegalBall) {
      bowler.ballsBowled += 1;
      const completedOvers = Math.floor(bowler.ballsBowled / 6);
      const remBalls = bowler.ballsBowled % 6;
      bowler.oversBowledFormatted = `${completedOvers}.${remBalls}`;
    }
    bowler.runsConceded += runsScored;
    if (isWicket) {
      bowler.wickets += 1;
    }
    bowler.economy = bowler.ballsBowled > 0
      ? Number(((bowler.runsConceded / bowler.ballsBowled) * 6).toFixed(2))
      : 0;
    bowler.bowlingAvg = bowler.wickets > 0
      ? Number((bowler.runsConceded / bowler.wickets).toFixed(1))
      : 0;

    updated[bowlerIndex] = bowler;
  }

  saveAllPlayerStats(updated);
  return updated;
}

/**
 * Updates a player's multi-sport stats (Goals, Assists, Raid Points, Tackles, Aces)
 */
export function recordMultiSportEventToPlayer(
  players: PlayerStatsRecord[],
  playerName: string,
  sport: SportId,
  eventType: 'GOAL' | 'ASSIST' | 'RAID_POINT' | 'TACKLE_POINT' | 'ACE' | 'POINT',
  points: number = 1
): PlayerStatsRecord[] {
  let updated = [...players];
  let index = updated.findIndex(
    p => p.name.toLowerCase().trim() === playerName.toLowerCase().trim()
  );

  if (index === -1) {
    const newPlayer: PlayerStatsRecord = {
      id: 'ath_' + playerName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36),
      name: playerName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      sport: sport,
      team: 'Active Team',
      role: 'Player',
      mvpAwards: 0,
      winRate: 60,
      matches: 1,
      innings: 1,
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      fifties: 0,
      hundreds: 0,
      highestScore: 0,
      notOuts: 0,
      strikeRate: 0,
      battingAvg: 0,
      ballsBowled: 0,
      oversBowledFormatted: '0.0',
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      bowlingAvg: 0,
      bestBowling: '-',
      goals: 0,
      assists: 0,
      raidPoints: 0,
      tacklePoints: 0,
      superRaids: 0,
      aces: 0,
      recentPerformances: []
    };
    updated.push(newPlayer);
    index = updated.length - 1;
  }

  const p = { ...updated[index] };
  if (eventType === 'GOAL') {
    p.goals = (p.goals || 0) + points;
  } else if (eventType === 'ASSIST') {
    p.assists = (p.assists || 0) + points;
  } else if (eventType === 'RAID_POINT') {
    p.raidPoints = (p.raidPoints || 0) + points;
    if (points >= 3) {
      p.superRaids = (p.superRaids || 0) + 1;
    }
  } else if (eventType === 'TACKLE_POINT') {
    p.tacklePoints = (p.tacklePoints || 0) + points;
  } else if (eventType === 'ACE') {
    p.aces = (p.aces || 0) + points;
  }

  updated[index] = p;
  saveAllPlayerStats(updated);
  return updated;
}

/**
 * Universal auto-recorder from Live Scoring Engine
 */
export function recordLiveScoringEvent(
  sportId: SportId,
  event: {
    type: string;
    label: string;
    playerName?: string;
    pointDelta?: number;
    teamName?: string;
    strikerName?: string;
    bowlerName?: string;
  }
): void {
  try {
    const players = loadAllPlayerStats();

    if (sportId === 'cricket') {
      const runs = event.pointDelta || 0;
      const isFour = event.label.includes('4') || event.label.includes('Four');
      const isSix = event.label.includes('6') || event.label.includes('Six');
      const isWicket = event.label.includes('Wicket') || event.type === 'WICKET';
      const isLegal = !event.label.includes('Wide') && !event.label.includes('No Ball');

      updateCricketLivePlayerStats(
        players,
        event.strikerName || event.playerName || 'Aarav Sharma',
        event.bowlerName || 'Vikramaditya',
        runs,
        isLegal,
        isWicket,
        isFour,
        isSix
      );
    } else {
      const playerName = event.playerName || 'Player';
      let type: 'GOAL' | 'ASSIST' | 'RAID_POINT' | 'TACKLE_POINT' | 'ACE' | 'POINT' = 'POINT';
      const lbl = event.label.toUpperCase();

      if (lbl.includes('GOAL') || event.type === 'GOAL') type = 'GOAL';
      else if (lbl.includes('ASSIST')) type = 'ASSIST';
      else if (lbl.includes('RAID') || lbl.includes('TOUCH') || lbl.includes('BONUS')) type = 'RAID_POINT';
      else if (lbl.includes('TACKLE') || lbl.includes('SUPER TACKLE')) type = 'TACKLE_POINT';
      else if (lbl.includes('ACE')) type = 'ACE';

      recordMultiSportEventToPlayer(
        players,
        playerName,
        sportId,
        type,
        event.pointDelta || 1
      );
    }
  } catch (err) {
    console.error('Failed to auto-record player stats:', err);
  }
}

