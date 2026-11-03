import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const sanitize = (val: string | undefined, fallback: string) => {
  if (!val || val.includes('YourFirebase') || val.includes('your-project') || val.includes('DemoKey')) {
    return fallback;
  }
  return val.trim();
};

const firebaseConfig = {
  apiKey: sanitize(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'AIzaSyCmuTvI6jd4E1aKkAu0WL8BRjWISUtU3SA'),
  authDomain: sanitize(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'ieee-stb-kiet-afc25.firebaseapp.com'),
  projectId: sanitize(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'ieee-stb-kiet-afc25'),
  storageBucket: sanitize(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'ieee-stb-kiet-afc25.firebasestorage.app'),
  messagingSenderId: sanitize(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, '171340196868'),
  appId: sanitize(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, '1:171340196868:web:d68ccaffbe71873cabd951'),
  measurementId: sanitize(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, 'G-PN9GJS741F'),
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
