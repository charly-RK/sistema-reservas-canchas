import { Court, Booking, User, TimeSlot } from '@/types';

// Mock Courts Data
export const mockCourts: Court[] = [
  {
    id: 'court-1',
    name: 'Cancha de Fútbol Principal',
    sportType: 'football',
    description: 'Cancha de fútbol profesional con césped sintético de última generación. Iluminación LED para partidos nocturnos.',
    pricePerHour: 120,
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop&q=60',
    location: 'Zona Norte - Edificio A',
    features: ['Césped sintético', 'Iluminación LED', 'Vestuarios', 'Estacionamiento'],
    capacity: 22,
  },
  {
    id: 'court-2',
    name: 'Cancha de Fútbol 5',
    sportType: 'football',
    description: 'Cancha de fútbol 5 ideal para partidos rápidos y entrenamientos. Superficie de alta calidad.',
    pricePerHour: 80,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60',
    location: 'Zona Norte - Edificio B',
    features: ['Césped sintético', 'Mallas protectoras', 'Iluminación'],
    capacity: 10,
  },
  {
    id: 'court-3',
    name: 'Cancha de Tenis Central',
    sportType: 'tennis',
    description: 'Cancha de tenis con superficie de arcilla. Mantenimiento profesional diario.',
    pricePerHour: 60,
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=60',
    location: 'Zona Sur - Complejo de Tenis',
    features: ['Superficie de arcilla', 'Iluminación', 'Gradas', 'Raquetas disponibles'],
    capacity: 4,
  },
  {
    id: 'court-4',
    name: 'Cancha de Tenis Cubierta',
    sportType: 'tennis',
    description: 'Cancha de tenis techada para jugar en cualquier clima. Superficie dura profesional.',
    pricePerHour: 75,
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60',
    location: 'Zona Sur - Edificio Cubierto',
    features: ['Techada', 'Clima controlado', 'Superficie dura', 'Vestuarios'],
    capacity: 4,
  },
  {
    id: 'court-5',
    name: 'Cancha de Básquet Principal',
    sportType: 'basketball',
    description: 'Cancha de básquetbol profesional con tableros de cristal templado y piso de madera.',
    pricePerHour: 90,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60',
    location: 'Zona Este - Gimnasio Principal',
    features: ['Piso de madera', 'Tableros profesionales', 'Marcador electrónico', 'Gradas'],
    capacity: 10,
  },
  {
    id: 'court-6',
    name: 'Cancha de Básquet Exterior',
    sportType: 'basketball',
    description: 'Cancha de básquetbol al aire libre con iluminación nocturna. Perfecta para juegos casuales.',
    pricePerHour: 50,
    imageUrl: 'https://images.unsplash.com/photo-1559692048-79a3f837883d?w=800&auto=format&fit=crop&q=60',
    location: 'Zona Este - Área Exterior',
    features: ['Al aire libre', 'Iluminación nocturna', 'Bancas'],
    capacity: 10,
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@sportcenter.com',
    fullName: 'Administrador Sistema',
    phone: '+52 555 123 4567',
    membershipType: 'premium',
    createdAt: new Date('2024-01-01'),
    isAdmin: true,
  },
  {
    id: 'user-2',
    email: 'carlos@email.com',
    fullName: 'Carlos Rodríguez',
    phone: '+52 555 234 5678',
    membershipType: 'premium',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'user-3',
    email: 'maria@email.com',
    fullName: 'María González',
    phone: '+52 555 345 6789',
    membershipType: 'regular',
    createdAt: new Date('2024-06-20'),
  },
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    courtId: 'court-1',
    courtName: 'Cancha de Fútbol Principal',
    sportType: 'football',
    userId: 'user-2',
    userName: 'Carlos Rodríguez',
    date: '2025-01-10',
    startTime: '18:00',
    endTime: '19:00',
    totalPrice: 120,
    status: 'confirmed',
    createdAt: new Date('2025-01-08'),
    paymentMethod: 'Visa ****4532',
  },
  {
    id: 'booking-2',
    courtId: 'court-3',
    courtName: 'Cancha de Tenis Central',
    sportType: 'tennis',
    userId: 'user-3',
    userName: 'María González',
    date: '2025-01-09',
    startTime: '10:00',
    endTime: '11:00',
    totalPrice: 60,
    status: 'completed',
    createdAt: new Date('2025-01-07'),
    paymentMethod: 'Mastercard ****8821',
  },
  {
    id: 'booking-3',
    courtId: 'court-5',
    courtName: 'Cancha de Básquet Principal',
    sportType: 'basketball',
    userId: 'user-2',
    userName: 'Carlos Rodríguez',
    date: '2025-01-08',
    startTime: '16:00',
    endTime: '17:00',
    totalPrice: 90,
    status: 'completed',
    createdAt: new Date('2025-01-06'),
    paymentMethod: 'Visa ****4532',
  },
  {
    id: 'booking-4',
    courtId: 'court-2',
    courtName: 'Cancha de Fútbol 5',
    sportType: 'football',
    userId: 'user-3',
    userName: 'María González',
    date: '2025-01-05',
    startTime: '19:00',
    endTime: '20:00',
    totalPrice: 80,
    status: 'cancelled',
    createdAt: new Date('2025-01-03'),
    paymentMethod: 'Mastercard ****8821',
  },
];

// Generate time slots for a day (8:00 AM to 10:00 PM)
export const generateTimeSlots = (courtId: string, date: string, existingBookings: Booking[]): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const bookedTimes = existingBookings
    .filter(b => b.courtId === courtId && b.date === date && b.status !== 'cancelled')
    .map(b => b.startTime);

  for (let hour = 8; hour <= 21; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    slots.push({
      time,
      available: !bookedTimes.includes(time),
    });
  }

  return slots;
};

// Get sport icon color class
export const getSportColor = (sportType: string): string => {
  switch (sportType) {
    case 'football':
      return 'bg-sport-football';
    case 'tennis':
      return 'bg-sport-tennis';
    case 'basketball':
      return 'bg-sport-basketball';
    default:
      return 'bg-primary';
  }
};

// Get sport display name
export const getSportDisplayName = (sportType: string): string => {
  switch (sportType) {
    case 'football':
      return 'Fútbol';
    case 'tennis':
      return 'Tenis';
    case 'basketball':
      return 'Básquetbol';
    default:
      return sportType;
  }
};

// Get booking status display
export const getStatusDisplay = (status: string): { text: string; className: string } => {
  switch (status) {
    case 'confirmed':
      return { text: 'Confirmada', className: 'bg-success text-success-foreground' };
    case 'completed':
      return { text: 'Completada', className: 'bg-muted text-muted-foreground' };
    case 'cancelled':
      return { text: 'Cancelada', className: 'bg-destructive text-destructive-foreground' };
    default:
      return { text: status, className: 'bg-muted' };
  }
};
