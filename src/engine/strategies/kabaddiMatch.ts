import { Match, SportEvent, StrategyRuleSet } from '../../types/sport';

export const kabaddiStrategy: StrategyRuleSet = {
  sportId: 'kabaddi',
  category: 'CLOCK_AND_ACCUMULATE',
  getPeriodLabel: (match: Match) => {
    if (match.currentPeriod === 1) return '1st Half (20m)';
    if (match.currentPeriod === 2) return '2nd Half (20m)';
    return 'Full Time';
  },

  formatScore: (match: Match) => ({
    primaryA: String(match.teamA.score),
    primaryB: String(match.teamB.score),
    secondaryA: match.kabaddiState ? `Raid: ${match.kabaddiState.raidPoints.teamA} • Tackle: ${match.kabaddiState.tacklePoints.teamA}` : undefined,
    secondaryB: match.kabaddiState ? `Raid: ${match.kabaddiState.raidPoints.teamB} • Tackle: ${match.kabaddiState.tacklePoints.teamB}` : undefined
  }),

  formatGameClock: (match: Match) => {
    const halfDuration = 20 * 60;
    const remaining = Math.max(0, halfDuration - (match.clockSeconds % halfDuration));
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },

  getAvailableActions: (match: Match) => [
    { id: 'kbd_touch', label: 'Touch Point (+1) 🤼', type: 'TOUCH_POINT', teamIdTarget: 'both', pointDelta: 1, color: 'bg-emerald-600 hover:bg-emerald-500 text-white', highlightWorthy: false },
    { id: 'kbd_bonus', label: 'Bonus Point (+1) 🎯', type: 'BONUS_POINT', teamIdTarget: 'both', pointDelta: 1, color: 'bg-blue-600/90 hover:bg-blue-500 text-white', highlightWorthy: false },
    { id: 'kbd_super_raid', label: 'SUPER RAID! (+3) 🔥', type: 'SUPER_RAID', teamIdTarget: 'both', pointDelta: 3, color: 'bg-amber-600 hover:bg-amber-500 text-white', highlightWorthy: true },
    { id: 'kbd_tackle', label: 'Tackle Point (+1) 🛡️', type: 'TACKLE_POINT', teamIdTarget: 'both', pointDelta: 1, color: 'bg-indigo-600/90 hover:bg-indigo-500 text-white', highlightWorthy: false },
    { id: 'kbd_super_tackle', label: 'SUPER TACKLE! (+2) ⚡', type: 'SUPER_TACKLE', teamIdTarget: 'both', pointDelta: 2, color: 'bg-purple-600 hover:bg-purple-500 text-white', highlightWorthy: true },
    { id: 'kbd_all_out', label: 'ALL-OUT LONA (+2) 🏆', type: 'ALL_OUT', teamIdTarget: 'both', pointDelta: 2, color: 'bg-rose-600 hover:bg-rose-500 text-white', highlightWorthy: true },
  ],

  applyEvent: (match: Match, eventData: Partial<SportEvent> & { type: string; teamId: string }) => {
    const updated = JSON.parse(JSON.stringify(match)) as Match;
    const isTeamA = eventData.teamId === updated.teamA.id;
    const targetTeam = isTeamA ? updated.teamA : updated.teamB;

    if (!updated.kabaddiState) {
      updated.kabaddiState = {
        activeRaider: 'Star Raider',
        raidClock: 30,
        raidPoints: { teamA: 0, teamB: 0 },
        tacklePoints: { teamA: 0, teamB: 0 },
        bonusPoints: { teamA: 0, teamB: 0 },
        allOuts: { teamA: 0, teamB: 0 },
        isDoOrDie: false
      };
    }

    const ks = updated.kabaddiState;
    const delta = eventData.pointDelta || 0;
    targetTeam.score += delta;

    let commentaryHeadline = '';
    let commentaryText = '';
    let tactical = '';

    if (eventData.type === 'TOUCH_POINT') {
      if (isTeamA) ks.raidPoints.teamA += delta; else ks.raidPoints.teamB += delta;
    } else if (eventData.type === 'BONUS_POINT') {
      if (isTeamA) ks.bonusPoints.teamA += delta; else ks.bonusPoints.teamB += delta;
    } else if (eventData.type === 'SUPER_RAID') {
      if (isTeamA) ks.raidPoints.teamA += delta; else ks.raidPoints.teamB += delta;
      commentaryHeadline = `SENSATIONAL SUPER RAID! 3 POINTS SECURED!`;
      commentaryText = `Dubki out of this world! Raider slips under the chain of corner defenders and crosses the midline!`;
      tactical = 'Masterclass low center of gravity maneuver escaping ankle hold attempt.';
    } else if (eventData.type === 'TACKLE_POINT') {
      if (isTeamA) ks.tacklePoints.teamA += delta; else ks.tacklePoints.teamB += delta;
    } else if (eventData.type === 'SUPER_TACKLE') {
      if (isTeamA) ks.tacklePoints.teamA += delta; else ks.tacklePoints.teamB += delta;
      commentaryHeadline = `SUPER TACKLE! 2 DEFENDERS BRING DOWN THE RAIDER!`;
      commentaryText = `Unbelievable back hold! Short-handed defense locks the thighs and pulls the raider backward!`;
      tactical = 'Anticipated the toe-touch attempt with a sudden coordinated thigh grip.';
    } else if (eventData.type === 'ALL_OUT') {
      if (isTeamA) ks.allOuts.teamA += 1; else ks.allOuts.teamB += 1;
      commentaryHeadline = `ALL-OUT INFLICTED! 2 EXTRA LONA POINTS!`;
      commentaryText = `The mat is cleared! Entire opposing team sent to the bench as revival occurs!`;
      tactical = 'Relentless offensive pressure capitalizing on defender depletion.';
    }

    const newEvent: SportEvent = {
      id: 'ev_kbd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      matchId: match.id,
      timestamp: new Date().toISOString(),
      gameTime: kabaddiStrategy.formatGameClock(match),
      period: match.currentPeriod,
      type: eventData.type,
      label: eventData.label || `${delta > 0 ? `+${delta}` : ''} ${eventData.type}`,
      teamId: eventData.teamId,
      playerName: eventData.playerName || (isTeamA ? updated.teamA.players[0]?.name : updated.teamB.players[0]?.name) || 'Raider',
      pointDelta: delta,
      details: eventData.details,
      highlightWorthy: Boolean(eventData.highlightWorthy || delta >= 2),
      aiNarrative: commentaryHeadline ? {
        headline: commentaryHeadline,
        commentary: commentaryText,
        tacticalAnalysis: tactical
      } : undefined
    };

    updated.events.unshift(newEvent);
    return updated;
  }
};
