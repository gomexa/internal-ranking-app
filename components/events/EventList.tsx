'use client';

import { Event } from '@/types';
import { Button, Card } from '@/components/ui';
import Link from 'next/link';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

const typeLabels = {
  official: 'Oficial',
  internal: 'Interno',
};

const typeColors = {
  official: 'bg-blue-100 text-blue-800',
  internal: 'bg-green-100 text-green-800',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function EventList({ events, loading, isAdmin, onEdit, onDelete }: EventListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-4">
          No hay eventos registrados.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900">{event.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[event.type]}`}>
                  {typeLabels[event.type]}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div>{formatDate(event.date)}</div>
                <div>{event.totalTargets} blancos</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link href={`/eventos/resultados?id=${event.id}`}>
                <Button size="sm" variant="secondary">
                  Resultados
                </Button>
              </Link>
              {isAdmin && (
                <>
                  <Button size="sm" variant="secondary" onClick={() => onEdit?.(event)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete?.(event)}>
                    Eliminar
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
