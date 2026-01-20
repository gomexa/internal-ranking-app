'use client';

import { useState } from 'react';
import { EventInput, EventType } from '@/types';
import { Button, Input, Select } from '@/components/ui';
import { getCurrentSeason } from '@/lib/constants';

interface EventFormProps {
  initialData?: Partial<EventInput>;
  onSubmit: (data: EventInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function EventForm({ initialData, onSubmit, onCancel, loading }: EventFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(
    initialData?.date ? initialData.date.toISOString().split('T')[0] : ''
  );
  const [type, setType] = useState<EventType>(initialData?.type || 'official');
  const [totalTargets, setTotalTargets] = useState(initialData?.totalTargets?.toString() || '');
  const [season, setSeason] = useState(initialData?.season?.toString() || getCurrentSeason().toString());
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !totalTargets) {
      setError('Todos los campos son requeridos');
      return;
    }

    const targets = parseInt(totalTargets);
    if (isNaN(targets) || targets <= 0) {
      setError('Número de blancos inválido');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        date: new Date(date),
        type,
        totalTargets: targets,
        season: parseInt(season),
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    }
  };

  const typeOptions = [
    { value: 'official', label: 'Competencia Oficial (Peso 1.0)' },
    { value: 'internal', label: 'Evento Interno (Peso 0.6)' },
  ];

  const currentYear = getCurrentSeason();
  const seasonOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Nombre del evento"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Campeonato Regional"
        required
      />

      <Input
        label="Fecha"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Select
        label="Tipo de evento"
        value={type}
        onChange={(e) => setType(e.target.value as EventType)}
        options={typeOptions}
      />

      <Input
        label="Número de blancos"
        type="number"
        min="1"
        value={totalTargets}
        onChange={(e) => setTotalTargets(e.target.value)}
        placeholder="Ej: 40"
        required
      />

      <Select
        label="Temporada"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        options={seasonOptions}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
