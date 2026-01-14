/**
 * Sound Manager - Handles game sound effects
 * Uses Web Audio API for better performance
 */

import { ConsoleLogger, LogCategory } from './ConsoleLogger.js';

export class SoundManager {
  constructor() {
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.3');
    this.audioContext = null;
    this.initialized = false;
  }

  /**
   * Initialize Audio Context (requires user interaction)
   */
  init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
      ConsoleLogger.info(LogCategory.SOUND, '🔊 Sound system initialized');

      // Play a silent sound to "unlock" audio on mobile
      this.playTestSound();
    } catch (e) {
      ConsoleLogger.warn(LogCategory.SOUND, 'Sound not supported:', e);
      this.enabled = false;
    }
  }

  /**
   * Play test sound (silent) to unlock audio
   */
  playTestSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    gainNode.gain.value = 0.001; // Nearly silent
    oscillator.frequency.value = 440;
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.01);
  }

  /**
   * Play a sound effect using frequency-based synthesis
   * @param {string} type - Sound type (hit, miss, special, heal, event, victory)
   */
  play(type) {
    if (!this.enabled) return;

    // Initialize on first play if needed
    if (!this.initialized) {
      this.init();
    }

    if (!this.audioContext) return;

    const audioContext = this.audioContext;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = this.volume;

    // Start the oscillator first
    oscillator.start();

    switch (type) {
      case 'hit':
        // Quick punch sound
        oscillator.frequency.value = 200;
        oscillator.type = 'square';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;

      case 'special':
        // Powerful whoosh
        oscillator.frequency.value = 400;
        oscillator.type = 'sawtooth';
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;

      case 'miss':
        // Swoosh miss
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;

      case 'heal':
        // Magical chime
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;

      case 'event':
        // Dramatic alarm
        oscillator.frequency.value = 300;
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;

      case 'victory':
        // Triumphant fanfare
        oscillator.frequency.value = 523; // C5
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.15); // E5
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.3); // G5
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        oscillator.stop(audioContext.currentTime + 0.6);
        break;

      default:
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
  }

  /**
   * Toggle sound on/off
   */
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);

    // Initialize on enable
    if (this.enabled && !this.initialized) {
      this.init();
    }

    return this.enabled;
  }

  /**
   * Set volume level
   * @param {number} level - Volume (0.0 to 1.0)
   */
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    localStorage.setItem('soundVolume', this.volume);
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
