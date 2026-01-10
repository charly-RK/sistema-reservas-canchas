import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">SC</span>
              </div>
              <span className="font-bold text-xl text-foreground">SportCenter</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu centro deportivo de confianza. Reserva canchas de fútbol, tenis y básquetbol de manera fácil y rápida.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/canchas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Nuestras Canchas
                </Link>
              </li>
              <li>
                <Link to="/reserva" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Reservar Ahora
                </Link>
              </li>
              <li>
                <Link to="/historial" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mis Reservas
                </Link>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Horarios</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Lunes a Viernes: 8:00 - 22:00</li>
              <li>Sábados: 8:00 - 20:00</li>
              <li>Domingos: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Risk - Keep. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
