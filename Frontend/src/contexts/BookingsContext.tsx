import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking } from '@/types';
import { mockBookings } from '@/data/mockData';

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  cancelBooking: (bookingId: string) => void;
  getUserBookings: (userId: string) => Booking[];
  getCourtBookings: (courtId: string, date: string) => Booking[];
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

const BOOKINGS_KEY = 'sportcenter_bookings';

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(BOOKINGS_KEY);
    if (stored) {
      setBookings(JSON.parse(stored));
    } else {
      setBookings(mockBookings);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(mockBookings));
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(newBookings));
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date(),
    };

    const updatedBookings = [...bookings, newBooking];
    saveBookings(updatedBookings);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: 'cancelled' as const } : booking
    );
    saveBookings(updatedBookings);
  };

  const getUserBookings = (userId: string): Booking[] => {
    return bookings.filter(b => b.userId === userId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const getCourtBookings = (courtId: string, date: string): Booking[] => {
    return bookings.filter(b => b.courtId === courtId && b.date === date && b.status !== 'cancelled');
  };

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, cancelBooking, getUserBookings, getCourtBookings }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}
