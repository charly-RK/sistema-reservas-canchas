import { MainLayout } from '@/components/layout/MainLayout';
import { CourtCard } from '@/components/courts/CourtCard';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Court, CourtType } from '@/types';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CourtType | 'all'>('all');

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await api.get('/canchas');
        setCourts(response.data);
      } catch (error) {
        console.error('Error fetching courts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const filteredCourts = filter === 'all' ? courts : courts.filter(c => c.tipo === filter);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Nuestras Canchas</h1>
        <p className="text-muted-foreground mb-6">Encuentra la cancha perfecta para tu deporte</p>

        <div className="flex gap-2 mb-8 flex-wrap">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
            Todas
          </Button>
          <Button variant={filter === 'FUTBOL' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('FUTBOL')}>
            Fútbol
          </Button>
          <Button variant={filter === 'TENIS' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('TENIS')}>
            Tenis
          </Button>
          <Button variant={filter === 'BASQUET' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('BASQUET')}>
            Básquetbol
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map(court => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
