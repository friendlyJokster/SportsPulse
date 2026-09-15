import React, { useState } from 'react';
import { 
  Trophy, 
  ShieldCheck, 
  Award, 
  Flame, 
  Video, 
  TrendingUp, 
  MapPin, 
  Star, 
  Activity, 
  Share2, 
  Check, 
  UserPlus, 
  Zap,
  Play,
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import { AthleteProfile, SportId } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';

interface AthleteProCardProps {
  athletes: AthleteProfile[];
  selectedAthleteId: string;
  onSelectAthlete: (athleteId: string) => void;
  onPlayHighlightClip?: (clipTitle: string) => void;
  onBackToPrevious?: () => void;
  previousTabName?: string;
}

export const AthleteProCard: React.FC<AthleteProCardProps> = ({
  athletes,
  selectedAthleteId,
  onSelectAthlete,
  onPlayHighlightClip,
  onBackToPrevious,
  previousTabName = 'Live Scoring'
}) => {
  const currentAthlete = athletes.find(a => a.id === selectedAthleteId) || athletes[0];
  const [activeMediaTab, setActiveMediaTab] = useState<'all' | 'highlight' | 'training'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // SVG Radar Polygon math
  const metrics = currentAthlete.radarMetrics;
  const radius = 70;
  const center = 90;
  const numSides = metrics.length;

  const points = metrics.map((m, i) => {
    const angle = (Math.PI * 2 / numSides) * i - Math.PI / 2;
    const valueFactor = m.value / 100;
    const x = center + radius * valueFactor * Math.cos(angle);
    const y = center + radius * valueFactor * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const filteredMedia = currentAthlete.mediaGallery.filter(m => {
    if (activeMediaTab === 'all') return true;
    return m.type === activeMediaTab;
  });

  const handleShareCard = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Return to Previous Page Navigation Bar */}
      {onBackToPrevious && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg backdrop-blur-md">
          <button
            id="btn-ath-back-to-previous"
            onClick={onBackToPrevious}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white font-medium text-xs sm:text-sm border border-slate-700 hover:border-slate-600 transition-all active:scale-95 shadow-sm"
            title={`Return to ${previousTabName}`}
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            <span>
              Back to <strong className="text-white font-bold">{previousTabName}</strong>
            </span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-code">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Athlete Pro-Card Showcase</span>
          </div>
        </div>
      )}

      {/* Athlete Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between overflow-x-auto gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono-code whitespace-nowrap">Select Athlete Pro-Card:</span>
          <div className="flex items-center gap-2">
            {athletes.map(ath => (
              <button
                key={ath.id}
                id={`btn-ath-${ath.id}`}
                onClick={() => onSelectAthlete(ath.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  ath.id === currentAthlete.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <img src={ath.avatar} alt={ath.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{ath.name}</span>
                <span className="text-xs">{SPORT_CONFIGS[ath.primarySport]?.icon}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          id="btn-share-procard"
          onClick={handleShareCard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium shrink-0"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Link Copied!' : 'Share Pro-Card'}</span>
        </button>
      </div>

      {/* Main Digital Pro-Card Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Holographic FIFA/NBA Style Pro-Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Decorative Corner Holographic Elements */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/20 via-teal-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-amber-500/15 via-purple-500/5 to-transparent rounded-tr-full pointer-events-none" />

          <div>
            {/* Header: Overall Rating & Sport Emblem */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-display font-extrabold text-emerald-400 tracking-tight">
                    {Math.round(currentAthlete.radarMetrics.reduce((acc, m) => acc + m.value, 0) / currentAthlete.radarMetrics.length)}
                  </span>
                  <span className="text-xs font-mono-code font-bold text-slate-400">OVR</span>
                </div>
                <span className="text-xs font-mono-code uppercase tracking-wider text-slate-300 font-bold">
                  {currentAthlete.role}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span>{SPORT_CONFIGS[currentAthlete.primarySport]?.icon}</span>
                  <span>{SPORT_CONFIGS[currentAthlete.primarySport]?.name.split(' ')[0]}</span>
                </span>
                {currentAthlete.verified && (
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" title="Verified Grassroots Athlete">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Athlete Photo & Identity */}
            <div className="flex flex-col items-center my-4">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-emerald-400/60 shadow-xl shadow-emerald-500/15 bg-slate-800">
                  <img
                    src={currentAthlete.avatar}
                    alt={currentAthlete.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {currentAthlete.jerseyNumber && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-slate-950 border border-emerald-500 text-emerald-400 font-display font-black text-sm flex items-center justify-center shadow-lg">
                    #{currentAthlete.jerseyNumber}
                  </div>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-3 text-center">
                {currentAthlete.name}
              </h2>
              {currentAthlete.nickname && (
                <span className="text-xs font-mono-code text-amber-400 font-semibold">
                  "{currentAthlete.nickname}"
                </span>
              )}
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{currentAthlete.location}</span>
                <span>•</span>
                <span className="text-slate-300 font-medium">{currentAthlete.team}</span>
              </p>
            </div>

            {/* Quick Stat Pill Ribbon */}
            <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-800/80">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block">Win Rate</span>
                <span className="text-base font-display font-bold text-emerald-400">
                  {currentAthlete.winRatePercent}%
                </span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block">Matches</span>
                <span className="text-base font-display font-bold text-white">
                  {currentAthlete.totalMatches}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block">MVPs 🏆</span>
                <span className="text-base font-display font-bold text-amber-400">
                  {currentAthlete.mvpAwards}
                </span>
              </div>
            </div>
          </div>

          {/* Connect / Scout Action */}
          <div className="pt-2 flex items-center gap-2">
            <button
              id="btn-follow-athlete"
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isFollowing
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{isFollowing ? 'Following Athlete' : 'Follow Pro-Card'}</span>
            </button>
            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono-code text-slate-400">
              Scout ID: #{currentAthlete.id.substring(4, 9)}
            </div>
          </div>
        </div>

        {/* Right Column: Live Aggregated Career Stats & Radar Chart & Media */}
        <div className="lg:col-span-7 space-y-6">
          {/* Radar Chart & Detailed Career Stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Aggregated Performance Metrics</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Auto-aggregated across every live match ever recorded in SportPulse.
                </p>
              </div>
              <span className="text-xs font-mono-code text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Tier: Grassroots Elite
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* SVG Radar Chart Visualizer */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <svg width="180" height="180" className="overflow-visible">
                  {/* Outer and Inner Reference Webs */}
                  <circle cx={center} cy={center} r={radius} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx={center} cy={center} r={radius * 0.66} fill="none" stroke="#1e293b" strokeWidth="1" />
                  <circle cx={center} cy={center} r={radius * 0.33} fill="none" stroke="#1e293b" strokeWidth="1" />

                  {/* Polygon shape */}
                  <polygon
                    points={points}
                    fill="rgba(16, 185, 129, 0.35)"
                    stroke="#10b981"
                    strokeWidth="2"
                  />

                  {/* Metric Vertex Dots & Labels */}
                  {metrics.map((m, i) => {
                    const angle = (Math.PI * 2 / numSides) * i - Math.PI / 2;
                    const valRadius = radius * (m.value / 100);
                    const x = center + valRadius * Math.cos(angle);
                    const y = center + valRadius * Math.sin(angle);
                    const labelX = center + (radius + 16) * Math.cos(angle);
                    const labelY = center + (radius + 16) * Math.sin(angle);

                    return (
                      <g key={m.label}>
                        <circle cx={x} cy={y} r="3.5" fill="#34d399" />
                        <text
                          x={labelX}
                          y={labelY + 3}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#94a3b8"
                          fontWeight="600"
                        >
                          {m.label} ({m.value})
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <span className="text-[10px] font-mono-code text-slate-500 mt-2">
                  5-Axis Grassroots Attribute Matrix
                </span>
              </div>

              {/* Career Stats Breakdown */}
              <div className="space-y-2.5">
                {Object.entries(currentAthlete.careerStats).map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-400 font-medium">{label}</span>
                    <span className="font-mono-code font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Media Gallery (Match Highlights & Training Drills) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>Media Gallery & Clips ({currentAthlete.mediaGallery.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Auto-clipped match highlights & verified training routines.
                </p>
              </div>

              {/* Media Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveMediaTab('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeMediaTab === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveMediaTab('highlight')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeMediaTab === 'highlight' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Highlights
                </button>
                <button
                  onClick={() => setActiveMediaTab('training')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeMediaTab === 'training' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Training
                </button>
              </div>
            </div>

            {/* Clips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredMedia.map((media) => (
                <div
                  key={media.id}
                  onClick={() => onPlayHighlightClip && onPlayHighlightClip(media.title)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl ${media.thumbnailColor} flex items-center justify-center text-slate-300 group-hover:text-emerald-400 shrink-0 border border-slate-800 transition-colors`}>
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-mono-code uppercase px-1.5 py-0.2 rounded font-bold ${
                        media.type === 'highlight' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {media.type}
                      </span>
                      <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mt-1">
                        {media.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>⏱️ {media.duration}</span>
                    <span>👁️ {media.views.toLocaleString()} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
