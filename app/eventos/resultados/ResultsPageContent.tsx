'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { ResultsTable, ResultsEntry } from '@/components/results';
import { Button, Modal, Card } from '@/components/ui';
import { useResults, useShooters, useAuth } from '@/hooks';
import { getEvent } from '@/lib/services/eventService';
import { Event, Result, ResultInput } from '@/types';

export default function ResultsPageContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') || '';

  const [event, setEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(true);

  const { results, loading: resultsLoading, error, addResult, removeResult } = useResults(eventId);
  const { shooters, loading: shootersLoading } = useShooters(true);
  const { isAdmin } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setEventLoading(false);
      return;
    }

    async function loadEvent() {
      try {
        const data = await getEvent(eventId);
        setEvent(data);
      } catch (err) {
        console.error('Error loading event:', err);
      } finally {
        setEventLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const handleAddResult = async (data: ResultInput) => {
    if (!event) return;
    setSubmitting(true);
    try {
      await addResult(data, event);
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResult = async (result: Result) => {
    if (confirm('¿Eliminar este resultado?')) {
      await removeResult(result.id);
    }
  };

  const loading = eventLoading || resultsLoading || shootersLoading;
  const existingShooterIds = results.map((r) => r.shooterId);

  if (!eventId) {
    return (
      <Layout>
        <Card>
          <p className="text-center py-8 text-gray-500">
            No se especificó un evento.
          </p>
          <div className="text-center">
            <Link href="/eventos">
              <Button variant="secondary">Volver a eventos</Button>
            </Link>
          </div>
        </Card>
      </Layout>
    );
  }

  if (eventLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <Card>
          <p className="text-center py-8 text-gray-500">
            Evento no encontrado.
          </p>
          <div className="text-center">
            <Link href="/eventos">
              <Button variant="secondary">Volver a eventos</Button>
            </Link>
          </div>
        </Card>
      </Layout>
    );
  }

  const typeLabel = event.type === 'official' ? 'Competencia Oficial' : 'Evento Interno';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/eventos">
            <Button variant="secondary" size="sm">
              ← Volver
            </Button>
          </Link>
        </div>

        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <p className="text-gray-600">
                {typeLabel} • {event.totalTargets} blancos
              </p>
            </div>
            {isAdmin && (
              <Button onClick={() => setShowModal(true)}>
                Agregar resultado
              </Button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          <ResultsTable
            results={results}
            shooters={shooters}
            event={event}
            loading={loading}
            isAdmin={isAdmin}
            onDelete={handleDeleteResult}
          />
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Agregar resultado"
      >
        <ResultsEntry
          event={event}
          shooters={shooters}
          existingShooterIds={existingShooterIds}
          onSubmit={handleAddResult}
          onCancel={() => setShowModal(false)}
          loading={submitting}
        />
      </Modal>
    </Layout>
  );
}
