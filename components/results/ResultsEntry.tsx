'use client';

import { useState } from 'react';
import { Event, Shooter, ResultInput } from '@/types';
import { Button, Input, Select } from '@/components/ui';

interface ResultsEntryProps {
  event: Event;
  shooters: Shooter[];
  existingShooterIds: string[];
  onSubmit: (data: ResultInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ResultsEntry({
  event,
  shooters,
  existingShooterIds,
  onSubmit,
  onCancel,
  loading,
}: ResultsEntryProps) {
  const [shooterId, setShooterId] = useState('');
  const [targetsHit, setTargetsHit] = useState('');
  const [error, setError] = useState('');

  // Filtrar deportistas que ya tienen resultado
  const availableShooters = shooters.filter(
    (s) => !existingShooterIds.includes(s.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shooterId || !targetsHit) {
      setError('Todos los campos son requeridos');
      return;
    }

    const hits = parseInt(targetsHit);
    if (isNaN(hits) || hits < 0 || hits > event.totalTargets) {
      setError(`Blancos debe ser entre 0 y ${event.totalTargets}`);
      return;
    }

    try {
      await onSubmit({
        eventId: event.id,
        shooterId,
        targetsHit: hits,
      });
      // Limpiar formulario
      setShooterId('');
      setTargetsHit('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    }
  };

  const shooterOptions = [
    { value: '', label: 'Seleccionar deportista' },
    ...availableShooters.map((s) => ({
      value: s.id,
      label: s.name,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {availableShooters.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Todos los deportistas ya tienen resultado en este evento.
        </p>
      ) : (
        <>
          <Select
            label="Deportista"
            value={shooterId}
            onChange={(e) => setShooterId(e.target.value)}
            options={shooterOptions}
          />

          <Input
            label={`Blancos abatidos (de ${event.totalTargets})`}
            type="number"
            min="0"
            max={event.totalTargets}
            value={targetsHit}
            onChange={(e) => setTargetsHit(e.target.value)}
            placeholder={`0 - ${event.totalTargets}`}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !shooterId}>
              {loading ? 'Guardando...' : 'Agregar resultado'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
