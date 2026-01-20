'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ShooterTable, ShooterForm } from '@/components/shooters';
import { Button, Modal, Card, CardHeader } from '@/components/ui';
import { useShooters, useAuth } from '@/hooks';
import { Shooter, ShooterInput } from '@/types';

export default function ShootersPage() {
  const { shooters, loading, error, addShooter, editShooter, removeShooter } = useShooters();
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingShooter, setEditingShooter] = useState<Shooter | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = () => {
    setEditingShooter(null);
    setShowModal(true);
  };

  const handleEdit = (shooter: Shooter) => {
    setEditingShooter(shooter);
    setShowModal(true);
  };

  const handleDelete = async (shooter: Shooter) => {
    if (confirm(`¿Eliminar a ${shooter.name}?`)) {
      await removeShooter(shooter.id);
    }
  };

  const handleSubmit = async (data: ShooterInput) => {
    setSubmitting(true);
    try {
      if (editingShooter) {
        await editShooter(editingShooter.id, data);
      } else {
        await addShooter(data);
      }
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Deportistas"
            action={
              isAdmin && (
                <Button onClick={handleAdd}>Agregar deportista</Button>
              )
            }
          />

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          <ShooterTable
            shooters={shooters}
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
        title={editingShooter ? 'Editar deportista' : 'Nuevo deportista'}
      >
        <ShooterForm
          initialData={editingShooter || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={submitting}
        />
      </Modal>
    </Layout>
  );
}
