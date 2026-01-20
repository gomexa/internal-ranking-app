'use client';

import { useState, useEffect } from 'react';
import { Shooter, Event, Result } from '@/types';
import { Button, Card } from '@/components/ui';
import { getEvents } from '@/lib/services/eventService';
import { getResults } from '@/lib/services/resultService';
import { getCurrentSeason } from '@/lib/constants';

interface ShooterTableProps {
  shooters: Shooter[];
  loading?: boolean;
  isAdmin?: boolean;
  onEdit?: (shooter: Shooter) => void;
  onDelete?: (shooter: Shooter) => void;
}

interface ShooterStats {
  shooter: Shooter;
  resultsByEvent: Map<string, Result>;
  averageEffectiveness: number;
  weightedAverageEffectiveness: number;
  totalEvents: number;
}

export function ShooterTable({ shooters, loading, isAdmin, onEdit, onDelete }: ShooterTableProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsData, resultsData] = await Promise.all([
          getEvents(),
          getResults(),
        ]);
        // Filter events by current season and sort by date
        const currentSeason = getCurrentSeason();
        const seasonEvents = eventsData
          .filter(e => e.season === currentSeason)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(seasonEvents);
        setResults(resultsData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setDataLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || dataLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  if (shooters.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-4">
          No hay deportistas registrados.
        </p>
      </Card>
    );
  }

  // Calculate stats for each shooter
  const shooterStats: ShooterStats[] = shooters.map(shooter => {
    const shooterResults = results.filter(r => r.shooterId === shooter.id);
    const resultsByEvent = new Map<string, Result>();

    let totalEffectiveness = 0;
    let totalWeightedEffectiveness = 0;
    let count = 0;

    for (const result of shooterResults) {
      const event = events.find(e => e.id === result.eventId);
      if (event) {
        resultsByEvent.set(event.id, result);
        totalEffectiveness += result.effectiveness;
        totalWeightedEffectiveness += result.weightedEffectiveness;
        count++;
      }
    }

    return {
      shooter,
      resultsByEvent,
      averageEffectiveness: count > 0 ? totalEffectiveness / count : 0,
      weightedAverageEffectiveness: count > 0 ? totalWeightedEffectiveness / count : 0,
      totalEvents: count,
    };
  });

  // Sort by weighted average descending
  shooterStats.sort((a, b) => b.weightedAverageEffectiveness - a.weightedAverageEffectiveness);

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 min-w-[180px]">
                Deportista
              </th>
              {events.map(event => (
                <th key={event.id} className="px-3 py-3 text-center text-sm font-semibold text-gray-900 min-w-[90px]">
                  <div className="truncate max-w-[100px]" title={event.name}>
                    {event.name.length > 12 ? event.name.substring(0, 12) + '...' : event.name}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                <div>Efectividad</div>
                <div className="text-xs font-normal text-gray-600">Promedio</div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-green-700 bg-green-50">
                <div>Score Final</div>
                <div className="text-xs font-normal text-green-600">Ponderado</div>
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shooterStats.map(({ shooter, resultsByEvent, averageEffectiveness, weightedAverageEffectiveness }) => (
              <tr key={shooter.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 sticky left-0 bg-white">
                  <div className="font-medium text-gray-900">{shooter.name}</div>
                  {!shooter.active && (
                    <span className="text-xs text-gray-400">(Inactivo)</span>
                  )}
                </td>
                {events.map(event => {
                  const result = resultsByEvent.get(event.id);
                  return (
                    <td key={event.id} className="px-3 py-3 text-center text-gray-900">
                      {result ? (
                        <div>
                          <div className="text-lg font-bold">{result.targetsHit}/{event.totalTargets}</div>
                          <div className="text-xs text-gray-500">
                            {result.effectiveness.toFixed(1)}%
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            {result.weightedEffectiveness.toFixed(1)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin Registro</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {averageEffectiveness > 0 ? `${averageEffectiveness.toFixed(2)}%` : '-'}
                </td>
                <td className="px-4 py-3 text-center bg-green-50">
                  <span className="font-bold text-green-700">
                    {weightedAverageEffectiveness > 0 ? weightedAverageEffectiveness.toFixed(2) : '-'}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => onEdit?.(shooter)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete?.(shooter)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
