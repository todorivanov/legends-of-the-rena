/**
 * ObjectPool Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ObjectPool, PoolManager } from '../../src/utils/ObjectPool.js';

describe('ObjectPool', () => {
  let pool;
  let factory;
  let reset;

  beforeEach(() => {
    factory = vi.fn(() => ({ value: 0, used: false }));
    reset = vi.fn((obj) => {
      obj.value = 0;
      obj.used = false;
      return obj;
    });
    pool = new ObjectPool(factory, reset, 5, 20);
  });

  describe('Constructor', () => {
    it('should create pool with initial size', () => {
      expect(pool.pool.length).toBe(5);
      expect(factory).toHaveBeenCalledTimes(5);
    });

    it('should initialize statistics', () => {
      expect(pool.stats.created).toBe(5);
      expect(pool.stats.reused).toBe(0);
      expect(pool.stats.released).toBe(0);
    });

    it('should set max size', () => {
      expect(pool.maxSize).toBe(20);
    });
  });

  describe('acquire()', () => {
    it('should reuse object from pool', () => {
      const obj = pool.acquire();

      expect(obj).toBeDefined();
      expect(pool.pool.length).toBe(4);
      expect(pool.stats.reused).toBe(1);
    });

    it('should create new object when pool is empty', () => {
      // Acquire all pre-created objects
      for (let i = 0; i < 5; i++) {
        pool.acquire();
      }

      const createdBefore = pool.stats.created;
      const obj = pool.acquire();

      expect(obj).toBeDefined();
      expect(pool.stats.created).toBe(createdBefore + 1);
    });

    it('should track active objects', () => {
      const obj = pool.acquire();

      expect(pool.active.has(obj)).toBe(true);
      expect(pool.active.size).toBe(1);
    });

    it('should return objects with expected structure', () => {
      const obj = pool.acquire();

      expect(obj).toHaveProperty('value');
      expect(obj).toHaveProperty('used');
    });
  });

  describe('release()', () => {
    it('should return object to pool', () => {
      const obj = pool.acquire();
      pool.release(obj);

      expect(pool.pool.length).toBe(5);
      expect(pool.stats.released).toBe(1);
      expect(pool.active.has(obj)).toBe(false);
    });

    it('should reset object when releasing', () => {
      const obj = pool.acquire();
      obj.value = 100;
      pool.release(obj);

      expect(reset).toHaveBeenCalledWith(obj);
    });

    it('should not exceed max pool size', () => {
      // Fill pool to max size
      const objects = [];
      for (let i = 0; i < 25; i++) {
        objects.push(pool.acquire());
      }

      // Release all
      objects.forEach((obj) => pool.release(obj));

      expect(pool.pool.length).toBeLessThanOrEqual(20);
    });

    it('should destroy excess objects', () => {
      const objects = [];
      for (let i = 0; i < 25; i++) {
        objects.push(pool.acquire());
      }

      objects.forEach((obj) => pool.release(obj));

      expect(pool.stats.destroyed).toBeGreaterThan(0);
    });

    it('should warn when releasing non-pool object', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation();
      const foreignObj = { value: 0 };

      pool.release(foreignObj);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('releaseAll()', () => {
    it('should release multiple objects', () => {
      const objects = [pool.acquire(), pool.acquire(), pool.acquire()];

      pool.releaseAll(objects);

      expect(pool.active.size).toBe(0);
      expect(pool.pool.length).toBe(5);
    });
  });

  describe('clear()', () => {
    it('should clear pool and active sets', () => {
      pool.acquire();
      pool.acquire();

      pool.clear();

      expect(pool.pool.length).toBe(0);
      expect(pool.active.size).toBe(0);
    });
  });

  describe('getStats()', () => {
    it('should return pool statistics', () => {
      const stats = pool.getStats();

      expect(stats).toHaveProperty('created');
      expect(stats).toHaveProperty('reused');
      expect(stats).toHaveProperty('released');
      expect(stats).toHaveProperty('pooled');
      expect(stats).toHaveProperty('active');
      expect(stats).toHaveProperty('total');
    });

    it('should calculate utilization correctly', () => {
      pool.acquire();
      pool.acquire();

      const stats = pool.getStats();

      expect(stats.active).toBe(2);
      expect(stats.pooled).toBe(3);
      expect(stats.utilization).toBeCloseTo(2 / 5);
    });

    it('should handle zero total gracefully', () => {
      pool.clear();
      const stats = pool.getStats();

      expect(isNaN(stats.utilization)).toBe(true); // 0/0 = NaN
    });
  });

  describe('resize()', () => {
    it('should trim excess objects', () => {
      pool.resize(3);

      expect(pool.pool.length).toBe(3);
    });

    it('should not affect objects below target', () => {
      pool.resize(10);

      expect(pool.pool.length).toBe(5);
    });

    it('should update destroyed count', () => {
      const before = pool.stats.destroyed;
      pool.resize(2);

      expect(pool.stats.destroyed).toBe(before + 3);
    });
  });
});

describe('PoolManager', () => {
  let manager;

  beforeEach(() => {
    manager = new PoolManager();
  });

  describe('createPool()', () => {
    it('should create new pool', () => {
      const factory = () => ({ id: Math.random() });
      const pool = manager.createPool('test', factory, null, 5, 10);

      expect(pool).toBeInstanceOf(ObjectPool);
      expect(manager.pools.has('test')).toBe(true);
    });

    it('should return existing pool if name exists', () => {
      const factory = () => ({ id: 1 });
      const pool1 = manager.createPool('duplicate', factory);
      const pool2 = manager.createPool('duplicate', factory);

      expect(pool1).toBe(pool2);
    });

    it('should create pools with different names', () => {
      const factory = () => ({});
      const pool1 = manager.createPool('pool1', factory);
      const pool2 = manager.createPool('pool2', factory);

      expect(pool1).not.toBe(pool2);
      expect(manager.pools.size).toBe(2);
    });
  });

  describe('getPool()', () => {
    it('should retrieve existing pool', () => {
      const factory = () => ({});
      manager.createPool('retrieve', factory);

      const pool = manager.getPool('retrieve');

      expect(pool).toBeInstanceOf(ObjectPool);
    });

    it('should return null for non-existent pool', () => {
      const pool = manager.getPool('nonexistent');

      expect(pool).toBeNull();
    });
  });

  describe('clearAll()', () => {
    it('should clear all pools', () => {
      const factory = () => ({});
      manager.createPool('pool1', factory);
      manager.createPool('pool2', factory);

      manager.clearAll();

      manager.pools.forEach((pool) => {
        expect(pool.pool.length).toBe(0);
        expect(pool.active.size).toBe(0);
      });
    });
  });

  describe('getAllStats()', () => {
    it('should return stats for all pools', () => {
      const factory = () => ({});
      manager.createPool('pool1', factory, null, 5);
      manager.createPool('pool2', factory, null, 10);

      const stats = manager.getAllStats();

      expect(stats).toHaveProperty('pool1');
      expect(stats).toHaveProperty('pool2');
      expect(stats.pool1.pooled).toBe(5);
      expect(stats.pool2.pooled).toBe(10);
    });
  });
});
