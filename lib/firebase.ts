import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verificar si Firebase está configurado
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

// Inicializar Firebase solo si hay credenciales configuradas
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  auth = getAuth(app);
}

// Helper para verificar si Firebase está disponible
export function isFirebaseAvailable(): boolean {
  return isFirebaseConfigured && app !== null;
}

// Getters seguros que lanzan error si Firebase no está configurado
export function getDb(): Firestore {
  if (!db) {
    throw new Error('Firebase no está configurado. Por favor configura las variables de entorno.');
  }
  return db;
}

export function getAuthInstance(): Auth {
  if (!auth) {
    throw new Error('Firebase no está configurado. Por favor configura las variables de entorno.');
  }
  return auth;
}

export { app, db, auth };
