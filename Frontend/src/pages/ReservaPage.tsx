import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { PaymentForm } from '@/components/booking/PaymentForm';
import { PaymentReceiptModal } from '@/components/booking/PaymentReceiptModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentInfo, PaymentReceipt, Court, Reservation } from '@/types';
import { toast } from 'sonner';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourtId, setSelectedCourtId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courtsRes, reservationsRes] = await Promise.all([
          api.get('/canchas'),
          api.get('/reservaciones')
        ]);
        setCourts(courtsRes.data);
        setReservations(reservationsRes.data);

        const paramCourt = searchParams.get('court');
        if (paramCourt) {
          setSelectedCourtId(paramCourt);
        } else if (courtsRes.data.length > 0) {
          setSelectedCourtId(courtsRes.data[0].id.toString());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const selectedCourt = courts.find(c => c.id.toString() === selectedCourtId);

  const getTimeSlots = (courtId: string, date: string) => {
    // Generar slots desde las 8 AM hasta las 10 PM
    const slots = [];
    for (let i = 8; i < 22; i++) {
      const time = `${i.toString().padStart(2, '0')}:00`;
      // Verificar si está reservado
      const isReserved = reservations.some(r =>
        r.cancha_id.toString() === courtId &&
        r.fecha_inicio.startsWith(`${date}T${time}`) &&
        r.estado !== 'CANCELADA'
      );
      slots.push({ time, available: !isReserved });
    }
    return slots;
  };

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date);
    if (time) setSelectedTime(time);
  };

  const handlePayment = async (paymentInfo: PaymentInfo) => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para reservar');
      navigate('/registro');
      return;
    }
    if (!selectedDate || !selectedTime || !selectedCourt) return;

    setIsProcessing(true);

    try {
      // 1. Crear Reserva
      const startTime = `${selectedDate}T${selectedTime}:00Z`;
      const endTime = `${selectedDate}T${(parseInt(selectedTime) + 1).toString().padStart(2, '0')}:00:00Z`;

      const reservationRes = await api.post('/reservaciones', {
        usuario_id: user.id,
        cancha_id: selectedCourt.id,
        fecha_inicio: startTime,
        fecha_fin: endTime,
      });

      const reservationId = reservationRes.data.id;

      // 2. Procesar Pago
      await api.post('/pagos', {
        reserva_id: reservationId,
        monto: selectedCourt.precio_hora,
        metodo: 'TARJETA',
      });

      const newReceipt: PaymentReceipt = {
        id: `REC-${Date.now()}`,
        bookingId: reservationId.toString(),
        amount: selectedCourt.precio_hora,
        date: new Date(),
        cardLast4: paymentInfo.cardNumber.replace(/\s/g, '').slice(-4),
        status: 'success',
      };

      setReceipt(newReceipt);
      setShowReceipt(true);
      toast.success('¡Reserva confirmada!');

      // Refrescar reservas
      const res = await api.get('/reservaciones');
      setReservations(res.data);

    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.error || 'Error al procesar la reserva');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reservar Cancha</h1>

        <div className="mb-6">
          <Select value={selectedCourtId} onValueChange={v => { setSelectedCourtId(v); setSelectedDate(null); setSelectedTime(null); }}>
            <SelectTrigger className="w-full md:w-80"><SelectValue placeholder="Selecciona una cancha" /></SelectTrigger>
            <SelectContent>
              {courts.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourt && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <BookingCalendar
                courtId={selectedCourtId}
                getTimeSlots={getTimeSlots}
                onSelectSlot={handleSlotSelect}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
              {selectedDate && selectedTime && (
                <PaymentForm amount={selectedCourt.precio_hora} onSubmit={handlePayment} isLoading={isProcessing} />
              )}
            </div>
            <div>
              <BookingSummary
                court={{ ...selectedCourt, name: selectedCourt.nombre, sportType: selectedCourt.tipo, pricePerHour: selectedCourt.precio_hora } as any} // Quick cast to adapt to component props if needed
                date={selectedDate}
                time={selectedTime}
              />
            </div>
          </div>
        )}
      </div>

      <PaymentReceiptModal
        open={showReceipt}
        onClose={() => { setShowReceipt(false); navigate('/historial'); }}
        receipt={receipt}
        bookingDetails={selectedDate && selectedTime && user && selectedCourt ? {
          courtName: selectedCourt.nombre,
          date: selectedDate,
          time: selectedTime,
          userName: user.nombre,
          userEmail: user.email
        } : null}
      />
    </MainLayout>
  );
}
