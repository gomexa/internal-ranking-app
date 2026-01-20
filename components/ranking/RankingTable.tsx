'use client';

import { useMemo } from 'react';
import { RankingEntry } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { Card } from '@/components/ui';

interface RankingTableProps {
  ranking: RankingEntry[];
  loading?: boolean;
}

export function RankingTable({ ranking, loading }: RankingTableProps) {
  // Determine category leaders (first qualifying shooter in each category)
  const categoryLeaders = useMemo(() => {
    const leaders = new Set<string>();
    const seenCategories = new Set<string>();

    for (const entry of ranking) {
      if (entry.qualifies && !seenCategories.has(entry.category)) {
        leaders.add(entry.shooter.id);
        seenCategories.add(entry.category);
      }
    }

    return leaders;
  }, [ranking]);
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  if (ranking.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">
          No hay datos de ranking disponibles.
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
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Eventos</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                <span title="Peso: 1.0">Oficiales</span>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                <span title="Peso: 0.6">Internos</span>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                <div>Efectividad</div>
                <div className="text-xs font-normal text-gray-600">Promedio</div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-green-700 bg-green-50">
                <div>Score Final</div>
                <div className="text-xs font-normal text-green-600">Ranking</div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Categoría</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ranking.map((entry, index) => {
              const isLeader = categoryLeaders.has(entry.shooter.id);
              return (
              <tr
                key={entry.shooter.id}
                className={`
                  ${isLeader ? 'bg-amber-50 border-l-4 border-l-amber-400' : entry.qualifies ? 'bg-white' : 'bg-gray-50'} text-gray-900
                  hover:bg-gray-100 transition-colors
                `}
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {entry.qualifies ? (
                    <span className="flex items-center gap-1">
                      {isLeader && <span className="text-amber-500">&#9733;</span>}
                      {index + 1}
                    </span>
                  ) : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className={`font-medium ${isLeader ? 'text-amber-700' : 'text-gray-900'}`}>
                    {entry.shooter.name}
                    {isLeader && <span className="ml-2 text-xs text-amber-600 font-normal">Lider</span>}
                  </div>
                  {!entry.qualifies && (
                    <div className="text-xs text-gray-900">No clasifica</div>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {entry.totalEvents}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {entry.officialEvents}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {entry.internalEvents}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {entry.averageEffectiveness.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-center bg-green-50">
                  <span className="font-bold text-green-700">
                    {entry.weightedAverageEffectiveness.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <CategoryBadge category={entry.category} size="sm" />
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
