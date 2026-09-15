// Firebase Cloud Messaging Background Service Worker
// SportPulse Match Day Live Notifications

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBSEFcO5laPHhN39bTmwJxxw1Q6Wk8SGww",
  appId: "1:139788416248:web:fd30b8cd597404079df70d",
  messagingSenderId: "139788416248",
  projectId: "optimum-ensign-qxjsq",
  authDomain: "optimum-ensign-qxjsq.firebaseapp.com",
  storageBucket: "optimum-ensign-qxjsq.firebasestorage.app"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);
  const notificationTitle = payload.notification?.title || '🏏 SportPulse Match Update';
  const notificationOptions = {
    body: payload.notification?.body || 'New live scoring event occurred!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'sportpulse-match-alert',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
