// User types
export type MembershipType = 'regular' | 'premium';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'CLIENTE' | 'ADMIN';
  fecha_registro?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string | null;
}

// Court types
export type CourtType = 'FUTBOL' | 'TENIS' | 'BASQUET';

export interface Court {
  id: number;
  nombre: string;
  tipo: CourtType;
  precio_hora: number;
  estado: 'DISPONIBLE' | 'MANTENIMIENTO';
  // Optional UI fields that might not be in DB yet or need mapping
  imageUrl?: string;
  description?: string;
}

// Booking types
export type BookingStatus = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';

export interface Reservation {
  id: number;
  usuario_id: number;
  cancha_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: BookingStatus;
  creado_en?: string;
  court?: Court;
  user?: User;
}

// Payment types
export interface Payment {
  id: number;
  reserva_id: number;
  monto: number;
  metodo: 'TARJETA' | 'EFECTIVO';
  estado: 'COMPLETADO' | 'FALLIDO';
  fecha_pago?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentReceipt {
  id: string;
  bookingId: string;
  amount: number;
  date: Date;
  cardLast4: string;
  status: 'success' | 'failed';
}
