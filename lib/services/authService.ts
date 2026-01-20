import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getAuthInstance, isFirebaseAvailable } from '@/lib/firebase';

// Iniciar sesión
export async function signIn(email: string, password: string): Promise<User> {
  const auth = getAuthInstance();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// Cerrar sesión
export async function signOut(): Promise<void> {
  const auth = getAuthInstance();
  await firebaseSignOut(auth);
}

// Obtener usuario actual
export function getCurrentUser(): User | null {
  if (!isFirebaseAvailable()) return null;
  const auth = getAuthInstance();
  return auth.currentUser;
}

// Suscribirse a cambios de autenticación
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!isFirebaseAvailable()) {
    // Si Firebase no está configurado, llamar callback con null y retornar noop
    callback(null);
    return () => {};
  }
  const auth = getAuthInstance();
  return onAuthStateChanged(auth, callback);
}

// Verificar si hay un usuario autenticado
export function isAuthenticated(): boolean {
  if (!isFirebaseAvailable()) return false;
  const auth = getAuthInstance();
  return auth.currentUser !== null;
}
