/* Service worker: receives push while the admin page is closed / logged out. */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDH1738INWjoXnzXLOPytluX1ED8saNcyI",
  authDomain: "english-studies-flshm.firebaseapp.com",
  projectId: "english-studies-flshm",
  storageBucket: "english-studies-flshm.firebasestorage.app",
  messagingSenderId: "271583538710",
  appId: "1:271583538710:web:1922dbfbeebc9fb1a5cf37"
});

const messaging = firebase.messaging();

// Server sends DATA-ONLY messages, so we display the notification ourselves (no duplicates).
messaging.onBackgroundMessage(payload => {
  const d = payload.data || {};
  return self.registration.showNotification(d.title || '🪪 New verification request', {
    body: d.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: 'mv-' + (d.id || 'new'),
    data: { open: 'verify' }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const wins = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if ('focus' in w) { await w.focus(); w.postMessage({ type: 'open-verify' }); return; }
    }
    await clients.openWindow(self.registration.scope + '?open=verify');
  })());
});
