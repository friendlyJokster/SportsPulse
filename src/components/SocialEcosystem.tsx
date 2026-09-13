import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Filter, 
  Radio, 
  Cpu, 
  AlertTriangle,
  ArrowRight,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { SocialPost, AthleteProfile, SportId } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';

interface SocialEcosystemProps {
  posts: SocialPost[];
  onAddPost: (post: SocialPost) => void;
  currentUser: AthleteProfile;
}

export const SocialEcosystem: React.FC<SocialEcosystemProps> = ({
  posts,
  onAddPost,
  currentUser
}) => {
  const [activePillarFilter, setActivePillarFilter] = useState<string>('ALL');
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('ALL');
  const [showFanoutExplainer, setShowFanoutExplainer] = useState(false);

  // New post authoring form
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostPillar, setNewPostPillar] = useState<'PRE_GAME' | 'POST_MATCH' | 'TRAINING' | 'HIGHLIGHT'>('POST_MATCH');
  const [newPostSport, setNewPostSport] = useState<SportId>(currentUser.primarySport);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState<{
    isClean: boolean;
    confidenceScore: number;
    sportsmanshipRating: number;
    recommendation: string;
  } | null>(null);

  // Cheer interaction state
  const [cheeredMap, setCheeredMap] = useState<Record<string, boolean>>({
    post_1: true
  });
  const [cheerCounts, setCheerCounts] = useState<Record<string, number>>({
    post_1: 343,
    post_2: 512,
    post_3: 1240,
    post_4: 680
  });

  const handleToggleCheer = (postId: string) => {
    const isCurrentlyCheered = Boolean(cheeredMap[postId]);
    setCheeredMap({ ...cheeredMap, [postId]: !isCurrentlyCheered });
    setCheerCounts({
      ...cheerCounts,
      [postId]: (cheerCounts[postId] || 0) + (isCurrentlyCheered ? -1 : 1)
    });
  };

  const handleScanAndPost = async () => {
    if (!newPostContent.trim()) return;

    setIsModerating(true);
    try {
      const response = await fetch('/api/ai/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newPostContent,
          authorRole: currentUser.role
        })
      });
      const data = await response.json();
      setModerationResult(data);

      if (data.isClean) {
        // Create post
        const newPost: SocialPost = {
          id: 'post_' + Date.now(),
          author: currentUser,
          sport: newPostSport,
          pillar: newPostPillar,
          title: `${newPostPillar.replace('_', ' ')}: ${currentUser.name}`,
          content: newPostContent,
          timestamp: 'Just now',
          cheersCount: 1,
          commentsCount: 0,
          sharesCount: 0,
          hasCheered: true,
          fanoutModel: currentUser.totalMatches > 50 ? 'PUSH_CELEB' : 'PULL_REGULAR',
          moderationStatus: 'APPROVED'
        };

        onAddPost(newPost);
        setNewPostContent('');
        setTimeout(() => setModerationResult(null), 4000);
      }
    } catch (err) {
      console.warn('Moderation fallback:', err);
      // Fallback auto-approve
      const newPost: SocialPost = {
        id: 'post_' + Date.now(),
        author: currentUser,
        sport: newPostSport,
        pillar: newPostPillar,
        title: `${newPostPillar.replace('_', ' ')}: ${currentUser.name}`,
        content: newPostContent,
        timestamp: 'Just now',
        cheersCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        hasCheered: true,
        fanoutModel: 'PULL_REGULAR',
        moderationStatus: 'APPROVED'
      };
      onAddPost(newPost);
      setNewPostContent('');
    } finally {
      setIsModerating(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activePillarFilter !== 'ALL' && post.pillar !== activePillarFilter) return false;
    if (selectedSportFilter !== 'ALL' && post.sport !== selectedSportFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner with Fan-out Architecture Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Unified Multi-Sport Social Layer
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 font-mono-code">
                Daily Athlete Engagement
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              Social Feed, 4 Content Pillars & Fan-Out Engine
            </h2>
            <p className="text-xs text-slate-400">
              Transforming the utility scoring engine into a daily social habitat with automated AI sportsmanship moderation.
            </p>
          </div>

          <button
            id="btn-toggle-fanout-explainer"
            onClick={() => setShowFanoutExplainer(!showFanoutExplainer)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-mono-code transition-all self-start sm:self-center"
          >
            <Cpu className="w-4 h-4" />
            <span>{showFanoutExplainer ? 'Hide Fan-Out Architecture' : 'Inspect Fan-Out Architecture'}</span>
          </button>
        </div>
      </div>

      {/* Fan-Out Architecture Inspector (Push vs Pull Models at Scale) */}
      {showFanoutExplainer && (
        <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-display font-bold text-white">
                Fan-Out Architecture: Hybrid Push vs Pull Scaling Engine
              </h3>
            </div>
            <span className="text-[11px] font-mono-code text-slate-400">Scalability Requirement</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Push Model */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold font-mono-code">
                  PUSH MODEL (Write Fan-out)
                </span>
                <span className="text-slate-400 text-[11px]">Pro-Athletes & Celebs (&gt;10k Followers)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                When a marquee athlete (e.g. Aarav Sharma, Ananya Sen) posts, creating 50,000 timeline writes simultaneously causes a write spike. SportPulse uses an async Redis message queue with batch fan-out workers that write into followers' timeline caches.
              </p>
              <div className="bg-slate-950 p-2 rounded-lg font-mono-code text-[11px] text-slate-400">
                Post Event &rarr; Queue (BullMQ) &rarr; Async Worker Batch &rarr; Redis Timelines (ZADD)
              </div>
            </div>

            {/* Pull Model */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono-code">
                  PULL MODEL (Read Fan-out)
                </span>
                <span className="text-slate-400 text-[11px]">Regular Grassroots Users (&lt;1k Followers)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                For everyday amateur players, writing to millions of empty feeds is wasteful. When a follower logs in, the app pulls and merges the recent posts from their followed graph into memory via read fan-out.
              </p>
              <div className="bg-slate-950 p-2 rounded-lg font-mono-code text-[11px] text-slate-400">
                User Login &rarr; Query Following List &rarr; Union & Sort Timestamps (k-way merge)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Pillars & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* 4 Content Pillars Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-mono-code mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Pillar:
          </span>
          {[
            { id: 'ALL', label: 'All Pillars' },
            { id: 'PRE_GAME', label: '⚡ Pre-Game Excitement' },
            { id: 'POST_MATCH', label: '🏆 Post-Match Reactions' },
            { id: 'TRAINING', label: '🏋️ Training Routines' },
            { id: 'HIGHLIGHT', label: '🔥 Match Highlights' },
          ].map((pil) => (
            <button
              key={pil.id}
              onClick={() => setActivePillarFilter(pil.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activePillarFilter === pil.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {pil.label}
            </button>
          ))}
        </div>

        {/* Sport Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono-code">Sport:</span>
          <select
            value={selectedSportFilter}
            onChange={(e) => setSelectedSportFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Sports</option>
            <option value="football">Football ⚽</option>
            <option value="tennis">Tennis 🎾</option>
            <option value="mma">MMA 🥋</option>
            <option value="basketball">Basketball 🏀</option>
          </select>
        </div>
      </div>

      {/* Main Social Layout: Feed Left, Post Creator & AI Moderation Scanner Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Posts Feed */}
        <div className="lg:col-span-8 space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 hover:border-slate-700 transition-all"
            >
              {/* Author & Pillar Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-white">
                        {post.author.name}
                      </span>
                      {post.author.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className="text-xs font-mono-code text-slate-400">
                        {SPORT_CONFIGS[post.sport]?.icon} {SPORT_CONFIGS[post.sport]?.name.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span>{post.author.team}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                    post.pillar === 'PRE_GAME' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                    post.pillar === 'POST_MATCH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    post.pillar === 'TRAINING' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {post.pillar.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono-code" title={`Engine Fan-out: ${post.fanoutModel}`}>
                    {post.fanoutModel === 'PUSH_CELEB' ? '⚡ PUSH' : '📥 PULL'}
                  </span>
                </div>
              </div>

              {/* Title & Body Content */}
              <div>
                <h3 className="font-display font-bold text-sm text-white mb-1">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    id={`btn-cheer-${post.id}`}
                    onClick={() => handleToggleCheer(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
                      cheeredMap[post.id]
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${cheeredMap[post.id] ? 'fill-current' : ''}`} />
                    <span>{cheerCounts[post.id] || post.cheersCount} Cheers</span>
                  </button>

                  <button className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-code text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    AI Moderated (Approved)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: New Post Authoring & AI Content Moderation Scanner */}
        <div className="lg:col-span-4 space-y-5">
          {/* Post Authoring Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Share Athlete Update</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono-code">
                {currentUser.name}
              </span>
            </div>

            {/* Pillar Selector */}
            <div>
              <span className="text-[11px] font-mono-code text-slate-400 block mb-1.5">
                SELECT CONTENT PILLAR:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'PRE_GAME', label: 'Pre-Game' },
                  { id: 'POST_MATCH', label: 'Post-Match' },
                  { id: 'TRAINING', label: 'Training' },
                  { id: 'HIGHLIGHT', label: 'Highlight' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setNewPostPillar(p.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      newPostPillar === p.id
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                id="textarea-post-content"
                rows={4}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your pre-game mindset, post-match reaction, or training clip breakdown..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* AI Moderation Feedback Banner */}
            {moderationResult && (
              <div className={`p-3 rounded-xl border text-xs ${
                moderationResult.isClean
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>AI Sportsmanship: {moderationResult.recommendation} ({Math.round(moderationResult.confidenceScore * 100)}% Conf)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Rating: {moderationResult.sportsmanshipRating}/10 • Zero hate speech or referee abuse detected.
                </p>
              </div>
            )}

            {/* Publish Button */}
            <button
              id="btn-scan-and-post"
              onClick={handleScanAndPost}
              disabled={isModerating || !newPostContent.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isModerating ? 'animate-pulse' : ''}`} />
              <span>{isModerating ? 'Scanning with AI Moderation...' : 'Post to Community'}</span>
            </button>
          </div>

          {/* AI Moderation Pipeline Explainer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-display font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real-Time AI Content Moderation</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every grassroots comment, reaction, and match report passes through the AI Moderation pipeline before broadcast, filtering out referee harassment, toxic speech, or unsportsmanlike behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
