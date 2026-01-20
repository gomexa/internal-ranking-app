'use client';

import { useState, useEffect, useCallback } from 'react';
import { RankingEntry } from '@/types';
import { generateRanking } from '@/lib/rankingCalculator';
import { getActiveShooters } from '@/lib/services/shooterService';
import { getEventsBySeason, getEvents } from '@/lib/services/eventService';
import { getResults } from '@/lib/services/resultService';
import { getCurrentSeason } from '@/lib/constants';
import { isFirebaseAvailable } from '@/lib/firebase';

export function useRanking(season?: number) {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSeason, setCurrentSeason] = useState(season ?? getCurrentSeason());

  const fetchRanking = useCallback(async () => {
    if (!isFirebaseAvailable()) {
      setLoading(false);
      setError('Firebase no está configurado. Por favor configura las variables de entorno.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [shooters, events, results] = await Promise.all([
        getActiveShooters(),
        currentSeason ? getEventsBySeason(currentSeason) : getEvents(),
        getResults(),
      ]);

      const rankingData = generateRanking(shooters, results, events, currentSeason);
      setRanking(rankingData);
    } catch (err: any) {
      setError(err.message || 'Error al calcular ranking');
    } finally {
      setLoading(false);
    }
  }, [currentSeason]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const changeSeason = (newSeason: number) => {
    setCurrentSeason(newSeason);
  };

  return {
    ranking,
    loading,
    error,
    season: currentSeason,
    refresh: fetchRanking,
    changeSeason,
  };
}
