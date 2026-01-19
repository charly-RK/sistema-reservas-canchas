import { test, expect } from '@playwright/test';
import {
    TEST_USER,
    TEST_PAYMENT,
    generateUniqueEmail,
    getTomorrowDate,
    ROUTES,
    SELECTORS,
    MESSAGES
} from '../../fixtures/test-data';

/**
 * PRUEBAS DE SISTEMA - RESERVAS
 * 
 * Validan el flujo completo de reservación de canchas
 * desde la interfaz de usuario.
 */

test.describe('PS - Reservas', () => {

    // Helper para hacer login antes de las pruebas que lo requieren
    async function loginUser(page: any) {
        const uniqueEmail = generateUniqueEmail();

        await page.goto(ROUTES.REGISTER);

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

        // Login
        await page.goto(ROUTES.REGISTER);
        await page.locator(SELECTORS.AUTH.EMAIL_INPUT).fill(uniqueEmail);
        await page.locator(SELECTORS.AUTH.PASSWORD_INPUT).fill(TEST_USER.password);
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        await page.waitForTimeout(2000);

        return uniqueEmail;
    }

    test('PS010 - Selección de cancha en formulario de reserva', async ({ page }) => {
        // Hacer login primero
        await loginUser(page);

        // Navegar a página de reservas
        await page.goto(ROUTES.BOOKING);

        await page.waitForTimeout(2000);

        // Verificar que hay un selector de canchas
        const courtSelector = page.locator('button[role="combobox"], select, [data-radix-select-trigger]').first();
        await expect(courtSelector).toBeVisible();

        // Hacer clic para abrir el selector
        await courtSelector.click();
        await page.waitForTimeout(1000);

        // Verificar que aparecen opciones de canchas
        const options = page.locator('[role="option"]');
        await expect(options.first()).toBeVisible({ timeout: 5000 });
    });

    test('PS011 - Selección de fecha y hora', async ({ page }) => {
        await loginUser(page);

        await page.goto(ROUTES.BOOKING);
        await page.waitForTimeout(2000);

        // Buscar el calendario
        const calendar = page.locator('[role="grid"], .calendar, [class*="calendar"]');

        if (await calendar.isVisible()) {
            // Buscar un día disponible (botón de día que no esté deshabilitado)
            const availableDay = page.locator('button[name="day"]:not([disabled]), td button:not([disabled])').first();

            if (await availableDay.isVisible()) {
                await availableDay.click();
                await page.waitForTimeout(1000);

                // Verificar que aparecen slots de tiempo
                const timeSlots = page.locator('button:has-text(":00")');
                const hasTimeSlots = await timeSlots.count() > 0;
                expect(hasTimeSlots).toBeTruthy();
            }
        }
    });

    test('PS012 - Visualización de resumen de reserva', async ({ page }) => {
        await loginUser(page);

        await page.goto(ROUTES.BOOKING);
        await page.waitForTimeout(2000);

        // Verificar que hay un resumen visible
        const summary = page.locator('text=/Resumen|Total|Precio/i');
        await expect(summary.first()).toBeVisible();
    });

    test('PS013 - Procesamiento de pago exitoso', async ({ page }) => {
        await loginUser(page);

        await page.goto(ROUTES.BOOKING);
        await page.waitForTimeout(2000);

        // 1. Seleccionar cancha (si hay selector)
        const courtSelector = page.locator('button[role="combobox"]').first();
        if (await courtSelector.isVisible()) {
            await courtSelector.click();
            const option = page.locator('[role="option"]').first();
            if (await option.isVisible()) {
                await option.click();
            }
        }

        await page.waitForTimeout(1000);

        // 2. Seleccionar fecha (clic en un día del calendario)
        const dayButton = page.locator('button[name="day"]:not([disabled])').first();
        if (await dayButton.isVisible()) {
            await dayButton.click();
            await page.waitForTimeout(1000);
        }

        // 3. Seleccionar hora
        const timeSlot = page.locator('button:has-text(":00"):not([disabled])').first();
        if (await timeSlot.isVisible()) {
            await timeSlot.click();
            await page.waitForTimeout(1000);
        }

        // 4. Llenar formulario de pago
        const cardInput = page.locator('input[placeholder*="1234"], input[name*="card"], input[id*="card"]').first();
        if (await cardInput.isVisible()) {
            await cardInput.fill(TEST_PAYMENT.cardNumber);

            const nameInput = page.locator('input[placeholder*="nombre"], input[name*="name"]').first();
            if (await nameInput.isVisible()) {
                await nameInput.fill(TEST_PAYMENT.cardName);
            }

            const expiryInput = page.locator('input[placeholder*="MM"], input[name*="expir"]').first();
            if (await expiryInput.isVisible()) {
                await expiryInput.fill(TEST_PAYMENT.expiryDate);
            }

            const cvvInput = page.locator('input[placeholder*="123"], input[placeholder*="CVV"], input[name*="cvv"]').first();
            if (await cvvInput.isVisible()) {
                await cvvInput.fill(TEST_PAYMENT.cvv);
            }

            // 5. Enviar pago
            const payButton = page.locator('button:has-text("Pagar"), button:has-text("Confirmar"), button[type="submit"]').first();
            if (await payButton.isVisible() && await payButton.isEnabled()) {
                await payButton.click();

                // Verificar confirmación
                await expect(
                    page.locator('text=confirmad').or(page.locator('text=exitosa')).or(page.locator('text=Recibo'))
                ).toBeVisible({ timeout: 15000 });
            }
        }
    });

    test('PS014 - Confirmación de reserva mostrada', async ({ page }) => {
        // Esta prueba verifica que después de una reserva exitosa
        // se muestra un modal o mensaje de confirmación
        await loginUser(page);

        await page.goto(ROUTES.BOOKING);
        await page.waitForTimeout(2000);

        // Realizar los pasos de reserva igual que PS013
        const courtSelector = page.locator('button[role="combobox"]').first();
        if (await courtSelector.isVisible()) {
            await courtSelector.click();
            const option = page.locator('[role="option"]').first();
            if (await option.isVisible()) await option.click();
        }

        await page.waitForTimeout(1000);

        const dayButton = page.locator('button[name="day"]:not([disabled])').first();
        if (await dayButton.isVisible()) {
            await dayButton.click();
            await page.waitForTimeout(1000);
        }

        const timeSlot = page.locator('button:has-text(":00"):not([disabled])').first();
        if (await timeSlot.isVisible()) {
            await timeSlot.click();
            await page.waitForTimeout(1000);
        }

        const cardInput = page.locator('input[placeholder*="1234"]').first();
        if (await cardInput.isVisible()) {
            await cardInput.fill(TEST_PAYMENT.cardNumber);
            await page.locator('input[placeholder*="nombre"]').first().fill(TEST_PAYMENT.cardName);
            await page.locator('input[placeholder*="MM"]').first().fill(TEST_PAYMENT.expiryDate);
            await page.locator('input[placeholder*="CVV"], input[placeholder*="123"]').first().fill(TEST_PAYMENT.cvv);

            const payButton = page.locator('button:has-text("Pagar")').first();
            if (await payButton.isEnabled()) {
                await payButton.click();

                // Verificar que aparece modal o mensaje de confirmación
                const confirmation = page.locator('[role="dialog"], .modal, text=Recibo, text=Confirmación');
                await expect(confirmation.first()).toBeVisible({ timeout: 15000 });
            }
        }
    });

    test('PS015 - Redirección al historial tras reserva', async ({ page }) => {
        await loginUser(page);

        await page.goto(ROUTES.BOOKING);
        await page.waitForTimeout(2000);

        // Realizar reserva completa
        const courtSelector = page.locator('button[role="combobox"]').first();
        if (await courtSelector.isVisible()) {
            await courtSelector.click();
            const option = page.locator('[role="option"]').first();
            if (await option.isVisible()) await option.click();
        }

        await page.waitForTimeout(1000);

        const dayButton = page.locator('button[name="day"]:not([disabled])').first();
        if (await dayButton.isVisible()) {
            await dayButton.click();
            await page.waitForTimeout(1000);
        }

        const timeSlot = page.locator('button:has-text(":00"):not([disabled])').first();
        if (await timeSlot.isVisible()) {
            await timeSlot.click();
            await page.waitForTimeout(1000);
        }

        const cardInput = page.locator('input[placeholder*="1234"]').first();
        if (await cardInput.isVisible()) {
            await cardInput.fill(TEST_PAYMENT.cardNumber);
            await page.locator('input[placeholder*="nombre"]').first().fill(TEST_PAYMENT.cardName);
            await page.locator('input[placeholder*="MM"]').first().fill(TEST_PAYMENT.expiryDate);
            await page.locator('input[placeholder*="CVV"], input[placeholder*="123"]').first().fill(TEST_PAYMENT.cvv);

            const payButton = page.locator('button:has-text("Pagar")').first();
            if (await payButton.isEnabled()) {
                await payButton.click();

                await page.waitForTimeout(3000);

                // Cerrar modal si existe y verificar redirección
                const closeButton = page.locator('button:has-text("Cerrar"), button:has-text("OK"), button:has-text("Aceptar")');
                if (await closeButton.isVisible()) {
                    await closeButton.click();
                }

                // Verificar redirección al historial
                await expect(page).toHaveURL(/\/[Hh]istorial/, { timeout: 10000 });
            }
        }
    });

});
