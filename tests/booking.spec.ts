import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - set token in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('token', 'mock-jwt-token-for-testing');
    });
  });

  test('complete booking flow', async ({ page }) => {
    // Step 1: Navigate to studios page
    await page.goto('/studios');
    await expect(page.locator('h1')).toContainText('Студии');

    // Step 2: Select first studio
    await page.locator('[data-testid="studio-card"]').first().click();
    await expect(page.locator('h1')).toContainText('Комнаты студии');

    // Step 3: Select first room and click "Забронировать"
    await page.locator('[data-testid="room-card"]').first().waitFor();
    const firstRoomCard = page.locator('[data-testid="room-card"]').first();
    await firstRoomCard.locator('button:has-text("Забронировать")').click();

    // Step 4: Verify booking modal is open
    await expect(page.locator('[data-testid="booking-modal"]')).toBeVisible();
    await expect(page.locator('h2:has-text("Бронирование")')).toBeVisible();

    // Step 5: Select date (today + 1 day)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    await page.locator('[data-testid="date-picker"]').fill(tomorrowString);

    // Step 6: Wait for time slots to load
    await page.locator('[data-testid="time-slot"]').first().waitFor();

    // Step 7: Select time range (click first available slot, then second available slot)
    const availableSlots = page.locator('[data-testid="time-slot"]:not([disabled])');
    await availableSlots.first().click();
    await availableSlots.nth(1).click();

    // Step 8: Verify price calculation
    await expect(page.locator('[data-testid="total-price"]')).toBeVisible();

    // Step 9: Click "Забронировать" button
    await page.locator('button:has-text("Забронировать")').click();

    // Step 10: Verify success toast
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Бронирование создано');

    // Step 11: Modal should close
    await expect(page.locator('[data-testid="booking-modal"]')).not.toBeVisible();

    // Step 12: Navigate to "Мои бронирования"
    await page.goto('/my-bookings');
    await expect(page.locator('h2:has-text("Мои бронирования")')).toBeVisible();

    // Step 13: Verify new booking appears
    await expect(page.locator('[data-testid="booking-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-status"]')).toContainText('Ожидает');
  });

  test('cancel booking flow', async ({ page }) => {
    // First create a booking
    await page.goto('/studios');
    await page.locator('[data-testid="studio-card"]').first().click();
    const firstRoomCard = page.locator('[data-testid="room-card"]').first();
    await firstRoomCard.locator('button:has-text("Забронировать")').click();

    // Complete booking
    await page.locator('[data-testid="time-slot"]:not([disabled])').first().click();
    await page.locator('[data-testid="time-slot"]:not([disabled])').nth(1).click();
    await page.locator('button:has-text("Забронировать")').click();
    await page.locator('[data-testid="toast-success"]').waitFor();

    // Navigate to my bookings
    await page.goto('/my-bookings');
    
    // Find and cancel the booking
    const bookingItem = page.locator('[data-testid="booking-item"]').first();
    await bookingItem.locator('button:has-text("Отменить бронирование")').click();

    // Verify cancellation success
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Бронирование отменено');

    // Verify status updated
    await expect(bookingItem.locator('[data-testid="booking-status"]')).toContainText('Отменено');
  });

  test('booking validation', async ({ page }) => {
    await page.goto('/studios');
    await page.locator('[data-testid="studio-card"]').first().click();
    const firstRoomCard = page.locator('[data-testid="room-card"]').first();
    await firstRoomCard.locator('button:has-text("Забронировать")').click();

    // Try to book without selecting time
    await page.locator('button:has-text("Забронировать")').click();
    
    // Button should be disabled
    await expect(page.locator('button:has-text("Забронировать")')).toBeDisabled();
  });

  test('authentication required for booking', async ({ page }) => {
    // Clear authentication
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('token');
    });

    await page.goto('/studios');
    await page.locator('[data-testid="studio-card"]').first().click();
    const firstRoomCard = page.locator('[data-testid="room-card"]').first();
    await firstRoomCard.locator('button:has-text("Забронировать")').click();

    // Should show authentication error
    await expect(page.locator('[data-testid="auth-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="auth-error"]')).toContainText('Пожалуйста, войдите в систему');
  });
});
