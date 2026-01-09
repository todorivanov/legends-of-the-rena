/**
 * Compression Utilities Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  compress,
  decompress,
  compressJSON,
  decompressJSON,
  getCompressionRatio,
  getSizeKB,
} from '../../src/utils/compression.js';

describe('Compression Utilities', () => {
  describe('compress()', () => {
    it('should compress a string', () => {
      const original = 'Hello, World!';
      const compressed = compress(original);

      expect(compressed).toBeDefined();
      expect(typeof compressed).toBe('string');
      expect(compressed).not.toBe(original);
    });

    it('should handle empty string', () => {
      const compressed = compress('');

      expect(compressed).toBe('');
    });

    it('should handle null', () => {
      const compressed = compress(null);

      expect(compressed).toBe('');
    });

    it('should compress large text effectively', () => {
      const original = 'A'.repeat(1000);
      const compressed = compress(original);

      expect(compressed.length).toBeLessThan(original.length);
    });

    it('should handle special characters', () => {
      const original = '你好世界 🌍 Special: @#$%^&*()';
      const compressed = compress(original);

      expect(compressed).toBeDefined();
      expect(compressed.length).toBeGreaterThan(0);
    });
  });

  describe('decompress()', () => {
    it('should decompress compressed string', () => {
      const original = 'Hello, World!';
      const compressed = compress(original);
      const decompressed = decompress(compressed);

      expect(decompressed).toBe(original);
    });

    it('should handle empty string', () => {
      const decompressed = decompress('');

      expect(decompressed).toBe('');
    });

    it('should handle null', () => {
      const decompressed = decompress(null);

      expect(decompressed).toBe('');
    });

    it('should return original if decompression fails', () => {
      const invalid = 'not compressed data';
      const result = decompress(invalid);

      expect(result).toBe(invalid);
    });

    it('should handle large compressed data', () => {
      const original = 'Test data '.repeat(100);
      const compressed = compress(original);
      const decompressed = decompress(compressed);

      expect(decompressed).toBe(original);
    });
  });

  describe('compressJSON()', () => {
    it('should compress JSON object', () => {
      const obj = { name: 'Test', value: 123, items: [1, 2, 3] };
      const compressed = compressJSON(obj);

      expect(compressed).toBeDefined();
      expect(typeof compressed).toBe('string');
    });

    it('should handle complex nested objects', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              data: [1, 2, 3, 4, 5],
              text: 'nested',
            },
          },
        },
      };

      const compressed = compressJSON(obj);

      expect(compressed).toBeDefined();
      expect(compressed.length).toBeGreaterThan(0);
    });

    it('should handle arrays', () => {
      const arr = [1, 2, 3, 'a', 'b', 'c', { key: 'value' }];
      const compressed = compressJSON(arr);

      expect(compressed).toBeDefined();
    });

    it('should handle empty object', () => {
      const compressed = compressJSON({});

      expect(compressed).toBeDefined();
    });
  });

  describe('decompressJSON()', () => {
    it('should decompress to original object', () => {
      const original = { name: 'Test', value: 123 };
      const compressed = compressJSON(original);
      const decompressed = decompressJSON(compressed);

      expect(decompressed).toEqual(original);
    });

    it('should preserve data types', () => {
      const original = {
        string: 'text',
        number: 42,
        boolean: true,
        null: null,
        array: [1, 2, 3],
      };

      const compressed = compressJSON(original);
      const decompressed = decompressJSON(compressed);

      expect(decompressed).toEqual(original);
      expect(typeof decompressed.string).toBe('string');
      expect(typeof decompressed.number).toBe('number');
      expect(typeof decompressed.boolean).toBe('boolean');
    });

    it('should return null for invalid data', () => {
      const result = decompressJSON('invalid compressed data');

      expect(result).toBeNull();
    });

    it('should handle complex objects', () => {
      const original = {
        users: [
          { id: 1, name: 'Alice', active: true },
          { id: 2, name: 'Bob', active: false },
        ],
        settings: {
          theme: 'dark',
          notifications: true,
        },
      };

      const compressed = compressJSON(original);
      const decompressed = decompressJSON(compressed);

      expect(decompressed).toEqual(original);
    });
  });

  describe('getCompressionRatio()', () => {
    it('should calculate compression ratio', () => {
      const original = 'A'.repeat(1000);
      const compressed = compress(original);
      const ratio = getCompressionRatio(original, compressed);

      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(1);
    });

    it('should return 0 for empty strings', () => {
      const ratio = getCompressionRatio('', '');

      expect(ratio).toBe(0);
    });

    it('should return 0 for null inputs', () => {
      const ratio = getCompressionRatio(null, null);

      expect(ratio).toBe(0);
    });

    it('should show better compression for repetitive data', () => {
      const repetitive = 'ABC'.repeat(100);
      const random = Math.random().toString().repeat(10);

      const compressedRep = compress(repetitive);
      const compressedRand = compress(random);

      const ratioRep = getCompressionRatio(repetitive, compressedRep);
      const ratioRand = getCompressionRatio(random, compressedRand);

      expect(ratioRep).toBeLessThan(ratioRand);
    });
  });

  describe('getSizeKB()', () => {
    it('should return size in KB', () => {
      const str = 'A'.repeat(1024); // 1KB
      const size = getSizeKB(str);

      expect(Number(size)).toBeCloseTo(1, 1);
    });

    it('should return 0 for empty string', () => {
      const size = getSizeKB('');

      expect(Number(size)).toBe(0);
    });

    it('should return 0 for null', () => {
      const size = getSizeKB(null);

      expect(Number(size)).toBe(0);
    });

    it('should handle small strings', () => {
      const size = getSizeKB('Hello');

      // Small strings may round to 0 KB
      expect(Number(size)).toBeGreaterThanOrEqual(0);
      expect(Number(size)).toBeLessThan(1);
    });

    it('should return string format', () => {
      const size = getSizeKB('test');

      expect(typeof size).toBe('string');
    });
  });

  describe('Integration Tests', () => {
    it('should compress and decompress preserving data', () => {
      const testData = {
        profile: {
          name: 'Player',
          level: 10,
          gold: 1000,
        },
        inventory: [
          { id: 1, name: 'Sword', damage: 50 },
          { id: 2, name: 'Shield', defense: 30 },
        ],
        achievements: ['first_victory', 'level_10', 'rich'],
      };

      const compressed = compressJSON(testData);
      const decompressed = decompressJSON(compressed);

      expect(decompressed).toEqual(testData);
    });

    it('should achieve compression for save data', () => {
      const saveData = JSON.stringify({
        profile: { level: 1, xp: 0, gold: 100 },
        stats: { wins: 0, losses: 0 },
        inventory: Array(50).fill({ item: 'potion' }),
      });

      const compressed = compress(saveData);
      const ratio = getCompressionRatio(saveData, compressed);

      expect(ratio).toBeLessThan(1);
    });
  });
});
