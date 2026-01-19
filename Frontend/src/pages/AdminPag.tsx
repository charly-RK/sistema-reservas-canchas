import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import type { Court } from '@/types';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'FUTBOL' as 'FUTBOL' | 'TENIS' | 'BASQUET',
    precio_hora: 0,
    estado: 'DISPONIBLE' as 'DISPONIBLE' | 'MANTENIMIENTO',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.rol !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchCourts();
  }, [isAuthenticated, user, navigate, authLoading]);

  const fetchCourts = async () => {
    try {
      const response = await api.get('/canchas');
      setCourts(response.data);
    } catch (error) {
      toast.error('Error al cargar canchas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourt) {
        await api.put(`/canchas/${editingCourt.id}`, formData);
        toast.success('Cancha actualizada');
      } else {
        await api.post('/canchas', formData);
        toast.success('Cancha creada');
      }
      setShowForm(false);
      setEditingCourt(null);
      resetForm();
      fetchCourts();
    } catch (error) {
      toast.error('Error al guardar cancha');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta cancha?')) return;
    try {
      await api.delete(`/canchas/${id}`);
      toast.success('Cancha eliminada');
      fetchCourts();
    } catch (error) {
      toast.error('Error al eliminar cancha');
    }
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    setFormData({
      nombre: court.nombre,
      tipo: court.tipo,
      precio_hora: court.precio_hora,
      estado: court.estado,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: 'FUTBOL',
      precio_hora: 0,
      estado: 'DISPONIBLE',
    });
  };

  const getSportName = (tipo: string) => {
    const names: Record<string, string> = {
      FUTBOL: 'Fútbol',
      TENIS: 'Tenis',
      BASQUET: 'Básquetbol',
    };
    return names[tipo] || tipo;
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button onClick={() => { setShowForm(true); setEditingCourt(null); resetForm(); }}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Cancha
          </Button>
        </div>

        {/* Formulario de Cancha */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingCourt ? 'Editar Cancha' : 'Nueva Cancha'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Deporte</Label>
                  <Select value={formData.tipo} onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FUTBOL">Fútbol</SelectItem>
                      <SelectItem value="TENIS">Tenis</SelectItem>
                      <SelectItem value="BASQUET">Básquetbol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="precio_hora">Precio por Hora ($)</Label>
                  <Input
                    id="precio_hora"
                    type="number"
                    value={formData.precio_hora}
                    onChange={(e) => setFormData({ ...formData, precio_hora: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value: any) => setFormData({ ...formData, estado: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                      <SelectItem value="MANTENIMIENTO">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingCourt ? 'Actualizar' : 'Crear'}</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingCourt(null); resetForm(); }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Canchas */}
        <div className="grid gap-4">
          {courts.map((court) => (
            <Card key={court.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{court.nombre}</h3>
                    <p className="text-muted-foreground">{getSportName(court.tipo)}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${court.precio_hora}/hora
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${court.estado === 'DISPONIBLE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {court.estado === 'DISPONIBLE' ? 'Disponible' : 'Mantenimiento'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(court)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(court.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No hay canchas registradas</p>
              <Button onClick={() => { setShowForm(true); resetForm(); }}>
                <Plus className="mr-2 h-4 w-4" /> Crear Primera Cancha
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
