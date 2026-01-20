'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shooter, ShooterInput } from '@/types';
import {
  getShooters,
  getActiveShooters,
  createShooter,
  updateShooter,
  deleteShooter,
} from '@/lib/services/shooterService';
import { isFirebaseAvailable } from '@/lib/firebase';

export function useShooters(activeOnly = false) {
  const [shooters, setShooters] = useState<Shooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShooters = useCallback(async () => {
    if (!isFirebaseAvailable()) {
      setLoading(false);
      setError('Firebase no está configurado.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = activeOnly ? await getActiveShooters() : await getShooters();
      setShooters(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar deportistas');
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchShooters();
  }, [fetchShooters]);

  const addShooter = async (input: ShooterInput) => {
    const newShooter = await createShooter(input);
    setShooters((prev) => [...prev, newShooter].sort((a, b) => a.name.localeCompare(b.name)));
    return newShooter;
  };

  const editShooter = async (id: string, input: Partial<ShooterInput>) => {
    await updateShooter(id, input);
    setShooters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...input } : s))
    );
  };

  const removeShooter = async (id: string) => {
    await deleteShooter(id);
    setShooters((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    shooters,
    loading,
    error,
    refresh: fetchShooters,
    addShooter,
    editShooter,
    removeShooter,
  };
}
