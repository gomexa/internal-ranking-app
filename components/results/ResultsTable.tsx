'use client';

import { Result, Shooter, Event } from '@/types';
import { Button, Card } from '@/components/ui';

interface ResultsTableProps {
  results: Result[];
  shooters: Shooter[];
  event: Event;
  loading?: boolean;
  isAdmin?: boolean;
  onDelete?: (result: Result) => void;
}

export function ResultsTable({
  results,
  shooters,
  event,
  loading,
  isAdmin,
  onDelete,
}: ResultsTableProps) {
  const shooterMap = new Map(shooters.map((s) => [s.id, s]));

  // Ordenar por efectividad descendente
  const sortedResults = [...results].sort(
    (a, b) => b.effectiveness - a.effectiveness
  );

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">
          No hay resultados registrados para este evento.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Deportista</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Blancos</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Efectividad</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Ponderado</th>
              {isAdmin && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedResults.map((result, index) => {
              const shooter = shooterMap.get(result.shooterId);
              return (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {shooter?.name || 'Desconocido'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900">
                    {result.targetsHit} / {event.totalTargets}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900">
                    <span className="font-semibold">
                      {result.effectiveness.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900">
                    {result.weightedEffectiveness.toFixed(2)}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete?.(result)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
