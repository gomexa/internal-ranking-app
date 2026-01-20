'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { EventList, EventForm } from '@/components/events';
import { SeasonSelector } from '@/components/ranking';
import { Button, Modal, Card, CardHeader } from '@/components/ui';
import { useEvents, useAuth } from '@/hooks';
import { Event, EventInput } from '@/types';
import { getCurrentSeason } from '@/lib/constants';

export default function EventsPage() {
  const [season, setSeason] = useState(getCurrentSeason());
  const { events, loading, error, addEvent, editEvent, removeEvent } = useEvents(season);
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (event: Event) => {
    if (confirm(`¿Eliminar el evento "${event.name}"?`)) {
      await removeEvent(event.id);
    }
  };

  const handleSubmit = async (data: EventInput) => {
    setSubmitting(true);
    try {
      if (editingEvent) {
        await editEvent(editingEvent.id, data);
      } else {
        await addEvent(data);
      }
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Eventos</h2>
            <div className="flex items-center gap-4">
              <SeasonSelector value={season} onChange={setSeason} />
              {isAdmin && (
                <Button onClick={handleAdd}>Agregar evento</Button>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          <EventList
            events={events}
            loading={loading}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEvent ? 'Editar evento' : 'Nuevo evento'}
      >
        <EventForm
          initialData={editingEvent || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={submitting}
        />
      </Modal>
    </Layout>
  );
}
