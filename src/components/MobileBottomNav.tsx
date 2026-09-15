import React from 'react';
import { 
  Home,
  Calendar,
  Zap, 
  Video, 
  Users,
  User,
  Crown
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { AuthUser } from '../types/auth';
import { triggerHaptic } from '../utils/nativeMobileServices';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: AuthUser | null;
  onOpenCreateModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  currentUser
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'matches' as ActiveTab, label: 'Matches', icon: Calendar },
    { id: 'scoring' as ActiveTab, label: 'Scoring', icon: Zap, isLive: true },
    { id: 'highlights' as ActiveTab, label: 'Clips', icon: Video },
    { id: 'players' as ActiveTab, label: 'Players', icon: Users },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User, isProfile: true },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    triggerHaptic('selection');
    setActiveTab(tabId);
  };

  return (
    <nav 
      id="mobile-bottom-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/90 md:hidden px-2 pt-1 pb-safe transition-all shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] select-none"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {/* Material Design 3 Active Pill */}
              <div className={`relative px-3 py-1 rounded-full transition-all ${
                isActive ? 'bg-blue-500/15 dark:bg-blue-500/20' : ''
              }`}>
                {item.isProfile && currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-5 h-5 rounded-full object-cover border border-blue-500" 
                  />
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                )}

                {/* Pulse dot on Live Scoring */}
                {item.isLive && (
                  <>
                    <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </>
                )}

                {/* Admin Crown on Profile */}
                {item.isProfile && currentUser?.role === 'admin' && (
                  <Crown className="w-2.5 h-2.5 text-amber-400 absolute -top-0.5 -right-0.5" />
                )}
              </div>

              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
