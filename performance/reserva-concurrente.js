import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 20,          // usuarios virtuales simultáneos
  duration: '10s',  // duración de la prueba
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
  // 1. Login (usuario ya existente)
  const loginRes = http.post(`${BASE_URL}/registro/login`, JSON.stringify({
    email: 'juan@test.com',
    password: '123456',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login exitoso': (r) => r.status === 200,
  });

  const token = loginRes.json('token');

  // 2. Intentar crear reserva (misma cancha, mismo horario)
  const reservaRes = http.post(`${BASE_URL}/reservaciones`, JSON.stringify({
    cancha_id: 1,
    fecha_inicio: '2026-01-20T10:00:00.000Z',
    fecha_fin: '2026-01-20T11:00:00.000Z',
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  check(reservaRes, {
    'reserva procesada': (r) =>
      r.status === 201 || r.status === 400,
  });

  sleep(1);
}
