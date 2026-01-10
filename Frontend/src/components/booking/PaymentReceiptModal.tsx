import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PaymentReceipt } from '@/types';
import { CheckCircle2, Download, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentReceiptModalProps {
  open: boolean;
  onClose: () => void;
  receipt: PaymentReceipt | null;
  bookingDetails: {
    courtName: string;
    date: string;
    time: string;
    userName: string;
    userEmail: string;
  } | null;
}

export function PaymentReceiptModal({
  open,
  onClose,
  receipt,
  bookingDetails,
}: PaymentReceiptModalProps) {
  const navigate = useNavigate();

  if (!receipt || !bookingDetails) return null;

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <DialogTitle className="text-2xl">¡Pago Exitoso!</DialogTitle>
          <DialogDescription>
            Tu reserva ha sido confirmada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Receipt Details */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nº de Recibo</span>
              <span className="font-mono">{receipt.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fecha de Pago</span>
              <span>{new Date(receipt.date).toLocaleDateString('es-ES')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método de Pago</span>
              <span>**** **** **** {receipt.cardLast4}</span>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-2">
            <h4 className="font-semibold">Detalles de la Reserva</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Cancha:</span> {bookingDetails.courtName}</p>
              <p className="capitalize"><span className="text-muted-foreground">Fecha:</span> {formatDate(bookingDetails.date)}</p>
              <p><span className="text-muted-foreground">Horario:</span> {bookingDetails.time} - {getEndTime(bookingDetails.time)}</p>
              <p><span className="text-muted-foreground">Reservado por:</span> {bookingDetails.userName}</p>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Pagado</span>
            <span className="text-primary">${receipt.amount}</span>
          </div>

          {/* Email Notification */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
            <Mail className="h-4 w-4 text-primary" />
            <span>Se ha enviado una confirmación a {bookingDetails.userEmail}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => { }}>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
            <Button className="flex-1" onClick={() => { onClose(); navigate('/historial'); }}>
              Ver Reservas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
