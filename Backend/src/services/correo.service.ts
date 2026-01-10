import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar configuración al iniciar
transporter.verify((err, success) => {
  if (err) {
    console.error('Error con transporter nodemailer:', err);
  } else {
    console.log(' Nodemailer listo para enviar correos.');
  }
});

interface ReservationEmailData {
  userEmail: string;
  userName: string;
  courtName: string;
  courtType: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}

export class CorreoService {
  async enviarConfirmacionReserva(data: ReservationEmailData): Promise<boolean> {
    try {
      const { userEmail, userName, courtName, courtType, startDate, endDate, totalPrice } = data;

      const fechaFormateada = new Date(startDate).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Bogota', 
      });

      const horaInicio = new Date(startDate).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota', 
      });

      const horaFin = new Date(endDate).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota', 
      });

      const tipoDeporte = this.getTipoDeporteNombre(courtType);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #2563eb;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #555;
            }
            .detail-value {
              color: #333;
            }
            .total {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Reserva Confirmada!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${userName}</strong>,</p>
              <p>Tu reserva ha sido confirmada exitosamente. Aquí están los detalles:</p>
              
              <div style="margin: 20px 0;">
                <div class="detail-row">
                  <span class="detail-label">🏟️ Cancha:</span>
                  <span class="detail-value">${courtName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">⚽ Deporte:</span>
                  <span class="detail-value">${tipoDeporte}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">📅 Fecha:</span>
                  <span class="detail-value">${fechaFormateada}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">🕐 Horario:</span>
                  <span class="detail-value">${horaInicio} - ${horaFin}</span>
                </div>
              </div>

              <div class="total">
                Total: $${totalPrice.toFixed(2)}
              </div>

              <p style="margin-top: 30px;">
                <strong>Importante:</strong> Por favor llega 10 minutos antes de tu horario reservado.
              </p>

              <p>¡Nos vemos pronto!</p>
              <p>Equipo de Risk - Keep</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no responder.</p>
              <p>© ${new Date().getFullYear()} Risk - Keep. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await transporter.sendMail({
        from: `"SportCenter - Reservas" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `✅ Confirmación de Reserva - ${courtName}`,
        html,
      });

      console.log('✅ Correo enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error enviando correo:', error);
      return false;
    }
  }

  private getTipoDeporteNombre(tipo: string): string {
    const nombres: Record<string, string> = {
      FUTBOL: 'Fútbol',
      TENIS: 'Tenis',
      BASQUET: 'Básquetbol',
    };
    return nombres[tipo] || tipo;
  }
}
