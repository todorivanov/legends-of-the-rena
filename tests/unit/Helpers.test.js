/**
 * Helpers Utility Unit Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { Helpers } from '../../src/utils/helpers.js';

describe('Helpers', () => {
  describe('getRandomNumber()', () => {
    it('should return a number within the specified range', () => {
      const result = Helpers.getRandomNumber(1, 10);
      
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it('should return the same number when min equals max', () => {
      const result = Helpers.getRandomNumber(5, 5);
      
      expect(result).toBe(5);
    });

    it('should handle range of 0 to 1', () => {
      const result = Helpers.getRandomNumber(0, 1);
      
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    it('should handle negative ranges', () => {
      const result = Helpers.getRandomNumber(-10, -5);
      
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(-5);
    });

    it('should handle mixed negative and positive ranges', () => {
      const result = Helpers.getRandomNumber(-5, 5);
      
      expect(result).toBeGreaterThanOrEqual(-5);
      expect(result).toBeLessThanOrEqual(5);
    });

    it('should return an integer', () => {
      const result = Helpers.getRandomNumber(1, 100);
      
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should generate different values over multiple calls', () => {
      const results = new Set();
      
      for (let i = 0; i < 50; i++) {
        results.add(Helpers.getRandomNumber(1, 100));
      }
      
      // Should have multiple different values
      expect(results.size).toBeGreaterThan(10);
    });

    it('should handle large ranges', () => {
      const result = Helpers.getRandomNumber(1, 1000000);
      
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(1000000);
    });

    it('should include minimum value in possible results', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      
      const result = Helpers.getRandomNumber(5, 10);
      
      expect(result).toBe(5);
      
      vi.restoreAllMocks();
    });

    it('should include maximum value in possible results', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999999);
      
      const result = Helpers.getRandomNumber(5, 10);
      
      expect(result).toBe(10);
      
      vi.restoreAllMocks();
    });

    it('should handle decimal inputs by converting to integers', () => {
      const result = Helpers.getRandomNumber(1.7, 5.9);
      
      // Should use Math.ceil and Math.floor internally
      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThanOrEqual(5);
      expect(Number.isInteger(result)).toBe(true);
    });
  });
});
