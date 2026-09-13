import React from 'react';
import { 
  Zap, 
  Activity, 
  Video, 
  UserCheck, 
  Users, 
  Compass, 
  DollarSign, 
  Cpu, 
  Radio, 
  Flame,
  Sun,
  Moon,
  Plus,
  Trophy,
  User,
  Crown,
  Shield
} from 'lucide-react';
import { SportId } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';
import { AuthUser } from '../types/auth';

export type ActiveTab = 'scoring' | 'highlights' | 'procard' | 'social' | 'marketplace' | 'monetization' | 'architecture' | 'account';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedSport: SportId;
  setSelectedSport: (sport: SportId) => void;
  latencyMs: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCreateModal: () => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
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
  onOpenAuthModal
}) => {
  const currentSportConfig = SPORT_CONFIGS[selectedSport];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      {/* Top Brand & Telemetry Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Logo & Category Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20 font-display font-extrabold text-lg sm:text-xl tracking-wider">
              SP
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white">
                  Sport<span className="text-emerald-400">Pulse</span>
                </span>
                <span className="hidden xs:inline px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Multi-Sport
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden md:block">
                Cricket Ball-by-Ball, Kabaddi Raids & Multi-Sport Tournaments
              </p>
            </div>
          </div>

          {/* Sport Selector Carousel - Desktop & Tablet */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1 px-2 bg-slate-900/90 border border-slate-800 rounded-xl max-w-md">
            {(Object.keys(SPORT_CONFIGS) as SportId[]).map((sportKey) => {
              const cfg = SPORT_CONFIGS[sportKey];
              const isSelected = selectedSport === sportKey;
              return (
                <button
                  key={sportKey}
                  id={`sport-btn-${sportKey}`}
                  onClick={() => setSelectedSport(sportKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={`${cfg.name} (${cfg.category})`}
                >
                  <span className="text-sm">{cfg.icon}</span>
                  <span>{cfg.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Right Utilities: Create Button, User/Admin Profile, Theme Toggle, SSE Status */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Prominent Create Match / Tournament Button */}
            <button
              id="btn-create-match-tourn"
              onClick={onOpenCreateModal}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              title="Create a new live match fixture or grassroots tournament"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Start Match / Tournament</span>
              <span className="inline sm:hidden">+ Match</span>
            </button>

            {/* User / Admin Authentication & Profile Button */}
            <button
              id="btn-auth-profile"
              onClick={() => {
                if (currentUser) {
                  if (activeTab === 'account') {
                    onOpenAuthModal();
                  } else {
                    setActiveTab('account');
                  }
                } else {
                  onOpenAuthModal();
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 ${
                activeTab === 'account'
                  ? 'ring-2 ring-emerald-500 bg-slate-800 border-emerald-500/50 text-white'
                  : currentUser?.role === 'admin'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                  : currentUser
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
              }`}
              title={currentUser ? `Profile: ${currentUser.name} (${currentUser.role.toUpperCase()}) - Click to view profile` : 'Sign In as User or Admin'}
            >
              {currentUser ? (
                <>
                  <div className="relative">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-5 h-5 rounded-full object-cover" 
                    />
                    {currentUser.role === 'admin' && (
                      <Crown className="w-2.5 h-2.5 text-amber-400 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <span className="text-xs font-semibold max-w-[85px] sm:max-w-[110px] truncate hidden xs:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono-code font-bold uppercase hidden sm:inline ${
                    currentUser.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {currentUser.role}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Sign In</span>
                </>
              )}
            </button>

            {/* Light / Dark Theme Toggle Switch */}
            <button
              id="btn-theme-toggle"
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Real-time Telemetry Status */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-slate-400 font-mono-code text-[11px]">SSE:</span>
              <span className="text-emerald-400 font-mono-code font-bold text-[11px]">{latencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Sport Selector Strip */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-900 scrollbar-none">
          {(Object.keys(SPORT_CONFIGS) as SportId[]).map((sportKey) => {
            const cfg = SPORT_CONFIGS[sportKey];
            const isSelected = selectedSport === sportKey;
            return (
              <button
                key={sportKey}
                id={`mobile-sport-btn-${sportKey}`}
                onClick={() => setSelectedSport(sportKey)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
                }`}
              >
                <span className="text-xs">{cfg.icon}</span>
                <span>{cfg.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            <button
              id="tab-scoring"
              onClick={() => setActiveTab('scoring')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'scoring'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Live Scoring Engine</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono-code">
                {currentSportConfig.category.split('_')[0]}
              </span>
            </button>

            <button
              id="tab-highlights"
              onClick={() => setActiveTab('highlights')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'highlights'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>AI Highlights & Stream HUD</span>
            </button>

            <button
              id="tab-procard"
              onClick={() => setActiveTab('procard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'procard'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Athlete "Pro-Card"</span>
            </button>

            <button
              id="tab-social"
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'social'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Social Locker Room</span>
            </button>

            <button
              id="tab-marketplace"
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>"Looking For" Market</span>
            </button>

            <button
              id="tab-monetization"
              onClick={() => setActiveTab('monetization')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'monetization'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Monetization & Scouts</span>
            </button>

            <button
              id="tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Architecture & Engine</span>
            </button>

            {/* Account & Admin Tab */}
            <button
              id="tab-account"
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'account'
                  ? currentUser?.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {currentUser?.role === 'admin' ? (
                <Crown className="w-4 h-4 text-amber-400" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>{currentUser ? (currentUser.role === 'admin' ? 'Admin Portal' : 'User Account') : 'Sign In'}</span>
              {currentUser && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono-code font-bold uppercase ${
                  currentUser.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {currentUser.role}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
