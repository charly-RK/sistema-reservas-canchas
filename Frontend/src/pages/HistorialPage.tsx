import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import type { Reservation } from '@/types';

export default function HistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/registro');
      return;
    }
    fetchReservations();
  }, [isAuthenticated, user, navigate]);

  const fetchReservations = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/reservaciones/user/${user.id}`);
      setReservations(response.data);
    } catch (error) {
      toast.error('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
    try {
      await api.delete(`/reservaciones/${id}`);
      toast.success('Reserva cancelada');
      fetchReservations();
    } catch (error) {
      toast.error('Error al cancelar reserva');
    }
  };

  const getStatusBadge = (estado: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      PENDIENTE: { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      CONFIRMADA: { text: 'Confirmada', className: 'bg-green-100 text-green-800' },
      CANCELADA: { text: 'Cancelada', className: 'bg-red-100 text-red-800' },
    };
    return badges[estado] || { text: estado, className: 'bg-gray-100 text-gray-800' };
  };

  const getSportName = (tipo: string) => {
    const names: Record<string, string> = {
      FUTBOL: 'Fútbol',
      TENIS: 'Tenis',
      BASQUET: 'Básquetbol',
    };
    return names[tipo] || tipo;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>

        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No tienes reservas aún</p>
              <Button onClick={() => navigate('/Reserva')}>Hacer una Reserva</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map(reservation => {
              const status = getStatusBadge(reservation.estado);
              const canCancel = reservation.estado === 'CONFIRMADA' && new Date(reservation.fecha_inicio) > new Date();

              return (
                <Card key={reservation.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {reservation.cancha?.nombre || 'Cancha'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {reservation.cancha && getSportName(reservation.cancha.tipo)}
                        </p>
                      </div>
                      <Badge className={status.className}>{status.text}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(reservation.fecha_inicio)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(reservation.fecha_inicio)} - {formatTime(reservation.fecha_fin)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        ${reservation.cancha ?
                          (reservation.cancha.precio_hora *
                            ((new Date(reservation.fecha_fin).getTime() - new Date(reservation.fecha_inicio).getTime()) / (1000 * 60 * 60))
                          ).toFixed(2)
                          : '0'}
                      </span>
                      {canCancel && (
                        <Button variant="destructive" size="sm" onClick={() => handleCancel(reservation.id)}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
