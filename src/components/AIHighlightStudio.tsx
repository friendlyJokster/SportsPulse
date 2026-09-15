import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Camera, 
  Share2, 
  Sliders, 
  Radio, 
  Volume2, 
  VolumeX, 
  Check, 
  RefreshCw, 
  ShieldCheck,
  Maximize2,
  Smartphone,
  Tv,
  FastForward,
  Rewind
} from 'lucide-react';
import { Match, SportEvent, BroadcastOverlaySettings } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';
import { shareContent, triggerHaptic } from '../utils/nativeMobileServices';

interface AIHighlightStudioProps {
  currentMatch: Match;
  activeHighlightEvent: SportEvent | null;
  onClose?: () => void;
  onPostHighlightToFeed?: (clip: { title: string; commentary: string; event: SportEvent }) => void;
}

export const AIHighlightStudio: React.FC<AIHighlightStudioProps> = ({
  currentMatch,
  activeHighlightEvent,
  onPostHighlightToFeed
}) => {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [isPortraitMode, setIsPortraitMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playProgress, setPlayProgress] = useState(65); // 0 to 100% of the 30s buffer
  const [slowMo, setSlowMo] = useState(false);
  const [cameraAngle, setCameraAngle] = useState<'broadcast' | 'behind_goal' | 'player_cam'>('broadcast');
  const [audioMuted, setAudioMuted] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Available highlight events from current match
  const highlightEvents = currentMatch.events.filter(e => e.highlightWorthy);
  const allClips = highlightEvents.length > 0 ? highlightEvents : currentMatch.events;

  // Selected event
  const eventToHighlight = allClips[selectedEventIndex] || activeHighlightEvent || currentMatch.events[0] || {
    id: 'ev_demo',
    matchId: currentMatch.id,
    timestamp: new Date().toISOString(),
    gameTime: '68:24',
    period: 2,
    type: 'GOAL',
    label: 'Spectacular Goal ⚽',
    teamId: currentMatch.teamA.id,
    playerName: currentMatch.teamA.players[0]?.name || 'Star Player',
    pointDelta: 1,
    highlightWorthy: true
  };

  // AI Narrative state
  const [aiHeadline, setAiHeadline] = useState(
    eventToHighlight.aiNarrative?.headline || `CLUTCH PLAY: ${eventToHighlight.playerName?.toUpperCase()} DELIVERS!`
  );
  const [aiCommentary, setAiCommentary] = useState(
    eventToHighlight.aiNarrative?.commentary || `Sensational execution at ${eventToHighlight.gameTime}! The bench erupts as the momentum completely shifts!`
  );
  const [aiTactical, setAiTactical] = useState(
    eventToHighlight.aiNarrative?.tacticalAnalysis || `Exploited structural space in the secondary zone to execute with pinpoint clinical precision.`
  );

  // Update headlines when clip switches
  useEffect(() => {
    setAiHeadline(eventToHighlight.aiNarrative?.headline || `HIGHLIGHT: ${eventToHighlight.label} at ${eventToHighlight.gameTime}!`);
    setAiCommentary(eventToHighlight.aiNarrative?.commentary || `Incredible sequence delivered by ${eventToHighlight.playerName || 'Athlete'}!`);
    setAiTactical(eventToHighlight.aiNarrative?.tacticalAnalysis || `Decisive momentum-turning event for ${currentMatch.tournamentName}.`);
  }, [selectedEventIndex, eventToHighlight]);

  // Overlay Settings for Mobile Broadcaster
  const [overlaySettings, setOverlaySettings] = useState<BroadcastOverlaySettings>({
    showScorebug: true,
    showLowerThird: true,
    showSponsorBug: true,
    showLatencyStats: true,
    activeSponsor: currentMatch.sponsor.name,
    overlayTheme: 'dark-cyber'
  });

  // Simulated playback progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      const step = slowMo ? 0.3 : 0.8;
      interval = setInterval(() => {
        setPlayProgress((prev) => (prev >= 100 ? 0 : prev + step));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slowMo]);

  // Double tap forward / backward
  const handleSeek = (delta: number) => {
    triggerHaptic('light');
    setPlayProgress(prev => Math.min(100, Math.max(0, prev + delta)));
  };

  // Native Android Share Sheet Trigger
  const handleNativeShare = async (platform?: string) => {
    triggerHaptic('medium');
    const shareText = `🔥 Watch this insane clip! ${aiHeadline}\n${eventToHighlight.playerName} scored in ${currentMatch.teamA.shortName} vs ${currentMatch.teamB.shortName} at ${currentMatch.tournamentName}.\n#SportPulse #${currentMatch.sportId}`;
    
    await shareContent({
      title: aiHeadline,
      text: shareText,
      url: window.location.href,
      dialogTitle: platform ? `Share to ${platform}` : 'Share SportPulse AI Clip'
    });
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  // Request fresh AI Broadcast commentary from Express API
  const handleRegenerateCommentary = async () => {
    triggerHaptic('medium');
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: currentMatch.sportId,
          eventType: eventToHighlight.label,
          team: eventToHighlight.teamId === currentMatch.teamA.id ? currentMatch.teamA.name : currentMatch.teamB.name,
          player: eventToHighlight.playerName || 'Athlete',
          matchTime: eventToHighlight.gameTime,
          score: `${currentMatch.teamA.score} - ${currentMatch.teamB.score}`,
          context: `${currentMatch.tournamentName} at ${currentMatch.venue}`
        })
      });

      const json = await response.json();
      if (json && json.data) {
        setAiHeadline(json.data.headline);
        setAiCommentary(json.data.commentary);
        setAiTactical(json.data.tacticalAnalysis);
      }
    } catch (err) {
      console.warn('AI Commentary API fallback:', err);
      setAiHeadline(`SENSATIONAL MOMENT: ${eventToHighlight.playerName} ROCKS THE ARENA!`);
      setAiCommentary(`Incredible sequence at ${eventToHighlight.gameTime}! An electrifying display of grassroots athletic brilliance!`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePublishToFeed = () => {
    triggerHaptic('heavy');
    if (onPostHighlightToFeed) {
      onPostHighlightToFeed({
        title: aiHeadline,
        commentary: aiCommentary,
        event: eventToHighlight
      });
    }
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info & Clip Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Automated Replay Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 font-mono-code">
                Buffer: -30.0s to +5.0s
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-bold text-white mt-1">
              AI Video Highlights & Mobile Reels Studio
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* 16:9 vs 9:16 Portrait Reel Mode Switch */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  triggerHaptic('selection');
                  setIsPortraitMode(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !isPortraitMode ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
                title="16:9 Landscape Video"
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">16:9</span>
              </button>
              <button
                onClick={() => {
                  triggerHaptic('selection');
                  setIsPortraitMode(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isPortraitMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400'
                }`}
                title="9:16 Portrait Reel / Shorts / TikTok"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>9:16 Reel</span>
              </button>
            </div>

            <button
              id="btn-regen-commentary"
              onClick={handleRegenerateCommentary}
              disabled={isGeneratingAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isGeneratingAI ? 'Synthesizing...' : 'Regen Call'}</span>
            </button>
          </div>
        </div>

        {/* Highlight Clips Reel Selector Carousel */}
        {allClips.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono-code text-slate-400 block mb-1.5">
              AUTO-GENERATED MATCH REELS ({allClips.length} CLIPS):
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {allClips.map((clip, idx) => (
                <button
                  key={clip.id || idx}
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedEventIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                    idx === selectedEventIndex
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-mono-code text-[10px] text-slate-500">#{idx + 1}</span>
                  <span>{clip.label}</span>
                  <span className="text-[10px] font-mono-code text-slate-400">({clip.gameTime})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Column Studio: Video Canvas Left, Overlay Controls & AI Narrative Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Canvas Player with Real Broadcast Overlay */}
        <div className={`lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
          isPortraitMode ? 'max-w-sm mx-auto' : ''
        }`}>
          {/* Replay Screen Simulator */}
          <div className={`relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden select-none dark-surface video-canvas ${
            isPortraitMode ? 'aspect-[9/16] min-h-[500px]' : 'aspect-video'
          }`}>
            {/* Double Tap Seek Overlays: Left for Rewind, Right for Forward */}
            <div 
              onClick={() => handleSeek(-10)} 
              className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-black/40 to-transparent"
              title="Double tap to rewind 5s"
            >
              <div className="bg-slate-900/80 p-2 rounded-full border border-slate-700 text-white flex items-center gap-1 text-xs">
                <Rewind className="w-4 h-4" />
                <span>-5s</span>
              </div>
            </div>
            <div 
              onClick={() => handleSeek(10)} 
              className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-l from-black/40 to-transparent"
              title="Double tap to forward 5s"
            >
              <div className="bg-slate-900/80 p-2 rounded-full border border-slate-700 text-white flex items-center gap-1 text-xs">
                <span>+5s</span>
                <FastForward className="w-4 h-4" />
              </div>
            </div>
            {/* Dynamic Pitch / Court Backdrop Representation */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {currentMatch.sportId === 'football' && (
                <div className="w-full h-full border-4 border-white/20 m-auto flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-2 border-white/20"></div>
                  <div className="absolute inset-x-0 top-1/2 border-t-2 border-white/20"></div>
                </div>
              )}
              {currentMatch.sportId === 'tennis' && (
                <div className="w-full h-full border-4 border-amber-500/20 m-auto flex items-center justify-center">
                  <div className="w-full border-t-2 border-white/30"></div>
                  <div className="h-full border-l-2 border-white/30"></div>
                </div>
              )}
              {currentMatch.sportId === 'mma' && (
                <div className="w-48 h-48 border-4 border-rose-500/30 rotate-45 m-auto flex items-center justify-center">
                  <span className="text-[10px] text-rose-500/40 uppercase tracking-widest font-mono-code font-bold">OCTAGON CANVAS</span>
                </div>
              )}
            </div>

            {/* Simulated Animated Action Visualizer */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/10 mb-3 animate-bounce">
                {SPORT_CONFIGS[currentMatch.sportId].icon}
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono-code text-emerald-400 border border-emerald-500/20 mb-2">
                Simulated 1080p60 Stream • Angle: {cameraAngle.toUpperCase()}
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide">
                {eventToHighlight.label}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Timestamp: {eventToHighlight.gameTime} • {eventToHighlight.playerName}
              </p>
            </div>

            {/* LIVE STREAM OVERLAY HUD LAYER (The Mobile Streamer Feature) */}
            {overlaySettings.showScorebug && (
              <div className="absolute top-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3.5 py-2 shadow-2xl flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 font-mono-code">LIVE</span>
                </div>
                <div className="h-4 w-px bg-slate-800"></div>
                <div className="flex items-center gap-2 font-display text-xs font-bold text-white">
                  <span>{currentMatch.teamA.shortName}</span>
                  <span className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded text-sm">
                    {currentMatch.teamA.score}
                  </span>
                  <span className="text-slate-500">-</span>
                  <span className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded text-sm">
                    {currentMatch.teamB.score}
                  </span>
                  <span>{currentMatch.teamB.shortName}</span>
                </div>
                <div className="h-4 w-px bg-slate-800"></div>
                <span className="text-[11px] font-mono-code text-slate-300 font-semibold">
                  {eventToHighlight.gameTime}
                </span>
              </div>
            )}

            {/* Sponsor Watermark Overlay Bug */}
            {overlaySettings.showSponsorBug && (
              <div className="absolute top-4 right-4 z-20 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-mono-code text-slate-300 flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">SPONSORED BY:</span>
                <span className="text-white font-bold">{overlaySettings.activeSponsor}</span>
              </div>
            )}

            {/* Lower-Third AI Broadcast Ticker Popup */}
            {overlaySettings.showLowerThird && (
              <div className="absolute bottom-16 inset-x-4 z-20 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-md border border-emerald-500/40 rounded-xl p-3 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs font-display shrink-0">
                    AI
                  </div>
                  <div>
                    <div className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider font-bold">
                      {aiHeadline}
                    </div>
                    <div className="text-xs text-white font-medium line-clamp-1">
                      {aiCommentary}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-[10px] font-mono-code text-slate-400 text-right">
                  Auto-Clipped @ {eventToHighlight.gameTime}
                </div>
              </div>
            )}

            {/* Latency Stats Bug */}
            {overlaySettings.showLatencyStats && (
              <div className="absolute bottom-4 right-4 z-20 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono-code text-emerald-400">
                Overlay Ingress: 184ms • Bitrate: 4500 kbps
              </div>
            )}
          </div>

          {/* Replay Scrubbing & Controls Bar */}
          <div className="bg-slate-900 border-t border-slate-800 p-4 space-y-3">
            {/* 30s Buffer Scrubber */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span>-30.0s (Live Buffer)</span>
                <span className="text-emerald-400 font-bold">
                  {((playProgress / 100) * 30).toFixed(1)}s / 30.0s Replay
                </span>
                <span className="text-amber-400 font-bold">Event Trigger Point ⚡</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={playProgress}
                onChange={(e) => setPlayProgress(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Playback Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  id="btn-play-pause-replay"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  id="btn-reset-replay"
                  onClick={() => setPlayProgress(0)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Rewind to -30s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  id="btn-toggle-slowmo"
                  onClick={() => setSlowMo(!slowMo)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono-code font-bold transition-all ${
                    slowMo
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {slowMo ? '0.5x Slow-Mo ON' : '1.0x Normal Speed'}
                </button>
                <button
                  id="btn-toggle-mute"
                  onClick={() => setAudioMuted(!audioMuted)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Camera Angle Toggle */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  id="cam-broadcast"
                  onClick={() => setCameraAngle('broadcast')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    cameraAngle === 'broadcast'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Main Cam
                </button>
                <button
                  id="cam-behind-goal"
                  onClick={() => setCameraAngle('behind_goal')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    cameraAngle === 'behind_goal'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  End-Zone
                </button>
                <button
                  id="cam-player-cam"
                  onClick={() => setCameraAngle('player_cam')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    cameraAngle === 'player_cam'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Athlete Cam
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Commentary Breakdown & Broadcaster Overlay Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* AI Narrative Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Automated Commentary Card</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono-code font-bold">
                Gemini 2.5 Flash
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono-code text-[11px] block mb-1">
                  BROADCAST HEADLINE:
                </span>
                <p className="font-bold text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {aiHeadline}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-mono-code text-[11px] block mb-1">
                  PLAY-BY-PLAY CALL:
                </span>
                <p className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800 leading-relaxed italic">
                  "{aiCommentary}"
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-mono-code text-[11px] block mb-1">
                  TACTICAL BREAKDOWN:
                </span>
                <p className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                  {aiTactical}
                </p>
              </div>
            </div>

            {/* Social Media Export Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono-code text-slate-400 block font-semibold">
                INSTANT SOCIAL REEL EXPORT:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNativeShare('WhatsApp')}
                  className="py-2 px-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 hover:bg-emerald-900/60 text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>💬 WhatsApp</span>
                </button>
                <button
                  onClick={() => handleNativeShare('Instagram Reels')}
                  className="py-2 px-2.5 rounded-xl bg-pink-950/80 border border-pink-700/60 text-pink-400 hover:bg-pink-900/60 text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>📸 IG Reels</span>
                </button>
              </div>

              {/* Native System Share Sheet */}
              <button
                id="btn-native-share"
                onClick={() => handleNativeShare()}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{shareSuccess ? 'Shared Successfully!' : 'Open Device Share Sheet'}</span>
              </button>
            </div>

            {/* Community Feed Publish Button */}
            <button
              id="btn-publish-highlight-feed"
              onClick={handlePublishToFeed}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-98"
            >
              {publishedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Published to Community Feed!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Highlight to Community Feed</span>
                </>
              )}
            </button>
          </div>

          {/* Broadcaster Overlay Config (Mobile-First Tool) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Mobile Broadcaster Overlay HUD</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono-code">
                Live Broadcast Kit
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Live Scorebug Overlay</span>
                <input
                  type="checkbox"
                  checked={overlaySettings.showScorebug}
                  onChange={(e) => setOverlaySettings({ ...overlaySettings, showScorebug: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Lower-Third AI Event Popups</span>
                <input
                  type="checkbox"
                  checked={overlaySettings.showLowerThird}
                  onChange={(e) => setOverlaySettings({ ...overlaySettings, showLowerThird: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Sponsor Watermark Bug</span>
                <input
                  type="checkbox"
                  checked={overlaySettings.showSponsorBug}
                  onChange={(e) => setOverlaySettings({ ...overlaySettings, showSponsorBug: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Low-Latency Telemetry (Real-time &lt;300ms)</span>
                <input
                  type="checkbox"
                  checked={overlaySettings.showLatencyStats}
                  onChange={(e) => setOverlaySettings({ ...overlaySettings, showLatencyStats: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
              </label>

              {/* Sponsor Switcher */}
              <div className="pt-2">
                <span className="text-[11px] font-mono-code text-slate-400 block mb-1">
                  ACTIVE STREAM SPONSOR:
                </span>
                <select
                  id="select-stream-sponsor"
                  value={overlaySettings.activeSponsor}
                  onChange={(e) => setOverlaySettings({ ...overlaySettings, activeSponsor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Nike NextGen Athletes">Nike NextGen Athletes</option>
                  <option value="Red Bull Grassroots Speed">Red Bull Grassroots Speed</option>
                  <option value="Gatorade Performance Lab">Gatorade Performance Lab</option>
                  <option value="Wilson Blade Pro Series">Wilson Blade Pro Series</option>
                  <option value="Monster Combat Octagon">Monster Combat Octagon</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
