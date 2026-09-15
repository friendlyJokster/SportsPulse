import React from 'react';
import { Camera, MapPin, Bell, ShieldCheck, X } from 'lucide-react';
import { 
  requestCameraPermissions, 
  requestLocationPermissions, 
  requestNotificationPermission,
  triggerHaptic 
} from '../../utils/nativeMobileServices';

export type PermissionType = 'camera' | 'location' | 'notifications';

interface PrePermissionModalProps {
  isOpen: boolean;
  type: PermissionType;
  onClose: () => void;
  onGranted: () => void;
}

export const PrePermissionModal: React.FC<PrePermissionModalProps> = ({
  isOpen,
  type,
  onClose,
  onGranted,
}) => {
  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    await triggerHaptic('medium');
    let granted = false;

    if (type === 'camera') {
      granted = await requestCameraPermissions();
    } else if (type === 'location') {
      granted = await requestLocationPermissions();
    } else if (type === 'notifications') {
      granted = await requestNotificationPermission();
    }

    if (granted) {
      await triggerHaptic('success');
      onGranted();
    }
    onClose();
  };

  const getPermissionDetails = () => {
    switch (type) {
      case 'camera':
        return {
          icon: <Camera className="w-7 h-7 text-emerald-500" />,
          title: 'Camera Access Needed',
          subtitle: 'Used for athlete profile photos & match scorecard capture',
          description:
            'SportPulse uses your device camera solely to take profile photos for player cards, capture match day pictures, and verify official scorecards. Your photos are never shared without your permission.',
          buttonText: 'Enable Camera Access',
        };
      case 'location':
        return {
          icon: <MapPin className="w-7 h-7 text-blue-500" />,
          title: 'Ground & Venue Location',
          subtitle: 'Used for automatic stadium tagging & local tournaments',
          description:
            'SportPulse uses your approximate location to tag the venue of your cricket or football fixture and discover live grassroots matches being scored near you. We do not track your location in the background.',
          buttonText: 'Enable Location Tagging',
        };
      case 'notifications':
        return {
          icon: <Bell className="w-7 h-7 text-amber-500" />,
          title: 'Live Match Alerts & Wickets',
          subtitle: 'Instant boundary bells, goal alerts & AI highlight drops',
          description:
            'Stay up to speed with real-time push notifications when wickets fall, sixes are struck, tournament knockout fixtures are published, or AI commentary highlights are rendered.',
          buttonText: 'Enable Match Notifications',
        };
    }
  };

  const details = getPermissionDetails();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="perm-title">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-md p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto shadow-inner">
          {details.icon}
        </div>

        <div className="space-y-1">
          <h3 id="perm-title" className="text-lg font-bold text-slate-900 dark:text-white font-display">
            {details.title}
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {details.subtitle}
          </p>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-2">
          {details.description}
        </p>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>You can revoke or adjust this in System Settings at any time.</span>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleRequestPermission}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            {details.buttonText}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
