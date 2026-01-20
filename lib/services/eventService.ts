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
import { Event, EventInput } from '@/types';

const COLLECTION = 'events';

// Convertir documento de Firestore a Event
function docToEvent(docSnapshot: any): Event {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name,
    date: data.date?.toDate() || new Date(),
    type: data.type,
    totalTargets: data.totalTargets,
    season: data.season,
  };
}

// Obtener todos los eventos
export async function getEvents(): Promise<Event[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), orderBy('date', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToEvent);
}

// Obtener eventos por temporada
export async function getEventsBySeason(season: number): Promise<Event[]> {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    where('season', '==', season),
    orderBy('date', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToEvent);
}

// Obtener un evento por ID
export async function getEvent(id: string): Promise<Event | null> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return docToEvent(snapshot);
}

// Crear un evento
export async function createEvent(input: EventInput): Promise<Event> {
  const db = getDb();
  const data = {
    name: input.name,
    date: Timestamp.fromDate(input.date),
    type: input.type,
    totalTargets: input.totalTargets,
    season: input.season,
  };
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return {
    id: docRef.id,
    ...input,
  };
}

// Actualizar un evento
export async function updateEvent(
  id: string,
  input: Partial<EventInput>
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  const updateData: any = { ...input };
  if (input.date) {
    updateData.date = Timestamp.fromDate(input.date);
  }
  await updateDoc(docRef, updateData);
}

// Eliminar un evento
export async function deleteEvent(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
