import { Event, Result, RankingEntry, ResultWithEvent, Shooter } from '@/types';
import { EVENT_WEIGHTS, RANKING_REQUIREMENTS, getCategory } from './constants';

// Calcular efectividad de un resultado
export function calculateEffectiveness(targetsHit: number, totalTargets: number): number {
  if (totalTargets === 0) return 0;
  return (targetsHit / totalTargets) * 100;
}

// Calcular efectividad ponderada
export function calculateWeightedEffectiveness(
  effectiveness: number,
  eventType: Event['type']
): number {
  return effectiveness * EVENT_WEIGHTS[eventType];
}

// Verificar si un deportista cumple los requisitos para clasificar
export function checkQualification(
  officialEvents: number,
  totalEvents: number
): boolean {
  return (
    totalEvents >= RANKING_REQUIREMENTS.minEvents &&
    officialEvents >= RANKING_REQUIREMENTS.minOfficialEvents
  );
}

// Calcular promedio de efectividad (sin ponderar)
export function calculateRawAverageEffectiveness(
  resultsWithEvents: ResultWithEvent[]
): number {
  if (resultsWithEvents.length === 0) return 0;

  let totalEffectiveness = 0;

  for (const result of resultsWithEvents) {
    totalEffectiveness += result.effectiveness;
  }

  return totalEffectiveness / resultsWithEvents.length;
}

// Calcular promedio final ponderado: sum(ponderadas) / cantidadEventos
export function calculateWeightedAverageEffectiveness(
  resultsWithEvents: ResultWithEvent[]
): number {
  if (resultsWithEvents.length === 0) return 0;

  let totalWeightedEffectiveness = 0;

  for (const result of resultsWithEvents) {
    totalWeightedEffectiveness += result.weightedEffectiveness;
  }

  return totalWeightedEffectiveness / resultsWithEvents.length;
}

// Generar entrada de ranking para un deportista
export function generateRankingEntry(
  shooter: Shooter,
  results: Result[],
  events: Event[]
): RankingEntry {
  // Crear mapa de eventos para búsqueda rápida
  const eventMap = new Map(events.map(e => [e.id, e]));

  // Combinar resultados con eventos
  const resultsWithEvents: ResultWithEvent[] = results
    .filter(r => eventMap.has(r.eventId))
    .map(r => ({
      ...r,
      event: eventMap.get(r.eventId)!,
    }));

  // Contar eventos por tipo
  const officialEvents = resultsWithEvents.filter(
    r => r.event.type === 'official'
  ).length;
  const internalEvents = resultsWithEvents.filter(
    r => r.event.type === 'internal'
  ).length;
  const totalEvents = resultsWithEvents.length;

  // Calcular promedios de efectividad
  const averageEffectiveness = calculateRawAverageEffectiveness(resultsWithEvents);
  const weightedAverageEffectiveness = calculateWeightedAverageEffectiveness(resultsWithEvents);

  // Verificar si clasifica
  const qualifies = checkQualification(officialEvents, totalEvents);

  // Determinar categoría (basada en promedio ponderado)
  const category = qualifies ? getCategory(weightedAverageEffectiveness) : 'Sin clasificar';

  return {
    shooter,
    totalEvents,
    officialEvents,
    internalEvents,
    averageEffectiveness,
    weightedAverageEffectiveness,
    category,
    qualifies,
    results: resultsWithEvents,
  };
}

// Generar ranking completo ordenado
export function generateRanking(
  shooters: Shooter[],
  results: Result[],
  events: Event[],
  season?: number
): RankingEntry[] {
  // Filtrar eventos por temporada si se especifica
  const filteredEvents = season
    ? events.filter(e => e.season === season)
    : events;

  const eventIds = new Set(filteredEvents.map(e => e.id));

  // Filtrar resultados por eventos de la temporada
  const filteredResults = results.filter(r => eventIds.has(r.eventId));

  // Agrupar resultados por deportista
  const resultsByShooter = new Map<string, Result[]>();
  for (const result of filteredResults) {
    const existing = resultsByShooter.get(result.shooterId) || [];
    existing.push(result);
    resultsByShooter.set(result.shooterId, existing);
  }

  // Generar entradas de ranking
  const entries: RankingEntry[] = shooters
    .filter(s => s.active)
    .map(shooter => {
      const shooterResults = resultsByShooter.get(shooter.id) || [];
      return generateRankingEntry(shooter, shooterResults, filteredEvents);
    });

  // Ordenar: primero los que clasifican, luego por promedio descendente
  return entries.sort((a, b) => {
    // Los que clasifican van primero
    if (a.qualifies && !b.qualifies) return -1;
    if (!a.qualifies && b.qualifies) return 1;

    // Ordenar por promedio ponderado descendente
    return b.weightedAverageEffectiveness - a.weightedAverageEffectiveness;
  });
}
