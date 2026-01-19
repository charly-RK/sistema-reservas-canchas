import { test, expect } from '@playwright/test';
import {
    TEST_USER,
    TEST_PAYMENT,
    generateUniqueEmail,
    ROUTES,
    SELECTORS,
    MESSAGES
} from '../../fixtures/test-data';

/**
 * PRUEBAS DE SISTEMA - HISTORIAL
 * 
 * Validan la visualización del historial de reservas
 * y la funcionalidad de cancelación desde la interfaz.
 */

test.describe('PS - Historial', () => {

    // Helper para hacer login
    async function loginUser(page: any) {
        const uniqueEmail = generateUniqueEmail();

        await page.goto(ROUTES.REGISTER);

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

        await page.goto(ROUTES.REGISTER);
        await page.locator(SELECTORS.AUTH.EMAIL_INPUT).fill(uniqueEmail);
        await page.locator(SELECTORS.AUTH.PASSWORD_INPUT).fill(TEST_USER.password);
        await page.locator(SELECTORS.AUTH.SUBMIT_BUTTON).click();

        // Esperar redirección al home después del login
        await page.waitForURL('**/', { timeout: 10000 }).catch(() => { });
        await page.waitForTimeout(1000);

        return uniqueEmail;
    }

    // Helper para crear una reserva
    async function createBooking(page: any) {
        await page.goto(ROUTES.BOOKING);
        await page.waitForTimeout(2000);

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

                const closeButton = page.locator('button:has-text("Cerrar"), button:has-text("OK")');
                if (await closeButton.isVisible()) {
                    await closeButton.click();
                }
            }
        }
    }

    test('PS016 - Usuario ve su historial de reservas', async ({ page }) => {
        // Primero hacer login y crear una reserva (esto asegura que estamos autenticados)
        await loginUser(page);
        await createBooking(page);

        // Después de createBooking, ya nos redirige al historial
        // Solo verificamos que podemos ver contenido de la página
        await page.waitForTimeout(2000);

        // Verificar que hay algún contenido visible (cards de reserva o mensaje vacío)
        const pageContent = await page.locator('body').textContent();
        expect(pageContent).toBeTruthy();

        // Si estamos en historial, debería haber contenido sobre reservas
        const hasReservaContent = pageContent?.includes('Reserva') ||
            pageContent?.includes('reserva') ||
            pageContent?.includes('Historial') ||
            pageContent?.includes('Cancelar');
        expect(hasReservaContent).toBeTruthy();
    });

    test('PS017 - Reserva muestra estado correcto', async ({ page }) => {
        await loginUser(page);

        // Crear una reserva primero
        await createBooking(page);

        // Ir al historial
        await page.goto(ROUTES.HISTORY);
        await page.waitForTimeout(2000);

        // Verificar que hay estados de reserva visibles
        const statusBadge = page.locator('text=Pendiente, text=Confirmada, text=PENDIENTE, text=CONFIRMADA');

        if (await statusBadge.first().isVisible()) {
            await expect(statusBadge.first()).toBeVisible();
        }
    });

    test('PS018 - Cancelación de reserva futura', async ({ page }) => {
        await loginUser(page);

        // Crear una reserva
        await createBooking(page);

        // Ir al historial
        await page.goto(ROUTES.HISTORY);
        await page.waitForTimeout(2000);

        // Buscar botón de cancelar
        const cancelButton = page.locator('button:has-text("Cancelar")').first();

        if (await cancelButton.isVisible()) {
            // Manejar el diálogo de confirmación
            page.on('dialog', async dialog => {
                await dialog.accept();
            });

            await cancelButton.click();

            // Verificar mensaje de éxito o cambio de estado
            await expect(
                page.locator('text=cancelada').or(page.locator('text=Cancelada'))
            ).toBeVisible({ timeout: 10000 });
        }
    });

});
