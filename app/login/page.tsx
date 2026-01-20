'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error: authError, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirigir si ya está autenticado
  if (isAdmin) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Acceso Administrador
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || authError) && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error || authError}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@club.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-500 text-center">
            El acceso de administrador es solo para miembros autorizados del club.
          </p>
        </Card>
      </div>
    </Layout>
  );
}
