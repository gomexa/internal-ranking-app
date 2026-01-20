'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event, EventInput } from '@/types';
import {
  getEvents,
  getEventsBySeason,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/lib/services/eventService';
import { getCurrentSeason } from '@/lib/constants';
import { isFirebaseAvailable } from '@/lib/firebase';

export function useEvents(season?: number) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!isFirebaseAvailable()) {
      setLoading(false);
      setError('Firebase no está configurado.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = season ? await getEventsBySeason(season) : await getEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, [season]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = async (input: EventInput) => {
    const newEvent = await createEvent(input);
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const editEvent = async (id: string, input: Partial<EventInput>) => {
    await updateEvent(id, input);
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...input } : e))
    );
  };

  const removeEvent = async (id: string) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    events,
    loading,
    error,
    refresh: fetchEvents,
    addEvent,
    editEvent,
    removeEvent,
  };
}
