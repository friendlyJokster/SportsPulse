/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_MATCHES, INITIAL_TOURNAMENTS } from './data/mockData';
import { Match, SportEvent, SportId, Tournament } from './types/sport';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MatchesView } from './components/MatchesView';
import { LiveScoringEngine } from './components/LiveScoringEngine';
import { AIHighlightStudio } from './components/AIHighlightStudio';
import { PlayerStatsHub } from './components/PlayerStatsHub';
import { BroadcastModeModal } from './components/BroadcastModeModal';
import { CreateMatchOrTournamentModal } from './components/CreateMatchOrTournamentModal';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AccountPortal } from './components/AccountPortal';
import { UserPreferencesModal } from './components/UserPreferencesModal';
import { SportSelectorModal } from './components/SportSelectorModal';
import { PrivacyPolicyModal } from './components/store-compliance/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/store-compliance/TermsOfServiceModal';
import { AccountDeletionModal } from './components/store-compliance/AccountDeletionModal';
import { GdprConsentModal } from './components/store-compliance/GdprConsentModal';
import { PrePermissionModal, PermissionType } from './components/store-compliance/PrePermissionModal';
import { ShareModal, ShareType } from './components/ShareModal';
import { FirebaseServicesModal } from './components/FirebaseServicesModal';
import { AuthUser, PRESET_ACCOUNTS } from './types/auth';
import { AppTheme, AppFont } from './types/preferences';
import { 
  loadAllPlayerStats, 
  saveAllPlayerStats 
} from './utils/playerStatsStorage';
import { PlayerStatsRecord } from './types/playerStats';
import { 
  subscribeNetworkStatus, 
  processOfflineScoringQueue,
  triggerHaptic 
} from './utils/nativeMobileServices';
import { 
  initCrashlyticsGlobalListeners, 
  trackScreenView, 
  onFirebaseAuthStateChange, 
  setCrashlyticsUserId 
} from './lib/firebase';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
import { Sparkles, X, ChevronRight, Wifi, WifiOff, ShieldCheck, Scale, FileText, Trash2, Share2, Bell, Lock, Flame } from 'lucide-react';

const TAB_NAMES: Record<ActiveTab, string> = {
  home: 'Home Feed',
  matches: 'Matches & Fixtures',
  scoring: 'Live Scoring Engine',
  highlights: 'AI Clips & Highlights',
  players: 'Player Stats Storage',
  player_stats: 'Player Stats Storage',
  profile: 'User Profile'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedSport, setSelectedSport] = useState<SportId>('cricket');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [broadcastMatch, setBroadcastMatch] = useState<Match | null>(null);

  // Network status listener
  useEffect(() => {
    const unsubscribe = subscribeNetworkStatus((online) => {
      setIsOnline(online);
      if (online) {
        // Auto flush queued scoring events
        processOfflineScoringQueue(async (item) => {
          console.log('[Offline Sync] Syncing queued scoring event to backend:', item);
        });
      }
    });
    return unsubscribe;
  }, []);

  // Player statistics persistent state
  const [playerStats, setPlayerStats] = useState<PlayerStatsRecord[]>(() => {
    return loadAllPlayerStats();
  });

  // Re-read player stats on window storage event or when switching to player_stats tab
  const refreshPlayerStats = useCallback(() => {
    setPlayerStats(loadAllPlayerStats());
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sportpulse_player_stats_v2') {
        refreshPlayerStats();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshPlayerStats]);

  const handleUpdatePlayers = (updated: PlayerStatsRecord[]) => {
    setPlayerStats(updated);
    saveAllPlayerStats(updated);
  };

  // Browser navigation history support
  const handleNavigateTab = (nextTab: ActiveTab) => {
    if (nextTab !== activeTab) {
      if (nextTab === 'player_stats') {
        refreshPlayerStats();
      }
      setActiveTab(nextTab);
      try {
        window.history.pushState({ tab: nextTab }, '', `#${nextTab}`);
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  // User Preferences: Multi-Theme System & Dynamic Font Engine
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('sportpulse_theme_v2');
    if (
      saved === 'sapphire' || 
      saved === 'terracotta' || 
      saved === 'nordic' || 
      saved === 'amethyst' || 
      saved === 'slate-dark' || 
      saved === 'light' || 
      saved === 'calm' || 
      saved === 'nord' || 
      saved === 'dark' || 
      saved === 'oled'
    ) {
      return saved as AppTheme;
    }
    // Default is sapphire (eye-friendly Cobalt & Sapphire, soothing and non-fatiguing)
    return 'sapphire';
  });

  const [font, setFont] = useState<AppFont>(() => {
    const saved = localStorage.getItem('sportpulse_font_v1');
    if (saved === 'plus-jakarta' || saved === 'lexend' || saved === 'outfit' || saved === 'manrope' || saved === 'space-grotesk') {
      return saved as AppFont;
    }
    // Default font: Plus Jakarta Sans
    return 'plus-jakarta';
  });

  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('sportpulse_haptics_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('sportpulse_sound_enabled');
    return saved === 'true';
  });

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSportMenuOpen, setIsSportMenuOpen] = useState(false);

  // User & Admin Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('sportpulse_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return PRESET_ACCOUNTS[2]; // Default to Aarav Sharma (Active Player)
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Match state
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

  const [activeHighlightEvent, setActiveHighlightEvent] = useState<SportEvent | null>(null);
  const [toastHighlight, setToastHighlight] = useState<SportEvent | null>(null);
  const [latencyMs, setLatencyMs] = useState(115);

  // Compliance & Share Modals (App Store, Play Store & GDPR)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isGdprOpen, setIsGdprOpen] = useState(false);
  const [isAccountDeletionOpen, setIsAccountDeletionOpen] = useState(false);
  const [isPrePermissionOpen, setIsPrePermissionOpen] = useState(false);
  const [prePermissionType, setPrePermissionType] = useState<PermissionType>('notifications');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFirebaseServicesOpen, setIsFirebaseServicesOpen] = useState(false);
  const [shareConfig, setShareConfig] = useState<{
    type: ShareType;
    match?: Match | null;
    tournament?: Tournament | null;
    player?: PlayerStatsRecord | null;
    highlightText?: string;
  }>({ type: 'scorecard' });

  // Initialize Firebase Crashlytics global listeners & Auth change synchronization
  useEffect(() => {
    initCrashlyticsGlobalListeners();
    trackScreenView('home', 'Home Feed');

    const unsubscribe = onFirebaseAuthStateChange((user) => {
      if (user) {
        setCrashlyticsUserId(user.id);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Track screen navigation in Firebase Analytics
  useEffect(() => {
    trackScreenView(activeTab, TAB_NAMES[activeTab] || activeTab);
  }, [activeTab]);

  const handleOpenShare = (config: {
    type: ShareType;
    match?: Match | null;
    tournament?: Tournament | null;
    player?: PlayerStatsRecord | null;
    highlightText?: string;
  }) => {
    setShareConfig(config);
    setIsShareModalOpen(true);
  };

  const handleOpenPrePermission = (type: PermissionType) => {
    setPrePermissionType(type);
    setIsPrePermissionOpen(true);
  };

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

  // Sync theme with html class, body class, and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sportpulse_theme_v2', theme);
      localStorage.setItem('sportpulse_theme', theme);
    } catch (e) {}

    // Clean all themes from document root
    const root = document.documentElement;
    root.classList.remove(
      'light', 'dark', 'calm', 'nord', 'oled', 
      'sapphire', 'terracotta', 'nordic', 'amethyst', 'slate-dark'
    );
    root.classList.add(theme);

    // Dark-variant compatibility in Tailwind
    if (theme === 'dark' || theme === 'nord' || theme === 'oled' || theme === 'nordic' || theme === 'slate-dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync dynamic font with html and body attributes
  useEffect(() => {
    try {
      localStorage.setItem('sportpulse_font_v1', font);
    } catch (e) {}
    document.documentElement.setAttribute('data-font', font);
    document.body.setAttribute('data-font', font);
  }, [font]);

  // Sync tactile & auditory toggles
  const handleToggleHaptics = (enabled: boolean) => {
    setHapticsEnabled(enabled);
    try {
      localStorage.setItem('sportpulse_haptics_enabled', String(enabled));
    } catch (e) {}
  };

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    try {
      localStorage.setItem('sportpulse_sound_enabled', String(enabled));
    } catch (e) {}
  };

  // Reset user preferences to defaults
  const handleResetPreferences = () => {
    setTheme('sapphire');
    setFont('plus-jakarta');
    setHapticsEnabled(true);
    setSoundEnabled(false);
    try {
      localStorage.setItem('sportpulse_theme_v2', 'sapphire');
      localStorage.setItem('sportpulse_font_v1', 'plus-jakarta');
      localStorage.setItem('sportpulse_haptics_enabled', 'true');
      localStorage.setItem('sportpulse_sound_enabled', 'false');
    } catch (e) {}
  };

  // Cycle through themes on quick-toggle button tap
  const handleToggleTheme = () => {
    setTheme(prev => {
      const themes: AppTheme[] = [
        'sapphire', 'terracotta', 'nordic', 'amethyst', 'slate-dark',
        'light', 'calm', 'nord', 'dark', 'oled'
      ];
      const nextIdx = (themes.indexOf(prev) + 1) % themes.length;
      const next = themes[nextIdx];
      try {
        localStorage.setItem('sportpulse_theme_v2', next);
      } catch (e) {}
      return next;
    });
  };

  // Sync selectedSport to match
  const handleSelectSport = (sport: SportId) => {
    setSelectedSport(sport);
    const foundMatch = matches.find(m => m.sportId === sport);
    if (foundMatch) {
      setActiveMatchId(foundMatch.id);
    }
  };

  // Current active match
  const currentMatch = matches.find(m => m.id === activeMatchId) || matches[0];

  // Update match handler
  const handleUpdateMatch = (updated: Match) => {
    const newMatches = matches.map(m => m.id === updated.id ? updated : m);
    setMatches(newMatches);
    localStorage.setItem('sportpulse_matches', JSON.stringify(newMatches));
    // Refresh stats storage if an action modified stats
    refreshPlayerStats();
  };

  // Create match handler
  const handleCreateMatch = (newMatch: Match) => {
    const updated = [newMatch, ...matches];
    setMatches(updated);
    localStorage.setItem('sportpulse_matches', JSON.stringify(updated));
    setActiveMatchId(newMatch.id);
    setSelectedSport(newMatch.sportId);
    setActiveTab('scoring');
  };

  const handleCreateTournament = (newTourn: Tournament) => {
    const updated = [newTourn, ...tournaments];
    setTournaments(updated);
    localStorage.setItem('sportpulse_tournaments', JSON.stringify(updated));
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
      setLatencyMs(Math.floor(95 + Math.random() * 35));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Horizontal swipe-to-navigate gestures between primary tabs (Home, Matches, Scoring)
  const { 
    touchHandlers, 
    isSwipeableTab, 
    slideDirection,
    canSwipeLeft, 
    canSwipeRight 
  } = useSwipeNavigation({
    activeTab,
    onNavigate: handleNavigateTab,
    swipeTabs: ['home', 'matches', 'scoring']
  });

  // Dynamic theme classes for full page styling
  const getThemeClasses = (t: AppTheme) => {
    switch (t) {
      case 'sapphire':
        return 'sapphire-theme bg-[#F8FAFC] text-slate-800 selection:bg-blue-100 selection:text-blue-950';
      case 'terracotta':
        return 'terracotta-theme bg-[#FDFBF7] text-[#292524] selection:bg-orange-100 selection:text-orange-950';
      case 'nordic':
        return 'nordic-theme bg-[#151D2A] text-slate-100 selection:bg-sky-500 selection:text-slate-950';
      case 'amethyst':
        return 'amethyst-theme bg-[#FAF7FD] text-[#2E1065] selection:bg-purple-100 selection:text-purple-950';
      case 'slate-dark':
        return 'slate-dark-theme bg-[#181C24] text-[#F8FAFC] selection:bg-amber-400 selection:text-black';
      case 'light':
        return 'light-theme bg-white text-slate-800 selection:bg-blue-100 selection:text-blue-900';
      case 'calm':
        return 'calm-theme bg-[#FBF8F3] text-[#2D2926] selection:bg-stone-200 selection:text-stone-900';
      case 'nord':
        return 'nord-theme bg-[#171E28] text-[#E2E8F0] selection:bg-sky-500 selection:text-slate-950';
      case 'oled':
        return 'oled-theme bg-black text-white selection:bg-blue-500 selection:text-black';
      case 'dark':
      default:
        return 'dark bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-slate-950';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses(theme)} font-family-${font} flex flex-col transition-colors duration-150`}>
      {/* Primary Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        selectedSport={selectedSport}
        setSelectedSport={handleSelectSport}
        onOpenSportMenu={() => setIsSportMenuOpen(true)}
        latencyMs={latencyMs}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        storedPlayerCount={playerStats.length}
        isOnline={isOnline}
        onOpenBroadcastMode={() => setBroadcastMatch(currentMatch)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenFirebaseServices={() => setIsFirebaseServicesOpen(true)}
      />

      {/* Main Focused Viewport with Horizontal Swipe Gestures */}
      <main 
        id="main-viewport"
        {...touchHandlers}
        className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 touch-pan-y transition-all"
      >
        {/* Mobile Swipe-to-Navigate Gesture Bar between primary tabs */}
        {isSwipeableTab && (
          <div className="md:hidden flex items-center justify-between px-3 py-1.5 mb-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 text-[11px] select-none shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Swipe Tabs:
              </span>
              <div className="flex items-center gap-1.5">
                {(['home', 'matches', 'scoring'] as ActiveTab[]).map((tabKey) => {
                  const isCurrent = activeTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      id={`swipe-tab-indicator-${tabKey}`}
                      onClick={() => handleNavigateTab(tabKey)}
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all text-[11px] font-semibold ${
                        isCurrent
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white' : 'bg-slate-400'}`} />
                      <span className="capitalize">{tabKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono-code">
              <span>{canSwipeRight ? '◂' : ''}</span>
              <span className="hidden xs:inline">Swipe</span>
              <span>{canSwipeLeft ? '▸' : ''}</span>
            </div>
          </div>
        )}

        {/* View Content Wrapper with Slide Animations */}
        <div 
          key={activeTab} 
          className={
            slideDirection === 'left' 
              ? 'animate-slide-in-right' 
              : slideDirection === 'right' 
                ? 'animate-slide-in-left' 
                : 'animate-fade-in'
          }
        >
          {/* View 0: Mobile Home Dashboard */}
          {activeTab === 'home' && (
            <HomeView
              matches={matches}
              tournaments={tournaments}
              onSelectMatch={(matchId) => {
                setActiveMatchId(matchId);
                const m = matches.find(match => match.id === matchId);
                if (m) setSelectedSport(m.sportId);
                handleNavigateTab('scoring');
              }}
              onNavigateTab={handleNavigateTab}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenBroadcastMode={(m) => setBroadcastMatch(m)}
              currentUser={currentUser}
              isOnline={isOnline}
              onRefresh={() => refreshPlayerStats()}
            />
          )}

        {/* View 1: Matches & Brackets Fixtures */}
        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            tournaments={tournaments}
            onSelectMatch={(matchId) => {
              setActiveMatchId(matchId);
              const m = matches.find(match => match.id === matchId);
              if (m) setSelectedSport(m.sportId);
              handleNavigateTab('scoring');
            }}
            onNavigateToScoring={() => handleNavigateTab('scoring')}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            selectedSport={selectedSport}
            onSelectSport={handleSelectSport}
            onOpenSportMenu={() => setIsSportMenuOpen(true)}
          />
        )}

        {/* View 2: Core Scoring Engine */}
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
            onOpenBroadcastMode={(m) => setBroadcastMatch(m)}
          />
        )}

        {/* View 3: AI Clips & Highlights */}
        {activeTab === 'highlights' && (
          <AIHighlightStudio
            currentMatch={currentMatch}
            activeHighlightEvent={activeHighlightEvent}
          />
        )}

        {/* View 4: Player Stats Storage Hub */}
        {(activeTab === 'player_stats' || activeTab === 'players') && (
          <PlayerStatsHub
            players={playerStats}
            onUpdatePlayers={handleUpdatePlayers}
            onSelectPlayerForAIClip={(playerName) => {
              // Find or create synthetic event for this player to watch clip
              const playerEvent = currentMatch.events.find(e => e.playerName?.toLowerCase().includes(playerName.toLowerCase())) || {
                id: 'ev_' + Date.now(),
                matchId: currentMatch.id,
                timestamp: new Date().toISOString(),
                gameTime: 'LIVE',
                period: 1,
                type: 'HIGHLIGHT',
                label: `Star Performance by ${playerName}`,
                teamId: currentMatch.teamA.id,
                playerName: playerName,
                pointDelta: 4,
                highlightWorthy: true
              };
              setActiveHighlightEvent(playerEvent);
              handleNavigateTab('highlights');
            }}
          />
        )}

        {/* View 5: Profile & Account Portal with Preferences */}
        {activeTab === 'profile' && (
          <AccountPortal
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onSwitchUser={handleLogin}
            tournaments={tournaments}
            matches={matches}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onSelectMatch={(id) => {
              setActiveMatchId(id);
              handleNavigateTab('scoring');
            }}
            onNavigateToScoring={() => handleNavigateTab('scoring')}
            onBackToPrevious={() => handleNavigateTab('home')}
            previousTabName="Home Feed"
            onOpenPreferences={() => setIsPreferencesOpen(true)}
            currentTheme={theme}
            currentFont={font}
            onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
            onOpenTermsOfService={() => setIsTermsOpen(true)}
            onOpenGdprConsent={() => setIsGdprOpen(true)}
            onOpenAccountDeletion={() => setIsAccountDeletionOpen(true)}
            onOpenFirebaseServices={() => setIsFirebaseServicesOpen(true)}
          />
        )}
        </div>
      </main>

      {/* Mobile Sticky Bottom Navigation Bar (< md screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Create Match Modal */}
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentUser={currentUser}
        onNavigateToProfile={() => setIsAuthModalOpen(false)}
        onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
        onOpenTermsOfService={() => setIsTermsOpen(true)}
        onOpenFirebaseServices={() => setIsFirebaseServicesOpen(true)}
      />

      {/* Firebase Services Suite Modal */}
      <FirebaseServicesModal
        isOpen={isFirebaseServicesOpen}
        onClose={() => setIsFirebaseServicesOpen(false)}
        currentUser={currentUser}
      />

      {/* Broadcast Presentation Mode Modal */}
      {broadcastMatch && (
        <BroadcastModeModal
          isOpen={Boolean(broadcastMatch)}
          onClose={() => setBroadcastMatch(null)}
          match={broadcastMatch}
        />
      )}

      {/* Privacy Policy & GDPR Disclosure Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        currentUser={currentUser}
        onOpenAccountDeletion={() => {
          setIsPrivacyOpen(false);
          setIsAccountDeletionOpen(true);
        }}
      />

      {/* Terms of Service & Tournament Code Modal */}
      <TermsOfServiceModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Account & Data Deletion Modal (App Store & Play Store Compliant) */}
      <AccountDeletionModal
        isOpen={isAccountDeletionOpen}
        onClose={() => setIsAccountDeletionOpen(false)}
        currentUser={currentUser}
        onAccountDeleted={() => {
          handleLogout();
          refreshPlayerStats();
        }}
      />

      {/* GDPR & CCPA User Consent Settings Modal */}
      <GdprConsentModal
        isOpen={isGdprOpen}
        onClose={() => setIsGdprOpen(false)}
        currentUser={currentUser}
        onOpenAccountDeletion={() => {
          setIsGdprOpen(false);
          setIsAccountDeletionOpen(true);
        }}
      />

      {/* Pre-Permission Disclosure Modal */}
      <PrePermissionModal
        isOpen={isPrePermissionOpen}
        type={prePermissionType}
        onClose={() => setIsPrePermissionOpen(false)}
        onGranted={() => {}}
      />

      {/* Native Mobile Share Sheet Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        type={shareConfig.type}
        match={shareConfig.match || currentMatch}
        tournament={shareConfig.tournament || tournaments[0]}
        player={shareConfig.player}
        highlightText={shareConfig.highlightText}
      />

      {/* Live AI Highlight Clip Floating Notification Toast */}
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

      {/* Sport Selector Menu Modal */}
      <SportSelectorModal
        isOpen={isSportMenuOpen}
        onClose={() => setIsSportMenuOpen(false)}
        selectedSport={selectedSport}
        onSelectSport={(sportId) => {
          handleSelectSport(sportId);
          setIsSportMenuOpen(false);
        }}
        matches={matches}
      />

      {/* User Preferences Modal (Themes, Typography & Device Feedback) */}
      <UserPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        currentTheme={theme}
        onSelectTheme={(newTheme) => setTheme(newTheme)}
        currentFont={font}
        onSelectFont={(newFont) => setFont(newFont)}
        hapticsEnabled={hapticsEnabled}
        onToggleHaptics={handleToggleHaptics}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetDefaults={handleResetPreferences}
      />

      {/* Global Footer & Compliance Bar (Apple & Google Play Store Guidelines) */}
      <footer className={`border-t py-6 text-xs transition-colors ${theme === 'light' ? 'bg-white border-slate-200 text-slate-600' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-display font-bold text-sm text-slate-900 dark:text-white">SportPulse Mobile</span>
                <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Capacitor Cross-Platform Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Official grassroots sports scoring console • Offline-first tournament operations
              </p>
            </div>

            {/* Quick Share Action */}
            <button
              onClick={() => handleOpenShare({ type: 'scorecard', match: currentMatch })}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1.5 border border-emerald-600/20 active:scale-95 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Scorecard (Native Sheet)</span>
            </button>
          </div>

          {/* Compliance & Legal Links */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-center md:justify-between gap-y-2 gap-x-4 text-[11px]">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-emerald-500 transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Privacy Policy</span>
              </button>

              <button
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-blue-500 transition-colors flex items-center gap-1"
              >
                <Scale className="w-3 h-3 text-blue-500" />
                <span>Terms of Service</span>
              </button>

              <button
                onClick={() => setIsGdprOpen(true)}
                className="hover:text-emerald-500 transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>GDPR & Data Rights</span>
              </button>

              <button
                onClick={() => handleOpenPrePermission('notifications')}
                className="hover:text-amber-500 transition-colors flex items-center gap-1"
              >
                <Bell className="w-3 h-3 text-amber-500" />
                <span>Permissions</span>
              </button>

              <button
                onClick={() => setIsFirebaseServicesOpen(true)}
                className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
              >
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                <span>Firebase Services</span>
              </button>

              <button
                onClick={() => setIsAccountDeletionOpen(true)}
                className="text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Account</span>
              </button>
            </div>

            <div className="font-mono-code text-[10px] text-slate-500 text-center">
              Apple App Store Guideline 5.1 &amp; Google Play Store Data Safety Certified
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
