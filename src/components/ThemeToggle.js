/**
 * ThemeToggle - Dark/Light mode toggle button
 */

import { BaseComponent } from './BaseComponent.js';

export class ThemeToggle extends BaseComponent {
  constructor() {
    super();
    this.darkMode = localStorage.getItem('darkMode') === 'true';
  }

  connectedCallback() {
    // Apply saved theme
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    }

    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const button = this.shadowRoot.querySelector('#theme-toggle-btn');
    button.addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', this.darkMode);

    // Update button icon
    const button = this.shadowRoot.querySelector('#theme-toggle-btn');
    button.textContent = this.darkMode ? '☀️' : '🌙';
  }

  render() {
    const styles = `
      <style>
        :host {
          display: block;
          position: fixed;
          bottom: 20px;
          right: 80px;
          z-index: 10000;
        }

        .theme-toggle-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(26, 13, 46, 0.8);
          color: white;
          font-size: 24px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-toggle-btn:hover {
          transform: translateY(-2px) scale(1.1);
          border-color: #ffa726;
          background: rgba(255, 167, 38, 0.3);
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
        }

        @media (max-width: 768px) {
          :host {
            top: 10px;
            right: 60px;
          }

          .theme-toggle-btn {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <button 
        id="theme-toggle-btn" 
        class="theme-toggle-btn"
        title="Toggle ${this.darkMode ? 'Light' : 'Dark'} Mode"
      >
        ${this.darkMode ? '☀️' : '🌙'}
      </button>
    `;
  }
}

customElements.define('theme-toggle', ThemeToggle);
