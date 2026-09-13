/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_MATCHES, 
  INITIAL_ATHLETES, 
  INITIAL_POSTS, 
  INITIAL_MARKETPLACE, 
  INITIAL_TOURNAMENTS 
} from './data/mockData';
import { Match, SportEvent, SportId, SocialPost, MarketplaceListing, Tournament } from './types/sport';
import { Navbar, ActiveTab } from './components/Navbar';
import { LiveScoringEngine } from './components/LiveScoringEngine';
import { AIHighlightStudio } from './components/AIHighlightStudio';
import { AthleteProCard } from './components/AthleteProCard';
import { SocialEcosystem } from './components/SocialEcosystem';
import { LookingForMarketplace } from './components/LookingForMarketplace';
import { MonetizationHub } from './components/MonetizationHub';
import { ArchitectureInspector } from './components/ArchitectureInspector';
import { CreateMatchOrTournamentModal } from './components/CreateMatchOrTournamentModal';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AccountPortal } from './components/AccountPortal';
import { AuthUser, PRESET_ACCOUNTS } from './types/auth';
import { Sparkles, X, ChevronRight } from 'lucide-react';

const TAB_NAMES: Record<ActiveTab, string> = {
  scoring: 'Live Scoring',
  highlights: 'AI Highlights',
  procard: 'Athlete Pro-Card',
  social: 'Locker Room Feed',
  marketplace: '"Looking For" Market',
  monetization: 'Monetization & PPV',
  architecture: 'Architecture Engine',
  account: 'Profile & Admin Portal',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scoring');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('scoring');
  const [selectedSport, setSelectedSport] = useState<SportId>('cricket');

  // Navigation handlers with history tracking
  const handleNavigateTab = (nextTab: ActiveTab) => {
    if (nextTab !== activeTab) {
      setPreviousTab(activeTab);
      setActiveTab(nextTab);
      try {
        window.history.pushState({ tab: nextTab }, '', `#${nextTab}`);
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToPrevious = () => {
    const target = previousTab && previousTab !== activeTab ? previousTab : 'scoring';
    setPreviousTab(activeTab);
    setActiveTab(target);
    try {
      window.history.pushState({ tab: target }, '', `#${target}`);
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser Back / Forward history synchronization
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as ActiveTab;
    if (hash && TAB_NAMES[hash]) {
      setActiveTab(hash);
      try {
        window.history.replaceState({ tab: hash }, '', `#${hash}`);
      } catch (e) {}
    } else {
      try {
        window.history.replaceState({ tab: 'scoring' }, '', '#scoring');
      } catch (e) {}
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab && TAB_NAMES[event.state.tab as ActiveTab]) {
        setActiveTab(event.state.tab as ActiveTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('sportpulse_theme') as 'dark' | 'light') || 'dark';
  });

  // User & Admin Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('sportpulse_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    // Default to Aarav Sharma (Verified User) so the app is instantly rich and ready to score
    return PRESET_ACCOUNTS[2];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('sportpulse_matches') || localStorage.getItem('sport_matches_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_MATCHES;
  });
  const [activeMatchId, setActiveMatchId] = useState<string>('match_cric_01');
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('sportpulse_tournaments') || localStorage.getItem('sport_tournaments_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_TOURNAMENTS;
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [athletes, setAthletes] = useState(INITIAL_ATHLETES);
  const [selectedAthleteId, setSelectedAthleteId] = useState('ath_aarav_sharma');
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('sportpulse_posts') || localStorage.getItem('sport_posts_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_POSTS;
  });
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(INITIAL_MARKETPLACE);
  const [activeHighlightEvent, setActiveHighlightEvent] = useState<SportEvent | null>(null);
  const [toastHighlight, setToastHighlight] = useState<SportEvent | null>(null);
  const [latencyMs, setLatencyMs] = useState(118);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sportpulse_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sportpulse_user');
    } catch (e) {}
  };

  // Sync theme with html class and localStorage
  useEffect(() => {
    localStorage.setItem('sportpulse_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync selectedSport to match if a match exists for that sport
  const handleSelectSport = (sport: SportId) => {
    setSelectedSport(sport);
    const foundMatch = matches.find(m => m.sportId === sport);
    if (foundMatch) {
      setActiveMatchId(foundMatch.id);
    }
    // Also select matching athlete
    const foundAth = athletes.find(a => a.primarySport === sport);
    if (foundAth) {
      setSelectedAthleteId(foundAth.id);
    }
  };

  // Find active match
  const currentMatch = matches.find(m => m.id === activeMatchId) || matches[0];

  // Update match handler
  const handleUpdateMatch = (updated: Match) => {
    const newMatches = matches.map(m => m.id === updated.id ? updated : m);
    setMatches(newMatches);
    localStorage.setItem('sportpulse_matches', JSON.stringify(newMatches));
  };

  // Add new match handler
  const handleCreateMatch = (newMatch: Match) => {
    const updated = [newMatch, ...matches];
    setMatches(updated);
    localStorage.setItem('sportpulse_matches', JSON.stringify(updated));
    setActiveMatchId(newMatch.id);
    setSelectedSport(newMatch.sportId);
    setActiveTab('scoring');
  };

  // Add new tournament handler
  const handleCreateTournament = (newTourn: Tournament) => {
    const updated = [newTourn, ...tournaments];
    setTournaments(updated);
    localStorage.setItem('sportpulse_tournaments', JSON.stringify(updated));
  };

  // Save posts on update
  const handleAddPost = (newPost: SocialPost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('sportpulse_posts', JSON.stringify(updated));
  };

  // Save marketplace listing
  const handleAddListing = (listing: MarketplaceListing) => {
    setMarketplaceListings([listing, ...marketplaceListings]);
  };

  // Highlight trigger handler
  const handleTriggerHighlight = (event: SportEvent) => {
    setActiveHighlightEvent(event);
    setToastHighlight(event);
    // Auto-hide toast after 8 seconds
    setTimeout(() => {
      setToastHighlight(prev => (prev?.id === event.id ? null : prev));
    }, 8000);
  };

  // Live match clock simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setMatches(prevMatches =>
        prevMatches.map(m => {
          if (m.status === 'LIVE' && m.clockRunning && m.sportId !== 'tennis' && m.sportId !== 'cricket') {
            return {
              ...m,
              clockSeconds: m.clockSeconds + 1
            };
          }
          return m;
        })
      );

      // Jitter latency slightly around 90-135ms to demonstrate real SSE stream
      setLatencyMs(Math.floor(95 + Math.random() * 35));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light-theme bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200`}>
      {/* Primary Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        selectedSport={selectedSport}
        setSelectedSport={handleSelectSport}
        latencyMs={latencyMs}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container Viewport (with mobile bottom nav clearance pb-24) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        {activeTab === 'scoring' && (
          <LiveScoringEngine
            currentMatch={currentMatch}
            onUpdateMatch={handleUpdateMatch}
            onTriggerHighlight={handleTriggerHighlight}
            allMatches={matches}
            onSelectMatch={(matchId) => {
              setActiveMatchId(matchId);
              const m = matches.find(match => match.id === matchId);
              if (m) setSelectedSport(m.sportId);
            }}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'highlights' && (
          <AIHighlightStudio
            currentMatch={currentMatch}
            activeHighlightEvent={activeHighlightEvent}
            onPostHighlightToFeed={(clip) => {
              const post: SocialPost = {
                id: 'post_' + Date.now(),
                author: currentMatch.teamA.players[0] || athletes[0],
                sport: currentMatch.sportId,
                pillar: 'HIGHLIGHT',
                title: clip.title,
                content: `${clip.commentary} — Auto-clipped replay generated by SportPulse AI.`,
                timestamp: 'Just now',
                cheersCount: 14,
                commentsCount: 2,
                sharesCount: 5,
                hasCheered: true,
                fanoutModel: 'PUSH_CELEB',
                moderationStatus: 'APPROVED'
              };
              handleAddPost(post);
              handleNavigateTab('social');
            }}
          />
        )}

        {activeTab === 'procard' && (
          <AthleteProCard
            athletes={athletes}
            selectedAthleteId={selectedAthleteId}
            onSelectAthlete={setSelectedAthleteId}
            onPlayHighlightClip={(title) => {
              handleNavigateTab('highlights');
            }}
            onBackToPrevious={handleBackToPrevious}
            previousTabName={TAB_NAMES[previousTab] || 'Previous Page'}
          />
        )}

        {activeTab === 'social' && (
          <SocialEcosystem
            posts={posts}
            onAddPost={handleAddPost}
            currentUser={athletes.find(a => a.id === selectedAthleteId) || athletes[0]}
          />
        )}

        {activeTab === 'marketplace' && (
          <LookingForMarketplace
            listings={marketplaceListings}
            onAddListing={handleAddListing}
          />
        )}

        {activeTab === 'monetization' && (
          <MonetizationHub
            athletes={athletes}
            selectedSport={selectedSport}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureInspector
            latencyMs={latencyMs}
          />
        )}

        {activeTab === 'account' && (
          <AccountPortal
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onSwitchUser={handleLogin}
            tournaments={tournaments}
            matches={matches}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onSelectMatch={(matchId) => {
              setActiveMatchId(matchId);
              const m = matches.find(match => match.id === matchId);
              if (m) setSelectedSport(m.sportId);
            }}
            onNavigateToScoring={() => handleNavigateTab('scoring')}
            onBackToPrevious={handleBackToPrevious}
            previousTabName={TAB_NAMES[previousTab] || 'Previous Page'}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar (< md screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Create Match or Tournament Modal */}
      <CreateMatchOrTournamentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateMatch={handleCreateMatch}
        onCreateTournament={handleCreateTournament}
        tournaments={tournaments}
        defaultSport={selectedSport}
        onSelectTournamentMatch={(tournName) => {
          const match = matches.find(m => m.tournamentName.includes(tournName.split(' ')[0]));
          if (match) {
            setActiveMatchId(match.id);
            setSelectedSport(match.sportId);
            handleNavigateTab('scoring');
          }
        }}
      />

      {/* Auth Modal for Users and Admins */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentUser={currentUser}
        onNavigateToProfile={() => {
          handleNavigateTab('account');
          setIsAuthModalOpen(false);
        }}
      />

      {/* Live AI Highlight Clip Floating Notification Toast (raised on mobile to avoid bottom bar) */}
      {toastHighlight && (
        <div id="toast-highlight-banner" className="fixed bottom-20 md:bottom-5 right-4 left-4 sm:left-auto sm:max-w-sm sm:w-full z-50 bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-4 shadow-2xl animate-slide-up flex items-start justify-between gap-3 dark-surface floating-toast">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono-code font-bold uppercase text-amber-400">
                  AI Highlight Triggered
                </span>
                <span className="text-[10px] text-slate-400">• Replay Clipped</span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                {toastHighlight.label}
              </h4>
              <p className="text-[11px] text-slate-300">
                {toastHighlight.playerName || 'Key Player'} @ {toastHighlight.gameTime}
              </p>
              <button
                onClick={() => {
                  setActiveHighlightEvent(toastHighlight);
                  setActiveTab('highlights');
                  setToastHighlight(null);
                }}
                className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Launch Replay Player</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setToastHighlight(null)}
            className="text-slate-500 hover:text-slate-300 p-1 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono-code transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SportPulse • Multi-Sport Live Scoring &amp; Tournament Network</span>
          <span>Ultra-Low Latency &lt;300ms • Real-time Scoring &amp; Tournament Brackets</span>
        </div>
      </footer>
    </div>
  );
}
