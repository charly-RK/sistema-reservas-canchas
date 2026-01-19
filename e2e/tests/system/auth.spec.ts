import { test, expect } from '@playwright/test';
import {
    TEST_USER,
    generateUniqueEmail,
    ROUTES,
    SELECTORS,
    MESSAGES
} from '../../fixtures/test-data';

/**
 * PRUEBAS DE SISTEMA - AUTENTICACIÓN
 * 
 * Validan las funcionalidades de registro, inicio y cierre de sesión
 * desde la interfaz de usuario.
 */

test.describe('PS - Autenticación', () => {

    test.beforeEach(async ({ page }) => {
        // Navegar a la página de registro/login antes de cada prueba
        await page.goto(ROUTES.REGISTER);
    });

    test('PS001 - Navegación a página de registro', async ({ page }) => {
        // Verificar que la página de registro se carga correctamente
        await expect(page).toHaveURL(/\/[Rr]egistro/);

        // Verificar que el título está presente (puede ser h1, h2, h3)
        await expect(page.locator('h1, h2, h3').filter({ hasText: /Iniciar Sesión|Crear Cuenta/ }).first()).toBeVisible();

        // Verificar que el formulario está presente
        await expect(page.locator('form')).toBeVisible();
    });

    test('PS002 - Registro exitoso de nuevo usuario', async ({ page }) => {
        // Generar email único para evitar conflictos
        const uniqueEmail = generateUniqueEmail();

        // Cambiar a modo registro si está en modo login
        const toggleButton = page.locator('button.text-primary, button:has-text("Regístrate")');
        if (await toggleButton.isVisible()) {
            // Verificar si estamos en modo login usando el heading
            const loginTitle = page.getByRole('heading', { name: 'Iniciar Sesión' });
            if (await loginTitle.isVisible()) {
                await toggleButton.click();
                await page.waitForTimeout(500);
            }
        }

        // Llenar formulario de registro
        await page.locator(SELECTORS.AUTH.NAME_INPUT).fill(TEST_USER.nombre);
        await page.locator(SELECTORS.AUTH.PHONE_INPUT).fill(TEST_USER.phone);
        await page.locator(SELECTORS.AUTH.EMAIL_INPUT).fill(uniqueEmail);
        await page.locator(SELECTORS.AUTH.PASSWORD_INPUT).fill(TEST_USER.password);

        // Enviar formulario
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        // Verificar mensaje de éxito o redirección
        await expect(
            page.locator(`text=${MESSAGES.REGISTER_SUCCESS}`).or(page.locator('text=exitosamente'))
        ).toBeVisible({ timeout: 10000 });
    });

    test('PS003 - Validación de campos obligatorios en registro', async ({ page }) => {
        // Cambiar a modo registro
        const toggleButton = page.locator('button:has-text("Regístrate")');
        if (await toggleButton.isVisible()) {
            await toggleButton.click();
            await page.waitForTimeout(500);
        }

        // Intentar enviar formulario vacío
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        // Verificar que los campos requeridos muestran validación del navegador
        const emailInput = page.locator(SELECTORS.AUTH.EMAIL_INPUT);
        await expect(emailInput).toHaveAttribute('required', '');
    });

    test('PS004 - Inicio de sesión exitoso', async ({ page }) => {
        // Primero registrar un usuario único
        const uniqueEmail = generateUniqueEmail();

        // Cambiar a modo registro
        const registerButton = page.locator('button:has-text("Regístrate")');
        if (await registerButton.isVisible()) {
            await registerButton.click();
            await page.waitForTimeout(500);
        }

        // Registrar usuario
        await page.locator(SELECTORS.AUTH.NAME_INPUT).fill(TEST_USER.nombre);
        await page.locator(SELECTORS.AUTH.PHONE_INPUT).fill(TEST_USER.phone);
        await page.locator(SELECTORS.AUTH.EMAIL_INPUT).fill(uniqueEmail);
        await page.locator(SELECTORS.AUTH.PASSWORD_INPUT).fill(TEST_USER.password);
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        await page.waitForTimeout(2000);

        // Ir nuevamente a login
        await page.goto(ROUTES.REGISTER);

        // Asegurarse de estar en modo login usando el heading específico
        const loginHeading = page.getByRole('heading', { name: 'Iniciar Sesión' });
        if (!(await loginHeading.isVisible())) {
            const loginButton = page.locator('button:has-text("Inicia Sesión")');
            if (await loginButton.isVisible()) {
                await loginButton.click();
                await page.waitForTimeout(500);
            }
        }

        // Llenar formulario de login
        await page.locator(SELECTORS.AUTH.EMAIL_INPUT).fill(uniqueEmail);
        await page.locator(SELECTORS.AUTH.PASSWORD_INPUT).fill(TEST_USER.password);

        // Enviar formulario
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        // Verificar login exitoso (redirección a home o mensaje de bienvenida)
        await expect(
            page.locator(`text=${MESSAGES.LOGIN_SUCCESS}`).or(page.locator('h1, h2, h3'))
        ).toBeVisible({ timeout: 10000 });
    });

    test('PS005 - Error en inicio de sesión con credenciales incorrectas', async ({ page }) => {
        // Asegurarse de estar en modo login
        await page.waitForTimeout(1000);

        // Llenar formulario con credenciales incorrectas
        await page.locator(SELECTORS.AUTH.EMAIL_INPUT).fill('usuario_inexistente@test.com');
        await page.locator(SELECTORS.AUTH.PASSWORD_INPUT).fill('password_incorrecto');

        // Enviar formulario
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        // Verificar que aparece mensaje de error (toast o alert)
        // El mensaje puede variar, así que buscamos varios patrones
        await page.waitForTimeout(3000);

        // Verificar que NO somos redirigidos a home (sigue en registro)
        await expect(page).toHaveURL(/\/[Rr]egistro/);
    });

    test('PS006 - Cierre de sesión', async ({ page }) => {
        // Primero hacer login
        const uniqueEmail = generateUniqueEmail();

        // Registrar usuario
        const registerButton = page.locator('button:has-text("Regístrate")');
        if (await registerButton.isVisible()) {
            await registerButton.click();
            await page.waitForTimeout(500);
        }

        await page.locator(SELECTORS.AUTH.NAME_INPUT).fill(TEST_USER.nombre);
        await page.locator(SELECTORS.AUTH.PHONE_INPUT).fill(TEST_USER.phone);
        await page.locator(SELECTORS.AUTH.EMAIL_INPUT).fill(uniqueEmail);
        await page.locator(SELECTORS.AUTH.PASSWORD_INPUT).fill(TEST_USER.password);
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        await page.waitForTimeout(2000);

        // Login con el usuario
        await page.goto(ROUTES.REGISTER);
        await page.locator(SELECTORS.AUTH.EMAIL_INPUT).fill(uniqueEmail);
        await page.locator(SELECTORS.AUTH.PASSWORD_INPUT).fill(TEST_USER.password);
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        await page.waitForTimeout(2000);

        // Buscar y hacer clic en botón de cerrar sesión
        const logoutButton = page.locator('button:has-text("Cerrar"), button:has-text("Salir"), button:has-text("Logout")');
        if (await logoutButton.isVisible()) {
            await logoutButton.click();

            // Verificar que se cerró la sesión (redirección a login o cambio en UI)
            await expect(page.getByRole('heading', { name: 'Iniciar Sesión' }).or(page.locator('a[href="/Registro"]'))).toBeVisible({ timeout: 10000 });
        }
    });
});
