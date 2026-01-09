/**
 * ObjectPool - Reusable object pooling system
 * Reduces garbage collection pressure by reusing objects
 */

export class ObjectPool {
  /**
   * @param {Function} factory - Function to create new objects
   * @param {Function} reset - Function to reset object state
   * @param {number} initialSize - Initial pool size
   * @param {number} maxSize - Maximum pool size
   */
  constructor(factory, reset = null, initialSize = 10, maxSize = 100) {
    this.factory = factory;
    this.reset = reset || ((obj) => obj);
    this.maxSize = maxSize;
    this.pool = [];
    this.active = new Set();
    this.stats = {
      created: 0,
      reused: 0,
      released: 0,
      destroyed: 0,
    };

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createNew());
    }
  }

  /**
   * Create a new object
   * @returns {*} New object
   */
  createNew() {
    this.stats.created++;
    return this.factory();
  }

  /**
   * Acquire an object from the pool
   * @returns {*} Object from pool or newly created
   */
  acquire() {
    let obj;

    if (this.pool.length > 0) {
      obj = this.pool.pop();
      this.stats.reused++;
    } else {
      obj = this.createNew();
    }

    this.active.add(obj);
    return obj;
  }

  /**
   * Release an object back to the pool
   * @param {*} obj - Object to release
   */
  release(obj) {
    if (!this.active.has(obj)) {
      console.warn('Attempting to release object not from this pool');
      return;
    }

    this.active.delete(obj);

    if (this.pool.length < this.maxSize) {
      this.reset(obj);
      this.pool.push(obj);
      this.stats.released++;
    } else {
      this.stats.destroyed++;
    }
  }

  /**
   * Release multiple objects
   * @param {Array} objects - Objects to release
   */
  releaseAll(objects) {
    objects.forEach((obj) => this.release(obj));
  }

  /**
   * Clear the pool
   */
  clear() {
    this.pool = [];
    this.active.clear();
  }

  /**
   * Get pool statistics
   * @returns {Object} Pool stats
   */
  getStats() {
    return {
      ...this.stats,
      pooled: this.pool.length,
      active: this.active.size,
      total: this.pool.length + this.active.size,
      utilization: this.active.size / (this.pool.length + this.active.size),
    };
  }

  /**
   * Resize pool (trim excess objects)
   * @param {number} targetSize - Target pool size
   */
  resize(targetSize) {
    while (this.pool.length > targetSize) {
      this.pool.pop();
      this.stats.destroyed++;
    }
  }
}

/**
 * PoolManager - Manages multiple object pools
 */
export class PoolManager {
  constructor() {
    this.pools = new Map();
  }

  /**
   * Create or get a pool
   * @param {string} name - Pool name
   * @param {Function} factory - Object factory function
   * @param {Function} reset - Reset function
   * @param {number} initialSize - Initial pool size
   * @param {number} maxSize - Max pool size
   * @returns {ObjectPool} The pool
   */
  createPool(name, factory, reset, initialSize = 10, maxSize = 100) {
    if (this.pools.has(name)) {
      return this.pools.get(name);
    }

    const pool = new ObjectPool(factory, reset, initialSize, maxSize);
    this.pools.set(name, pool);
    return pool;
  }

  /**
   * Get a pool by name
   * @param {string} name - Pool name
   * @returns {ObjectPool|null}
   */
  getPool(name) {
    return this.pools.get(name) || null;
  }

  /**
   * Acquire from pool
   * @param {string} poolName - Pool name
   * @returns {*} Object from pool
   */
  acquire(poolName) {
    const pool = this.getPool(poolName);
    if (!pool) {
      throw new Error(`Pool "${poolName}" not found`);
    }
    return pool.acquire();
  }

  /**
   * Release to pool
   * @param {string} poolName - Pool name
   * @param {*} obj - Object to release
   */
  release(poolName, obj) {
    const pool = this.getPool(poolName);
    if (!pool) {
      console.warn(`Pool "${poolName}" not found`);
      return;
    }
    pool.release(obj);
  }

  /**
   * Get stats for all pools
   * @returns {Object} All pool stats
   */
  getAllStats() {
    const stats = {};
    this.pools.forEach((pool, name) => {
      stats[name] = pool.getStats();
    });
    return stats;
  }

  /**
   * Clear all pools
   */
  clearAll() {
    this.pools.forEach((pool) => pool.clear());
  }

  /**
   * Dispose all pools
   */
  dispose() {
    this.pools.clear();
  }
}

// Singleton instance
export const poolManager = new PoolManager();

// Pre-configured pools for common game objects

/**
 * Vector2D pool
 */
poolManager.createPool(
  'vector2d',
  () => ({ x: 0, y: 0 }),
  (vec) => {
    vec.x = 0;
    vec.y = 0;
    return vec;
  },
  20,
  100
);

/**
 * Damage number pool (for floating damage text)
 */
poolManager.createPool(
  'damageNumber',
  () => ({
    value: 0,
    x: 0,
    y: 0,
    color: '#fff',
    opacity: 1,
    velocity: 0,
    lifetime: 0,
  }),
  (dmg) => {
    dmg.value = 0;
    dmg.opacity = 1;
    dmg.velocity = 0;
    dmg.lifetime = 0;
    return dmg;
  },
  15,
  50
);

/**
 * Particle pool (for visual effects)
 */
poolManager.createPool(
  'particle',
  () => ({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    size: 1,
    color: '#fff',
    life: 1,
    alpha: 1,
  }),
  (particle) => {
    particle.life = 1;
    particle.alpha = 1;
    particle.vx = 0;
    particle.vy = 0;
    return particle;
  },
  50,
  200
);

/**
 * Event object pool
 */
poolManager.createPool(
  'event',
  () => ({
    type: '',
    data: null,
    timestamp: 0,
  }),
  (evt) => {
    evt.type = '';
    evt.data = null;
    evt.timestamp = 0;
    return evt;
  },
  10,
  50
);

// Convenience functions
export const acquireVector = () => poolManager.acquire('vector2d');
export const releaseVector = (vec) => poolManager.release('vector2d', vec);
export const acquireDamageNumber = () => poolManager.acquire('damageNumber');
export const releaseDamageNumber = (dmg) => poolManager.release('damageNumber', dmg);
export const acquireParticle = () => poolManager.acquire('particle');
export const releaseParticle = (particle) => poolManager.release('particle', particle);
