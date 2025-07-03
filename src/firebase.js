// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getMessaging, getToken } from "firebase/messaging"
// import { setItemLocalStorage } from "./Utils/browserServices";

// const firebaseConfig = {
//     apiKey: "AIzaSyDvVU87Pv6_BrWHhQOoQZujIMgX1Fqe4Js",
//     authDomain: "smartfit-pro.firebaseapp.com",
//     projectId: "smartfit-pro",
//     storageBucket: "smartfit-pro.firebasestorage.app",
//     messagingSenderId: "416686174115",
//     appId: "1:416686174115:web:804dede6316e7170b07416",
//     measurementId: "G-P2QFHK6GLZ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const messaging = getMessaging(app)


// export const generateToken = async () => {
//     const permission = await Notification.requestPermission();
//     console.log(permission);
//     if (permission === "granted") {
//         const token = await getToken(messaging, {
//             vapidKey: "BCSpW3cwPB8wlqiW40cL39K5QZhpk7WDsNmV410_3hbrhLZMEIVCYavAv9QFlg_xTbPzleuAbaPKaceiYSQHqO0"
//         })
//         setItemLocalStorage("fcm_token", token);
//     }
// }


