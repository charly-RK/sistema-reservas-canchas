import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Court } from '@/types';
import { getSportDisplayName } from '@/data/mockData';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface BookingSummaryProps {
  court: Court;
  date: string | null;
  time: string | null;
}

export function BookingSummary({ court, date, time }: BookingSummaryProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getEndTime = (startTime: string) => {
    const [hours] = startTime.split(':').map(Number);
    return `${(hours + 1).toString().padStart(2, '0')}:00`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Reserva</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Court Info */}
        <div className="flex gap-4">
          <img
            src={court.imageUrl}
            alt={court.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h3 className="font-semibold">{court.name}</h3>
            <p className="text-sm text-muted-foreground">{getSportDisplayName(court.sportType)}</p>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {court.location}
            </div>
          </div>
        </div>

        <Separator />

        {/* Date & Time */}
        {date && time ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-medium capitalize">{formatDate(date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Horario</p>
                <p className="font-medium">{time} - {getEndTime(time)} (1 hora)</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Selecciona fecha y horario para ver el resumen completo
          </p>
        )}

        <Separator />

        {/* Price */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Precio por hora</span>
          <span className="font-semibold">${court.pricePerHour}</span>
        </div>

        {date && time && (
          <>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total a pagar</span>
              <span className="text-xl font-bold text-primary">${court.pricePerHour}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
