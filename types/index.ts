// Tipos de eventos
export type EventType = 'official' | 'internal';

// Deportista
export interface Shooter {
  id: string;
  name: string;
  email?: string;
  createdAt: Date;
  active: boolean;
}

// Evento
export interface Event {
  id: string;
  name: string;
  date: Date;
  type: EventType;
  totalTargets: number;
  season: number;
}

// Resultado de un deportista en un evento
export interface Result {
  id: string;
  eventId: string;
  shooterId: string;
  targetsHit: number;
  effectiveness: number;
  weightedEffectiveness: number;
}

// Entrada del ranking
export interface RankingEntry {
  shooter: Shooter;
  totalEvents: number;
  officialEvents: number;
  internalEvents: number;
  averageEffectiveness: number;
  weightedAverageEffectiveness: number;
  category: Category;
  qualifies: boolean;
  results: ResultWithEvent[];
}

// Resultado con información del evento
export interface ResultWithEvent extends Result {
  event: Event;
}

// Categorías del ranking
export type Category = 'Master' | 'Avanzado' | 'Intermedio' | 'Iniciado' | 'Sin clasificar';

// Datos para crear/actualizar
export type ShooterInput = Omit<Shooter, 'id' | 'createdAt'>;
export type EventInput = Omit<Event, 'id'>;
export type ResultInput = Omit<Result, 'id' | 'effectiveness' | 'weightedEffectiveness'>;
