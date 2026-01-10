import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Court } from '@/types';
import { MapPin, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourtCardProps {
  court: Court;
}

export function CourtCard({ court }: CourtCardProps) {
  const navigate = useNavigate();

  const getSportBadgeClass = (type: string) => {
    switch (type) {
      case 'FUTBOL':
        return 'bg-green-600 text-white';
      case 'TENIS':
        return 'bg-orange-500 text-white';
      case 'BASQUET':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getSportDisplayName = (type: string) => {
    switch (type) {
      case 'FUTBOL': return 'Fútbol';
      case 'TENIS': return 'Tenis';
      case 'BASQUET': return 'Básquetbol';
      default: return type;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <div className="relative h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
        {court.imageUrl ? (
          <img
            src={court.imageUrl}
            alt={court.nombre}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="text-4xl text-gray-400">🏟️</span>
        )}
        <Badge className={`absolute top-3 left-3 ${getSportBadgeClass(court.tipo)}`}>
          {getSportDisplayName(court.tipo)}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg text-foreground line-clamp-1">{court.nombre}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{court.description || 'Sin descripción disponible'}</p>
      </CardHeader>

      <CardContent className="pb-2 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          8:00 AM - 10:00 PM
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4 border-t border-border">
        <div className="text-lg font-bold text-primary">
          ${court.precio_hora}
          <span className="text-sm font-normal text-muted-foreground">/hora</span>
        </div>
        <Button onClick={() => navigate(`/Reserva?court=${court.id}`)}>
          Reservar
        </Button>
      </CardFooter>
    </Card>
  );
}
