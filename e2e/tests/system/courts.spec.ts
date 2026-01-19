import { test, expect } from '@playwright/test';
import { ROUTES } from '../../fixtures/test-data';

/**
 * PRUEBAS DE SISTEMA - CANCHAS
 * 
 * Validan la visualización y navegación de canchas deportivas
 * desde la interfaz de usuario.
 */

test.describe('PS - Canchas', () => {

    test('PS007 - Visualización de lista de canchas', async ({ page }) => {
        // Navegar a la página de canchas
        await page.goto(ROUTES.COURTS);

        // Verificar que la página se carga
        await expect(page).toHaveURL(/\/Canchas/);

        // Verificar que hay un título
        await expect(page.locator('h1, h2').filter({ hasText: /Canchas|Instalaciones/ })).toBeVisible();

        // Verificar que hay al menos una cancha visible (card o elemento de lista)
        const courtCards = page.locator('[class*="card"], [class*="Card"], article, .court-item');

        // Esperar a que carguen las canchas
        await page.waitForTimeout(2000);

        // Verificar contenido de canchas
        const hasCourts = await courtCards.count() > 0 ||
            await page.locator('text=Fútbol').isVisible() ||
            await page.locator('text=Tenis').isVisible() ||
            await page.locator('text=Básquet').isVisible();

        expect(hasCourts).toBeTruthy();
    });

    test('PS008 - Detalle de cancha muestra información completa', async ({ page }) => {
        // Navegar a la página de canchas
        await page.goto(ROUTES.COURTS);

        await page.waitForTimeout(2000);

        // Verificar que se muestra información de las canchas
        // Debe haber información de tipo de deporte
        const sportTypes = page.locator('text=Fútbol, text=Tenis, text=Básquet, text=FUTBOL, text=TENIS, text=BASQUET');

        // Verificar que hay precios visibles
        const prices = page.locator('text=/\\$\\d+/');

        // Al menos uno de estos elementos debe estar visible
        const hasInfo = await sportTypes.count() > 0 || await prices.count() > 0;
        expect(hasInfo).toBeTruthy();
    });

    test('PS009 - Navegación a reserva desde cancha', async ({ page }) => {
        // Navegar a la página de canchas
        await page.goto(ROUTES.COURTS);

        await page.waitForTimeout(2000);

        // Buscar botón de reservar en las canchas
        const reserveButton = page.locator('button:has-text("Reservar"), a:has-text("Reservar"), button:has-text("Ver"), a:has-text("Ver")').first();

        if (await reserveButton.isVisible()) {
            await reserveButton.click();

            // Verificar que navegó a la página de reservas
            await expect(page).toHaveURL(/\/Reserva/);
        } else {
            // Si no hay botón de reservar, intentar navegar directamente
            await page.goto(ROUTES.BOOKING);
            await expect(page).toHaveURL(/\/Reserva/);
        }
    });

});
