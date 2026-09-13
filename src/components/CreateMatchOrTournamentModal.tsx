import React, { useState } from 'react';
import { 
  Trophy, 
  Play, 
  X, 
  Plus, 
  MapPin, 
  Layers, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Flame, 
  Tv, 
  Award,
  ChevronRight
} from 'lucide-react';
import { Match, SportId, Tournament } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';

interface CreateMatchOrTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMatch: (newMatch: Match) => void;
  onCreateTournament: (newTournament: Tournament) => void;
  tournaments: Tournament[];
  onSelectTournamentMatch?: (tournamentName: string) => void;
  defaultSport?: SportId;
}

export const CreateMatchOrTournamentModal: React.FC<CreateMatchOrTournamentModalProps> = ({
  isOpen,
  onClose,
  onCreateMatch,
  onCreateTournament,
  tournaments,
  onSelectTournamentMatch,
  defaultSport = 'cricket'
}) => {
  const [activeTab, setActiveTab] = useState<'match' | 'tournament' | 'browse_tournaments'>('match');

  // Match Form State
  const [sportId, setSportId] = useState<SportId>(defaultSport);
  const [teamAName, setTeamAName] = useState('Mumbai Tigers CC');
  const [teamAShort, setTeamAShort] = useState('MUM');
  const [teamAColor, setTeamAColor] = useState('#0284c7');
  
  const [teamBName, setTeamBName] = useState('Delhi Grassroots CC');
  const [teamBShort, setTeamBShort] = useState('DEL');
  const [teamBColor, setTeamBColor] = useState('#dc2626');
  
  const [tournamentName, setTournamentName] = useState('TATA Grassroots T20 Trophy');
  const [venue, setVenue] = useState('Shivaji Park Ground, Dadar, Mumbai');
  const [matchFormat, setMatchFormat] = useState('20_OVERS'); // or duration
  const [tossWinner, setTossWinner] = useState<'teamA' | 'teamB'>('teamA');
  const [tossDecision, setTossDecision] = useState<'BAT' | 'BOWL' | 'SERVE' | 'FIRST_RAID'>('BAT');
  const [sponsorName, setSponsorName] = useState('TATA Grassroots');

  // Tournament Form State
  const [tournTitle, setTournTitle] = useState('');
  const [tournSport, setTournSport] = useState<SportId>('cricket');
  const [tournFormat, setTournFormat] = useState<'KNOCKOUT' | 'ROUND_ROBIN' | 'LEAGUE_AND_PLAYOFFS'>('KNOCKOUT');
  const [tournTeamsCount, setTournTeamsCount] = useState(8);
  const [tournLocation, setTournLocation] = useState('Mumbai, Maharashtra');
  const [tournVenue, setTournVenue] = useState('Azad Maidan & Shivaji Park');
  const [tournEntryFee, setTournEntryFee] = useState('₹3,000 / team');
  const [tournPrizePool, setTournPrizePool] = useState('₹75,000 + Gold Trophy');
  const [tournPPV, setTournPPV] = useState(true);

  if (!isOpen) return null;

  const currentSportConfig = SPORT_CONFIGS[sportId];

  // Quick Indian club preset suggestions based on sport
  const clubPresets: Record<SportId, Array<{ a: string; aShort: string; b: string; bShort: string; venue: string }>> = {
    cricket: [
      { a: 'Mumbai Tigers CC', aShort: 'MUM', b: 'Delhi Grassroots CC', bShort: 'DEL', venue: 'Shivaji Park, Dadar, Mumbai' },
      { a: 'Bandra Blasters', aShort: 'BAN', b: 'Dadar Royal Colts', bShort: 'DAD', venue: 'Azad Maidan, Fort, Mumbai' },
      { a: 'Bengaluru Smashers XI', aShort: 'BLR', b: 'Chennai Grassroots CC', bShort: 'CHN', venue: 'Kanteerava Turf, Bengaluru' }
    ],
    kabaddi: [
      { a: 'Haryana Yoddhas', aShort: 'HAR', b: 'Puneri Warriors', bShort: 'PUN', venue: 'Chhotu Ram Stadium, Rohtak' },
      { a: 'Jaipur Pink Academy', aShort: 'JAI', b: 'Patna Colts', bShort: 'PAT', venue: 'Sawai Mansingh Indoor, Jaipur' }
    ],
    football: [
      { a: 'Bengaluru FC Grassroots', aShort: 'BFC', b: 'Kochi Blasters FC', bShort: 'KBFC', venue: 'Bengaluru Football Stadium' },
      { a: 'Kolkata Strikers', aShort: 'KOL', b: 'Goa United Youth', bShort: 'GOA', venue: 'Salt Lake Practice Arena, Kolkata' }
    ],
    badminton: [
      { a: 'Pullela Academy Colts', aShort: 'HYD', b: 'Padukone Shuttlers', bShort: 'BLR', venue: 'Gachibowli Badminton Academy' }
    ],
    tennis: [
      { a: 'DLTA Delhi Aces', aShort: 'DEL', b: 'MSLTA Mumbai Masters', bShort: 'MUM', venue: 'RK Khanna Tennis Stadium, Delhi' }
    ],
    basketball: [
      { a: 'Punjab Hoop Kings', aShort: 'PB', b: 'Kerala Ballers', bShort: 'KER', venue: 'Guru Nanak Stadium, Ludhiana' }
    ],
    mma: [
      { a: 'Superhuman Gym Mumbai', aShort: 'BOM', b: 'Delhi Combat Club', bShort: 'DEL', venue: 'Andheri Combat Cage, Mumbai' }
    ],
    boxing: [
      { a: 'Bhiwani Boxing Club', aShort: 'BHW', b: 'Army Sports Institute', bShort: 'ASI', venue: 'Bhiwani Sports Complex, Haryana' }
    ]
  };

  const handleApplyPreset = (p: { a: string; aShort: string; b: string; bShort: string; venue: string }) => {
    setTeamAName(p.a);
    setTeamAShort(p.aShort);
    setTeamBName(p.b);
    setTeamBShort(p.bShort);
    setVenue(p.venue);
  };

  const handleSubmitMatch = (e: React.FormEvent) => {
    e.preventDefault();

    const newMatchId = `match_${sportId}_${Date.now()}`;
    const battingTeamId = tossDecision === 'BAT' ? (tossWinner === 'teamA' ? `team_${newMatchId}_a` : `team_${newMatchId}_b`) : (tossWinner === 'teamA' ? `team_${newMatchId}_b` : `team_${newMatchId}_a`);
    const bowlingTeamId = battingTeamId === `team_${newMatchId}_a` ? `team_${newMatchId}_b` : `team_${newMatchId}_a`;

    let newMatch: Match = {
      id: newMatchId,
      sportId: sportId,
      category: currentSportConfig.category,
      tournamentName: tournamentName || 'Grassroots Invitational Match',
      venue: venue || 'Local Grassroots Arena',
      status: 'LIVE',
      currentPeriod: 1,
      clockSeconds: 0,
      clockRunning: false,
      teamA: {
        id: `team_${newMatchId}_a`,
        name: teamAName || 'Team A',
        shortName: teamAShort || 'TMA',
        color: teamAColor,
        score: 0,
        players: []
      },
      teamB: {
        id: `team_${newMatchId}_b`,
        name: teamBName || 'Team B',
        shortName: teamBShort || 'TMB',
        color: teamBColor,
        score: 0,
        players: []
      },
      events: [],
      sponsor: {
        name: sponsorName || 'SportPulse Grassroots',
        tagline: 'Empowering Grassroots Champions',
        logoText: 'PULSE'
      }
    };

    // Sport-specific state setup
    if (sportId === 'cricket') {
      const totalOvers = matchFormat === '10_OVERS' ? 10 : matchFormat === '6_OVERS' ? 6 : matchFormat === '50_OVERS' ? 50 : 20;
      newMatch.cricketState = {
        innings: 1,
        battingTeamId: battingTeamId,
        bowlingTeamId: bowlingTeamId,
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        totalOvers: totalOvers,
        currentStriker: `${teamAName} Opener 1`,
        currentNonStriker: `${teamAName} Opener 2`,
        currentBowler: `${teamBName} Strike Bowler`,
        batsmenStats: {
          [`${teamAName} Opener 1`]: { runs: 0, balls: 0, fours: 0, sixes: 0 },
          [`${teamAName} Opener 2`]: { runs: 0, balls: 0, fours: 0, sixes: 0 }
        },
        bowlerStats: {
          [`${teamBName} Strike Bowler`]: { overs: '0.0', maidens: 0, runs: 0, wickets: 0, economy: 0 }
        },
        recentBalls: [],
        extras: { wide: 0, noBall: 0, bye: 0, legBye: 0 },
        crr: 0
      };
    } else if (sportId === 'kabaddi') {
      newMatch.kabaddiState = {
        activeRaider: `${teamAName} Raider`,
        raidClock: 30,
        raidPoints: { teamA: 0, teamB: 0 },
        tacklePoints: { teamA: 0, teamB: 0 },
        bonusPoints: { teamA: 0, teamB: 0 },
        allOuts: { teamA: 0, teamB: 0 },
        isDoOrDie: false
      };
    } else if (sportId === 'tennis' || sportId === 'badminton') {
      newMatch.tennisState = {
        server: 'teamA',
        currentPoints: { teamA: '0', teamB: '0' },
        games: { teamA: 0, teamB: 0 },
        sets: [{ teamA: 0, teamB: 0 }],
        isDeuce: false,
        breakPoint: false
      };
    }

    onCreateMatch(newMatch);
    onClose();
  };

  const handleSubmitTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournTitle) return;

    const newTourn: Tournament = {
      id: `tourn_${Date.now()}`,
      title: tournTitle,
      sportId: tournSport,
      format: tournFormat,
      totalTeams: tournTeamsCount,
      location: tournLocation || 'India',
      venue: tournVenue || 'Grassroots Sports Complex',
      startDate: 'Starts This Saturday',
      entryFee: tournEntryFee || '₹2,500 / team',
      prizePool: tournPrizePool || '₹50,000 + Trophy',
      status: 'ONGOING',
      organizer: 'Grassroots Sports League',
      matchesCount: tournTeamsCount - 1,
      ppvEnabled: tournPPV,
      teams: [
        `${tournTitle.split(' ')[0]} Titans`,
        `${tournTitle.split(' ')[0]} Blasters`,
        `${tournTitle.split(' ')[0]} Strikers`,
        `${tournTitle.split(' ')[0]} Warriors`
      ]
    };

    onCreateTournament(newTourn);
    setActiveTab('browse_tournaments');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] flex flex-col">
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
                <span>Create Match or Tournament</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono-code font-bold">
                  SportPulse Hub
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Setup live ball-by-ball fixtures or manage grassroots tournaments with automated brackets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 3 Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('match')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'match'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>1. Start Live Match</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tournament')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tournament'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>2. New Tournament</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('browse_tournaments')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'browse_tournaments'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Tournaments ({tournaments.length})</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-5">
          {/* TAB 1: START LIVE MATCH */}
          {activeTab === 'match' && (
            <form onSubmit={handleSubmitMatch} className="space-y-5">
              {/* Step 1: Select Sport */}
              <div>
                <label className="block text-xs font-mono-code text-slate-300 font-bold mb-2 uppercase">
                  Select Sport
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {(Object.keys(SPORT_CONFIGS) as SportId[]).map((sKey) => {
                    const cfg = SPORT_CONFIGS[sKey];
                    const isSelected = sportId === sKey;
                    return (
                      <button
                        type="button"
                        key={sKey}
                        onClick={() => {
                          setSportId(sKey);
                          // Auto load sample presets
                          const presets = clubPresets[sKey];
                          if (presets && presets[0]) {
                            handleApplyPreset(presets[0]);
                          }
                        }}
                        className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10 scale-105'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="text-xl">{cfg.icon}</span>
                        <span className="text-[11px] font-bold truncate">{cfg.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-1 text-[11px] text-emerald-400/90 font-mono-code">
                  Active Scoring Paradigm: <strong>{currentSportConfig.category.replace(/_/g, ' ')}</strong>
                </div>
              </div>

              {/* Quick Presets Strip */}
              {clubPresets[sportId] && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] font-mono-code text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Fill Indian Grassroots Fixtures:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {clubPresets[sportId].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-[11px] text-slate-200 font-medium transition-all"
                      >
                        {preset.a} vs {preset.b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Team Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Team A */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono-code text-sky-400">Team A (Home)</span>
                    <input
                      type="color"
                      value={teamAColor}
                      onChange={(e) => setTeamAColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      title="Team Kit Color"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Team Name</label>
                    <input
                      type="text"
                      value={teamAName}
                      onChange={(e) => setTeamAName(e.target.value)}
                      placeholder="e.g. Mumbai Tigers CC"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Short Code (3-4 chars)</label>
                    <input
                      type="text"
                      value={teamAShort}
                      onChange={(e) => setTeamAShort(e.target.value.toUpperCase())}
                      maxLength={4}
                      placeholder="e.g. MUM"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono-code uppercase focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Team B */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono-code text-rose-400">Team B (Away)</span>
                    <input
                      type="color"
                      value={teamBColor}
                      onChange={(e) => setTeamBColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      title="Team Kit Color"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Team Name</label>
                    <input
                      type="text"
                      value={teamBName}
                      onChange={(e) => setTeamBName(e.target.value)}
                      placeholder="e.g. Delhi Grassroots CC"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Short Code (3-4 chars)</label>
                    <input
                      type="text"
                      value={teamBShort}
                      onChange={(e) => setTeamBShort(e.target.value.toUpperCase())}
                      maxLength={4}
                      placeholder="e.g. DEL"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono-code uppercase focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Match Venue, Tournament & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Tournament / Cup Name</label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    placeholder="e.g. TATA Grassroots T20 Trophy"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Ground / Venue & City</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Shivaji Park Ground, Dadar, Mumbai"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Sport-Specific Options (Overs for Cricket, Duration for Football, etc.) */}
              {sportId === 'cricket' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold font-mono-code text-amber-400">Cricket Match Settings</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Overs Format</label>
                      <select
                        value={matchFormat}
                        onChange={(e) => setMatchFormat(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="20_OVERS">20 Overs (T20 Match)</option>
                        <option value="10_OVERS">10 Overs (T10 Sprint)</option>
                        <option value="6_OVERS">6 Overs (Gully / Box Cricket)</option>
                        <option value="50_OVERS">50 Overs (One Day Match)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Toss Won By</label>
                      <select
                        value={tossWinner}
                        onChange={(e) => setTossWinner(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="teamA">{teamAName || 'Team A'}</option>
                        <option value="teamB">{teamBName || 'Team B'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Elected To</label>
                      <select
                        value={tossDecision}
                        onChange={(e) => setTossDecision(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="BAT">Bat First</option>
                        <option value="BOWL">Bowl First</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Sponsor Tag */}
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Match Sponsor / Title Partner</label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. TATA Grassroots, Dream11, Amul India"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Live Scoring Now</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CREATE TOURNAMENT */}
          {activeTab === 'tournament' && (
            <form onSubmit={handleSubmitTournament} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-bold">Tournament Title</label>
                <input
                  type="text"
                  value={tournTitle}
                  onChange={(e) => setTournTitle(e.target.value)}
                  placeholder="e.g. All-India Grassroots T20 Trophy 2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Sport</label>
                  <select
                    value={tournSport}
                    onChange={(e) => setTournSport(e.target.value as SportId)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {(Object.keys(SPORT_CONFIGS) as SportId[]).map((s) => (
                      <option key={s} value={s}>
                        {SPORT_CONFIGS[s].icon} {SPORT_CONFIGS[s].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Tournament Structure</label>
                  <select
                    value={tournFormat}
                    onChange={(e) => setTournFormat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="KNOCKOUT">Knockout (Single-Elimination Brackets)</option>
                    <option value="ROUND_ROBIN">Round Robin League (Points Table)</option>
                    <option value="LEAGUE_AND_PLAYOFFS">Groups + Super-Playoffs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Number of Teams</label>
                  <select
                    value={tournTeamsCount}
                    onChange={(e) => setTournTeamsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value={4}>4 Teams (Semi-Finals & Final)</option>
                    <option value={8}>8 Teams (Quarter-Finals & Final)</option>
                    <option value={16}>16 Teams (Round of 16 Championship)</option>
                    <option value={32}>32 Teams (Mega Grassroots Cup)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Host City / State</label>
                  <input
                    type="text"
                    value={tournLocation}
                    onChange={(e) => setTournLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Team Entry Fee (₹ INR)</label>
                  <input
                    type="text"
                    value={tournEntryFee}
                    onChange={(e) => setTournEntryFee(e.target.value)}
                    placeholder="e.g. ₹3,500 / team"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Winner Prize Pool (₹ INR)</label>
                  <input
                    type="text"
                    value={tournPrizePool}
                    onChange={(e) => setTournPrizePool(e.target.value)}
                    placeholder="e.g. ₹1,00,000 + Trophy"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* PPV Option */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enable PPV Fan Match Passes (₹49 UPI)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Family, friends, and scouts pay ₹49 per match. 80% revenue credited to tournament organizers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={tournPPV}
                  onChange={(e) => setTournPPV(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Launch Tournament & Fixtures</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BROWSE EXISTING TOURNAMENTS */}
          {activeTab === 'browse_tournaments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Select any active tournament to inspect brackets or launch its live fixtures:
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('tournament')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Tournament</span>
                </button>
              </div>

              <div className="space-y-3">
                {tournaments.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-code bg-slate-800 text-slate-300">
                          {SPORT_CONFIGS[t.sportId]?.icon} {SPORT_CONFIGS[t.sportId]?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {t.status}
                        </span>
                        <span className="text-[10px] font-mono-code text-slate-400">
                          {t.format.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-display font-bold text-white">
                        {t.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                        <span>📍 {t.location}</span>
                        <span>•</span>
                        <span>Prize: <strong className="text-emerald-400">{t.prizePool}</strong></span>
                        <span>•</span>
                        <span>{t.totalTeams} Teams</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectTournamentMatch) {
                            onSelectTournamentMatch(t.title);
                          }
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>Score Fixture</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
