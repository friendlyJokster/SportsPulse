import React, { useState } from 'react';
import { 
  Crown, 
  Shield, 
  User, 
  CheckCircle2, 
  LogOut, 
  Key, 
  Plus, 
  Trophy, 
  Layers, 
  Flame, 
  Settings, 
  Calendar, 
  Users, 
  Activity, 
  ShieldCheck,
  AlertCircle,
  FileText,
  ArrowLeft,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AuthUser, PRESET_ACCOUNTS } from '../types/auth';
import { Tournament, Match, SportId } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';

interface AccountPortalProps {
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onSwitchUser: (user: AuthUser) => void;
  tournaments: Tournament[];
  matches: Match[];
  onOpenCreateModal: () => void;
  onSelectMatch: (matchId: string) => void;
  onNavigateToScoring: () => void;
  onBackToPrevious?: () => void;
  previousTabName?: string;
}

export const AccountPortal: React.FC<AccountPortalProps> = ({
  currentUser,
  onOpenAuthModal,
  onLogout,
  onSwitchUser,
  tournaments,
  matches,
  onOpenCreateModal,
  onSelectMatch,
  onNavigateToScoring,
  onBackToPrevious,
  previousTabName = 'Live Scoring'
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'tournaments' | 'matches' | 'accounts' | 'audit'>('tournaments');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto space-y-5 py-4">
        {/* Return to Previous Page Option */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <button
            id="btn-portal-back-unauth"
            onClick={onBackToPrevious || onNavigateToScoring}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white font-medium text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 group shadow-sm"
            title={`Return to ${previousTabName}`}
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            <span>
              Back to <strong className="text-white font-bold">{previousTabName}</strong>
            </span>
          </button>
          <button
            onClick={onNavigateToScoring}
            className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live Scoring</span>
          </button>
        </div>

        <div className="py-10 px-4 sm:px-8 text-center bg-slate-900/70 border border-slate-800 rounded-3xl shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Sign In to SportPulse
          </h2>
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            Access your athlete profile, manage team rosters, or authenticate as an official Tournament Admin & Umpire.
          </p>
          <button
            id="btn-portal-login"
            onClick={onOpenAuthModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Open Login & Admin Authentication
          </button>

          {/* Quick Demo Switchers */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-3">Quick 1-Click Demo Profiles:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {PRESET_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onSwitchUser(acc)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 active:scale-95 transition-all"
                >
                  {acc.role === 'admin' ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <User className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{acc.name}</span>
                  <span className="text-[10px] uppercase font-mono-code text-slate-500">({acc.role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Return to Previous Page Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-back-to-previous"
            onClick={onBackToPrevious || onNavigateToScoring}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white font-medium text-xs sm:text-sm border border-slate-700 hover:border-slate-600 transition-all active:scale-95 shadow-sm"
            title={`Return to ${previousTabName}`}
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            <span>
              Back to <strong className="text-white font-bold">{previousTabName}</strong>
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-400 font-mono-code flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Profile Portal
          </span>
          <button
            id="btn-portal-quick-scoring"
            onClick={onNavigateToScoring}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-semibold border border-emerald-500/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live Scoring</span>
          </button>
        </div>
      </div>

      {/* Profile Header Banner */}
      <div className={`rounded-2xl p-5 sm:p-6 border shadow-2xl relative overflow-hidden ${
        isAdmin 
          ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/40' 
          : 'bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
              />
              {isAdmin && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                  <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                  {currentUser.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider border ${
                  isAdmin 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  {currentUser.role}
                </span>
                {currentUser.verified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" title="Verified Athlete / Admin" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                {currentUser.email} • {currentUser.phone || 'No phone linked'}
              </p>
              {currentUser.adminLevel && (
                <p className="text-xs text-amber-400 font-semibold mt-1">
                  Security Clearance: Level {currentUser.adminLevel} Chief Umpire
                </p>
              )}
            </div>
          </div>

          {/* Actions & Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Return Button in Header */}
            <button
              id="btn-portal-header-return"
              onClick={onBackToPrevious || onNavigateToScoring}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
              title={`Return to ${previousTabName}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Done (Back)</span>
            </button>
            <button
              id="btn-portal-switch-account"
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Switch / Sign In Other</span>
            </button>
            <button
              id="btn-portal-logout"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Quick Account Switch Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Switch Active Persona:</span>
          {PRESET_ACCOUNTS.map((acc) => {
            const isActive = currentUser.id === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => onSwitchUser(acc)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${
                  isActive 
                    ? 'bg-slate-700 text-white font-bold ring-1 ring-emerald-500'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {acc.role === 'admin' ? <Crown className="w-3 h-3 text-amber-400" /> : <User className="w-3 h-3 text-emerald-400" />}
                <span>{acc.name.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono-code">({acc.role})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Specific Console */}
      {isAdmin ? (
        <div className="space-y-6">
          {/* Sub Navigation Bar for Admin */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveAdminSubTab('tournaments')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeAdminSubTab === 'tournaments'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Tournament Management ({tournaments.length})
              </button>
              <button
                onClick={() => setActiveAdminSubTab('matches')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeAdminSubTab === 'matches'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Live Fixtures & Scoring Control ({matches.length})
              </button>
              <button
                onClick={() => setActiveAdminSubTab('audit')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeAdminSubTab === 'audit'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Official Umpire Audit Log
              </button>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-bold text-xs shadow-md active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create Tournament / Match</span>
            </button>
          </div>

          {/* Tab 1: Tournaments List */}
          {activeAdminSubTab === 'tournaments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournaments.map((t) => (
                <div key={t.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase bg-amber-500/20 text-amber-300">
                        {t.sportId} • {t.format}
                      </span>
                      <h3 className="text-base font-display font-bold text-white mt-1">
                        {t.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{t.startDate} - {t.endDate} • {t.location}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {t.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center font-mono-code">
                    <div className="bg-slate-950/60 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">TEAMS</span>
                      <span className="text-sm font-bold text-white">{t.teamsCount} Registered</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">ORGANIZER</span>
                      <span className="text-xs font-bold text-slate-300 truncate block">{t.organizer}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">PRIZE POOL</span>
                      <span className="text-xs font-bold text-amber-400">{t.prizePool || 'Trophies & Medals'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      Authorized Umpire: <strong className="text-slate-200">{currentUser.name}</strong>
                    </span>
                    <button
                      onClick={() => {
                        const match = matches.find(m => m.tournamentName.includes(t.name.split(' ')[0]));
                        if (match) {
                          onSelectMatch(match.id);
                          onNavigateToScoring();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      Manage Fixtures →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Live Matches Control */}
          {activeAdminSubTab === 'matches' && (
            <div className="space-y-3">
              {matches.map((m) => {
                const cfg = SPORT_CONFIGS[m.sportId];
                return (
                  <div 
                    key={m.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
                        {cfg.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono-code text-slate-400 uppercase font-bold">
                            {cfg.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 font-mono-code">
                            {m.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          {m.teamA.name} ({m.teamA.score}) vs {m.teamB.name} ({m.teamB.score})
                        </h4>
                        <p className="text-xs text-slate-400">
                          {m.tournamentName} • {m.venue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectMatch(m.id);
                          onNavigateToScoring();
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold active:scale-95 transition-all"
                      >
                        Launch Umpire Pad
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Official Audit Log */}
          {activeAdminSubTab === 'audit' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Authoritative Umpire & Referee Audit Ledger</span>
              </h3>
              <p className="text-xs text-slate-400">
                All scoring events, rule triggers, and result certifications are signed by Admin: {currentUser.name} (Clearance #{currentUser.id}).
              </p>

              <div className="space-y-2 mt-4 font-mono-code text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-slate-300">
                  <span>[CERTIFIED] Mumbai Premier T20 Cup: Fixture #m_cricket_01 Active with DRS verification</span>
                  <span className="text-[10px] text-slate-500">2 mins ago</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-slate-300">
                  <span>[AUDIT_PASS] All-India Kabaddi Championship: 30s raid timer synchronization calibrated</span>
                  <span className="text-[10px] text-slate-500">14 mins ago</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-slate-300">
                  <span>[SEC_TOKEN] Referee credentials verified for 4 concurrent fixtures</span>
                  <span className="text-[10px] text-slate-500">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Regular User / Athlete Dashboard */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Athlete Stats & Badges */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Athlete Career Record & Certifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">MATCHES</span>
                <span className="text-lg font-bold text-white">48</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">WIN RATIO</span>
                <span className="text-lg font-bold text-emerald-400">72.4%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">MVP AWARDS</span>
                <span className="text-lg font-bold text-amber-400">11</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">PRO RATING</span>
                <span className="text-lg font-bold text-purple-400">92/100</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Active Tournament Registrations
              </h4>
              <div className="space-y-2">
                {tournaments.slice(0, 2).map((tourn) => (
                  <div key={tourn.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{tourn.name}</span>
                      <p className="text-[11px] text-slate-400">{tourn.location} • Starts {tourn.startDate}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono-code font-bold">
                      CONFIRMED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Quick Actions</span>
            </h3>

            <button
              onClick={onOpenCreateModal}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register New Team / Match</span>
            </button>

            <button
              onClick={onOpenAuthModal}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs flex items-center justify-center gap-2 border border-amber-500/30 active:scale-95 transition-all"
            >
              <Crown className="w-4 h-4" />
              <span>Sign In as Admin Umpire</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">Grassroots Verified Profile:</span>
              <p>
                Your match performances are indexed in the SportPulse Scout database for talent discovery by state selectors.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
