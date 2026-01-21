import {Category, EventType, Threshold} from '@/types';

// Pesos de los eventos según el reglamento
export const EVENT_WEIGHTS: Record<EventType, number> = {
  official: 1.0,
  internal: 0.6,
};

// Requisitos mínimos para clasificar en el ranking
export const RANKING_REQUIREMENTS = {
  minEvents: 4,
  minOfficialEvents: 2,
};

// Umbrales de categorías
export const CATEGORY_THRESHOLDS: Threshold[] = [
  { category: 'Master', max: 100, min: 80 },
  { category: 'Avanzado', max: 79.99, min: 65 },
  { category: 'Intermedio', max: 64.99, min: 50 },
  { category: 'Iniciado', max: 50, min: 0 },
];



// Obtener categoría según el promedio de efectividad
export function getCategory(averageEffectiveness: number): Category {
    for (const threshold of CATEGORY_THRESHOLDS) {
        if (
        averageEffectiveness <= threshold.max &&
        averageEffectiveness >= threshold.min
        ) {
        return threshold.category as Category;
        }
    }
    return 'Sin clasificar';
}

// Colores para las categorías (Tailwind classes)
// Oro, Plata, Bronce, Verde
export const CATEGORY_COLORS: Record<Category, string> = {
  'Master': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold',
  'Avanzado': 'bg-gradient-to-r from-slate-400 to-gray-500 text-white font-semibold',
  'Intermedio': 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold',
  'Iniciado': 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold',
  'Sin clasificar': 'bg-sky-600 text-white font-semibold',
};

// Cantidad de eventos por temporada
export const SEASON_EVENTS = {
  official: 4,
  internal: 4,
};

// Año de temporada actual
export function getCurrentSeason(): number {
  return new Date().getFullYear();
}
