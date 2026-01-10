import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TimeSlot } from '@/types';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  courtId: string;
  getTimeSlots: (courtId: string, date: string) => TimeSlot[];
  onSelectSlot: (date: string, time: string) => void;
  selectedDate: string | null;
  selectedTime: string | null;
}

export function BookingCalendar({
  courtId,
  getTimeSlots,
  onSelectSlot,
  selectedDate,
  selectedTime,
}: BookingCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
  };

  const formatDayNumber = (date: Date) => {
    return date.getDate();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const canGoPrev = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentWeekStart > today;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="capitalize">{formatMonthYear(currentWeekStart)}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('prev')}
              disabled={!canGoPrev()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => {
            const dateStr = formatDate(day);
            const isSelected = selectedDate === dateStr;
            const past = isPast(day);

            return (
              <button
                key={dateStr}
                onClick={() => !past && onSelectSlot(dateStr, selectedTime || '')}
                disabled={past}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-colors',
                  past && 'opacity-50 cursor-not-allowed',
                  !past && 'hover:bg-muted cursor-pointer',
                  isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                  isToday(day) && !isSelected && 'ring-2 ring-primary'
                )}
              >
                <span className="text-xs font-medium">{formatDayName(day)}</span>
                <span className="text-lg font-bold">{formatDayNumber(day)}</span>
              </button>
            );
          })}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Horarios disponibles</h4>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {getTimeSlots(courtId, selectedDate).map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? 'default' : 'outline'}
                  size="sm"
                  disabled={!slot.available}
                  onClick={() => onSelectSlot(selectedDate, slot.time)}
                  className={cn(
                    'text-sm',
                    !slot.available && 'bg-destructive/10 text-destructive border-destructive/20 cursor-not-allowed'
                  )}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {!selectedDate && (
          <p className="text-center text-muted-foreground py-8">
            Selecciona un día para ver los horarios disponibles
          </p>
        )}
      </CardContent>
    </Card>
  );
}
