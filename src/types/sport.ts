export type SportCategory = 'BALL_BY_BALL_INNINGS' | 'CLOCK_AND_ACCUMULATE' | 'SET_AND_RALLY' | 'COMBAT_BOUT';

export type SportId = 'cricket' | 'kabaddi' | 'football' | 'badminton' | 'tennis' | 'basketball' | 'mma' | 'boxing';

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'BREAK' | 'COMPLETED';

export interface SportConfig {
  id: SportId;
  name: string;
  category: SportCategory;
  icon: string;
  defaultDurationMin?: number;
  periodName: string; // "Half", "Quarter", "Set", "Round"
  totalPeriods: number;
  scoringUnit: string; // "Goals", "Points", "Games/Sets", "Rounds"
  description: string;
}

export interface TeamOrAthlete {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  color: string;
  score: number;
  secondaryScore?: number; // e.g. sets won or points in tennis
  players: AthleteProfile[];
  stats?: Record<string, number>;
}

export interface SportEvent {
  id: string;
  matchId: string;
  timestamp: string; // ISO string
  gameTime: string; // e.g. "34:12" or "Set 2, 40-30" or "R2 02:45"
  period: number;
  type: string; // 'GOAL' | 'POINT_1' | 'POINT_2' | 'POINT_3' | 'ACE' | 'FAULT' | 'BREAK' | 'KNOCKDOWN' | 'TAKEDOWN' | 'KO' | 'SUBMISSION' | 'CARD'
  label: string;
  teamId: string;
  playerId?: string;
  playerName?: string;
  pointDelta?: number;
  details?: string;
  highlightWorthy: boolean;
  aiNarrative?: {
    headline: string;
    commentary: string;
    tacticalAnalysis: string;
  };
}

export interface Tournament {
  id: string;
  title: string;
  sportId: SportId;
  format: 'KNOCKOUT' | 'ROUND_ROBIN' | 'LEAGUE_AND_PLAYOFFS';
  totalTeams: number;
  location: string;
  venue: string;
  startDate: string;
  entryFee: string; // e.g. "₹2,500 / team"
  prizePool: string; // e.g. "₹50,000 + Trophy"
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  organizer: string;
  matchesCount: number;
  ppvEnabled: boolean;
  teams: string[];
}

export interface Match {
  id: string;
  sportId: SportId;
  category: SportCategory;
  tournamentName: string;
  venue: string;
  status: MatchStatus;
  currentPeriod: number; // e.g. 1st half, 3rd quarter, 2nd set, round 2
  clockSeconds: number; // elapsed or remaining seconds
  clockRunning: boolean;
  teamA: TeamOrAthlete;
  teamB: TeamOrAthlete;
  // Specific state for Cricket (Ball-by-Ball Innings)
  cricketState?: {
    innings: 1 | 2;
    battingTeamId: string;
    bowlingTeamId: string;
    runs: number;
    wickets: number;
    overs: number; // completed overs e.g. 15
    balls: number; // current over balls (0 to 5)
    totalOvers: number; // e.g. 20 (T20) or 10
    target?: number; // target in 2nd innings
    currentStriker: string; // batsman on strike
    currentNonStriker: string; // batsman at non-striker end
    currentBowler: string;
    batsmenStats: Record<string, { runs: number; balls: number; fours: number; sixes: number; isOut?: boolean; dismissal?: string }>;
    bowlerStats: Record<string, { overs: string; maidens: number; runs: number; wickets: number; economy: number }>;
    recentBalls: string[]; // e.g. ["1", "4", "0", "Wd", "6", "W"]
    extras: { wide: number; noBall: number; bye: number; legBye: number };
    crr: number; // current run rate
    rrr?: number; // required run rate
  };
  // Specific state for Kabaddi
  kabaddiState?: {
    activeRaider: string;
    raidClock: number; // 30s raid timer
    raidPoints: { teamA: number; teamB: number };
    tacklePoints: { teamA: number; teamB: number };
    bonusPoints: { teamA: number; teamB: number };
    allOuts: { teamA: number; teamB: number };
    isDoOrDie: boolean;
  };
  // Specific state for Set-and-Rally
  tennisState?: {
    server: 'teamA' | 'teamB';
    currentPoints: { teamA: string; teamB: string }; // "0", "15", "30", "40", "AD"
    games: { teamA: number; teamB: number };
    sets: Array<{ teamA: number; teamB: number }>;
    isDeuce: boolean;
    breakPoint: boolean;
  };
  // Specific state for Combat
  combatState?: {
    currentRound: number;
    roundScores: Array<{ teamA: number; teamB: number }>; // 10-9 rounds
    strikes: { teamA: number; teamB: number };
    takedowns: { teamA: number; teamB: number };
    knockdowns: { teamA: number; teamB: number };
    termination?: {
      method: 'KO' | 'TKO' | 'SUBMISSION' | 'DOCTOR_STOPPAGE' | 'DECISION';
      winnerTeamId: string;
      round: number;
      time: string;
    };
  };
  events: SportEvent[];
  sponsor: {
    name: string;
    tagline: string;
    logoText: string;
  };
}

export interface AthleteProfile {
  id: string;
  name: string;
  nickname?: string;
  avatar: string;
  primarySport: SportId;
  secondarySports?: SportId[];
  role: string; // e.g. "Striker", "Point Guard", "Base-liner", "Flyweight"
  team: string;
  jerseyNumber?: number;
  location: string;
  verified: boolean;
  mvpAwards: number;
  winRatePercent: number;
  totalMatches: number;
  careerStats: Record<string, string | number>;
  radarMetrics: {
    label: string;
    value: number; // 0 to 100
  }[];
  mediaGallery: {
    id: string;
    type: 'highlight' | 'training';
    title: string;
    duration: string;
    thumbnailColor: string;
    views: number;
  }[];
}

export interface SocialPost {
  id: string;
  author: AthleteProfile;
  sport: SportId;
  pillar: 'PRE_GAME' | 'POST_MATCH' | 'TRAINING' | 'HIGHLIGHT';
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'image';
  timestamp: string;
  cheersCount: number;
  commentsCount: number;
  sharesCount: number;
  hasCheered?: boolean;
  fanoutModel: 'PUSH_CELEB' | 'PULL_REGULAR';
  moderationStatus: 'APPROVED' | 'FLAGGED';
}

export interface MarketplaceListing {
  id: string;
  type: 'OPPONENT' | 'TEAM' | 'COACH' | 'VENUE';
  sport: SportId;
  title: string;
  organizer: string;
  avatar: string;
  location: string;
  dateOrAvailability: string;
  skillLevel: 'Grassroots' | 'Intermediate' | 'Competitive / Pro';
  costOrFee: string;
  description: string;
  spotsLeft?: number;
}

export interface BroadcastOverlaySettings {
  showScorebug: boolean;
  showLowerThird: boolean;
  showSponsorBug: boolean;
  showLatencyStats: boolean;
  activeSponsor: string;
  overlayTheme: 'dark-cyber' | 'broadcast-light' | 'grassroots-neon';
}

export interface StrategyRuleSet {
  sportId: SportId;
  category: SportCategory;
  getPeriodLabel: (match: Match) => string;
  formatScore: (match: Match) => { primaryA: string; primaryB: string; secondaryA?: string; secondaryB?: string };
  formatGameClock: (match: Match) => string;
  getAvailableActions: (match: Match) => {
    id: string;
    label: string;
    type: string;
    teamIdTarget: 'teamA' | 'teamB' | 'both';
    pointDelta?: number;
    color: string;
    highlightWorthy: boolean;
  }[];
  applyEvent: (match: Match, event: Partial<SportEvent> & { type: string; teamId: string }) => Match;
}
