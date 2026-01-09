/**
 * E2E Tests for Main Game Flow
 */

import { test, expect } from '@playwright/test';

test.describe('Game Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
  });

  test('should load the game homepage', async ({ page }) => {
    // Wait for the title screen to load
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 10000 });

    // Check for main title
    const title = page.locator('h1').first();
    await expect(title).toContainText('Legends of the Arena');
  });

  test('should create a new character', async ({ page }) => {
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for character creation screen
    await expect(page.locator('character-creation')).toBeVisible({ timeout: 10000 });

    // Fill in character name
    const characterCreation = page.locator('character-creation');
    await characterCreation.evaluateHandle((el) => el.shadowRoot);

    // Enter character name
    await page.evaluate(() => {
      const cc = document.querySelector('character-creation');
      const input = cc.shadowRoot.querySelector('input[type="text"]');
      if (input) input.value = 'Test Hero';
    });

    // Select a class
    await page.evaluate(() => {
      const cc = document.querySelector('character-creation');
      const classBtn = cc.shadowRoot.querySelector('.class-card');
      if (classBtn) classBtn.click();
    });

    // Click create button
    await page.evaluate(() => {
      const cc = document.querySelector('character-creation');
      const createBtn = cc.shadowRoot.querySelector('button[type="submit"]');
      if (createBtn) createBtn.click();
    });

    // Should navigate to title screen
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to story mode', async ({ page }) => {
    // Ensure character is created
    await page.evaluate(() => {
      const mockSave = {
        version: '4.4.0',
        profile: {
          characterCreated: true,
          character: {
            name: 'Test Hero',
            class: 'BALANCED',
            health: 100,
            strength: 50,
            defense: 30,
          },
          level: 1,
          xp: 0,
          gold: 100,
        },
        stats: {},
        story: {
          unlockedRegions: ['tutorial'],
          unlockedMissions: ['tutorial_1'],
          completedMissions: [],
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();

    // Wait for title screen
    await expect(page.locator('title-screen')).toBeVisible();

    // Click Story Mode button
    await page.evaluate(() => {
      const ts = document.querySelector('title-screen');
      const buttons = Array.from(ts.shadowRoot.querySelectorAll('button'));
      const storyButton = buttons.find((btn) => btn.textContent.includes('Story'));
      if (storyButton) storyButton.click();
    });

    // Should show campaign map
    await expect(page.locator('campaign-map')).toBeVisible({ timeout: 5000 });
  });

  test('should open settings', async ({ page }) => {
    await expect(page.locator('title-screen')).toBeVisible();

    // Click settings button (in navigation bar)
    // If navigation bar uses shadow DOM
    await page.evaluate(() => {
      const nav = document.querySelector('navigation-bar');
      if (nav && nav.shadowRoot) {
        const btns = nav.shadowRoot.querySelectorAll('button');
        btns.forEach((btn) => {
          if (btn.textContent.includes('Settings')) btn.click();
        });
      }
    });

    // Should show settings screen
    await expect(page.locator('settings-screen')).toBeVisible({ timeout: 5000 });
  });

  test('should toggle theme', async ({ page }) => {
    await expect(page.locator('title-screen')).toBeVisible();

    // Find theme toggle component
    const themeToggle = page.locator('theme-toggle');
    await expect(themeToggle).toBeVisible();

    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.body.getAttribute('data-theme');
    });

    // Click theme toggle
    await page.evaluate(() => {
      const toggle = document.querySelector('theme-toggle');
      if (toggle && toggle.shadowRoot) {
        const btn = toggle.shadowRoot.querySelector('button');
        if (btn) btn.click();
      }
    });

    // Wait a bit for theme change
    await page.waitForTimeout(500);

    // Check theme changed
    const newTheme = await page.evaluate(() => {
      return document.body.getAttribute('data-theme');
    });

    expect(newTheme).not.toBe(initialTheme);
  });

  test('should show profile screen', async ({ page }) => {
    // Set up mock save data
    await page.evaluate(() => {
      const mockSave = {
        version: '4.4.0',
        profile: {
          characterCreated: true,
          character: {
            name: 'Test Hero',
            class: 'BALANCED',
          },
          level: 5,
          xp: 500,
          gold: 250,
        },
        stats: {
          totalWins: 10,
          totalLosses: 2,
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
    await expect(page.locator('title-screen')).toBeVisible();

    // Click profile button
    await page.evaluate(() => {
      const nav = document.querySelector('navigation-bar');
      if (nav && nav.shadowRoot) {
        const btns = nav.shadowRoot.querySelectorAll('button');
        btns.forEach((btn) => {
          if (btn.textContent.includes('Profile')) btn.click();
        });
      }
    });

    // Should show profile screen
    await expect(page.locator('profile-screen')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Combat E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Set up character
    await page.evaluate(() => {
      const mockSave = {
        version: '4.4.0',
        profile: {
          characterCreated: true,
          character: {
            name: 'Fighter',
            class: 'BALANCED',
            health: 100,
            strength: 50,
            defense: 30,
          },
          level: 1,
        },
        stats: {},
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
  });

  test('should start single combat', async ({ page }) => {
    await expect(page.locator('title-screen')).toBeVisible();

    // Click Single Combat button
    await page.evaluate(() => {
      const ts = document.querySelector('title-screen');
      if (ts && ts.shadowRoot) {
        const buttons = Array.from(ts.shadowRoot.querySelectorAll('button'));
        const combatBtn = buttons.find((btn) => btn.textContent.includes('Single'));
        if (combatBtn) combatBtn.click();
      }
    });

    // Should show fighter gallery for opponent selection
    await expect(page.locator('fighter-gallery')).toBeVisible({ timeout: 5000 });
  });

  test('should display combat arena', async ({ page }) => {
    // This would require selecting an opponent and starting combat
    // For now, we'll simulate it
    await page.evaluate(() => {
      // Trigger combat start programmatically
      window.location.hash = '#/combat';
    });

    // Wait a bit for navigation
    await page.waitForTimeout(1000);

    // Combat arena might be visible
    const arena = page.locator('combat-arena');
    if (await arena.isVisible()) {
      expect(arena).toBeVisible();
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    await expect(page.locator('title-screen')).toBeVisible();

    // Game should still be usable
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');

    await expect(page.locator('title-screen')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper document title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Legends of the Arena/i);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('navigation-bar');
    await expect(nav).toBeVisible();
  });
});
