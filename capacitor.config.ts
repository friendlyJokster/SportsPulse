import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sportpulse.app',
  appName: 'SportPulse',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: '#0F172A',
    preferredContentMode: 'mobile',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#0F172A',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#2563EB',
      sound: 'beep.wav',
    },
    Camera: {
      presentationStyle: 'fullscreen',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F172A',
      overlaysWebView: true,
    },
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#0F172A',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
