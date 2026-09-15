import { SportId } from './sport';

export interface PlayerStatsRecord {
  id: string;
  name: string;
  avatar: string;
  sport: SportId;
  team: string;
  jerseyNumber?: number;
  role: string; // e.g. "Opening Batsman", "Pace Bowler", "All-Rounder", "Striker #10", "Raider"
  verified?: boolean;
  mvpAwards: number;
  winRate: number; // e.g. 78%

  // Batting stats
  matches: number;
  innings: number;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  fifties: number;
  hundreds: number;
  highestScore: number;
  notOuts: number;
  strikeRate: number; // (runs / ballsFaced) * 100
  battingAvg: number; // runs / (innings - notOuts)

  // Bowling stats
  ballsBowled: number; // Total legal deliveries bowled
  oversBowledFormatted: string; // e.g. "12.4"
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number; // (runsConceded / ballsBowled) * 6
  bowlingAvg: number; // runsConceded / wickets
  bestBowling: string; // e.g. "3/18"

  // Multi-sport specific statistics
  goals?: number;
  assists?: number;
  raidPoints?: number;
  tacklePoints?: number;
  superRaids?: number;
  aces?: number;

  // Recent match log
  recentPerformances: Array<{
    id: string;
    date: string;
    matchTitle: string;
    summary: string;
    badge?: string;
  }>;
}
