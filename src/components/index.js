/**
 * Web Components Entry Point
 * Import all components to register them
 */

export { BaseComponent } from './BaseComponent.js';
export { FighterCard } from './FighterCard.js';
export { ActionSelection } from './ActionSelection.js';
export { StatusEffectIcon } from './StatusEffectIcon.js';
export { TurnIndicator } from './TurnIndicator.js';
export { ComboIndicator } from './ComboIndicator.js';
export { FighterHUD } from './FighterHUD.js';

// Auto-register all components by importing this file
console.log('✅ All Web Components registered');
