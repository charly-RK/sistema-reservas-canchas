import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas de Sistema y Aceptación
 * Sistema de Reservas de Canchas Deportivas
 */
export default defineConfig({
    testDir: './tests',

    /* Ejecutar pruebas en paralelo */
    fullyParallel: true,

    /* Fallar el build en CI si hay test.only */
    forbidOnly: !!process.env.CI,

    /* Reintentos en caso de fallo */
    retries: process.env.CI ? 2 : 0,

    /* Workers para paralelización */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter para resultados */
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
    ],

    /* Configuración compartida para todos los tests */
    use: {
        /* URL base de la aplicación */
        baseURL: 'http://localhost:8080',

        /* Capturar trace en primer reintento */
        trace: 'on-first-retry',

        /* Capturar screenshot en fallo */
        screenshot: 'only-on-failure',

        /* Capturar video en fallo */
        video: 'on-first-retry',

        /* Timeout para acciones */
        actionTimeout: 10000,

        /* Timeout para navegación */
        navigationTimeout: 30000,
    },

    /* Configurar proyectos para diferentes navegadores */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    /* Servidor de desarrollo - comentado porque ya está corriendo */
    // webServer: {
    //     command: 'npm run dev',
    //     url: 'http://localhost:8080',
    //     reuseExistingServer: !process.env.CI,
    //     timeout: 120000,
    // },
});
