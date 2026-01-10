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

## 🛠️ Tecnologías

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- SQLite
- JWT + bcrypt
- Nodemailer

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
```

## 🎯 Uso

1. **Iniciar Backend**: `cd Backend && npm run dev` (Puerto 3000)
2. **Iniciar Frontend**: `cd Frontend && npm run dev` (Puerto 5173)
3. **Abrir navegador**: `http://localhost:5173`

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

### Frontend
- **Rutas**: React Router con rutas en español
- **Estado**: Context API para autenticación
- **UI**: Componentes reutilizables con Shadcn UI

## 📡 API Endpoints

### Autenticación
- `POST /api/registro/register` - Registrar usuario
- `POST /api/registro/login` - Iniciar sesión

### Canchas
- `GET /api/canchas` - Listar canchas
- `POST /api/canchas` - Crear cancha (admin)
- `PUT /api/canchas/:id` - Actualizar cancha
- `DELETE /api/canchas/:id` - Eliminar cancha

### Reservas
- `GET /api/reservaciones` - Listar todas
- `GET /api/reservaciones/user/:userId` - Por usuario
- `POST /api/reservaciones` - Crear reserva
- `DELETE /api/reservaciones/:id` - Cancelar

### Pagos
- `POST /api/pagos` - Procesar pago

## 👥 Autores

- **Desarrollador**: Risk Keep
- **Proyecto**: Sistema de Gestión de Reservas


