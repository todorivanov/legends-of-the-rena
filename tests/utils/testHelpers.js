/**
 * Test Helper Functions
 * Reusable utilities for testing
 */

import { Fighter } from '../../src/entities/fighter.js';

/**
 * Create a test fighter with default stats
 * @param {Object} overrides - Properties to override
 * @returns {Fighter} Test fighter
 */
export function createTestFighter(overrides = {}) {
  const defaults = {
    id: Math.floor(Math.random() * 1000),
    name: 'Test Fighter',
    health: 100,
    strength: 50,
    defense: 30,
    image: 'test.png',
    description: 'A test fighter',
    class: 'BALANCED',
  };

  return new Fighter({ ...defaults, ...overrides });
}

/**
 * Create multiple test fighters
 * @param {number} count - Number of fighters to create
 * @returns {Array<Fighter>} Array of fighters
 */
export function createTestFighters(count) {
  return Array.from({ length: count }, (_, i) =>
    createTestFighter({
      id: i,
      name: `Fighter ${i + 1}`,
    })
  );
}

/**
 * Wait for a specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after timeout
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock localStorage with initial data
 * @param {Object} data - Initial data
 */
export function mockLocalStorage(data = {}) {
  const store = { ...data };

  global.localStorage.getItem = vi.fn((key) => store[key] || null);
  global.localStorage.setItem = vi.fn((key, value) => {
    store[key] = value;
  });
  global.localStorage.removeItem = vi.fn((key) => {
    delete store[key];
  });
  global.localStorage.clear = vi.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
  });

  return store;
}

/**
 * Create a mock save data object
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock save data
 */
export function createMockSaveData(overrides = {}) {
  return {
    version: '4.10.0',
    profile: {
      name: 'Test Player',
      level: 1,
      xp: 0,
      gold: 100,
      characterCreated: true,
      character: {
        name: 'Test Character',
        class: 'BALANCED',
        health: 100,
        strength: 50,
        defense: 30,
        image: 'test.png',
      },
    },
    stats: {
      totalWins: 0,
      totalLosses: 0,
      totalFightsPlayed: 0,
      winStreak: 0,
      bestStreak: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      criticalHits: 0,
      skillsUsed: 0,
      itemsUsed: 0,
    },
    inventory: {
      equipment: [],
      consumables: [],
    },
    story: {
      unlockedRegions: ['tutorial'],
      unlockedMissions: ['tutorial_1'],
      completedMissions: [],
      currentMission: null,
      missionStars: {},
    },
    settings: {
      difficulty: 'normal',
      soundEnabled: true,
      musicEnabled: true,
      darkMode: true,
    },
    achievements: [],
    lastSavedAt: Date.now(),
    ...overrides,
  };
}

/**
 * Flush all pending promises
 * @returns {Promise} Promise that resolves after all pending promises
 */
export async function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Create a mock Web Component
 * @param {string} tagName - Component tag name
 * @returns {HTMLElement} Mock component
 */
export function createMockComponent(tagName) {
  class MockComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, MockComponent);
  }

  return document.createElement(tagName);
}

/**
 * Mock the Logger utility
 * @returns {Object} Mock logger
 */
export function mockLogger() {
  return {
    log: vi.fn(),
    clearLog: vi.fn(),
    logFighter: vi.fn(),
    setLogHolder: vi.fn(),
    setAutoScroll: vi.fn(),
  };
}

/**
 * Simulate user interaction
 * @param {HTMLElement} element - Element to interact with
 * @param {string} eventType - Event type (click, input, etc.)
 * @param {Object} eventData - Event data
 */
export function simulateEvent(element, eventType, eventData = {}) {
  const event = new Event(eventType, {
    bubbles: true,
    cancelable: true,
    ...eventData,
  });

  Object.assign(event, eventData);
  element.dispatchEvent(event);
}

/**
 * Get element from shadow DOM
 * @param {HTMLElement} host - Shadow host element
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null} Element or null
 */
export function getShadowElement(host, selector) {
  return host.shadowRoot?.querySelector(selector) || null;
}

/**
 * Assert fighter has valid stats
 * @param {Fighter} fighter - Fighter to validate
 * @throws {Error} If fighter is invalid
 */
export function assertValidFighter(fighter) {
  if (!fighter) throw new Error('Fighter is null or undefined');
  if (typeof fighter.name !== 'string') throw new Error('Fighter name must be a string');
  if (typeof fighter.health !== 'number') throw new Error('Fighter health must be a number');
  if (typeof fighter.strength !== 'number')
    throw new Error('Fighter strength must be a number');
  if (fighter.health < 0) throw new Error('Fighter health cannot be negative');
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
