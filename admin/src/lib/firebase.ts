import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCmuTvI6jd4E1aKkAu0WL8BRjWISUtU3SA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'ieee-stb-kiet-afc25.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ieee-stb-kiet-afc25',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'ieee-stb-kiet-afc25.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '171340196868',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:171340196868:web:d68ccaffbe71873cabd951',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-PN9GJS741F',
};

// Initialize Firebase once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
