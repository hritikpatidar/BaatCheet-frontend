// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// firebase.initializeApp({
//     apiKey: "AIzaSyBJ4NKf5MeRu9A1YaoN5YKQM5BvOcsBl0Y",
//     authDomain: "baatcheet-b424d.firebaseapp.com",
//     projectId: "baatcheet-b424d",
//     storageBucket: "baatcheet-b424d.firebasestorage.app",
//     messagingSenderId: "817145024781",
//     appId: "1:817145024781:web:d94eb131aa42484eaf2044",
//     measurementId: "G-GQ5RFPG7SZ"
// });

// const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//     console.log(
//         '[firebase-messaging-sw.js] Received background message ',
//         payload
//     );
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/firebase-logo.png',
//         data: {
//             url: payload.data.route || '/',
//         },
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

// messaging.onBackgroundMessage((payload) => {
//     console.log('Received background message ', payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: '/firebase-logo.png',
//         data: {
//             url: payload.data.route || '/',
//         },
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener('notificationclick', (event) => {
//     const urlToOpen = event.notification.data.url || '/';
//     event.notification.close();

//     event.waitUntil(
//         clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
//             for (let i = 0; i < clientList.length; i++) {
//                 const client = clientList[i];
//                 if (client.url === urlToOpen && 'focus' in client) {
//                     return client.focus();
//                 }
//             }
//             if (clients.openWindow) {
//                 return clients.openWindow(urlToOpen);
//             }
//         })
//     );
// });