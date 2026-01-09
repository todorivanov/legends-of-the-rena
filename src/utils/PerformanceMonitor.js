/**
 * PerformanceMonitor - Real-time performance tracking and profiling
 * Monitors FPS, memory usage, render times, and custom metrics
 */

export class PerformanceMonitor {
  constructor() {
    this.enabled = true;
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memory: { used: 0, total: 0, limit: 0 },
      drawCalls: 0,
      entities: 0,
    };

    this.history = {
      fps: [],
      frameTime: [],
      memory: [],
    };

    this.maxHistoryLength = 60; // 60 samples
    this.marks = new Map();
    this.measures = new Map();
    this.timers = new Map();

    // FPS tracking
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.lastFpsUpdate = performance.now();
    this.deltaTime = 0;

    // Performance thresholds
    this.thresholds = {
      fps: { good: 55, warning: 40, critical: 25 },
      frameTime: { good: 16, warning: 25, critical: 40 }, // ms
      memory: { warning: 80, critical: 95 }, // percentage
    };

    // Start monitoring
    if (this.enabled) {
      this.startMonitoring();
    }
  }

  /**
   * Start performance monitoring loop
   */
  startMonitoring() {
    this.monitoringActive = true;
    this.monitorLoop();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    this.monitoringActive = false;
  }

  /**
   * Main monitoring loop
   */
  monitorLoop() {
    if (!this.monitoringActive) return;

    const now = performance.now();
    this.deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;
    this.frameCount++;

    // Update FPS every second
    if (now - this.lastFpsUpdate >= 1000) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.metrics.frameTime = Math.round(this.deltaTime * 100) / 100;

      this.addToHistory('fps', this.metrics.fps);
      this.addToHistory('frameTime', this.metrics.frameTime);

      this.frameCount = 0;
      this.lastFpsUpdate = now;

      // Update memory if available
      this.updateMemory();
    }

    requestAnimationFrame(() => this.monitorLoop());
  }

  /**
   * Update memory metrics
   */
  updateMemory() {
    if (performance.memory) {
      this.metrics.memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
      };

      const usagePercent = (this.metrics.memory.used / this.metrics.memory.limit) * 100;
      this.addToHistory('memory', usagePercent);
    }
  }

  /**
   * Add value to history
   */
  addToHistory(metric, value) {
    if (!this.history[metric]) {
      this.history[metric] = [];
    }

    this.history[metric].push(value);

    if (this.history[metric].length > this.maxHistoryLength) {
      this.history[metric].shift();
    }
  }

  /**
   * Start a performance mark
   * @param {string} name - Mark name
   */
  mark(name) {
    if (!this.enabled) return;

    const timestamp = performance.now();
    this.marks.set(name, timestamp);

    if (typeof performance.mark === 'function') {
      performance.mark(name);
    }
  }

  /**
   * Measure time between two marks
   * @param {string} name - Measure name
   * @param {string} startMark - Start mark name
   * @param {string} endMark - End mark name (optional, uses now if not provided)
   * @returns {number} Duration in ms
   */
  measure(name, startMark, endMark = null) {
    if (!this.enabled) return 0;

    const startTime = this.marks.get(startMark);
    if (!startTime) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }

    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    if (endMark && !endTime) {
      console.warn(`End mark "${endMark}" not found`);
      return 0;
    }

    const duration = endTime - startTime;
    this.measures.set(name, duration);

    if (typeof performance.measure === 'function' && endMark) {
      try {
        performance.measure(name, startMark, endMark);
      } catch {
        // Silently fail if marks don't exist
      }
    }

    return duration;
  }

  /**
   * Start a timer
   * @param {string} name - Timer name
   */
  startTimer(name) {
    if (!this.enabled) return;
    this.timers.set(name, performance.now());
  }

  /**
   * End a timer and get duration
   * @param {string} name - Timer name
   * @returns {number} Duration in ms
   */
  endTimer(name) {
    if (!this.enabled) return 0;

    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer "${name}" not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);
    return duration;
  }

  /**
   * Profile a function execution
   * @param {string} name - Profile name
   * @param {Function} fn - Function to profile
   * @returns {*} Function result
   */
  profile(name, fn) {
    if (!this.enabled) return fn();

    this.startTimer(name);
    const result = fn();
    const duration = this.endTimer(name);

    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    return result;
  }

  /**
   * Profile an async function
   * @param {string} name - Profile name
   * @param {Function} fn - Async function to profile
   * @returns {Promise<*>} Function result
   */
  async profileAsync(name, fn) {
    if (!this.enabled) return fn();

    this.startTimer(name);
    const result = await fn();
    const duration = this.endTimer(name);

    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    return result;
  }

  /**
   * Get current metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get metric history
   * @param {string} metric - Metric name
   * @returns {Array} Metric history
   */
  getHistory(metric) {
    return this.history[metric] || [];
  }

  /**
   * Get all measures
   * @returns {Map} All measures
   */
  getMeasures() {
    return new Map(this.measures);
  }

  /**
   * Get performance status
   * @returns {Object} Status object
   */
  getStatus() {
    const fps = this.metrics.fps;
    const frameTime = this.metrics.frameTime;
    const memoryPercent = this.metrics.memory.limit
      ? (this.metrics.memory.used / this.metrics.memory.limit) * 100
      : 0;

    return {
      fps: this.getStatusLevel(fps, this.thresholds.fps, true),
      frameTime: this.getStatusLevel(frameTime, this.thresholds.frameTime, false),
      memory: this.getStatusLevel(memoryPercent, this.thresholds.memory, true),
      overall: this.getOverallStatus(),
    };
  }

  /**
   * Get status level for a metric
   */
  getStatusLevel(value, thresholds, higherIsBetter = true) {
    if (higherIsBetter) {
      if (value >= thresholds.good) return 'good';
      if (value >= thresholds.warning) return 'warning';
      return 'critical';
    } else {
      if (value <= thresholds.good) return 'good';
      if (value <= thresholds.warning) return 'warning';
      return 'critical';
    }
  }

  /**
   * Get overall performance status
   */
  getOverallStatus() {
    const fps = this.metrics.fps;
    const frameTime = this.metrics.frameTime;

    // Calculate status levels directly to avoid circular dependency
    const fpsStatus = this.getStatusLevel(fps, this.thresholds.fps, true);
    const frameTimeStatus = this.getStatusLevel(frameTime, this.thresholds.frameTime, false);

    if (fpsStatus === 'critical' || frameTimeStatus === 'critical') {
      return 'critical';
    }
    if (fpsStatus === 'warning' || frameTimeStatus === 'warning') {
      return 'warning';
    }
    return 'good';
  }

  /**
   * Get average from history
   * @param {string} metric - Metric name
   * @returns {number} Average value
   */
  getAverage(metric) {
    const history = this.getHistory(metric);
    if (history.length === 0) return 0;
    return history.reduce((sum, val) => sum + val, 0) / history.length;
  }

  /**
   * Get min/max from history
   * @param {string} metric - Metric name
   * @returns {Object} {min, max}
   */
  getMinMax(metric) {
    const history = this.getHistory(metric);
    if (history.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...history),
      max: Math.max(...history),
    };
  }

  /**
   * Log performance summary
   */
  logSummary() {
    const fps = this.metrics.fps;
    const avgFps = Math.round(this.getAverage('fps'));
    const { min: minFps, max: maxFps } = this.getMinMax('fps');

    console.group('📊 Performance Summary');
    console.log(`FPS: ${fps} (avg: ${avgFps}, min: ${minFps}, max: ${maxFps})`);
    console.log(`Frame Time: ${this.metrics.frameTime}ms`);

    if (this.metrics.memory.limit > 0) {
      const memPercent = ((this.metrics.memory.used / this.metrics.memory.limit) * 100).toFixed(1);
      console.log(
        `Memory: ${this.metrics.memory.used}MB / ${this.metrics.memory.limit}MB (${memPercent}%)`
      );
    }

    if (this.measures.size > 0) {
      console.log('⏱️ Measures:');
      this.measures.forEach((duration, name) => {
        console.log(`  ${name}: ${duration.toFixed(2)}ms`);
      });
    }

    console.groupEnd();
  }

  /**
   * Clear all data
   */
  clear() {
    this.marks.clear();
    this.measures.clear();
    this.timers.clear();
    Object.keys(this.history).forEach((key) => {
      this.history[key] = [];
    });
  }

  /**
   * Dispose monitor
   */
  dispose() {
    this.stopMonitoring();
    this.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const startTimer = (name) => performanceMonitor.startTimer(name);
export const endTimer = (name) => performanceMonitor.endTimer(name);
export const profile = (name, fn) => performanceMonitor.profile(name, fn);
export const profileAsync = (name, fn) => performanceMonitor.profileAsync(name, fn);
export const getMetrics = () => performanceMonitor.getMetrics();
export const logPerformance = () => performanceMonitor.logSummary();
