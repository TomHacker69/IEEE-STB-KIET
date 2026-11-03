import admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

export const initFirebase = (): admin.app.App => {
  if (firebaseApp) return firebaseApp;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Direct JSON string or parsed object
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized via FIREBASE_SERVICE_ACCOUNT_KEY');
    } else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      // Environment variables
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      console.log('✅ Firebase Admin initialized via Environment Variables');
    } else {
      // Default fallback using project ID
      console.warn('⚠️ Firebase Admin service account key not provided in .env. Initializing with project ID for token verification.');
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'ieee-stb-kiet-afc25'
      });
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
  }

  return firebaseApp!;
};

export const getAuth = () => {
  if (!firebaseApp) initFirebase();
  return admin.auth();
};

