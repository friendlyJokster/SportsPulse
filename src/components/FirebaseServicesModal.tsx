import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  ShieldCheck, 
  Bell, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  Trash2, 
  User, 
  Radio, 
  Activity, 
  Layers,
  Sparkles,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { 
  firebaseConfig,
  signInWithGoogleFirebase, 
  signInWithAppleFirebase, 
  signOutFirebase,
  requestFCMToken, 
  getCachedFCMToken, 
  triggerFCMPushAlert,
  logAnalyticsEvent, 
  getRecentAnalyticsEvents, 
  clearAnalyticsEvents,
  AnalyticsEventRecord,
  recordCrashlyticsError,
  logCrashlyticsMessage,
  getCrashlyticsReports,
  getCrashlyticsBreadcrumbs,
  clearCrashlyticsData,
  CrashlyticsReport,
  setCrashlyticsCustomKey
} from '../lib/firebase';
import { AuthUser } from '../types/auth';
import { triggerHaptic } from '../utils/nativeMobileServices';

interface FirebaseServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
}

export const FirebaseServicesModal: React.FC<FirebaseServicesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'fcm' | 'analytics' | 'crashlytics'>('auth');
  
  // Auth state
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  // FCM state
  const [fcmToken, setFcmToken] = useState<string | null>(getCachedFCMToken());
  const [fcmLoading, setFcmLoading] = useState(false);
  const [fcmStatus, setFcmStatus] = useState<string>('Ready');
  const [copiedToken, setCopiedToken] = useState(false);
  const [testPushTitle, setTestPushTitle] = useState('🏏 Wicket Falls! Over 14.2');
  const [testPushBody, setTestPushBody] = useState('Aarav Sharma caught at deep mid-wicket! Score: 112/4');

  // Analytics state
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEventRecord[]>([]);

  // Crashlytics state
  const [crashReports, setCrashReports] = useState<CrashlyticsReport[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<CrashlyticsReport | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, activeTab]);

  const refreshData = () => {
    setFcmToken(getCachedFCMToken());
    setAnalyticsEvents(getRecentAnalyticsEvents());
    setCrashReports(getCrashlyticsReports());
    setBreadcrumbs(getCrashlyticsBreadcrumbs());
  };

  if (!isOpen) return null;

  // 1. Firebase Auth Handlers
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthSuccessMessage(null);
    await triggerHaptic('selection');
    try {
      const user = await signInWithGoogleFirebase();
      onLogin(user);
      setAuthSuccessMessage(`Signed in as ${user.name} via Firebase Google Auth`);
      refreshData();
    } catch (e: any) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAuthLoading(true);
    setAuthSuccessMessage(null);
    await triggerHaptic('selection');
    try {
      const user = await signInWithAppleFirebase();
      onLogin(user);
      setAuthSuccessMessage(`Signed in as ${user.name} via Firebase Apple Auth`);
      refreshData();
    } catch (e: any) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutFirebase();
    onLogout();
    setAuthSuccessMessage('Logged out from Firebase');
    refreshData();
  };

  // 2. FCM Push Notification Handlers
  const handleRegisterFCM = async () => {
    setFcmLoading(true);
    setFcmStatus('Registering with Firebase Cloud Messaging...');
    await triggerHaptic('medium');
    const result = await requestFCMToken();
    setFcmLoading(false);
    if (result.token) {
      setFcmToken(result.token);
      setFcmStatus('FCM Device Token active & registered');
      logCrashlyticsMessage('FCM token registration succeeded');
    } else {
      setFcmStatus(`FCM registration failed: ${result.error || 'Unknown'}`);
    }
    refreshData();
  };

  const handleCopyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      setCopiedToken(true);
      triggerHaptic('selection');
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleSendTestPush = async () => {
    await triggerFCMPushAlert(testPushTitle, testPushBody, { matchId: 'm_cricket_01', type: 'wicket' });
    setFcmStatus('Test FCM push alert dispatched!');
    refreshData();
  };

  // 3. Analytics Handlers
  const handleTriggerAnalyticsEvent = async (name: string, payload: Record<string, any>) => {
    await logAnalyticsEvent(name, payload);
    await triggerHaptic('light');
    refreshData();
  };

  const handleClearAnalytics = () => {
    clearAnalyticsEvents();
    setAnalyticsEvents([]);
    triggerHaptic('medium');
  };

  // 4. Crashlytics Handlers
  const handleTriggerNonFatalCrash = () => {
    logCrashlyticsMessage('User clicked [Trigger Non-Fatal Crashlytics Error]');
    setCrashlyticsCustomKey('simulated_failure_mode', 'bluetooth_scoreboard_disconnect');
    try {
      throw new Error('Bluetooth Scoreboard Disconnected: BLE packet sync dropped after frame 402');
    } catch (err: any) {
      recordCrashlyticsError(err, false, {
        simulated: true,
        stadium_pitch: 'Wankhede Pitch 3',
        battery_level: '42%',
      });
    }
    triggerHaptic('warning');
    refreshData();
  };

  const handleTriggerFatalCrash = () => {
    logCrashlyticsMessage('User clicked [Trigger Fatal Crashlytics Exception]');
    setCrashlyticsCustomKey('fatal_test_initiated', true);
    recordCrashlyticsError(
      new Error('Fatal Umpire Sync Exception: Concurrent state divergence between 3 scorers. State hash mismatch.'),
      true,
      {
        fatal_simulation: true,
        critical_tier: 'match_umpire_lock',
        active_match: 'CRIC-T20-FINALS',
      }
    );
    triggerHaptic('error');
    refreshData();
  };

  const handleClearCrashlytics = () => {
    clearCrashlyticsData();
    setCrashReports([]);
    setBreadcrumbs([]);
    setSelectedReport(null);
    triggerHaptic('medium');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
              <Flame className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                  Firebase Services Suite
                </h2>
                <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Project: <span className="font-mono-code text-slate-300 font-semibold">{firebaseConfig.projectId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 p-2 bg-slate-950/80 border-b border-slate-800 gap-1 text-xs">
          <button
            onClick={() => { setActiveTab('auth'); triggerHaptic('selection'); }}
            className={`py-2 px-3 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'auth'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Authentication</span>
            <span className="sm:hidden">Auth</span>
          </button>

          <button
            onClick={() => { setActiveTab('fcm'); triggerHaptic('selection'); }}
            className={`py-2 px-3 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'fcm'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Messaging (FCM)</span>
            <span className="sm:hidden">FCM</span>
          </button>

          <button
            onClick={() => { setActiveTab('analytics'); triggerHaptic('selection'); }}
            className={`py-2 px-3 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => { setActiveTab('crashlytics'); triggerHaptic('selection'); }}
            className={`py-2 px-3 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'crashlytics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Crashlytics</span>
            <span className="sm:hidden">Crash</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-200">
          
          {/* TAB 1: FIREBASE AUTHENTICATION */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 shrink-0">
                    {currentUser ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {currentUser ? currentUser.name : 'Anonymous / Guest'}
                      </span>
                      {currentUser && (
                        <span className="text-[10px] font-mono-code font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                          {currentUser.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {currentUser ? currentUser.email : 'Not logged in with Firebase OAuth'}
                    </p>
                  </div>
                </div>

                {currentUser && (
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors self-end sm:self-auto"
                  >
                    Sign Out
                  </button>
                )}
              </div>

              {authSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{authSuccessMessage}</span>
                </div>
              )}

              {/* Action Buttons for Google & Apple Sign-In */}
              <div className="space-y-3">
                <label className="text-xs font-mono-code uppercase font-bold text-slate-400 block">
                  Firebase OAuth Authentication Providers
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Sign-In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="p-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign In with Google (Firebase)</span>
                  </button>

                  {/* Apple Sign-In */}
                  <button
                    onClick={handleAppleSignIn}
                    disabled={authLoading}
                    className="p-3.5 rounded-2xl bg-black hover:bg-slate-950 text-white font-semibold text-sm flex items-center justify-center gap-2.5 border border-slate-700 shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.7-13.98-5.74-8.8-10.15-18.91-13.24-30.34-3.08-11.43-4.63-22.38-4.63-32.85 0-14.03 3.65-25.96 10.95-35.79 7.3-9.83 16.5-14.85 27.6-15.07 4.13 0 9.17 1.15 15.12 3.46 5.95 2.31 9.87 3.51 11.76 3.61 1.7 0 5.74-1.25 12.12-3.76 6.38-2.5 11.53-3.65 15.46-3.46 11.44.65 20.67 4.96 27.69 12.94-9.92 6.09-14.78 14.38-14.58 24.87.2 8.04 3.21 14.93 9.03 20.68 5.82 5.75 12.82 9.08 21 10-2.4 7.06-5.4 14.12-9 21.18zM119.22 31.85c0-6.96 2.53-13.5 7.6-19.63 5.07-6.13 11.43-9.98 19.08-11.55.22 1.09.33 2.18.33 3.27 0 6.96-2.6 13.6-7.81 19.92-5.21 6.32-11.57 10.02-19.08 11.11-.08-1.09-.12-2.13-.12-3.12z"/>
                    </svg>
                    <span>Sign In with Apple (Firebase)</span>
                  </button>
                </div>
              </div>

              {/* Auth Details & SDK Settings */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">Firebase Auth Environment Details:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-code text-slate-400">
                  <div>Auth Domain: <span className="text-amber-400">{firebaseConfig.authDomain}</span></div>
                  <div>Persistence: <span className="text-emerald-400">IndexedDB / LocalStorage</span></div>
                  <div>Apple Guideline 4.8: <span className="text-emerald-400">Fully Compliant</span></div>
                  <div>OAuth Provider: <span className="text-blue-400">Google + Apple ID</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FIREBASE CLOUD MESSAGING (FCM) */}
          {activeTab === 'fcm' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="font-bold text-sm text-white">FCM Device Registration Token</span>
                  </div>
                  <button
                    onClick={handleRegisterFCM}
                    disabled={fcmLoading}
                    className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/20 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${fcmLoading ? 'animate-spin' : ''}`} />
                    <span>{fcmToken ? 'Refresh Token' : 'Register Device'}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <span className="font-mono-code text-[11px] text-slate-300 truncate select-all">
                    {fcmToken || 'No token generated yet. Click "Register Device" above.'}
                  </span>
                  {fcmToken && (
                    <button
                      onClick={handleCopyToken}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                      title="Copy FCM Token"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Status: <strong className="text-slate-200">{fcmStatus}</strong></span>
                </div>
              </div>

              {/* Push Dispatch Tester */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-mono-code uppercase font-bold text-slate-400 block">
                  Send Test FCM Live Alert
                </span>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Notification Title</label>
                    <input
                      type="text"
                      value={testPushTitle}
                      onChange={(e) => setTestPushTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Notification Body</label>
                    <input
                      type="text"
                      value={testPushBody}
                      onChange={(e) => setTestPushBody(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendTestPush}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Push Notification via FCM Channel</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Push Architecture:</span> Service worker registered at <code className="text-amber-400">/firebase-messaging-sw.js</code> with messagingSenderId <code className="text-emerald-400">{firebaseConfig.messagingSenderId}</code>.
              </div>
            </div>
          )}

          {/* TAB 3: FIREBASE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Sports Event Stream</span>
                  </h3>
                  <p className="text-xs text-slate-400">Events tracked via Firebase Analytics</p>
                </div>

                <button
                  onClick={handleClearAnalytics}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Stream</span>
                </button>
              </div>

              {/* Quick Fire Test Events */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono-code uppercase font-bold text-slate-500 block">
                  Quick Event Triggers
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTriggerAnalyticsEvent('six_hit', { sport: 'cricket', batter: 'Aarav Sharma', runs: 6 })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono-code border border-slate-700"
                  >
                    + six_hit
                  </button>
                  <button
                    onClick={() => handleTriggerAnalyticsEvent('wicket_fallen', { sport: 'cricket', bowler: 'Rajesh Varma', method: 'bowled' })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-mono-code border border-slate-700"
                  >
                    + wicket_fallen
                  </button>
                  <button
                    onClick={() => handleTriggerAnalyticsEvent('ai_highlight_viewed', { clip_id: 'clip_941', sport: 'cricket' })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-mono-code border border-slate-700"
                  >
                    + ai_highlight_viewed
                  </button>
                  <button
                    onClick={() => handleTriggerAnalyticsEvent('scorecard_shared', { platform: 'whatsapp', sport: 'cricket' })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono-code border border-slate-700"
                  >
                    + scorecard_shared
                  </button>
                </div>
              </div>

              {/* Event Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 max-h-72 overflow-y-auto">
                {analyticsEvents.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No events tracked yet. Click a trigger above or perform actions in the app!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-850">
                    {analyticsEvents.map((evt) => (
                      <div key={evt.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code font-bold text-amber-400">
                            {evt.eventName}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-xs">
                            {JSON.stringify(evt.params)}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-code text-slate-500 shrink-0">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FIREBASE CRASHLYTICS */}
          {activeTab === 'crashlytics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Firebase Crashlytics Diagnostics</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Automatic unhandled error listener, breadcrumb logs &amp; telemetry
                  </p>
                </div>

                <button
                  onClick={handleClearCrashlytics}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Reports</span>
                </button>
              </div>

              {/* Simulation triggers */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-mono-code uppercase font-bold text-slate-400 block">
                  Interactive Crashlytics Simulator
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleTriggerNonFatalCrash}
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 border border-amber-500/20 active:scale-95 transition-all"
                  >
                    <span>Trigger Non-Fatal Exception</span>
                  </button>

                  <button
                    onClick={handleTriggerFatalCrash}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 border border-rose-500/20 active:scale-95 transition-all"
                  >
                    <span>Trigger Fatal Crash Exception</span>
                  </button>
                </div>
              </div>

              {/* Recent Crash Reports */}
              <div className="space-y-2">
                <span className="text-xs font-mono-code uppercase font-bold text-slate-400 block">
                  Recorded Crash Reports ({crashReports.length})
                </span>

                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 max-h-56 overflow-y-auto">
                  {crashReports.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs flex flex-col items-center gap-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Zero crashes recorded! Application health is 100% crash-free.</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-850">
                      {crashReports.map((report) => (
                        <div 
                          key={report.id} 
                          onClick={() => setSelectedReport(report)}
                          className="p-3 text-xs hover:bg-slate-900/60 cursor-pointer transition-colors space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                                report.type === 'fatal' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                                {report.type}
                              </span>
                              <span className="font-semibold text-white truncate max-w-sm">
                                {report.message}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono-code text-slate-500 shrink-0">
                              {new Date(report.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Report Inspection */}
              {selectedReport && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Stack Trace &amp; Device Context:</span>
                    <button 
                      onClick={() => setSelectedReport(null)}
                      className="text-slate-400 hover:text-white text-[11px]"
                    >
                      Close Details
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-xl bg-black/80 font-mono-code text-[10px] text-rose-300 overflow-x-auto whitespace-pre-wrap">
                    {selectedReport.stack || selectedReport.message}
                  </pre>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code text-slate-400">
                    <div>User ID: <span className="text-slate-200">{selectedReport.userId}</span></div>
                    <div>Platform: <span className="text-slate-200">{selectedReport.deviceDetails.platform}</span></div>
                    <div>Screen: <span className="text-slate-200">{selectedReport.deviceDetails.screen}</span></div>
                    <div>Network: <span className="text-emerald-400">{selectedReport.deviceDetails.online ? 'Online' : 'Offline'}</span></div>
                  </div>
                </div>
              )}

              {/* Crashlytics Breadcrumb Logs */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono-code uppercase font-bold text-slate-400 block">
                  Crashlytics Breadcrumbs Trail ({breadcrumbs.length})
                </span>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 max-h-36 overflow-y-auto font-mono-code text-[10px] space-y-1 text-slate-400">
                  {breadcrumbs.length === 0 ? (
                    <span className="text-slate-600">No breadcrumbs logged yet.</span>
                  ) : (
                    breadcrumbs.map((bc, i) => (
                      <div key={i} className="text-slate-400 hover:text-slate-200">
                        {bc}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Firebase SDK 10.12.0 • Active Project: <strong className="text-white">{firebaseConfig.projectId}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
