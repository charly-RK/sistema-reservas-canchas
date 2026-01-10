import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MembershipType } from '@/types';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Actualizar isLogin cuando cambie el parámetro mode en la URL
  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'register');
  }, [searchParams]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    membershipType: 'regular' as MembershipType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('¡Bienvenido de nuevo!');
        navigate('/');
      } else {
        toast.error(result.error);
      }
    } else {
      if (!formData.fullName || !formData.phone) {
        toast.error('Por favor completa todos los campos');
        setIsLoading(false);
        return;
      }
      const result = await register({
        nombre: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      if (result.success) {
        toast.success('¡Cuenta creada exitosamente!');
        navigate('/');
      } else {
        toast.error(result.error);
      }
    }
    setIsLoading(false);
  };

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Ingresa tus credenciales para continuar' : 'Regístrate para reservar canchas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <Input id="fullName" placeholder="Juan Pérez" value={formData.fullName} onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="0935512567" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Membresía</Label>
                    <Select value={formData.membershipType} onValueChange={(v: MembershipType) => setFormData(p => ({ ...p, membershipType: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••" value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button type="button" className="text-primary hover:underline" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Regístrate' : 'Inicia Sesión'}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
