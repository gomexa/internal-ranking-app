'use client';

import { Shooter } from '@/types';
import { Button, Card } from '@/components/ui';

interface ShooterListProps {
  shooters: Shooter[];
  loading?: boolean;
  isAdmin?: boolean;
  onEdit?: (shooter: Shooter) => void;
  onDelete?: (shooter: Shooter) => void;
}

export function ShooterList({ shooters, loading, isAdmin, onEdit, onDelete }: ShooterListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
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

  return (
    <div className="space-y-3">
      {shooters.map((shooter) => (
        <Card key={shooter.id} className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">{shooter.name}</div>
            {shooter.email && (
              <div className="text-sm text-gray-500">{shooter.email}</div>
            )}
            {!shooter.active && (
              <span className="text-xs text-gray-400">(Inactivo)</span>
            )}
          </div>

          {isAdmin && (
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" onClick={() => onEdit?.(shooter)}>
                Editar
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete?.(shooter)}>
                Eliminar
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
