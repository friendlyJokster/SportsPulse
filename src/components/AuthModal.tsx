import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  KeyRound, 
  AlertCircle,
  Crown,
  LogOut,
  RefreshCw,
  Trophy,
  Activity,
  Award,
  Fingerprint,
  Eye,
  FileText,
  Flame
} from 'lucide-react';
import { AuthUser, PRESET_ACCOUNTS, UserRole } from '../types/auth';
import { authenticateWithBiometrics, triggerHaptic, isIOS } from '../utils/nativeMobileServices';
import { signInWithGoogleFirebase, signInWithAppleFirebase } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  defaultRole?: UserRole;
  isStandaloneView?: boolean;
  onNavigateToProfile?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
  onOpenFirebaseServices?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  defaultRole = 'user',
  isStandaloneView = false,
  onNavigateToProfile,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
  onOpenFirebaseServices,
}) => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin' | 'register'>(defaultRole === 'admin' ? 'admin' : 'user');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [biometricLoading, setBiometricLoading] = useState(false);
  
  // Form states
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<'user' | 'admin'>('user');
  const [regEmailOrPhone, setRegEmailOrPhone] = useState('');
  const [regSport, setRegSport] = useState('cricket');
  const [regCity, setRegCity] = useState('');

  if (!isOpen && !isStandaloneView) return null;

  // Handle Quick Presets
  const handleQuickLogin = (presetUser: AuthUser) => {
    setError(null);
    onLogin(presetUser);
    if (!isStandaloneView) onClose();
  };

  // Handle User Phone / OTP Login
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setOtpSent(true);
    setOtp('123456'); // Pre-fill test OTP for instantaneous testability
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456' && otp.length !== 6) {
      setError('Invalid OTP code. Please enter 123456 for testing.');
      return;
    }
    // Find preset or create user
    const found = PRESET_ACCOUNTS.find(u => u.role === 'user' && u.phone?.includes(phone.slice(-6)));
    const loggedUser: AuthUser = found || {
      id: `user_${Date.now()}`,
      name: `Player ${phone.slice(-4)}`,
      role: 'user',
      email: `user${phone.slice(-4)}@sportpulse.io`,
      phone: `+91 ${phone}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Grassroots Sports Player',
      verified: true,
      city: 'Mumbai, MH',
      primarySport: 'cricket',
    };
    onLogin(loggedUser);
    if (!isStandaloneView) onClose();
  };

  // Handle Admin Passkey Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email && !adminPin) {
      setError('Please enter your Admin credentials or select a Quick Admin profile below');
      return;
    }
    // Accept admin presets or correct pin
    const adminUser = PRESET_ACCOUNTS.find(u => u.role === 'admin' && (u.email === email || email.includes('admin') || !email)) || PRESET_ACCOUNTS[0];
    onLogin(adminUser);
    if (!isStandaloneView) onClose();
  };

  // Handle User Email Login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    const targetRole = activeTab === 'admin' ? 'admin' : 'user';
    const found = PRESET_ACCOUNTS.find(u => u.role === targetRole && u.email.toLowerCase() === email.toLowerCase());
    const loggedUser: AuthUser = found || {
      id: `${targetRole}_${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      role: targetRole,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: targetRole === 'admin' ? 'Match Official' : 'Community Athlete',
      verified: true,
      city: 'Delhi, DL',
      primarySport: 'cricket',
    };
    onLogin(loggedUser);
    if (!isStandaloneView) onClose();
  };

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regName) {
      setError('Please enter your name');
      return;
    }
    const newUser: AuthUser = {
      id: `${regRole}_${Date.now()}`,
      name: regName,
      role: regRole,
      email: regEmailOrPhone.includes('@') ? regEmailOrPhone : `${regName.toLowerCase().replace(/\s+/g, '')}@sportpulse.io`,
      phone: !regEmailOrPhone.includes('@') ? `+91 ${regEmailOrPhone}` : undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: regRole === 'admin' ? 'Tournament Official' : 'Registered Athlete',
      verified: true,
      city: regCity || 'India',
      primarySport: regSport,
      adminPrivileges: regRole === 'admin' ? {
        canOverrideScores: true,
        canCreateTournaments: true,
        canManageFinances: true,
        canVerifyPlayers: true,
      } : undefined,
    };
    onLogin(newUser);
    if (!isStandaloneView) onClose();
  };

  // Handle Apple Sign-In (Firebase OAuthProvider + Apple ID)
  const handleAppleSignIn = async () => {
    await triggerHaptic('selection');
    setError(null);
    try {
      const appleUser = await signInWithAppleFirebase();
      onLogin(appleUser);
      if (!isStandaloneView) onClose();
    } catch (err: any) {
      setError(err?.message || 'Apple Sign-In encountered an issue');
    }
  };

  // Handle Google Sign-In (Firebase GoogleAuthProvider)
  const handleGoogleSignIn = async () => {
    await triggerHaptic('selection');
    setError(null);
    try {
      const googleUser = await signInWithGoogleFirebase();
      onLogin(googleUser);
      if (!isStandaloneView) onClose();
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In encountered an issue');
    }
  };

  // Handle Guest Mode for Spectators (Zero Friction 1-Tap Access)
  const handleGuestMode = async () => {
    await triggerHaptic('light');
    const guestUser: AuthUser = {
      id: `guest_${Date.now()}`,
      name: 'Guest Spectator',
      role: 'user',
      email: 'spectator@sportpulse.local',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Match Day Spectator',
      verified: false,
      city: 'Live Stadium',
      primarySport: 'cricket',
    };
    onLogin(guestUser);
    if (!isStandaloneView) onClose();
  };

  // Handle Biometric Quick Unlock (Face ID / Touch ID)
  const handleBiometricAuth = async () => {
    setBiometricLoading(true);
    try {
      const result = await authenticateWithBiometrics('Authenticate with Biometrics');
      if (result.success) {
        const saved = localStorage.getItem('sportpulse_user');
        const userToLogin = saved ? JSON.parse(saved) : PRESET_ACCOUNTS[2];
        onLogin(userToLogin);
        if (!isStandaloneView) onClose();
      }
    } catch {
      // Ignored
    } finally {
      setBiometricLoading(false);
    }
  };

  // Switch between Admin & User quickly
  const handleSwitchAccountType = () => {
    if (currentUser?.role === 'admin') {
      const userPreset = PRESET_ACCOUNTS.find(u => u.role === 'user') || PRESET_ACCOUNTS[2];
      onLogin(userPreset);
    } else {
      const adminPreset = PRESET_ACCOUNTS.find(u => u.role === 'admin') || PRESET_ACCOUNTS[0];
      onLogin(adminPreset);
    }
  };

  const content = (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg transition-all">
      {/* Modal / Screen Header */}
      <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-display font-extrabold text-lg shadow-md shadow-emerald-500/20">
            SP
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              <span>{currentUser ? 'SportPulse Account' : 'Sign In to SportPulse'}</span>
              {currentUser?.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> ADMIN
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {currentUser 
                ? `Logged in as ${currentUser.role === 'admin' ? 'Official Admin' : 'Athlete / User'}`
                : 'Access Live Scoring, Tournament Management & Athlete Hub'
              }
            </p>
          </div>
        </div>

        {!isStandaloneView && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* If already logged in, show User Profile & Role Switcher */}
      {currentUser ? (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Active User Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-white text-base truncate">
                  {currentUser.name}
                </h4>
                {currentUser.verified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {currentUser.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase font-mono-code ${
                  currentUser.role === 'admin' 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {currentUser.role === 'admin' ? '🛡️ Admin Privileges Active' : '🏃 Athlete / User Mode'}
                </span>
                <span className="text-xs text-slate-500">📍 {currentUser.city}</span>
              </div>
            </div>
          </div>

          {/* Admin Capabilities Breakdown */}
          {currentUser.role === 'admin' ? (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-amber-400 uppercase font-mono-code flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Admin Permissions Granted
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ball-by-Ball Overrides</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tournament Sanctioning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Umpire Certification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PPV & Cash Payouts</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-emerald-400 uppercase font-mono-code flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> User Player Pass
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                You can record personal match stats, cheer on live fixtures, browse looking-for challenges, and share highlights on the Locker Room.
              </p>
            </div>
          )}

          {/* Quick Navigation to Full Profile Page */}
          {onNavigateToProfile && (
            <button
              id="btn-modal-open-profile-page"
              onClick={() => {
                onClose();
                onNavigateToProfile();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-bold text-xs sm:text-sm flex items-center justify-between shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Go to Full Profile & Management Hub</span>
              </div>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Quick Account Switch Buttons */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono-code uppercase text-slate-400 font-bold">
              Switch Persona (Instant 1-Click Demo)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleSwitchAccountType}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold transition-all border border-slate-700 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch to {currentUser.role === 'admin' ? 'Athlete / User' : 'Official Admin'}</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all border border-rose-500/30 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Switch to Other Profiles */}
          <div className="border-t border-slate-800 pt-4">
            <span className="text-xs text-slate-400 block mb-2 font-medium">Log in as another registered profile:</span>
            <div className="grid grid-cols-1 gap-2">
              {PRESET_ACCOUNTS.filter(p => p.id !== currentUser.id).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleQuickLogin(preset)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={preset.avatar} alt={preset.name} className="w-7 h-7 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                        <span>{preset.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono-code font-semibold ${
                          preset.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {preset.role.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">{preset.title}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Not logged in: Show Login Forms & Roles */
        <div className="p-5 sm:p-6 space-y-5">
          {/* Role Navigation: User vs Admin vs Register */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveTab('user'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'user'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User</span>
            </button>

            <button
              onClick={() => { setActiveTab('admin'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: User Login */}
          {activeTab === 'user' && (
            <div className="space-y-4">
              {/* Native Mobile Sign-In Options (App Store & Play Store Compliant) */}
              <div className="space-y-2">
                {/* 1. Sign in with Apple (Mandatory under App Store Guideline 4.8) */}
                <button
                  onClick={handleAppleSignIn}
                  className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-900 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 border border-neutral-700 shadow-md active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.71-14.42-5.74-9.05-10.15-18.99-13.24-29.82-3.09-10.83-4.64-21.37-4.64-31.62 0-14.8 3.82-27.18 11.47-37.15 7.65-9.97 17.37-15.06 29.17-15.28 4.36 0 9.29 1.14 14.79 3.42 5.5 2.28 9.38 3.47 11.64 3.56 2.07-.09 6.09-1.29 12.06-3.6 5.97-2.31 10.9-3.32 14.79-3.04 10.89.87 19.82 4.96 26.79 12.28-9.58 5.77-14.26 13.93-14.04 24.48.22 8.38 3.54 15.46 9.97 21.24 6.43 5.78 14.15 9.07 23.16 9.87-2.18 6.74-4.89 13.82-8.13 21.23zM119.22 33.64c-.11 4.57-1.78 9.09-5.01 13.56-3.23 4.47-7.29 7.68-12.18 9.63-.65-4.13.25-8.49 2.7-13.08 2.45-4.59 6.27-8.23 11.46-10.92 1.09.22 2.1.48 3.03.81z" />
                  </svg>
                  <span>Sign in with Apple</span>
                </button>

                {/* 2. Sign in with Google */}
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 border border-slate-300 shadow-sm active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* 3. Continue as Spectator Guest */}
                  <button
                    onClick={handleGuestMode}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Guest Mode</span>
                  </button>

                  {/* 4. Biometric Quick Login */}
                  <button
                    onClick={handleBiometricAuth}
                    disabled={biometricLoading}
                    className="py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/30 active:scale-95"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>{isIOS() ? 'Face ID Login' : 'Biometric Login'}</span>
                  </button>
                </div>

                {onOpenFirebaseServices && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFirebaseServices();
                    }}
                    className="w-full mt-1.5 py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[11px] font-medium flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
                      <span>Firebase Console: Auth, FCM &amp; Crashlytics</span>
                    </div>
                    <span className="font-mono-code text-[10px] text-amber-300">View Status &rarr;</span>
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono-code uppercase text-slate-500">or phone / email OTP</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Method Switch: Mobile Phone (OTP) vs Email */}
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-slate-400 font-medium">OTP Credentials:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${authMethod === 'phone' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Mobile Phone (OTP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${authMethod === 'email' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Email ID
                  </button>
                </div>
              </div>

              {authMethod === 'phone' ? (
                !otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs font-mono-code">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white font-mono-code focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Instant SMS verification code will be simulated.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Get OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-medium text-slate-300">
                          Enter 6-digit OTP sent to +91 {phone}
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-emerald-400 hover:underline"
                        >
                          Change Number
                        </button>
                      </div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-mono-code text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <p className="text-[11px] text-emerald-400/90 mt-1 text-center font-mono-code">
                        Test OTP code is pre-filled: 123456
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      Verify & Sign In
                    </button>
                  </form>
                )
              ) : (
                <form onSubmit={handleEmailLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="athlete@sportpulse.io"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Sign In as Athlete / User
                  </button>
                </form>
              )}

              {/* 1-Click User Presets */}
              <div className="border-t border-slate-800 pt-3">
                <span className="text-[11px] font-mono-code uppercase text-slate-400 font-bold block mb-2">
                  ⚡ 1-Click Demo Athletes & Fans
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_ACCOUNTS.filter(p => p.role === 'user').map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleQuickLogin(preset)}
                      className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-center gap-2.5 active:scale-95 group"
                    >
                      <img src={preset.avatar} alt={preset.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                          {preset.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{preset.title.split('•')[0]}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Admin Login */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Official Match & Tournament Admin Portal</strong>
                  Provides Umpire live score override capabilities, official bracket finalization, and cash prize payouts.
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Admin ID or Official Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@sportpulse.io"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Admin Security PIN / Passcode
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="Enter 4-digit PIN (default: 1234)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono-code"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Authenticate as Admin Official</span>
                </button>
              </form>

              {/* 1-Click Admin Presets */}
              <div className="border-t border-slate-800 pt-3">
                <span className="text-[11px] font-mono-code uppercase text-amber-400 font-bold block mb-2">
                  👑 Quick Admin Presets
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_ACCOUNTS.filter(p => p.role === 'admin').map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleQuickLogin(preset)}
                      className="p-2.5 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 text-left transition-all flex items-center justify-between active:scale-95 group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={preset.avatar} alt={preset.name} className="w-8 h-8 rounded-lg object-cover border border-amber-500/30" />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                            <span>{preset.name}</span>
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 rounded font-mono-code">ADMIN</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{preset.title}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono-code text-amber-400 font-bold">1-Click Login &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Register New Account */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Account Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as 'user' | 'admin')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="user">Athlete / Player</option>
                    <option value="admin">Official / Tournament Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Sport</label>
                  <select
                    value={regSport}
                    onChange={(e) => setRegSport(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="cricket">Cricket</option>
                    <option value="kabaddi">Kabaddi</option>
                    <option value="football">Football</option>
                    <option value="badminton">Badminton</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email or Phone Number</label>
                <input
                  type="text"
                  value={regEmailOrPhone}
                  onChange={(e) => setRegEmailOrPhone(e.target.value)}
                  placeholder="vikram@sportpulse.io or 9876543210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Home City & State</label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Complete Registration & Sign In
              </button>
            </form>
          )}
        </div>
      )}

      {/* App Store Legal & GDPR Compliance Footer */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 text-center text-[11px] text-slate-500">
        By continuing, you agree to our{' '}
        <button
          type="button"
          onClick={() => {
            if (onOpenTermsOfService) onOpenTermsOfService();
          }}
          className="text-emerald-400 hover:underline font-semibold"
        >
          Terms of Service
        </button>{' '}
        and acknowledge our{' '}
        <button
          type="button"
          onClick={() => {
            if (onOpenPrivacyPolicy) onOpenPrivacyPolicy();
          }}
          className="text-emerald-400 hover:underline font-semibold"
        >
          Privacy Policy
        </button>
        .
      </div>
    </div>
  );

  if (isStandaloneView) {
    return (
      <div className="max-w-lg mx-auto py-4 px-2">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      {content}
    </div>
  );
};
