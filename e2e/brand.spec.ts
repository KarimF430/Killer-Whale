import { test, expect } from '@playwright/test';

/**
 * Brand Page E2E Tests
 * Tests brand listing and individual brand pages
 */

test.describe('Brand Pages', () => {
    test('should display all brands on brands listing page', async ({ page }) => {
        await page.goto('/brands');

        // Wait for brand list to load
        await page.waitForSelector('text=/Browse by Brand/i', { timeout: 10000 });

        // Check that at least one brand card is visible
        const brandCards = page.locator('[data-testid="brand-card"]').or(page.locator('a[href*="/brands/"]'));
        await expect(brandCards.first()).toBeVisible();
    });

    test('should navigate to individual brand page', async ({ page }) => {
        await page.goto('/');

        // Find and click a brand link (e.g., Maruti Suzuki)
        const brandLink = page.locator('a[href*="/brands/"]').first();
        await brandLink.click();

        // Wait for navigation
        await page.waitForLoadState('networkidle');

        // Check URL changed
        expect(page.url()).toContain('/brands/');
    });

    test('should display brand logo and models on brand page', async ({ page }) => {
        // Navigate to a specific brand page (using Maruti Suzuki as example)
        await page.goto('/brands/maruti-suzuki');

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check that brand name is displayed
        await expect(page.locator('h1, h2').first()).toBeVisible();

        // Check that model cards are displayed
        const modelCards = page.locator('a[href*="/cars/"]').or(page.locator('[data-testid="model-card"]'));

        // Wait for models to load (may be async)
        await page.waitForTimeout(2000);

        // At least one model should be visible
        const count = await modelCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should allow clicking on model cards', async ({ page }) => {
        await page.goto('/brands/maruti-suzuki');
        await page.waitForLoadState('networkidle');

        // Find first model card
        const firstModel = page.locator('a[href*="/cars/"]').first();

        if (await firstModel.isVisible()) {
            await firstModel.click();

            // Wait for navigation
            await page.waitForLoadState('networkidle');

            // Check URL changed to model page
            expect(page.url()).toContain('/cars/');
        }
    });

    test('should display correct meta information', async ({ page }) => {
        await page.goto('/brands/maruti-suzuki');

        // Check meta tags are present
        const title = await page.title();
        expect(title.toLowerCase()).toContain('maruti');
    });
});
