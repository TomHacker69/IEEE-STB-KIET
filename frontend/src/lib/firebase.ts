import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Production Firebase Configuration for IEEE STB KIET
const firebaseConfig = {
  apiKey: 'AIzaSyCmuTvI6jd4E1aKkAu0WL8BRjWISUtU3SA',
  authDomain: 'ieee-stb-kiet-afc25.firebaseapp.com',
  projectId: 'ieee-stb-kiet-afc25',
  storageBucket: 'ieee-stb-kiet-afc25.firebasestorage.app',
  messagingSenderId: '171340196868',
  appId: '1:171340196868:web:d68ccaffbe71873cabd951',
  measurementId: 'G-PN9GJS741F',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
