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
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { Result, ResultInput, Event } from '@/types';
import { calculateEffectiveness, calculateWeightedEffectiveness } from '@/lib/rankingCalculator';

const COLLECTION = 'results';

// Convertir documento de Firestore a Result
function docToResult(docSnapshot: any): Result {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    eventId: data.eventId,
    shooterId: data.shooterId,
    targetsHit: data.targetsHit,
    effectiveness: data.effectiveness,
    weightedEffectiveness: data.weightedEffectiveness,
  };
}

// Obtener todos los resultados
export async function getResults(): Promise<Result[]> {
  const db = getDb();
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(docToResult);
}

// Obtener resultados por evento
export async function getResultsByEvent(eventId: string): Promise<Result[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where('eventId', '==', eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToResult);
}

// Obtener resultados por deportista
export async function getResultsByShooter(shooterId: string): Promise<Result[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where('shooterId', '==', shooterId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToResult);
}

// Obtener un resultado por ID
export async function getResult(id: string): Promise<Result | null> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return docToResult(snapshot);
}

// Crear un resultado (calcula automáticamente efectividad)
export async function createResult(
  input: ResultInput,
  event: Event
): Promise<Result> {
  const db = getDb();
  const effectiveness = calculateEffectiveness(input.targetsHit, event.totalTargets);
  const weightedEffectiveness = calculateWeightedEffectiveness(effectiveness, event.type);

  const data = {
    eventId: input.eventId,
    shooterId: input.shooterId,
    targetsHit: input.targetsHit,
    effectiveness,
    weightedEffectiveness,
  };

  const docRef = await addDoc(collection(db, COLLECTION), data);
  return {
    id: docRef.id,
    ...data,
  };
}

// Actualizar un resultado
export async function updateResult(
  id: string,
  input: Partial<ResultInput>,
  event?: Event
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  const updateData: any = { ...input };

  // Si se actualiza targetsHit, recalcular efectividad
  if (input.targetsHit !== undefined && event) {
    updateData.effectiveness = calculateEffectiveness(input.targetsHit, event.totalTargets);
    updateData.weightedEffectiveness = calculateWeightedEffectiveness(
      updateData.effectiveness,
      event.type
    );
  }

  await updateDoc(docRef, updateData);
}

// Eliminar un resultado
export async function deleteResult(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

// Eliminar todos los resultados de un evento
export async function deleteResultsByEvent(eventId: string): Promise<void> {
  const results = await getResultsByEvent(eventId);
  await Promise.all(results.map(r => deleteResult(r.id)));
}

// Eliminar todos los resultados de un deportista
export async function deleteResultsByShooter(shooterId: string): Promise<void> {
  const results = await getResultsByShooter(shooterId);
  await Promise.all(results.map(r => deleteResult(r.id)));
}
