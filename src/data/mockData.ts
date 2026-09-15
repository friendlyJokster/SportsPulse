import { Match, AthleteProfile, SocialPost, MarketplaceListing, Tournament } from '../types/sport';

export const INITIAL_ATHLETES: AthleteProfile[] = [
  {
    id: 'ath_aarav_sharma',
    name: 'Aarav Sharma',
    nickname: 'Hitman',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    primarySport: 'cricket',
    secondarySports: ['badminton', 'football'],
    role: 'Right-Hand Opener / Sixer Specialist',
    team: 'Mumbai Tigers Cricket Club',
    jerseyNumber: 18,
    location: 'Dadar, Mumbai',
    verified: true,
    mvpAwards: 18,
    winRatePercent: 84,
    totalMatches: 112,
    careerStats: {
      'Total Runs': '2,840',
      'Batting Avg': '48.2',
      'Strike Rate': '164.8',
      'Hundreds / Fifties': '4 / 16',
      'Sixes Hit': '142',
      'Boundaries (4s)': '288'
    },
    radarMetrics: [
      { label: 'Power Hitting', value: 96 },
      { label: 'Timing', value: 92 },
      { label: 'Running Between Wickets', value: 88 },
      { label: 'Death Over Strike', value: 95 },
      { label: 'Spin Playing', value: 90 }
    ],
    mediaGallery: [
      { id: 'mc1', type: 'highlight', title: 'Towering 95m six over long-on in Shivaji Park final', duration: '0:32', thumbnailColor: 'bg-emerald-950', views: 24800 },
      { id: 'mc2', type: 'training', title: 'Range hitting & trigger movement drill vs 140kmh side-arm', duration: '0:55', thumbnailColor: 'bg-slate-900', views: 8200 },
      { id: 'mc3', type: 'highlight', title: 'Backfoot punch over extra cover for boundary four', duration: '0:24', thumbnailColor: 'bg-blue-950', views: 15400 }
    ]
  },
  {
    id: 'ath_pradeep_kumar',
    name: 'Pradeep Kumar',
    nickname: 'Dubki King',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    primarySport: 'kabaddi',
    secondarySports: ['cricket'],
    role: 'Star Raider / Right In',
    team: 'Haryana Yoddhas',
    jerseyNumber: 7,
    location: 'Rohtak, Haryana',
    verified: true,
    mvpAwards: 14,
    winRatePercent: 88,
    totalMatches: 74,
    careerStats: {
      'Total Raid Points': 680,
      'Super Raids': 24,
      'Super 10s': 19,
      'Successful Raid %': '72%',
      'Tackle Points': 48
    },
    radarMetrics: [
      { label: 'Dubki Agility', value: 98 },
      { label: 'Toe Touch Reach', value: 94 },
      { label: 'Bonus Line Awareness', value: 91 },
      { label: 'Turn & Escape', value: 95 },
      { label: 'Mat Endurance', value: 89 }
    ],
    mediaGallery: [
      { id: 'mk1', type: 'highlight', title: '5-point Super Raid sliding under corner chain', duration: '0:28', thumbnailColor: 'bg-amber-950', views: 32000 },
      { id: 'mk2', type: 'training', title: 'Akhada mud sprint & plyometric explosive jumps', duration: '0:48', thumbnailColor: 'bg-slate-900', views: 11400 }
    ]
  },
  {
    id: 'ath_ananya_sen',
    name: 'Ananya Sen',
    nickname: 'The Shuttle Flash',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    primarySport: 'badminton',
    secondarySports: ['tennis'],
    role: 'Women Singles Seed #1',
    team: 'Bengaluru Smashers',
    location: 'Koramangala, Bengaluru',
    verified: true,
    mvpAwards: 15,
    winRatePercent: 86,
    totalMatches: 68,
    careerStats: {
      'Tournament Titles': 8,
      'Smash Peak': '342 km/h',
      'Net Drops Converted': '82%',
      'Third Game Win %': '89%',
      'All India Grassroots Rank': '#1'
    },
    radarMetrics: [
      { label: 'Smash Speed', value: 93 },
      { label: 'Net Play', value: 95 },
      { label: 'Footwork Speed', value: 92 },
      { label: 'Rally Defense', value: 88 },
      { label: 'Court Stamina', value: 94 }
    ],
    mediaGallery: [
      { id: 'mb1', type: 'highlight', title: '34-shot rally concluded by steep reverse slice drop', duration: '0:44', thumbnailColor: 'bg-purple-950', views: 14200 },
      { id: 'mb2', type: 'training', title: 'Shadow footwork & multi-shuttle reaction drills', duration: '0:40', thumbnailColor: 'bg-slate-900', views: 6100 }
    ]
  },
  {
    id: 'ath_farhan_akhtar',
    name: 'Farhan Akhtar',
    nickname: 'Malabar Magician',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    primarySport: 'football',
    secondarySports: ['cricket'],
    role: 'Left Inverted Winger / #10',
    team: 'Kerala Blasters Youth Academy',
    jerseyNumber: 10,
    location: 'Kochi, Kerala',
    verified: true,
    mvpAwards: 11,
    winRatePercent: 77,
    totalMatches: 58,
    careerStats: {
      'Goals': 38,
      'Assists': 24,
      'Dribble Success': '76%',
      'Free-Kick Goals': 7,
      'Sprint Top Speed': '33.8 km/h'
    },
    radarMetrics: [
      { label: 'Dribbling', value: 94 },
      { label: 'Acceleration', value: 91 },
      { label: 'Crossing', value: 87 },
      { label: 'Finishing', value: 86 },
      { label: 'Vision', value: 89 }
    ],
    mediaGallery: [
      { id: 'mf1', type: 'highlight', title: 'Curled 25-yard free-kick into top corner at JLN Kochi', duration: '0:26', thumbnailColor: 'bg-rose-950', views: 18900 }
    ]
  },
  {
    id: 'ath_leo_vance',
    name: 'Leo Vance',
    nickname: 'The Archer',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&auto=format&fit=crop&q=80',
    primarySport: 'football',
    secondarySports: ['tennis'],
    role: 'Central Striker / #9',
    team: 'North London Strikers FC',
    jerseyNumber: 9,
    location: 'London / International League',
    verified: true,
    mvpAwards: 14,
    winRatePercent: 78,
    totalMatches: 84,
    careerStats: {
      'Career Goals': 62,
      'Assists': 29,
      'Shot Accuracy': '68%',
      'Penalties Converted': '11/12',
      'Sprint Peak': '34.2 km/h'
    },
    radarMetrics: [
      { label: 'Finishing', value: 92 },
      { label: 'Pace', value: 88 },
      { label: 'Vision', value: 76 },
      { label: 'Stamina', value: 85 },
      { label: 'Discipline', value: 90 },
    ],
    mediaGallery: [
      { id: 'm1', type: 'highlight', title: 'Top-corner curler in grassroots cup final', duration: '0:28', thumbnailColor: 'bg-emerald-950', views: 4200 }
    ]
  },
  {
    id: 'ath_elena_rostova',
    name: 'Elena Rostova',
    nickname: 'Baseline Queen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    primarySport: 'tennis',
    secondarySports: ['badminton'],
    role: 'Singles Seed #1',
    team: 'Midtown Tennis Club',
    location: 'Austin, TX',
    verified: true,
    mvpAwards: 19,
    winRatePercent: 84,
    totalMatches: 62,
    careerStats: {
      'Tournament Titles': 7,
      'Aces Logged': 188,
      'Break Points Saved': '74%',
      'First Serve Win %': '81%',
      'Double Faults / Match': '1.4'
    },
    radarMetrics: [
      { label: 'Serve Power', value: 86 },
      { label: 'Forehand', value: 94 },
      { label: 'Footwork', value: 91 },
      { label: 'Mental Toughness', value: 89 },
      { label: 'Rally Depth', value: 92 },
    ],
    mediaGallery: [
      { id: 'm4', type: 'highlight', title: '12-shot baseline duel & slice winner', duration: '0:34', thumbnailColor: 'bg-purple-950', views: 6100 }
    ]
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_cric_01',
    sportId: 'cricket',
    category: 'BALL_BY_BALL_INNINGS',
    tournamentName: 'TATA Grassroots T20 Trophy • Quarter-Final',
    venue: 'Shivaji Park Ground • Dadar, Mumbai',
    status: 'LIVE',
    currentPeriod: 2,
    clockSeconds: 0,
    clockRunning: false,
    teamA: {
      id: 'team_mumbai_tigers',
      name: 'Mumbai Tigers CC',
      shortName: 'MUM',
      color: '#0284c7',
      score: 154,
      players: [INITIAL_ATHLETES[0]] // Aarav Sharma
    },
    teamB: {
      id: 'team_delhi_daredevils',
      name: 'Delhi Grassroots CC',
      shortName: 'DEL',
      color: '#dc2626',
      score: 177,
      players: []
    },
    cricketState: {
      innings: 2,
      battingTeamId: 'team_mumbai_tigers',
      bowlingTeamId: 'team_delhi_daredevils',
      runs: 154,
      wickets: 3,
      overs: 16,
      balls: 2,
      totalOvers: 20,
      target: 178,
      currentStriker: 'Aarav Sharma',
      currentNonStriker: 'Rohan Verma',
      currentBowler: 'Jaspreet Gill',
      batsmenStats: {
        'Aarav Sharma': { runs: 64, balls: 38, fours: 7, sixes: 3 },
        'Rohan Verma': { runs: 28, balls: 22, fours: 3, sixes: 0 },
        'Vikram Rao': { runs: 32, balls: 19, fours: 4, sixes: 1, isOut: true, dismissal: 'c Gill b Khan' },
        'Siddharth Nair': { runs: 14, balls: 11, fours: 1, sixes: 0, isOut: true, dismissal: 'lbw b Sharma' }
      },
      bowlerStats: {
        'Jaspreet Gill': { overs: '3.2', maidens: 0, runs: 28, wickets: 2, economy: 8.4 },
        'Tariq Khan': { overs: '4.0', maidens: 1, runs: 32, wickets: 1, economy: 8.0 },
        'Devendra Sharma': { overs: '4.0', maidens: 0, runs: 38, wickets: 0, economy: 9.5 }
      },
      recentBalls: ['1', '0', '4', '1', '6', 'W', '1', '2'],
      extras: { wide: 6, noBall: 2, bye: 4, legBye: 4 },
      crr: 9.43,
      rrr: 6.55
    },
    events: [
      {
        id: 'ev_cric_101',
        matchId: 'match_cric_01',
        timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
        gameTime: '16.2 ov',
        period: 2,
        type: 'CRIC_6',
        label: 'SIXER! 🚀 by Aarav Sharma',
        teamId: 'team_mumbai_tigers',
        playerId: 'ath_aarav_sharma',
        playerName: 'Aarav Sharma',
        pointDelta: 6,
        details: 'Dispatched 90 meters over deep midwicket into the Shivaji Park pavilion!',
        highlightWorthy: true,
        aiNarrative: {
          headline: 'MASSIVE SIX! SHARMA ROARS AT SHIVAJI PARK!',
          commentary: 'Pick that one out! Aarav Sharma clears his front leg and launches it high into the Mumbai twilight!',
          tacticalAnalysis: 'Anticipated the slower ball into the pitch and gained tremendous bottom-hand whip.'
        }
      },
      {
        id: 'ev_cric_102',
        matchId: 'match_cric_01',
        timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
        gameTime: '15.5 ov',
        period: 2,
        type: 'CRIC_4',
        label: 'FOUR! 💥 by Aarav Sharma',
        teamId: 'team_mumbai_tigers',
        playerId: 'ath_aarav_sharma',
        playerName: 'Aarav Sharma',
        pointDelta: 4,
        details: 'Cracking backfoot punch through point rope',
        highlightWorthy: true
      },
      {
        id: 'ev_cric_103',
        matchId: 'match_cric_01',
        timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
        gameTime: '14.1 ov',
        period: 2,
        type: 'CRIC_WICKET',
        label: 'WICKET! ☝️ Vikram Rao Dismissed',
        teamId: 'team_mumbai_tigers',
        playerName: 'Vikram Rao',
        pointDelta: 0,
        details: 'c Long-on b Jaspreet Gill for a well-made 32 (19b)',
        highlightWorthy: true
      }
    ],
    sponsor: {
      name: 'Dream11 Grassroots Cricket',
      tagline: 'India Khelega, India Jeetega',
      logoText: 'DREAM11 CRICKET'
    }
  },
  {
    id: 'match_kabaddi_01',
    sportId: 'kabaddi',
    category: 'CLOCK_AND_ACCUMULATE',
    tournamentName: 'Pro Grassroots Kabaddi Championship • Semi-Final',
    venue: 'Balewadi Sports Complex • Pune, Maharashtra',
    status: 'LIVE',
    currentPeriod: 2,
    clockSeconds: 14 * 60 + 35, // 14:35
    clockRunning: true,
    teamA: {
      id: 'team_haryana',
      name: 'Haryana Yoddhas',
      shortName: 'HAR',
      color: '#f97316',
      score: 34,
      players: [INITIAL_ATHLETES[1]] // Pradeep Kumar
    },
    teamB: {
      id: 'team_puneri',
      name: 'Puneri Paltan Grassroots',
      shortName: 'PUN',
      color: '#ea580c',
      score: 31,
      players: []
    },
    kabaddiState: {
      activeRaider: 'Pradeep Kumar',
      raidClock: 18,
      raidPoints: { teamA: 22, teamB: 18 },
      tacklePoints: { teamA: 8, teamB: 11 },
      bonusPoints: { teamA: 4, teamB: 2 },
      allOuts: { teamA: 1, teamB: 0 },
      isDoOrDie: false
    },
    events: [
      {
        id: 'ev_kbd_201',
        matchId: 'match_kabaddi_01',
        timestamp: new Date(Date.now() - 1000 * 90).toISOString(),
        gameTime: '13:20',
        period: 2,
        type: 'SUPER_RAID',
        label: 'SUPER RAID! (+3) 🔥 by Pradeep Kumar',
        teamId: 'team_haryana',
        playerId: 'ath_pradeep_kumar',
        playerName: 'Pradeep Kumar',
        pointDelta: 3,
        details: 'Dubki under two converging defenders and touch on right cover!',
        highlightWorthy: true,
        aiNarrative: {
          headline: 'DUBKI MAGIC: PRADEEP KUMAR DESTROYS DEFENSE!',
          commentary: 'Unbelievable flexibility! Pradeep dives under the chain and drags three defenders across the midline!',
          tacticalAnalysis: 'Low-center glide exploiting the aggressive ankle hold over-commit.'
        }
      }
    ],
    sponsor: {
      name: 'Amul India Hydration Partner',
      tagline: 'The Taste of Real India',
      logoText: 'AMUL KABADDI'
    }
  },
  {
    id: 'match_badminton_01',
    sportId: 'badminton',
    category: 'SET_AND_RALLY',
    tournamentName: 'All-India Grassroots Open • Grand Final',
    venue: 'Padukone-Dravid Centre for Sports Excellence • Bengaluru',
    status: 'LIVE',
    currentPeriod: 2,
    clockSeconds: 0,
    clockRunning: false,
    teamA: {
      id: 'team_ananya',
      name: 'Ananya Sen',
      shortName: 'SEN',
      color: '#10b981',
      score: 1, // 1 Game won
      players: [INITIAL_ATHLETES[2]]
    },
    teamB: {
      id: 'team_pooja',
      name: 'Pooja Kashyap',
      shortName: 'KAS',
      color: '#06b6d4',
      score: 0,
      players: []
    },
    tennisState: {
      server: 'teamA',
      currentPoints: { teamA: '18', teamB: '14' },
      games: { teamA: 1, teamB: 0 },
      sets: [
        { teamA: 21, teamB: 17 },
        { teamA: 18, teamB: 14 }
      ],
      isDeuce: false,
      breakPoint: false
    },
    events: [
      {
        id: 'ev_bad_301',
        matchId: 'match_badminton_01',
        timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
        gameTime: 'Game 2 [18-14]',
        period: 2,
        type: 'SMASH_WINNER',
        label: 'Steep Smash Winner ⚡ by Ananya Sen',
        teamId: 'team_ananya',
        playerName: 'Ananya Sen',
        pointDelta: 1,
        highlightWorthy: true,
        aiNarrative: {
          headline: '335 KM/H SMASH: ANANYA CLOSING IN ON TITLE!',
          commentary: 'Too fast, too steep! Ananya leaps from the rear court and detonates a cross-court bullet!',
          tacticalAnalysis: 'Exploited weak short lift following heavy backhand cross clear.'
        }
      }
    ],
    sponsor: {
      name: 'Yonex Sunrise India',
      tagline: 'Far Beyond Ordinary',
      logoText: 'YONEX INDIA'
    }
  },
  {
    id: 'match_foot_01',
    sportId: 'football',
    category: 'CLOCK_AND_ACCUMULATE',
    tournamentName: 'Kolkata-Kerala Grassroots Derby',
    venue: 'JLN Stadium Turf • Kochi, Kerala',
    status: 'LIVE',
    currentPeriod: 2,
    clockSeconds: 68 * 60 + 24, // 68:24
    clockRunning: true,
    teamA: {
      id: 'team_blasters',
      name: 'Kerala Blasters Youth',
      shortName: 'KBY',
      color: '#eab308',
      score: 2,
      players: [INITIAL_ATHLETES[3]] // Farhan Akhtar
    },
    teamB: {
      id: 'team_eastbengal',
      name: 'East Bengal Grassroots',
      shortName: 'EBG',
      color: '#ef4444',
      score: 1,
      players: []
    },
    events: [
      {
        id: 'ev_101',
        matchId: 'match_foot_01',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        gameTime: '56:10',
        period: 2,
        type: 'GOAL',
        label: 'Goal ⚽ by Farhan Akhtar',
        teamId: 'team_blasters',
        playerId: 'ath_farhan_akhtar',
        playerName: 'Farhan Akhtar',
        pointDelta: 1,
        details: 'Curling free-kick from 24 yards inside near post',
        highlightWorthy: true,
        aiNarrative: {
          headline: 'BICYCLE OF DREAMS: FARHAN SCORES DERBY STUNNER!',
          commentary: 'Kochi goes wild! Farhan Akhtar sends a majestic curling effort into the top netting!',
          tacticalAnalysis: 'Curled around a four-man defensive wall catching the keeper flat-footed.'
        }
      }
    ],
    sponsor: {
      name: 'Nivia Sports India',
      tagline: 'Step Out And Play',
      logoText: 'NIVIA SPORTS'
    }
  },
  {
    id: 'match_tennis_01',
    sportId: 'tennis',
    category: 'SET_AND_RALLY',
    tournamentName: 'All-India Grassroots Tennis Championship',
    venue: 'DLTA Complex • New Delhi',
    status: 'LIVE',
    currentPeriod: 2,
    clockSeconds: 0,
    clockRunning: false,
    teamA: {
      id: 'team_elena',
      name: 'Elena Rostova',
      shortName: 'ROS',
      color: '#8b5cf6',
      score: 1,
      players: [INITIAL_ATHLETES[5]]
    },
    teamB: {
      id: 'team_clara',
      name: 'Rhea Chakraborty',
      shortName: 'RHE',
      color: '#06b6d4',
      score: 0,
      players: []
    },
    tennisState: {
      server: 'teamA',
      currentPoints: { teamA: '40', teamB: '30' },
      games: { teamA: 4, teamB: 3 },
      sets: [
        { teamA: 6, teamB: 4 },
        { teamA: 4, teamB: 3 }
      ],
      isDeuce: false,
      breakPoint: false
    },
    events: [
      {
        id: 'ev_201',
        matchId: 'match_tennis_01',
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        gameTime: 'Set 2 [4-3] (40-30)',
        period: 2,
        type: 'ACE',
        label: 'Ace Serve ⚡ by Elena Rostova',
        teamId: 'team_elena',
        playerName: 'Elena Rostova',
        pointDelta: 1,
        highlightWorthy: true
      }
    ],
    sponsor: {
      name: 'Wilson Blade India',
      tagline: 'Feel Every Strike',
      logoText: 'WILSON INDIA'
    }
  }
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post_1',
    author: INITIAL_ATHLETES[0], // Aarav Sharma
    sport: 'cricket',
    pillar: 'POST_MATCH',
    title: 'Chased 178 under Shivaji Park floodlights! On to the Semi-Finals! 🏏🔥',
    content: 'What an electric night in Dadar! Needed 24 off the last two overs. Kept my calm, targeted the shorter midwicket boundary, and sent that 19th over slower ball into the stands! Big congratulations to Rohan Verma for holding the other end. Post-match cutting chai and bun maska on me tonight boys! ☕',
    timestamp: '18m ago',
    cheersCount: 1420,
    commentsCount: 184,
    sharesCount: 76,
    hasCheered: true,
    fanoutModel: 'PUSH_CELEB',
    moderationStatus: 'APPROVED'
  },
  {
    id: 'post_2',
    author: INITIAL_ATHLETES[1], // Pradeep Kumar
    sport: 'kabaddi',
    pillar: 'TRAINING',
    title: 'Akhada morning session: 100 Dubki drills & mud resistance sprints 🤼',
    content: 'When opponents expect you to jump over the chain, you must disappear beneath their knees! 6 AM mat conditioning complete in Rohtak. Ready for the Puneri Paltan derby tomorrow evening!',
    timestamp: '2h ago',
    cheersCount: 890,
    commentsCount: 65,
    sharesCount: 52,
    fanoutModel: 'PUSH_CELEB',
    moderationStatus: 'APPROVED'
  },
  {
    id: 'post_3',
    author: INITIAL_ATHLETES[2], // Ananya Sen
    sport: 'badminton',
    pillar: 'HIGHLIGHT',
    title: 'That 34-shot rally point at Padukone-Dravid Centre! 🏸⚡',
    content: 'Pushed to the absolute physical limit in the second game. Recovered two steep smashes before finishing with the reverse slice drop shot. Check the auto-clipped replay generated by SportPulse AI!',
    timestamp: '4h ago',
    cheersCount: 620,
    commentsCount: 42,
    sharesCount: 38,
    fanoutModel: 'PULL_REGULAR',
    moderationStatus: 'APPROVED'
  },
  {
    id: 'post_4',
    author: INITIAL_ATHLETES[3], // Farhan Akhtar
    sport: 'football',
    pillar: 'PRE_GAME',
    title: 'Derby Day in Kochi! Manjappada yellow army in full voice! ⚽🟡',
    content: 'Derby days are why we play this beautiful game. Pitch is immaculate after the afternoon rain. Warmup done, boots laced, let’s bring all 3 points home!',
    timestamp: '6h ago',
    cheersCount: 1105,
    commentsCount: 98,
    sharesCount: 61,
    fanoutModel: 'PUSH_CELEB',
    moderationStatus: 'APPROVED'
  }
];

export const INITIAL_MARKETPLACE: MarketplaceListing[] = [
  {
    id: 'mkt_1',
    type: 'OPPONENT',
    sport: 'cricket',
    title: 'Seeking Box Cricket Opponent for Saturday Night Floodlight Clash',
    organizer: 'Bandra Super Strikers CC',
    avatar: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&auto=format&fit=crop&q=80',
    location: 'Bandra Turf Club • Mumbai',
    dateOrAvailability: 'This Saturday • 9:00 PM - 11:00 PM',
    skillLevel: 'Intermediate',
    costOrFee: '₹800 / team (Turf Split)',
    description: 'Looking for a competitive 8v8 box cricket match with tennis ball. Verified ball-by-ball scorer provided. Trophy for winning squad!'
  },
  {
    id: 'mkt_2',
    type: 'VENUE',
    sport: 'cricket',
    title: 'Koramangala Floodlit Astro-Turf • Prime Weekend Slots',
    organizer: 'Bangalore Turf Arena',
    avatar: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=100&auto=format&fit=crop&q=80',
    location: '80 Feet Road, Koramangala • Bengaluru',
    dateOrAvailability: 'Open Daily 6 AM - 12 Midnight',
    skillLevel: 'Grassroots',
    costOrFee: '₹1,200 / hour',
    description: 'FIFA & ICC-certified artificial turf equipped with 4K automated replay cameras, LED floodlights, and integrated SportPulse digital umpire tablets.'
  },
  {
    id: 'mkt_3',
    type: 'TEAM',
    sport: 'kabaddi',
    title: 'Right Corner Defender Needed for State Grassroots Squad',
    organizer: 'Haryana Yoddhas Academy',
    avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80',
    location: 'Chhotu Ram Stadium • Rohtak, Haryana',
    dateOrAvailability: 'Trials this Sunday • 8:00 AM',
    skillLevel: 'Competitive / Pro',
    costOrFee: 'Free (Kit & Travel Sponsored)',
    description: 'Seeking aggressive corner defender with proven ankle-hold and thigh-catch stats on SportPulse Pro-Card. Minimum 60% tackle success rate.'
  },
  {
    id: 'mkt_4',
    type: 'COACH',
    sport: 'badminton',
    title: 'Advanced Strokeplay & Agility Clinic by Ex-National Player',
    organizer: 'Coach Arvind Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&auto=format&fit=crop&q=80',
    location: 'Padukone-Dravid Centre • Bengaluru',
    dateOrAvailability: 'Tues, Thurs & Sat • 6:30 AM',
    skillLevel: 'Intermediate',
    costOrFee: '₹600 / session',
    description: 'Video-analyzed smash velocity, cross-court deception, and third-game stamina building with high-speed sensor tracking.'
  },
  {
    id: 'mkt_5',
    type: 'OPPONENT',
    sport: 'football',
    title: 'Looking for 7v7 Weekend Turf Friendly Match',
    organizer: 'Malabar Rovers FC',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80',
    location: 'Decathlon Turf • Kochi, Kerala',
    dateOrAvailability: 'Sunday • 7:00 PM',
    skillLevel: 'Grassroots',
    costOrFee: '₹500 / team (Turf Split)',
    description: 'Friendly but energetic 7-a-side match. Clean bibs and match ball provided. Live score broadcasted on SportPulse.'
  }
];

export const PLATFORM_BENCHMARK_DATA = [
  {
    dimension: 'Scoring Logic & Sports Scope',
    legacyPlatform: 'Hardcoded Single-Sport Scoring (Strictly single sport rules, locked schemas)',
    sportPulse: 'Modular Strategy Pattern (Cricket Ball-by-Ball + Kabaddi Raids + Badminton Rally + Football Clock)',
    advantage: 'Unifies ball-by-ball precision across all athletic paradigms on one cohesive engine.'
  },
  {
    dimension: 'Grassroots Ecosystem & Reach',
    legacyPlatform: 'Single-Sport Siloed Audience (Isolated to one sport community)',
    sportPulse: 'Multi-Sport Grassroots Network: Cricket, Kabaddi, Badminton, Football (120M+ Athletes)',
    advantage: 'Multi-sport athletes who play weekend cricket & weekday football or badminton maintain one verified sports passport.'
  },
  {
    dimension: 'Athlete Digital Identity',
    legacyPlatform: 'Basic Match Scorecard (Raw numbers, basic batting/bowling averages)',
    sportPulse: 'Multi-Sport Digital "Pro-Card" with 5-axis Radar, Verified Scout Analytics, and AI Video Highlights',
    advantage: 'Acts as the definitive digital athletic passport connecting grassroots talents with academy and league scouts.'
  },
  {
    dimension: 'Community & Fixtures Market',
    legacyPlatform: 'Static message boards and manual phone coordination',
    sportPulse: 'Instant Challenge Hub with Turf Escrow, WhatsApp Match Sync, and Verified Official Booking in ₹ INR',
    advantage: 'Instant digital challenges and verified turf booking across 50+ sports arenas.'
  },
  {
    dimension: 'AI Integration & Broadcast',
    legacyPlatform: 'Basic automated post-match text summaries',
    sportPulse: 'Sub-300ms Real-time AI Highlights Auto-Clipping, Gemini Bilingual Commentary (Hinglish/English), and TV Scorebug',
    advantage: 'Grassroots players get broadcast-grade streaming overlays and automated video clip production.'
  },
  {
    dimension: 'Monetization & Economy',
    legacyPlatform: 'Static banner advertisements and intrusive paywalls',
    sportPulse: 'D2C Equipment Store (SG, MRF, Yonex in ₹ INR), UPI Match PPV Passes (₹49), and Scout Subscriptions',
    advantage: 'Sustainable multi-stream commerce built around UPI, PhonePe, Google Pay, and premier athletic brands.'
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourn_01',
    title: 'TATA Grassroots T20 Trophy 2026',
    sportId: 'cricket',
    format: 'KNOCKOUT',
    totalTeams: 16,
    location: 'Mumbai, Maharashtra',
    venue: 'Shivaji Park Ground & Azad Maidan',
    startDate: 'Ongoing • Finals this Sunday',
    entryFee: '₹3,500 / team',
    prizePool: '₹1,00,000 + Gold Trophy',
    status: 'ONGOING',
    organizer: 'Mumbai Grassroots Cricket Association',
    matchesCount: 15,
    ppvEnabled: true,
    teams: ['Mumbai Tigers CC', 'Delhi Grassroots CC', 'Bandra Blasters', 'Pune Warriors XI', 'Shivaji Park Strikers', 'Dadar Royal Colts', 'Thane Super Kings', 'Navi Mumbai Titans']
  },
  {
    id: 'tourn_02',
    title: 'All-India Grassroots Pro-Kabaddi Cup',
    sportId: 'kabaddi',
    format: 'LEAGUE_AND_PLAYOFFS',
    totalTeams: 8,
    location: 'Rohtak, Haryana',
    venue: 'Chhotu Ram Stadium Indoor Mat Arena',
    startDate: 'Starting Saturday',
    entryFee: '₹2,000 / team',
    prizePool: '₹50,000 + Silver Shield',
    status: 'UPCOMING',
    organizer: 'Haryana Mat Sports Federation',
    matchesCount: 14,
    ppvEnabled: true,
    teams: ['Haryana Yoddhas', 'Puneri Paltan Grassroots', 'Jaipur Pink Lions', 'Bengaluru Bulls Youth', 'Patna Pirates Academy', 'UP Yoddhas Colts']
  },
  {
    id: 'tourn_03',
    title: 'Bengaluru Turf Football Championship',
    sportId: 'football',
    format: 'ROUND_ROBIN',
    totalTeams: 12,
    location: 'Bengaluru, Karnataka',
    venue: 'Kanteerava Turf & Astro Arena',
    startDate: 'Weekends Throughout This Month',
    entryFee: '₹2,500 / team',
    prizePool: '₹40,000 + MVP Boots',
    status: 'ONGOING',
    organizer: 'Bangalore Community Football League',
    matchesCount: 22,
    ppvEnabled: false,
    teams: ['Bengaluru FC Grassroots', 'Kochi Blasters FC', 'Indiranagar United', 'Koramangala City', 'Whitefield Strikers']
  },
  {
    id: 'tourn_04',
    title: 'Hyderabad Badminton Masters Open',
    sportId: 'badminton',
    format: 'KNOCKOUT',
    totalTeams: 32,
    location: 'Hyderabad, Telangana',
    venue: 'Gachibowli Indoor Badminton Academy',
    startDate: 'Next Weekend',
    entryFee: '₹1,200 / player',
    prizePool: '₹35,000 + Yonex Kits',
    status: 'UPCOMING',
    organizer: 'Telangana Shuttlers Club',
    matchesCount: 31,
    ppvEnabled: true,
    teams: ['Pullela Academy Shuttlers', 'Gachibowli Smashers', 'Secunderabad Aces', 'Cyberabad Smashers']
  }
];

