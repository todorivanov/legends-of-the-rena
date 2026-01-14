import { BaseComponent } from './BaseComponent.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { getAllClasses } from '../data/classes.js';
import { gameStore } from '../store/gameStore.js';
import { updatePlayer } from '../store/actions.js';
import styles from '../styles/components/CharacterCreation.scss?inline';

/**
 * CharacterCreation Web Component
 * Character creation screen for first-time players
 *
 * Events:
 * - character-created: { name, class, appearance }
 */
export class CharacterCreation extends BaseComponent {
  constructor() {
    super();
    this.selectedClass = 'BALANCED';
    this.selectedAppearance = 'avatar1';
    this.characterName = '';
  }

  styles() {
    return styles;
  }

  template() {
    const classes = getAllClasses();
    const appearances = ['🧙', '🧑‍🚀', '🧝', '🧛', '🥷', '🤠', '🧙‍♀️', '🦸', '🦹'];

    // Determine difficulty for each class
    const beginnerClasses = ['BALANCED', 'WARRIOR', 'PALADIN', 'BRUISER'];

    return `
      <div class="creation-container">
        <div class="creation-header">
          <h1 class="creation-title">⚔️ Create Your Hero ⚔️</h1>
          <p class="creation-subtitle">Choose your path to glory</p>
        </div>

        <div class="creation-form">
          <!-- Name Section -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-icon">📝</span>
              Character Name
            </div>
            <input 
              type="text" 
              class="name-input" 
              id="name-input"
              placeholder="Enter your hero's name..."
              maxlength="20"
            />
          </div>

          <!-- Class Selection -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-icon">🎭</span>
              Choose Your Class (${classes.length} Classes)
            </div>
            <div class="class-grid">
              ${classes
                .map((cls) => {
                  const baseHP = 400;
                  const baseSTR = 10;
                  const actualHP = Math.round(baseHP * cls.stats.healthMod);
                  const actualSTR = (baseSTR * cls.stats.strengthMod).toFixed(1);
                  const isBeginner = beginnerClasses.includes(cls.id);

                  return `
                  <div class="class-option ${this.selectedClass === cls.id ? 'selected' : ''}" data-class="${cls.id}">
                    <div class="class-header">
                      <div class="class-icon">${cls.icon}</div>
                      <div class="class-title">
                        <div class="class-name">${cls.name}</div>
                        <span class="difficulty-badge ${isBeginner ? 'difficulty-beginner' : 'difficulty-advanced'}">
                          ${isBeginner ? '★ Beginner' : '★★★ Advanced'}
                        </span>
                      </div>
                    </div>
                    
                    <div class="class-description">${cls.description}</div>
                    
                    <div class="class-stats">
                      <div class="stat-item">❤️ HP: ${actualHP}</div>
                      <div class="stat-item">⚔️ STR: ${actualSTR}</div>
                      <div class="stat-item">🛡️ DEF: ${(cls.stats.defenseMod * 100).toFixed(0)}%</div>
                      <div class="stat-item">💎 Crit: ${(cls.stats.critChance * 100).toFixed(0)}%</div>
                      <div class="stat-item">✨ Mana: +${cls.stats.manaRegen}/turn</div>
                      <div class="stat-item">💥 Crit Dmg: ${(cls.stats.critDamage * 100).toFixed(0)}%</div>
                    </div>
                    
                    <div class="class-passive">
                      <div class="passive-header">
                        <span class="passive-icon">${cls.passive.icon}</span>
                        <span class="passive-name">${cls.passive.name}</span>
                      </div>
                      <div class="passive-description">${cls.passive.description}</div>
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>

          <!-- Appearance Selection -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-icon">👤</span>
              Choose Your Avatar
            </div>
            <div class="appearance-grid">
              ${appearances
                .map(
                  (emoji, idx) => `
                <div class="appearance-option ${this.selectedAppearance === `avatar${idx}` ? 'selected' : ''}" data-appearance="avatar${idx}">
                  ${emoji}
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Create Button -->
          <div class="form-section">
            <button class="create-btn" id="create-btn">
              ⚔️ Begin Your Journey ⚔️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const nameInput = this.shadowRoot.getElementById('name-input');
    const createBtn = this.shadowRoot.getElementById('create-btn');
    const classOptions = this.shadowRoot.querySelectorAll('.class-option');
    const appearanceOptions = this.shadowRoot.querySelectorAll('.appearance-option');

    // Set initial button state
    this.updateCreateButton();

    // Name input
    nameInput.addEventListener('input', (e) => {
      this.characterName = e.target.value.trim();
      this.updateCreateButton();
    });

    // Class selection - update without full re-render
    classOptions.forEach((option) => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        classOptions.forEach((opt) => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Update selected class
        this.selectedClass = option.dataset.class;
      });
    });

    // Appearance selection - update without full re-render
    appearanceOptions.forEach((option) => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        appearanceOptions.forEach((opt) => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Update selected appearance
        this.selectedAppearance = option.dataset.appearance;
      });
    });

    // Create button
    createBtn.addEventListener('click', () => {
      if (this.characterName.length >= 2) {
        this.createCharacter();
      }
    });

    // Enter key to create
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.characterName.length >= 2) {
        this.createCharacter();
      }
    });
  }

  updateCreateButton() {
    const createBtn = this.shadowRoot.getElementById('create-btn');
    if (createBtn) {
      createBtn.disabled = this.characterName.length < 2;
    }
  }

  createCharacter() {
    const classStats = {
      BALANCED: { health: 400, strength: 10 },
      WARRIOR: { health: 350, strength: 13 },
      TANK: { health: 600, strength: 4 },
      GLASS_CANNON: { health: 300, strength: 20 },
      BRUISER: { health: 500, strength: 6 },
      MAGE: { health: 340, strength: 8 },
      ASSASSIN: { health: 320, strength: 12 },
      BERSERKER: { health: 440, strength: 11.5 },
      PALADIN: { health: 480, strength: 10.5 },
      NECROMANCER: { health: 360, strength: 8.5 },
    };

    const stats = classStats[this.selectedClass];

    const characterData = {
      name: this.characterName,
      class: this.selectedClass,
      appearance: this.selectedAppearance,
      health: stats.health,
      strength: stats.strength,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.characterName.toLowerCase()}&backgroundColor=b6e3f4`,
      description: `A ${this.selectedClass.toLowerCase()} hero forged in the fires of battle.`,
    };

    // Save to profile
    SaveManager.update('profile.name', this.characterName);
    SaveManager.update('profile.character', characterData);
    SaveManager.update('profile.characterCreated', true);

    const currentTime = Date.now();

    // Update gameStore to sync state
    gameStore.dispatch(
      updatePlayer({
        name: this.characterName,
        character: characterData,
        characterCreated: true,
        health: stats.health,
        maxHealth: stats.health,
        strength: stats.strength,
        class: this.selectedClass,
        createdAt: currentTime,
        lastPlayedAt: currentTime,
      })
    );

    ConsoleLogger.info(LogCategory.UI, '✅ Character created:', characterData);

    // Emit event
    this.emit('character-created', characterData);
  }
}

customElements.define('character-creation', CharacterCreation);
