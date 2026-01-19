# Sistema de Gestión de Reservas - Centro Deportivo

Sistema web orientado a objetos para la gestión de reservas de canchas deportivas, desarrollado con Node.js, TypeScript, React y Prisma.

## 📋 Descripción

Aplicación web que permite a usuarios registrarse, reservar canchas deportivas (fútbol, tenis, básquet), gestionar horarios, realizar pagos en línea y recibir notificaciones por correo electrónico.

## 🚀 Características

- ✅ Registro e inicio de sesión con JWT
- ✅ Gestión de canchas deportivas (CRUD)
- ✅ Sistema de reservas con detección de conflictos
- ✅ Procesamiento de pagos simulado
- ✅ Notificaciones automáticas por email
- ✅ Panel de administración
- ✅ Historial de reservas
- ✅ **Seguridad Mejorada:**
    - Autenticación JWT robusta
    - Protección contra inyecciones SQL (Prisma)
    - Validación estricta de datos
    - Protección de datos sensibles

## 🛠️ Tecnologías

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- SQLite
- JWT + bcrypt
- Nodemailer
- **Jest + Supertest (Testing)**

### Frontend
- React + Vite
- TypeScript
- TailwindCSS
- Shadcn UI
- React Router
- Axios

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Backend

```bash
cd Backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno (Backend)

Crear archivo `.env` en la carpeta `Backend`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu_secreto_jwt"
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASS="tu_app_password"
NODE_ENV="development"
```

## 🧪 Testing

El proyecto incluye una suite completa de pruebas: unitarias, seguridad, integración, rendimiento y E2E.

### Backend (Unitarias, Seguridad, Integración, Rendimiento)

Ejecutar en la carpeta `Backend`:

```bash
# Pruebas Unitarias
npm test

# Pruebas de Seguridad
npm run test:security

# Pruebas de Integración
npm run test:integration

# Pruebas de Rendimiento
npm run test:performance
```

### E2E (End-to-End) con Playwright

Las pruebas E2E verifican el flujo completo del usuario en la aplicación real.

**Requisitos:**
1. Backend corriendo (`npm run dev` en carpeta `Backend`)
2. Frontend corriendo (`npm run dev` en carpeta `Frontend`)

**Ejecutar pruebas:**

```bash
cd e2e
npx playwright test
```

Ver reporte detallado:
```bash
npx playwright show-report
```

## 🖥️ Uso

1. **Backend**: Asegúrate de que el servidor esté corriendo en puerto 3000.
2. **Frontend**: Asegúrate de que el cliente esté corriendo en puerto 8080.
3. **Abrir navegador**: Ve a `http://localhost:8080` (o el puerto que indique Vite).

### Crear Usuario Admin

```bash
cd Backend
npx prisma studio
```

En Prisma Studio, cambia el campo `rol` de un usuario de "CLIENTE" a "ADMIN".

## 📁 Estructura del Proyecto

```
Reservas Canchas/
├── Backend/
│   ├── src/
│   │   ├── controllador/     # Controladores
│   │   ├── services/          # Lógica de negocio
│   │   ├── rutas/             # Rutas de API
│   │   ├── middleware/        # Middleware (Auth, etc)
│   │   ├── security/          # Tests de seguridad
│   │   └── index.ts           # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de BD
│   │   └── seed.ts            # Datos de prueba
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/        # Componentes React
    │   ├── pages/             # Páginas
    │   ├── contexts/          # Context API
    │   └── services/          # API client
    └── package.json
```

## 🏗️ Arquitectura

### Backend (MVC)
- **Modelos**: Prisma Schema (Usuario, Cancha, Reserva, Pago)
- **Controladores**: `RegistroController`, `CanchasController`, `ReservacionController`, `PagoController`
- **Servicios**: `RegistroService`, `CanchasService`, `ReservacionService`, `PagoService`, `CorreoService`
- **Middleware**: `authMiddleware` (Protección de rutas)

### Frontend
- **Rutas**: React Router 
- **Estado**: Context API para autenticación
- **UI**: Componentes reutilizables con Shadcn UI

## 📡 API Endpoints

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

### Canchas
- `GET /canchas` - Listar canchas (Público)
- `POST /canchas` - Crear cancha (Admin)
- `PUT /canchas/:id` - Actualizar cancha (Admin)
- `DELETE /canchas/:id` - Eliminar cancha (Admin)

### Reservas
- `GET /reservas` - Listar todas (Público - Disponibilidad)
- `GET /reservas/user/:userId` - Mis reservas
- `POST /reservas` - Crear reserva (Autenticado)
- `DELETE /reservas/:id` - Cancelar (Autenticado)

### Pagos
- `POST /pagos` - Procesar pago (Autenticado)

## 👥 Autores

- **Desarrollador**: GRUPO 5
- **Proyecto**: Sistema de Gestión de Reservas


