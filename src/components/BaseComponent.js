/**
 * BaseComponent - Base class for all Web Components
 * Provides common functionality and patterns
 */
export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = {};
  }

  /**
   * Get component state
   */
  get state() {
    return this._state;
  }

  /**
   * Set component state and trigger render
   */
  setState(newState) {
    this._state = { ...this._state, ...newState };
    this.render();
  }

  /**
   * Create styles for the component
   * Override in subclasses
   */
  styles() {
    return '';
  }

  /**
   * Create template for the component
   * Override in subclasses
   */
  template() {
    return '';
  }

  /**
   * Render the component
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Import theme variables from parent */
        :host {
          --text-color: var(--text-color, #333);
          --bg-color: var(--bg-color, #fff);
          --card-bg: var(--card-bg, #f8f9fa);
          --border-color: var(--border-color, #dee2e6);
          --primary-color: var(--primary-color, #007bff);
          --success-color: var(--success-color, #28a745);
          --danger-color: var(--danger-color, #dc3545);
          --warning-color: var(--warning-color, #ffc107);
          --info-color: var(--info-color, #17a2b8);
        }
        
        ${this.styles()}
      </style>
      ${this.template()}
    `;
    
    this.attachEventListeners();
  }

  /**
   * Attach event listeners
   * Override in subclasses
   */
  attachEventListeners() {
    // Override in subclasses
  }

  /**
   * Called when component is added to DOM
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Dispatch custom event
   */
  emit(eventName, detail = {}) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}
