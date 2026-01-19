/**
 * Datos de prueba para las pruebas de Sistema y Aceptación
 * Sistema de Reservas de Canchas Deportivas
 */

// Usuario de prueba para cliente
export const TEST_USER = {
    nombre: 'Usuario Prueba',
    email: `test.user.${Date.now()}@test.com`,
    password: 'Test123456',
    phone: '0991234567',
};

// Usuario de prueba para administrador
export const TEST_ADMIN = {
    email: 'scarletcayapa@gmail.com',
    password: 'Scarlet123',
};

// Datos de pago de prueba
export const TEST_PAYMENT = {
    cardNumber: '4111 1111 1111 1111',
    cardName: 'Usuario Prueba',
    expiryDate: '12/28',
    cvv: '123',
};

// Datos de cancha de prueba
export const TEST_COURT = {
    nombre: 'Cancha de Prueba E2E',
    tipo: 'FUTBOL',
    precio_hora: 25,
    estado: 'DISPONIBLE',
};

// Función para generar email único
export function generateUniqueEmail(): string {
    return `test.user.${Date.now()}@test.com`;
}

// Función para obtener fecha futura (mañana)
export function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// Función para obtener hora disponible
export function getAvailableTime(): string {
    return '10:00';
}

// URLs de la aplicación
export const ROUTES = {
    HOME: '/',
    REGISTER: '/Registro',
    COURTS: '/Canchas',
    BOOKING: '/Reserva',
    HISTORY: '/Historial',
    ADMIN: '/Admin',
};

// Selectores comunes
export const SELECTORS = {
    // Formulario de autenticación
    AUTH: {
        EMAIL_INPUT: 'input#email',
        PASSWORD_INPUT: 'input#password',
        NAME_INPUT: 'input#fullName',
        PHONE_INPUT: 'input#phone',
        SUBMIT_BUTTON: 'button[type="submit"]',
        TOGGLE_MODE_BUTTON: 'button.text-primary',
    },
    // Navegación
    NAV: {
        CANCHAS_LINK: 'a[href="/Canchas"]',
        RESERVA_LINK: 'a[href="/Reserva"]',
        HISTORIAL_LINK: 'a[href="/Historial"]',
        ADMIN_LINK: 'a[href="/Admin"]',
        LOGOUT_BUTTON: 'button:has-text("Cerrar Sesión")',
    },
    // Reservas
    BOOKING: {
        COURT_SELECT: 'button[role="combobox"]',
        CALENDAR: '[role="grid"]',
        TIME_SLOT: 'button:has-text(":00")',
        PAYMENT_FORM: 'form',
        CARD_NUMBER: 'input[placeholder*="1234"]',
        CARD_NAME: 'input[placeholder*="nombre"]',
        EXPIRY: 'input[placeholder*="MM"]',
        CVV: 'input[placeholder*="123"]',
        PAY_BUTTON: 'button:has-text("Pagar")',
    },
    // Admin
    ADMIN: {
        NEW_COURT_BUTTON: 'button:has-text("Nueva Cancha")',
        COURT_NAME_INPUT: 'input#nombre',
        COURT_PRICE_INPUT: 'input#precio_hora',
        SAVE_BUTTON: 'button[type="submit"]',
        EDIT_BUTTON: 'button:has(svg.lucide-edit)',
        DELETE_BUTTON: 'button:has(svg.lucide-trash-2)',
    },
};

// Mensajes esperados
export const MESSAGES = {
    LOGIN_SUCCESS: '¡Bienvenido de nuevo!',
    REGISTER_SUCCESS: '¡Cuenta creada exitosamente!',
    BOOKING_SUCCESS: '¡Reserva confirmada!',
    CANCEL_SUCCESS: 'Reserva cancelada',
    COURT_CREATED: 'Cancha creada',
    COURT_UPDATED: 'Cancha actualizada',
    COURT_DELETED: 'Cancha eliminada',
};
