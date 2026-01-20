'use client';

import { useState } from 'react';
import { ShooterInput } from '@/types';
import { Button, Input } from '@/components/ui';

interface ShooterFormProps {
  initialData?: Partial<ShooterInput>;
  onSubmit: (data: ShooterInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ShooterForm({ initialData, onSubmit, onCancel, loading }: ShooterFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [active, setActive] = useState(initialData?.active ?? true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim() || undefined,
        active,
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del deportista"
        required
      />

      <Input
        label="Email (opcional)"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="correo@ejemplo.com"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="active"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="active" className="text-sm text-gray-700">
          Activo
        </label>
      </div>

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
