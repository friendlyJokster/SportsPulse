import React from 'react';
import { 
  Home,
  Calendar,
  Zap, 
  Video, 
  Users, 
  Sun,
  Moon,
  Plus,
  User,
  Crown,
  Wifi,
  WifiOff,
  Tv,
  Sparkles,
  Sliders,
  Coffee,
  Compass,
  ChevronDown,
  Palette,
  Flame
} from 'lucide-react';
import { SportId } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';
import { AuthUser } from '../types/auth';
import { AppTheme } from '../types/preferences';
import { triggerHaptic } from '../utils/nativeMobileServices';

export type ActiveTab = 'home' | 'matches' | 'scoring' | 'highlights' | 'players' | 'profile' | 'player_stats';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedSport: SportId;
  setSelectedSport: (sport: SportId) => void;
  latencyMs: number;
  theme: AppTheme;
  onToggleTheme: () => void;
  onOpenCreateModal: () => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  storedPlayerCount?: number;
  isOnline?: boolean;
  onOpenBroadcastMode?: () => void;
  onOpenPreferences?: () => void;
  onOpenSportMenu?: () => void;
  onOpenFirebaseServices?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedSport,
  setSelectedSport,
  latencyMs,
  theme,
  onToggleTheme,
  onOpenCreateModal,
  currentUser,
  onOpenAuthModal,
  storedPlayerCount = 10,
  isOnline = true,
  onOpenBroadcastMode,
  onOpenPreferences,
  onOpenSportMenu,
  onOpenFirebaseServices,
}) => {
  const currentSportConfig = SPORT_CONFIGS[selectedSport] || SPORT_CONFIGS.cricket;
  const isLight = theme === 'light' || theme === 'calm' || theme === 'sapphire' || theme === 'terracotta' || theme === 'amethyst';

  const normalizedTab = activeTab === 'player_stats' ? 'players' : activeTab;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors safe-area-top ${
      isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-950/90 border-slate-800'
    }`}>
      {/* Top Brand & Telemetry Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-2 sm:gap-3">
          {/* Logo & Category Badge */}
          <div 
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('home');
            }}
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer group"
          >
            <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-display font-bold text-base sm:text-lg tracking-normal transition-all group-hover:scale-105 shadow-sm ${
              isLight ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white shadow-blue-500/20'
            }`}>
              SP
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`font-display font-bold text-lg sm:text-xl tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Sport<span className={isLight ? 'text-blue-600' : 'text-blue-400'}>Pulse</span>
                </span>
                <span className={`px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                  isLight
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                }`}>
                  v1.0.0
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs hidden md:block ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Live Scoring Console • Broadcast Suite
              </p>
            </div>
          </div>

          {/* Selected Sport on Top (Sports hidden from bar; only active sport shown with change menu) */}
          <div className="flex items-center">
            <button
              id="btn-active-sport-menu"
              onClick={() => {
                triggerHaptic('selection');
                if (onOpenSportMenu) {
                  onOpenSportMenu();
                }
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border transition-all active:scale-95 shadow-xs cursor-pointer ${
                isLight
                  ? 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-200 text-slate-900 ring-1 ring-blue-500/15'
                  : 'bg-blue-950/40 hover:bg-blue-900/50 border-blue-800/80 text-white ring-1 ring-blue-500/20'
              }`}
              title="Current Sport • Tap to select another sport"
            >
              <span className="text-lg sm:text-xl leading-none">{currentSportConfig.icon}</span>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold tracking-tight">
                    {currentSportConfig.name}
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-600 text-white font-mono-code">
                    Active
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 pl-1.5 border-l border-blue-200 dark:border-blue-800/80">
                <span className="hidden xs:inline">Menu</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Broadcast Mode Button */}
            {onOpenBroadcastMode && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onOpenBroadcastMode();
                }}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isLight 
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                    : 'border-indigo-800 bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900/60'
                }`}
                title="Open Broadcast Mode (HDMI / TV Cast)"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Broadcast</span>
              </button>
            )}

            {/* Prominent Start Match Button */}
            <button
              id="btn-create-match-tourn"
              onClick={() => {
                triggerHaptic('medium');
                onOpenCreateModal();
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-display font-semibold text-xs sm:text-sm active:scale-95 transition-all shadow-sm ${
                isLight
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Start Match</span>
              <span className="inline sm:hidden">+ Match</span>
            </button>

            {/* Profile Avatar / Login Button */}
            <button
              id="btn-nav-profile"
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab('profile');
              }}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isLight 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <div className="relative">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-blue-500"
                  />
                ) : (
                  <User className="w-4 h-4 text-blue-500" />
                )}
                {currentUser?.role === 'admin' && (
                  <Crown className="w-2.5 h-2.5 text-amber-400 absolute -top-1 -right-1" />
                )}
              </div>
              <span className="hidden md:inline font-semibold">
                {currentUser ? currentUser.name.split(' ')[0] : 'Profile'}
              </span>
            </button>

            {/* Theme Quick Toggle */}
            <button
              id="btn-toggle-theme"
              onClick={() => {
                triggerHaptic('light');
                onToggleTheme();
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title={`Active Theme: ${theme.toUpperCase()} (Tap to cycle themes)`}
            >
              <Palette className="w-4 h-4 text-blue-500" />
            </button>

            {/* Firebase Services Suite (Auth, FCM, Analytics, Crashlytics) */}
            {onOpenFirebaseServices && (
              <button
                id="btn-navbar-firebase-services"
                onClick={() => {
                  triggerHaptic('selection');
                  onOpenFirebaseServices();
                }}
                className={`px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                }`}
                title="Firebase Suite: Auth (Google/Apple), Push Notifications, Analytics & Crashlytics"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span className="hidden sm:inline font-mono-code font-bold text-xs">Firebase</span>
              </button>
            )}

            {/* User Preferences (Themes, Typography & Tactile) */}
            {onOpenPreferences && (
              <button
                id="btn-open-user-preferences"
                onClick={() => {
                  triggerHaptic('selection');
                  onOpenPreferences();
                }}
                className={`p-2 rounded-xl border transition-all active:scale-95 ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title="User Preferences (Change Fonts & Themes)"
              >
                <Sliders className="w-4 h-4 text-blue-500" />
              </button>
            )}

            {/* Online / Offline Sync Badge */}
            <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              {isOnline ? (
                <Wifi className="w-3 h-3 text-emerald-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-rose-500" />
              )}
              <span className="font-mono-code text-[11px] text-slate-500">
                {isOnline ? `${latencyMs}ms` : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Desktop & Tablet) */}
      <div className={`hidden md:block border-t transition-colors ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-900 bg-slate-950/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 overflow-x-auto py-2.5 no-scrollbar items-center">
            {/* 1. Home */}
            <button
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab('home');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                normalizedTab === 'home'
                  ? isLight ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs' : 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* 2. Matches & Brackets */}
            <button
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab('matches');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                normalizedTab === 'matches'
                  ? isLight ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs' : 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Matches &amp; Brackets</span>
            </button>

            {/* 3. Live Scoring */}
            <button
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab('scoring');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                normalizedTab === 'scoring'
                  ? isLight ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs' : 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Live Scoring Engine</span>
            </button>

            {/* 4. AI Clips */}
            <button
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab('highlights');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                normalizedTab === 'highlights'
                  ? isLight ? 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200 shadow-xs' : 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Video className="w-4 h-4 text-indigo-500" />
              <span>AI Clips &amp; Highlights</span>
            </button>

            {/* 5. Player Stats */}
            <button
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab('players');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                normalizedTab === 'players'
                  ? isLight ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs' : 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-blue-500" />
              <span>Player Stats ({storedPlayerCount})</span>
            </button>

            {/* 6. Profile */}
            <button
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab('profile');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                normalizedTab === 'profile'
                  ? isLight ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold' : 'bg-slate-800 text-white border border-slate-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile &amp; Settings</span>
            </button>

            {/* Switch Sport Button in Nav Bar */}
            {onOpenSportMenu && (
              <button
                id="nav-tab-switch-sport"
                onClick={() => {
                  triggerHaptic('selection');
                  onOpenSportMenu();
                }}
                className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer"
                title="Select Another Sport"
              >
                <span>{currentSportConfig.icon}</span>
                <span>Sports Menu</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
