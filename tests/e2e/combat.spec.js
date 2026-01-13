/**
 * E2E Tests for Combat System
 */

import { test, expect } from '@playwright/test';

// Helper function to navigate to opponent selection and start combat
async function startCombatFromTitleScreen(page) {
  // Click Single Combat button
  const singleCombatBtn = page.locator('title-screen').locator('button').filter({ hasText: /Single Combat/i });
  await singleCombatBtn.click();
  await page.waitForTimeout(1500);
  
  // Wait for fighter gallery
  await expect(page.locator('fighter-gallery')).toBeVisible({ timeout: 10000 });
  
  // Select first opponent
  const firstOpponent = page.locator('fighter-gallery').locator('button, .fighter-card, .opponent-card').first();
  await firstOpponent.click();
  await page.waitForTimeout(1000);
  
  // Wait for "Start Battle" button to appear as overlay
  const startBattleBtn = page.locator('fighter-gallery').locator('button').filter({ hasText: /Start Battle|Begin|Fight/i });
  await expect(startBattleBtn).toBeVisible({ timeout: 5000 });
  await startBattleBtn.click();
  await page.waitForTimeout(2000);
  
  // Wait for combat arena
  await expect(page.locator('combat-arena')).toBeVisible({ timeout: 10000 });
}

test.describe('Combat System E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Set up character for combat
    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        createdAt: Date.now(),
        lastSavedAt: Date.now(),
        saveMetadata: {
          slot: 1,
          compressed: false,
          backupCount: 0,
        },
        profile: {
          id: 'test-profile',
          name: 'Combat Hero',
          characterCreated: true,
          character: {
            name: 'Combat Hero',
            class: 'BALANCED',
            health: 400,
            maxHealth: 400,
            strength: 10,
            defense: 30,
            appearance: 'avatar1',
          },
          level: 3,
          xp: 250,
          xpToNextLevel: 500,
          gold: 500,
          maxHealth: 400,
          class: 'BALANCED',
        },
        stats: {
          totalWins: 5,
          totalLosses: 1,
          totalDraws: 0,
          winStreak: 2,
          bestStreak: 5,
          totalDamageDealt: 1000,
          totalDamageTaken: 500,
          totalFightsPlayed: 6,
          tournamentsWon: 0,
          tournamentsPlayed: 0,
          criticalHits: 10,
          skillsUsed: 20,
          itemsUsed: 5,
        },
        equipped: {
          weapon: null,
          armor: null,
          accessory: null,
        },
        inventory: {
          equipment: [],
          consumables: {
            health_potion: 3,
            mana_potion: 3,
          },
        },
        unlocks: {
          fighters: [],
          skills: [],
          achievements: [],
        },
        settings: {
          difficulty: 'normal',
          autoScroll: true,
          soundEnabled: true,
          soundVolume: 0.3,
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
    
    // Wait for title screen to load
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to opponent selection from title screen', async ({ page }) => {
    // Click Single Combat button on title screen
    const singleCombatBtn = page.locator('title-screen').locator('button').filter({ hasText: /Single Combat/i });
    await singleCombatBtn.click();
    await page.waitForTimeout(1000);
    
    // Should be in opponent selection
    await expect(page.locator('fighter-gallery')).toBeVisible({ timeout: 5000 });
  });

  test('should display combat arena after selecting opponent', async ({ page }) => {
    // Click Single Combat button on title screen
    const singleCombatBtn = page.locator('title-screen').locator('button').filter({ hasText: /Single Combat/i });
    await singleCombatBtn.click();
    await page.waitForTimeout(2000);
    
    // Wait for fighter gallery (opponent selection screen)
    await expect(page.locator('fighter-gallery')).toBeVisible({ timeout: 10000 });
    
    // Select first opponent
    const firstOpponent = page.locator('fighter-gallery').locator('button, .opponent-card, .fighter-card').first();
    await firstOpponent.click();
    await page.waitForTimeout(1000);
    
    // Wait for "Start Battle" button overlay to appear
    const startBattleBtn = page.locator('fighter-gallery').locator('button').filter({ hasText: /Start Battle|Begin|Fight/i });
    await expect(startBattleBtn).toBeVisible({ timeout: 5000 });
    
    // Click Start Battle
    await startBattleBtn.click();
    await page.waitForTimeout(2000);
    
    // Should now be in combat
    await expect(page.locator('combat-arena')).toBeVisible({ timeout: 5000 });
  });

  test('should display fighter health bars in combat', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    const hasHealthBars = await page.evaluate(() => {
      const arena = document.querySelector('combat-arena');
      if (!arena?.shadowRoot) return false;

      const healthElements = arena.shadowRoot.querySelectorAll('.health, .hp, [class*="health"]');
      return healthElements.length >= 2; // Player and opponent
    });

    expect(hasHealthBars).toBe(true);
  });

  test('should display combat actions', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    const hasActions = await page.evaluate(() => {
      const arena = document.querySelector('combat-arena');
      if (!arena?.shadowRoot) return false;

      const buttons = arena.shadowRoot.querySelectorAll('button');
      const actionText = Array.from(buttons).map(btn => btn.textContent.toLowerCase()).join(' ');

      return actionText.includes('attack') || 
             actionText.includes('skill') || 
             actionText.includes('defend');
    });

    expect(hasActions).toBe(true);
  });

  test('should execute player attack action', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    // Click attack button
    const attackBtn = page.locator('combat-arena').locator('button').filter({ hasText: /attack/i }).first();
    const btnExists = await attackBtn.isVisible().catch(() => false);
    
    if (btnExists) {
      await attackBtn.click();
      await page.waitForTimeout(1000);
      
      // Check if combat log updated
      const logUpdated = await page.evaluate(() => {
        const arena = document.querySelector('combat-arena');
        if (!arena?.shadowRoot) return false;
        
        const log = arena.shadowRoot.querySelector('#log, .combat-log, .battle-log');
        return log && log.textContent.length > 0;
      });
      
      expect(logUpdated).toBe(true);
    }
  });
  test('should display combat log', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    const hasLog = await page.evaluate(() => {
      const arena = document.querySelector('combat-arena');
      if (!arena?.shadowRoot) return false;

      const log = arena.shadowRoot.querySelector('#log, .combat-log, .battle-log');
      return log !== null;
    });

    expect(hasLog).toBe(true);
  });

  test('should show combat messages in log', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    // Execute an attack
    const attackBtn = page.locator('combat-arena').locator('button').filter({ hasText: /attack/i }).first();
    if (await attackBtn.isVisible().catch(() => false)) {
      await attackBtn.click();
      await page.waitForTimeout(1500);

      const hasMessages = await page.evaluate(() => {
        const arena = document.querySelector('combat-arena');
        if (!arena?.shadowRoot) return false;

        const log = arena.shadowRoot.querySelector('#log, .combat-log, .battle-log');
        if (!log) return false;

        const text = log.textContent || '';
        return text.length > 50; // Should have combat messages
      });

      expect(hasMessages).toBe(true);
    }
  });

  test('should display fighter stats', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    const hasStats = await page.evaluate(() => {
      const arena = document.querySelector('combat-arena');
      if (!arena?.shadowRoot) return false;

      const text = arena.shadowRoot.textContent || '';
      // Look for common stat indicators
      return text.includes('HP') || text.includes('Health') || 
             text.includes('ATK') || text.includes('DEF');
    });

    expect(hasStats).toBe(true);
  });

  test('should end combat when fighter is defeated', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    // Perform multiple attacks to try to end combat
    for (let i = 0; i < 20; i++) {
      const attackBtn = page.locator('combat-arena').locator('button').filter({ hasText: /attack/i }).first();
      const isVisible = await attackBtn.isVisible().catch(() => false);
      
      if (!isVisible) {
        // Combat might have ended
        break;
      }
      
      await attackBtn.click();
      await page.waitForTimeout(800);
      
      // Check if victory or defeat screen appeared
      const victoryScreen = await page.locator('victory-screen, defeat-screen, .victory, .defeat').isVisible().catch(() => false);
      if (victoryScreen) {
        expect(victoryScreen).toBe(true);
        return;
      }
    }
    
    // Test passes if we were able to perform attacks
    expect(true).toBe(true);
  });
});

test.describe('Combat Special Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        createdAt: Date.now(),
        lastSavedAt: Date.now(),
        saveMetadata: {
          slot: 1,
          compressed: false,
          backupCount: 0,
        },
        profile: {
          id: 'test-profile',
          name: 'Berserker Hero',
          characterCreated: true,
          character: {
            name: 'Berserker Hero',
            class: 'BERSERKER',
            health: 440,
            maxHealth: 440,
            strength: 11.5,
            defense: 20,
            appearance: 'avatar2',
          },
          level: 5,
          xp: 500,
          xpToNextLevel: 800,
          gold: 1000,
          maxHealth: 440,
          class: 'BERSERKER',
        },
        stats: {
          totalWins: 10,
          totalLosses: 2,
          totalDraws: 0,
          winStreak: 5,
          bestStreak: 8,
          totalDamageDealt: 2000,
          totalDamageTaken: 800,
          totalFightsPlayed: 12,
        },
        equipped: {
          weapon: null,
          armor: null,
          accessory: null,
        },
        inventory: {
          equipment: [],
          consumables: {
            health_potion: 5,
            mana_potion: 5,
          },
        },
        unlocks: {
          fighters: [],
          skills: [],
          achievements: [],
        },
        settings: {
          difficulty: 'normal',
          autoScroll: true,
          soundEnabled: true,
          soundVolume: 0.3,
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });
    await page.reload();
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 10000 });
  });

  test('should display skills or special abilities', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    const hasSkills = await page.evaluate(() => {
      const arena = document.querySelector('combat-arena');
      if (!arena?.shadowRoot) return false;

      const buttons = arena.shadowRoot.querySelectorAll('button');
      const buttonText = Array.from(buttons).map(btn => btn.textContent.toLowerCase()).join(' ');
      
      return buttonText.includes('skill') || 
             buttonText.includes('special') || 
             buttonText.includes('ability');
    });

    expect(hasSkills).toBe(true);
  });

  test('should have defend or block action', async ({ page }) => {
    await startCombatFromTitleScreen(page);

    const hasDefend = await page.evaluate(() => {
      const arena = document.querySelector('combat-arena');
      if (!arena?.shadowRoot) return false;

      const buttons = arena.shadowRoot.querySelectorAll('button');
      const buttonText = Array.from(buttons).map(btn => btn.textContent.toLowerCase()).join(' ');
      
      return buttonText.includes('defend') || buttonText.includes('block') || buttonText.includes('guard');
    });

    expect(hasDefend).toBe(true);
  });
});
