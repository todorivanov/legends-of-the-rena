/**
 * PerformanceMonitorUI - Visual display of performance metrics
 */

import { BaseComponent } from './BaseComponent.js';
import { performanceMonitor } from '../utils/PerformanceMonitor.js';
import { poolManager } from '../utils/ObjectPool.js';
import { lazyLoader } from '../utils/LazyLoader.js';

export class PerformanceMonitorUI extends BaseComponent {
  constructor() {
    super();
    this.updateInterval = null;
    this.expanded = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.startUpdating();
  }

  disconnectedCallback() {
    this.stopUpdating();
  }

  startUpdating() {
    this.updateInterval = setInterval(() => {
      this.render();
    }, 1000); // Update every second
  }

  stopUpdating() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.render();
  }

  template() {
    const metrics = performanceMonitor.getMetrics();
    const status = performanceMonitor.getStatus();
    const poolStats = poolManager.getAllStats();
    const lazyStats = lazyLoader.getStats();

    const fpsColor = this.getStatusColor(status.fps);
    const frameTimeColor = this.getStatusColor(status.frameTime);
    const memoryColor = this.getStatusColor(status.memory);

    return `
      <div class="perf-monitor ${this.expanded ? 'expanded' : 'collapsed'}">
        <div class="perf-header" data-action="toggle">
          <span class="perf-title">⚡ Performance</span>
          <span class="perf-toggle">${this.expanded ? '−' : '+'}</span>
        </div>
        
        <div class="perf-content">
          <!-- FPS -->
          <div class="perf-metric">
            <span class="perf-label">FPS:</span>
            <span class="perf-value" style="color: ${fpsColor}">
              ${metrics.fps}
            </span>
          </div>

          <!-- Frame Time -->
          <div class="perf-metric">
            <span class="perf-label">Frame:</span>
            <span class="perf-value" style="color: ${frameTimeColor}">
              ${metrics.frameTime}ms
            </span>
          </div>

          <!-- Memory -->
          ${
            metrics.memory.limit > 0
              ? `
            <div class="perf-metric">
              <span class="perf-label">Memory:</span>
              <span class="perf-value" style="color: ${memoryColor}">
                ${metrics.memory.used}MB
              </span>
            </div>
          `
              : ''
          }

          ${
            this.expanded
              ? `
            <div class="perf-divider"></div>
            
            <!-- Object Pools -->
            <div class="perf-section">
              <div class="perf-section-title">Object Pools</div>
              ${Object.entries(poolStats)
                .map(
                  ([name, stats]) => `
                <div class="perf-pool">
                  <span class="pool-name">${name}:</span>
                  <span class="pool-stats">
                    ${stats.active}/${stats.total}
                    (${Math.round(stats.utilization * 100)}%)
                  </span>
                </div>
              `
                )
                .join('')}
            </div>

            <!-- Lazy Loader -->
            <div class="perf-section">
              <div class="perf-section-title">Lazy Loader</div>
              <div class="perf-metric">
                <span class="perf-label">Cached:</span>
                <span class="perf-value">${lazyStats.cached}</span>
              </div>
              <div class="perf-metric">
                <span class="perf-label">Loading:</span>
                <span class="perf-value">${lazyStats.loading}</span>
              </div>
              <div class="perf-metric">
                <span class="perf-label">Queued:</span>
                <span class="perf-value">${lazyStats.queued}</span>
              </div>
            </div>

            <!-- Average Stats -->
            <div class="perf-section">
              <div class="perf-section-title">Averages (60s)</div>
              <div class="perf-metric">
                <span class="perf-label">Avg FPS:</span>
                <span class="perf-value">
                  ${Math.round(performanceMonitor.getAverage('fps'))}
                </span>
              </div>
              <div class="perf-metric">
                <span class="perf-label">Avg Frame:</span>
                <span class="perf-value">
                  ${performanceMonitor.getAverage('frameTime').toFixed(1)}ms
                </span>
              </div>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  getStatusColor(status) {
    switch (status) {
      case 'good':
        return '#4ade80';
      case 'warning':
        return '#fbbf24';
      case 'critical':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  }

  styles() {
    return `
      :host {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        font-family: 'Courier New', monospace;
        user-select: none;
      }

      .perf-monitor {
        background: rgba(0, 0, 0, 0.85);
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 10px;
        min-width: 180px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        transition: all 0.3s ease;
      }

      .perf-monitor.expanded {
        min-width: 250px;
      }

      .perf-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 2px 4px;
        margin: -4px -4px 8px -4px;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .perf-header:hover {
        background: rgba(59, 130, 246, 0.2);
      }

      .perf-title {
        color: #3b82f6;
        font-size: 14px;
        font-weight: bold;
      }

      .perf-toggle {
        color: #3b82f6;
        font-size: 16px;
        font-weight: bold;
      }

      .perf-content {
        color: #fff;
        font-size: 12px;
      }

      .perf-metric {
        display: flex;
        justify-content: space-between;
        margin: 4px 0;
        padding: 2px 0;
      }

      .perf-label {
        color: #9ca3af;
      }

      .perf-value {
        font-weight: bold;
      }

      .perf-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
        margin: 10px 0;
      }

      .perf-section {
        margin: 10px 0;
      }

      .perf-section-title {
        color: #60a5fa;
        font-size: 11px;
        font-weight: bold;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .perf-pool {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        margin: 3px 0;
        padding: 2px 0;
      }

      .pool-name {
        color: #9ca3af;
        text-transform: capitalize;
      }

      .pool-stats {
        color: #d1d5db;
      }

      /* Responsive */
      @media (max-width: 768px) {
        :host {
          top: 10px;
          left: 10px;
        }

        .perf-monitor {
          font-size: 11px;
          padding: 8px;
          min-width: 150px;
        }
      }
    `;
  }

  attachEventListeners() {
    this.shadowRoot.querySelector('[data-action="toggle"]')?.addEventListener('click', () => {
      this.toggleExpanded();
    });
  }
}

customElements.define('performance-monitor-ui', PerformanceMonitorUI);
