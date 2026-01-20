import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { Shooter, ShooterInput } from '@/types';

const COLLECTION = 'shooters';

// Convertir documento de Firestore a Shooter
function docToShooter(docSnapshot: any): Shooter {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name,
    email: data.email || undefined,
    createdAt: data.createdAt?.toDate() || new Date(),
    active: data.active ?? true,
  };
}

// Obtener todos los deportistas
export async function getShooters(): Promise<Shooter[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToShooter);
}

// Obtener deportistas activos
export async function getActiveShooters(): Promise<Shooter[]> {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    where('active', '==', true),
    orderBy('name')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToShooter);
}

// Obtener un deportista por ID
export async function getShooter(id: string): Promise<Shooter | null> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return docToShooter(snapshot);
}

// Crear un deportista
export async function createShooter(input: ShooterInput): Promise<Shooter> {
  const db = getDb();
  const data = {
    name: input.name,
    email: input.email || null,
    active: input.active,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return {
    id: docRef.id,
    ...input,
    createdAt: new Date(),
  };
}

// Actualizar un deportista
export async function updateShooter(
  id: string,
  input: Partial<ShooterInput>
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, input);
}

// Eliminar un deportista
export async function deleteShooter(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

// Desactivar un deportista (soft delete)
export async function deactivateShooter(id: string): Promise<void> {
  await updateShooter(id, { active: false });
}
