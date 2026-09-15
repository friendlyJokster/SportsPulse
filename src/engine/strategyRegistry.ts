import { SportId, SportCategory, StrategyRuleSet, SportConfig } from '../types/sport';
import { cricketStrategy } from './strategies/cricketInnings';
import { kabaddiStrategy } from './strategies/kabaddiMatch';
import { footballStrategy, basketballStrategy } from './strategies/clockAccumulate';
import { tennisStrategy, badmintonStrategy } from './strategies/setRally';
import { mmaCombatStrategy } from './strategies/combatBout';

export const SPORT_CONFIGS: Record<SportId, SportConfig> = {
  cricket: {
    id: 'cricket',
    name: 'Cricket',
    category: 'BALL_BY_BALL_INNINGS',
    icon: '🏏',
    defaultDurationMin: 180,
    periodName: 'Innings',
    totalPeriods: 2,
    scoringUnit: 'Runs / Wickets (Overs)',
    description: 'Ball-by-ball innings paradigm with strike rotation, boundary 4s & 6s, extras, dismissals, and required run-rate chase.'
  },
  kabaddi: {
    id: 'kabaddi',
    name: 'Kabaddi',
    category: 'CLOCK_AND_ACCUMULATE',
    icon: '🤼',
    defaultDurationMin: 40,
    periodName: 'Half',
    totalPeriods: 2,
    scoringUnit: 'Points (Raid / Tackle / All-Out)',
    description: 'Indigenous Indian raid-and-tackle scoring with 30s raid clocks, bonus lines, super tackles, and all-out lona points.'
  },
  football: {
    id: 'football',
    name: 'Football (Soccer)',
    category: 'CLOCK_AND_ACCUMULATE',
    icon: '⚽',
    defaultDurationMin: 90,
    periodName: 'Half',
    totalPeriods: 2,
    scoringUnit: 'Goals',
    description: 'Clock-and-accumulate paradigm with running stoppage time, goals, cards, and disciplinary events.'
  },
  badminton: {
    id: 'badminton',
    name: 'Badminton',
    category: 'SET_AND_RALLY',
    icon: '🏸',
    periodName: 'Game',
    totalPeriods: 3,
    scoringUnit: 'Rally Points',
    description: 'Set-and-rally scoring to 21 with sudden death 30-point ceiling and rapid rallies.'
  },
  tennis: {
    id: 'tennis',
    name: 'Tennis',
    category: 'SET_AND_RALLY',
    icon: '🎾',
    periodName: 'Set',
    totalPeriods: 3,
    scoringUnit: 'Games / Sets',
    description: 'Set-and-rally paradigm with 15-30-40-Deuce-Advantage game rules and server rotations.'
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    category: 'CLOCK_AND_ACCUMULATE',
    icon: '🏀',
    defaultDurationMin: 48,
    periodName: 'Quarter',
    totalPeriods: 4,
    scoringUnit: 'Points',
    description: 'Clock-and-accumulate with shot clock, 1/2/3 point shot scoring, fouls, and bonus phases.'
  },
  mma: {
    id: 'mma',
    name: 'Mixed Martial Arts',
    category: 'COMBAT_BOUT',
    icon: '🥋',
    periodName: 'Round',
    totalPeriods: 3,
    scoringUnit: 'Round Points (10-9 Must)',
    description: 'Combat/bout paradigm with 10-point must judging and instant KO/Submission override triggers.'
  },
  boxing: {
    id: 'boxing',
    name: 'Boxing',
    category: 'COMBAT_BOUT',
    icon: '🥊',
    periodName: 'Round',
    totalPeriods: 10,
    scoringUnit: 'Round Points',
    description: 'Combat/bout with knockdown tracking, judges cards, and referee stoppage overrides.'
  }
};

export class SportStrategyEngine {
  private static strategies: Record<SportId, StrategyRuleSet> = {
    cricket: cricketStrategy,
    kabaddi: kabaddiStrategy,
    football: footballStrategy,
    basketball: basketballStrategy,
    tennis: tennisStrategy,
    badminton: badmintonStrategy,
    mma: mmaCombatStrategy,
    boxing: mmaCombatStrategy // Shared combat logic
  };

  public static getStrategy(sportId: SportId): StrategyRuleSet {
    const strategy = this.strategies[sportId];
    if (!strategy) {
      console.warn(`No specific strategy for ${sportId}, falling back to cricket`);
      return this.strategies.cricket;
    }
    return strategy;
  }

  public static getCategories(): { category: SportCategory; name: string; description: string; sports: SportId[] }[] {
    return [
      {
        category: 'BALL_BY_BALL_INNINGS',
        name: 'Ball-by-Ball & Innings',
        description: 'Cricket-style turn-based over scoring where each ball produces runs, extras, or wickets, rotating strike and tracking run rates.',
        sports: ['cricket']
      },
      {
        category: 'CLOCK_AND_ACCUMULATE',
        name: 'Clock-and-Accumulate',
        description: 'Timed periods where points accrue incrementally (Football, Kabaddi, Basketball). Clock is an authoritative running state.',
        sports: ['kabaddi', 'football', 'basketball']
      },
      {
        category: 'SET_AND_RALLY',
        name: 'Set-and-Rally',
        description: 'Points build to games and sets (Badminton, Tennis). Logic dynamically resolves deuce, advantage, and tiebreak triggers.',
        sports: ['badminton', 'tennis']
      },
      {
        category: 'COMBAT_BOUT',
        name: 'Combat / Bout',
        description: 'Rounds scored on 10-point system, with instant termination overrides (KO, TKO, Sub) that end the contest.',
        sports: ['mma', 'boxing']
      }
    ];
  }
}

