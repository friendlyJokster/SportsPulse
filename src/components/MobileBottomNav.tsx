import React from 'react';
import { 
  Zap, 
  Video, 
  Plus, 
  Compass, 
  User, 
  Crown, 
  Menu, 
  Users, 
  DollarSign, 
  Cpu, 
  X,
  Layers
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { AuthUser } from '../types/auth';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: AuthUser | null;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
  isMoreMenuOpen: boolean;
  setIsMoreMenuOpen: (open: boolean) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenCreateModal,
  onOpenAuthModal,
  isMoreMenuOpen,
  setIsMoreMenuOpen,
}) => {
  return (
    <>
      {/* Expanded "More" Drawer for Mobile */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm md:hidden flex flex-col justify-end animate-fade-in"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-display font-bold text-white text-sm">More SportPulse Features</span>
              </div>
              <button 
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => { setActiveTab('procard'); setIsMoreMenuOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                  activeTab === 'procard' 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <Layers className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">Athlete Pro-Cards</span>
                <span className="text-[10px] text-slate-500">Radar & Scout Stats</span>
              </button>

              <button
                onClick={() => { setActiveTab('social'); setIsMoreMenuOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                  activeTab === 'social' 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold">Locker Room</span>
                <span className="text-[10px] text-slate-500">Social Fan-out & Feed</span>
              </button>

              <button
                onClick={() => { setActiveTab('monetization'); setIsMoreMenuOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                  activeTab === 'monetization' 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">PPV & Store</span>
                <span className="text-[10px] text-slate-500">UPI Passes & Kits</span>
              </button>

              <button
                onClick={() => { setActiveTab('architecture'); setIsMoreMenuOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                  activeTab === 'architecture' 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <Cpu className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold">Architecture</span>
                <span className="text-[10px] text-slate-500">Benchmarks & Redis</span>
              </button>
            </div>

            {/* Quick Login / Admin Profile Shortcut */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  if (currentUser) {
                    setActiveTab('account');
                  } else {
                    onOpenAuthModal();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>
                    {currentUser ? `Account Profile (${currentUser.name})` : 'Sign In as User / Admin'}
                  </span>
                </div>
                {currentUser?.role === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 font-mono-code">
                    ADMIN
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar on Mobile */}
      <nav 
        id="mobile-bottom-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 md:hidden px-2 pt-1 pb-safe transition-all shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="flex items-center justify-around h-14 max-w-md mx-auto">
          {/* 1. Live Scoring Tab */}
          <button
            id="mobile-nav-scoring"
            onClick={() => setActiveTab('scoring')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 ${
              activeTab === 'scoring'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Zap className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight">Scoring</span>
          </button>

          {/* 2. Highlights Tab */}
          <button
            id="mobile-nav-highlights"
            onClick={() => setActiveTab('highlights')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 ${
              activeTab === 'highlights'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">AI Clips</span>
          </button>

          {/* 3. Center Action: Start Match / Tournament Button */}
          <div className="flex-1 flex justify-center -mt-5">
            <button
              id="mobile-nav-create"
              onClick={onOpenCreateModal}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 active:scale-90 transition-transform border-2 border-slate-950"
              title="Start Match / Tournament"
              aria-label="Start Match or Tournament"
            >
              <Plus className="w-6 h-6 stroke-[2.8]" />
            </button>
          </div>

          {/* 4. Marketplace / Challenges Tab */}
          <button
            id="mobile-nav-market"
            onClick={() => setActiveTab('marketplace')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 ${
              activeTab === 'marketplace'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Market</span>
          </button>

          {/* 5. User / Admin Profile Button */}
          <button
            id="mobile-nav-auth"
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
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 ${
              activeTab === 'account'
                ? 'text-emerald-400 font-bold'
                : currentUser?.role === 'admin'
                ? 'text-amber-400 font-semibold'
                : currentUser
                ? 'text-slate-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className={`w-5 h-5 rounded-full object-cover ${activeTab === 'account' ? 'ring-2 ring-emerald-400' : 'border border-emerald-500/40'}`} 
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              {currentUser?.role === 'admin' && (
                <Crown className="w-2.5 h-2.5 text-amber-400 absolute -top-1 -right-1" />
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight">
              {currentUser ? (currentUser.role === 'admin' ? 'Admin' : 'Profile') : 'Login'}
            </span>
          </button>

          {/* 6. More Drawer Trigger */}
          <button
            id="mobile-nav-more"
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center px-1.5 h-full text-slate-500 hover:text-slate-300 transition-all active:scale-95"
            title="More Modules"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[9px] mt-1 font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
