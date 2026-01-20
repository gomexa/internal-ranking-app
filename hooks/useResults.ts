'use client';

import { useState, useEffect, useCallback } from 'react';
import { Result, ResultInput, Event } from '@/types';
import {
  getResults,
  getResultsByEvent,
  createResult,
  updateResult,
  deleteResult,
} from '@/lib/services/resultService';
import { isFirebaseAvailable } from '@/lib/firebase';

export function useResults(eventId?: string) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!isFirebaseAvailable()) {
      setLoading(false);
      setError('Firebase no está configurado.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = eventId ? await getResultsByEvent(eventId) : await getResults();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar resultados');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const addResult = async (input: ResultInput, event: Event) => {
    const newResult = await createResult(input, event);
    setResults((prev) => [...prev, newResult]);
    return newResult;
  };

  const editResult = async (id: string, input: Partial<ResultInput>, event?: Event) => {
    await updateResult(id, input, event);
    await fetchResults(); // Refrescar para obtener valores recalculados
  };

  const removeResult = async (id: string) => {
    await deleteResult(id);
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    results,
    loading,
    error,
    refresh: fetchResults,
    addResult,
    editResult,
    removeResult,
  };
}
