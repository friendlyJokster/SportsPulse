import { Match, SportEvent, StrategyRuleSet } from '../../types/sport';

export const cricketStrategy: StrategyRuleSet = {
  sportId: 'cricket',
  category: 'BALL_BY_BALL_INNINGS',
  getPeriodLabel: (match: Match) => {
    const cs = match.cricketState;
    if (!cs) return 'Innings 1';
    if (cs.innings === 1) {
      return `1st Innings • ${cs.totalOvers} Overs`;
    }
    const targetStr = cs.target ? `Target: ${cs.target}` : '2nd Innings';
    const runsNeeded = cs.target ? Math.max(0, cs.target - cs.runs) : 0;
    const totalBalls = cs.totalOvers * 6;
    const ballsBowled = cs.overs * 6 + cs.balls;
    const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
    return `2nd Innings • ${targetStr} (Need ${runsNeeded} off ${ballsRemaining}b)`;
  },

  formatScore: (match: Match) => {
    const cs = match.cricketState;
    if (!cs) {
      return {
        primaryA: `${match.teamA.score}/0`,
        primaryB: `${match.teamB.score}/0`
      };
    }

    const isTeamABatting = cs.battingTeamId === match.teamA.id;
    const battingTeamScore = `${cs.runs}/${cs.wickets}`;
    const battingTeamOvers = `${cs.overs}.${cs.balls} / ${cs.totalOvers} ov • CRR: ${cs.crr}`;

    if (cs.innings === 2 && cs.target) {
      const runsNeeded = Math.max(0, cs.target - cs.runs);
      const ballsRem = Math.max(0, cs.totalOvers * 6 - (cs.overs * 6 + cs.balls));
      const chaseInfo = `Target: ${cs.target} • Need ${runsNeeded} in ${ballsRem}b`;

      return {
        primaryA: isTeamABatting ? battingTeamScore : `Target: ${cs.target}`,
        primaryB: isTeamABatting ? `Target: ${cs.target}` : battingTeamScore,
        secondaryA: isTeamABatting ? battingTeamOvers : chaseInfo,
        secondaryB: isTeamABatting ? chaseInfo : battingTeamOvers
      };
    }

    return {
      primaryA: isTeamABatting ? battingTeamScore : 'Yet to Bat',
      primaryB: isTeamABatting ? 'Yet to Bat' : battingTeamScore,
      secondaryA: isTeamABatting ? battingTeamOvers : `1st Innings Bowling`,
      secondaryB: isTeamABatting ? `1st Innings Bowling` : battingTeamOvers
    };
  },

  formatGameClock: (match: Match) => {
    const cs = match.cricketState;
    if (!cs) return '0.0 ov';
    return `${cs.overs}.${cs.balls} ov`;
  },

  getAvailableActions: (match: Match) => [
    { id: 'cric_dot', label: '0 Dot Ball', type: 'CRIC_DOT', teamIdTarget: 'both', pointDelta: 0, color: 'bg-slate-700 hover:bg-slate-600 text-white', highlightWorthy: false },
    { id: 'cric_1', label: '1 Single', type: 'CRIC_1', teamIdTarget: 'both', pointDelta: 1, color: 'bg-blue-600/90 hover:bg-blue-500 text-white', highlightWorthy: false },
    { id: 'cric_2', label: '2 Double', type: 'CRIC_2', teamIdTarget: 'both', pointDelta: 2, color: 'bg-indigo-600/90 hover:bg-indigo-500 text-white', highlightWorthy: false },
    { id: 'cric_3', label: '3 Triple', type: 'CRIC_3', teamIdTarget: 'both', pointDelta: 3, color: 'bg-violet-600/90 hover:bg-violet-500 text-white', highlightWorthy: false },
    { id: 'cric_4', label: '4 FOUR! 💥', type: 'CRIC_4', teamIdTarget: 'both', pointDelta: 4, color: 'bg-emerald-600 hover:bg-emerald-500 text-white', highlightWorthy: true },
    { id: 'cric_6', label: '6 SIXER! 🚀', type: 'CRIC_6', teamIdTarget: 'both', pointDelta: 6, color: 'bg-purple-600 hover:bg-purple-500 text-white', highlightWorthy: true },
    { id: 'cric_wicket', label: 'WICKET! ☝️', type: 'CRIC_WICKET', teamIdTarget: 'both', pointDelta: 0, color: 'bg-rose-600 hover:bg-rose-500 text-white', highlightWorthy: true },
    { id: 'cric_wide', label: 'Wide (+1 Wd)', type: 'CRIC_WIDE', teamIdTarget: 'both', pointDelta: 1, color: 'bg-amber-600 hover:bg-amber-500 text-white', highlightWorthy: false },
    { id: 'cric_noball', label: 'No-Ball (+1 Nb)', type: 'CRIC_NOBALL', teamIdTarget: 'both', pointDelta: 1, color: 'bg-orange-600 hover:bg-orange-500 text-white', highlightWorthy: true },
    { id: 'cric_legbye', label: 'Leg Bye (+1 Lb)', type: 'CRIC_LEGBYE', teamIdTarget: 'both', pointDelta: 1, color: 'bg-slate-800 hover:bg-slate-700 text-slate-200', highlightWorthy: false },
    { id: 'cric_switch', label: 'Switch Strike 🔄', type: 'CRIC_SWITCH_STRIKE', teamIdTarget: 'both', pointDelta: 0, color: 'bg-teal-700 hover:bg-teal-600 text-white', highlightWorthy: false },
  ],

  applyEvent: (match: Match, eventData: Partial<SportEvent> & { type: string; teamId: string }) => {
    const updated = JSON.parse(JSON.stringify(match)) as Match;
    
    // Initialize default cricketState if not existing
    if (!updated.cricketState) {
      updated.cricketState = {
        innings: 1,
        battingTeamId: updated.teamA.id,
        bowlingTeamId: updated.teamB.id,
        runs: updated.teamA.score || 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        totalOvers: 20,
        currentStriker: updated.teamA.players[0]?.name || 'Opening Batsman',
        currentNonStriker: 'Non-Striker Partner',
        currentBowler: 'Opening Bowler',
        batsmenStats: {
          [updated.teamA.players[0]?.name || 'Opening Batsman']: { runs: updated.teamA.score || 0, balls: 0, fours: 0, sixes: 0 }
        },
        bowlerStats: {
          'Opening Bowler': { overs: '0.0', maidens: 0, runs: 0, wickets: 0, economy: 0 }
        },
        recentBalls: [],
        extras: { wide: 0, noBall: 0, bye: 0, legBye: 0 },
        crr: 0
      };
    }

    const cs = updated.cricketState;
    const isTeamA = cs.battingTeamId === updated.teamA.id;
    const battingTeam = isTeamA ? updated.teamA : updated.teamB;

    let runDelta = 0;
    let isLegalBall = false;
    let ballBadge = '•';
    let label = eventData.label || 'Ball';
    let isHighlight = Boolean(eventData.highlightWorthy);
    let details = eventData.details || '';
    let commentaryHeadline = '';
    let commentaryText = '';
    let tactical = '';

    const striker = cs.currentStriker;
    if (!cs.batsmenStats[striker]) {
      cs.batsmenStats[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
    }
    const strikerStats = cs.batsmenStats[striker];

    const bowler = cs.currentBowler;
    if (!cs.bowlerStats[bowler]) {
      cs.bowlerStats[bowler] = { overs: '0.0', maidens: 0, runs: 0, wickets: 0, economy: 0 };
    }
    const bowlerStats = cs.bowlerStats[bowler];

    switch (eventData.type) {
      case 'CRIC_DOT':
        isLegalBall = true;
        ballBadge = '0';
        label = `Dot Ball to ${striker}`;
        strikerStats.balls += 1;
        details = details || 'Good length delivery defended solidly to cover point.';
        break;

      case 'CRIC_1':
        runDelta = 1;
        isLegalBall = true;
        ballBadge = '1';
        label = `1 Run by ${striker}`;
        strikerStats.runs += 1;
        strikerStats.balls += 1;
        bowlerStats.runs += 1;
        details = details || 'Pushed into the gap towards mid-on for a brisk single.';
        // Rotate strike
        const tmp1 = cs.currentStriker;
        cs.currentStriker = cs.currentNonStriker;
        cs.currentNonStriker = tmp1;
        break;

      case 'CRIC_2':
        runDelta = 2;
        isLegalBall = true;
        ballBadge = '2';
        label = `2 Runs by ${striker}`;
        strikerStats.runs += 2;
        strikerStats.balls += 1;
        bowlerStats.runs += 2;
        details = details || 'Clipped off the pads into deep square leg, excellent running between the wickets.';
        break;

      case 'CRIC_3':
        runDelta = 3;
        isLegalBall = true;
        ballBadge = '3';
        label = `3 Runs by ${striker}`;
        strikerStats.runs += 3;
        strikerStats.balls += 1;
        bowlerStats.runs += 3;
        details = details || 'Timed sweetly through extra cover, outfield pulls it back just inside the rope.';
        // Rotate strike
        const tmp3 = cs.currentStriker;
        cs.currentStriker = cs.currentNonStriker;
        cs.currentNonStriker = tmp3;
        break;

      case 'CRIC_4':
        runDelta = 4;
        isLegalBall = true;
        ballBadge = '4';
        label = `FOUR! 💥 by ${striker}`;
        strikerStats.runs += 4;
        strikerStats.balls += 1;
        strikerStats.fours += 1;
        bowlerStats.runs += 4;
        isHighlight = true;
        details = details || 'Cracking drive! Pierces backward point and extra cover to the boundary fence!';
        commentaryHeadline = `BOUNDARY: ${striker.toUpperCase()} CRUNCHES IT FOR FOUR!`;
        commentaryText = `What a shot! Stand and deliver! ${striker} leans into the drive and beats the sweeping sweeper with sheer timing!`;
        tactical = 'Capitalized on width outside off-stump with immaculate balance and bottom-hand punch.';
        break;

      case 'CRIC_6':
        runDelta = 6;
        isLegalBall = true;
        ballBadge = '6';
        label = `SIXER! 🚀 by ${striker}`;
        strikerStats.runs += 6;
        strikerStats.balls += 1;
        strikerStats.sixes += 1;
        bowlerStats.runs += 6;
        isHighlight = true;
        details = details || 'MASSIVE MAXIMUM! Dispatched 85 meters way over long-on into the crowd!';
        commentaryHeadline = `HUGE SIX! ${striker.toUpperCase()} DEPOSITS IT INTO THE STANDS!`;
        commentaryText = `That is out of the park! High, handsome and into the Mumbai night sky! ${striker} unleashes a towering six!`;
        tactical = 'Read the slower ball early, clearing the front leg to gain clean vertical elevation.';
        break;

      case 'CRIC_WICKET':
        isLegalBall = true;
        ballBadge = 'W';
        label = `WICKET! ☝️ ${striker} Dismissed!`;
        strikerStats.balls += 1;
        strikerStats.isOut = true;
        strikerStats.dismissal = details || 'c & b Bowler';
        cs.wickets = Math.min(10, cs.wickets + 1);
        bowlerStats.wickets += 1;
        isHighlight = true;
        details = details || 'Clean bowled! Off-stump uprooted by a scorching yorker!';
        commentaryHeadline = `BOWLED 'EM! TIMBER! BIG BREAKTHROUGH FOR ${bowler.toUpperCase()}!`;
        commentaryText = `You miss, I hit! Full, fast and swinging in at the base of the off stump! ${striker} has to walk back!`;
        tactical = 'Pinpoint yorker executing right in the blockhole at 138 km/h.';
        // Bring in next batsman placeholder
        cs.currentStriker = `Batter #${cs.wickets + 2}`;
        cs.batsmenStats[cs.currentStriker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
        break;

      case 'CRIC_WIDE':
        runDelta = 1;
        isLegalBall = false;
        ballBadge = 'Wd';
        label = `Wide Ball (+1 Wd)`;
        cs.extras.wide += 1;
        bowlerStats.runs += 1;
        details = details || 'Sprayed down the leg side, umpire stretches arms wide.';
        break;

      case 'CRIC_NOBALL':
        runDelta = 1;
        isLegalBall = false;
        ballBadge = 'Nb';
        label = `No-Ball! (+1 Nb • FREE HIT)`;
        cs.extras.noBall += 1;
        bowlerStats.runs += 1;
        isHighlight = true;
        details = details || 'Overstepped the popping crease! Next ball is a FREE HIT!';
        commentaryHeadline = `NO-BALL CALLED! FREE HIT COMING UP!`;
        commentaryText = `The siren sounds! Bowler has overstepped by two inches! Golden opportunity for the batting side!`;
        tactical = 'Loss of run-up cadence resulting in front foot stride overextension.';
        break;

      case 'CRIC_LEGBYE':
        runDelta = 1;
        isLegalBall = true;
        ballBadge = 'Lb';
        label = `Leg Bye (+1 Lb)`;
        strikerStats.balls += 1;
        cs.extras.legBye += 1;
        details = details || 'Deflected off the pad into the fine leg region.';
        // Rotate strike
        const tmpLb = cs.currentStriker;
        cs.currentStriker = cs.currentNonStriker;
        cs.currentNonStriker = tmpLb;
        break;

      case 'CRIC_SWITCH_STRIKE':
        const sw = cs.currentStriker;
        cs.currentStriker = cs.currentNonStriker;
        cs.currentNonStriker = sw;
        label = `Strike Changed to ${cs.currentStriker}`;
        details = 'Batsmen switched ends manually.';
        break;

      default:
        runDelta = eventData.pointDelta || 0;
        break;
    }

    // Apply runs
    cs.runs += runDelta;
    battingTeam.score = cs.runs;

    // Track ball badge
    if (eventData.type !== 'CRIC_SWITCH_STRIKE') {
      cs.recentBalls.push(ballBadge);
      if (cs.recentBalls.length > 8) {
        cs.recentBalls.shift();
      }
    }

    // Handle legal ball progression & overs
    if (isLegalBall) {
      cs.balls += 1;
      if (cs.balls === 6) {
        cs.overs += 1;
        cs.balls = 0;
        // Over completed: rotate strike
        const endOfOverStriker = cs.currentStriker;
        cs.currentStriker = cs.currentNonStriker;
        cs.currentNonStriker = endOfOverStriker;
        label += ` (Over ${cs.overs} Completed)`;
      }
    }

    // Update bowler overs display
    bowlerStats.overs = `${cs.overs}.${cs.balls}`;
    const totalBowlerLegalBalls = cs.overs * 6 + cs.balls;
    bowlerStats.economy = totalBowlerLegalBalls > 0 
      ? Number(((bowlerStats.runs / totalBowlerLegalBalls) * 6).toFixed(2)) 
      : 0;

    // Recalculate Run Rates
    const totalMatchLegalBalls = cs.overs * 6 + cs.balls;
    cs.crr = totalMatchLegalBalls > 0 
      ? Number(((cs.runs / totalMatchLegalBalls) * 6).toFixed(2)) 
      : 0;

    if (cs.target) {
      const runsRemaining = Math.max(0, cs.target - cs.runs);
      const ballsRemaining = Math.max(0, cs.totalOvers * 6 - totalMatchLegalBalls);
      cs.rrr = ballsRemaining > 0 
        ? Number(((runsRemaining / ballsRemaining) * 6).toFixed(2)) 
        : 0;
    }

    // Create immutable SportEvent
    const newEvent: SportEvent = {
      id: 'ev_cric_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      matchId: match.id,
      timestamp: new Date().toISOString(),
      gameTime: `${cs.overs}.${cs.balls} ov`,
      period: cs.innings,
      type: eventData.type,
      label,
      teamId: battingTeam.id,
      playerName: striker,
      pointDelta: runDelta,
      details,
      highlightWorthy: isHighlight,
      aiNarrative: isHighlight ? {
        headline: commentaryHeadline || `CRICKET MOMENTUM: ${label.toUpperCase()}`,
        commentary: commentaryText || `Thrilling cricket action as ${striker} takes center stage at Shivaji Park!`,
        tacticalAnalysis: tactical || `Key event reshaping the required run rate equation in the closing overs.`
      } : undefined
    };

    updated.events.unshift(newEvent);
    return updated;
  }
};
