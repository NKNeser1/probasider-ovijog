import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDGRQqFtPYR8XUz1Qsqp7O2AlADJhCitf8",
  authDomain: "probashider-ovijog.firebaseapp.com",
  projectId: "probashider-ovijog",
  storageBucket: "probashider-ovijog.firebasestorage.app",
  messagingSenderId: "712573748625",
  appId: "1:712573748625:web:75e40cd2050658206b0630",
    measurementId: "G-1NX8RP47L5",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const analytics =
  typeof window !== "undefined"
    ? isSupported().then((supported) =>
        supported ? getAnalytics(app) : null
      )
    : Promise.resolve(null);

export default app;