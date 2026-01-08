# Store Integration Examples

## Web Component Integration

### Example: Gold Display Component

```javascript
import { BaseComponent } from './BaseComponent.js';
import { gameStore, selectPlayerGold } from '../store/index.js';

export class GoldDisplay extends BaseComponent {
  constructor() {
    super();
    this.unsubscribe = null;
  }

  connectedCallback() {
    this.render();
    
    // Subscribe to gold changes
    this.unsubscribe = gameStore.subscribe((state) => {
      this.updateGold(selectPlayerGold(state));
    }, 'player.gold');
  }

  disconnectedCallback() {
    // Clean up subscription
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updateGold(gold) {
    const goldEl = this.shadowRoot.querySelector('#gold-amount');
    if (goldEl) {
      goldEl.textContent = gold;
    }
  }

  render() {
    const state = gameStore.getState();
    const gold = selectPlayerGold(state);

    this.shadowRoot.innerHTML = `
      <style>
        .gold-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid gold;
          border-radius: 8px;
        }
        .gold-icon { font-size: 24px; }
        .gold-amount { font-size: 20px; font-weight: bold; color: gold; }
      </style>
      
      <div class="gold-display">
        <span class="gold-icon">💰</span>
        <span class="gold-amount" id="gold-amount">${gold}</span>
        <span>Gold</span>
      </div>
    `;
  }
}

customElements.define('gold-display', GoldDisplay);
```

### Example: Shop Item Component

```javascript
import { BaseComponent } from './BaseComponent.js';
import { gameStore, spendGold, addItem, selectCanAfford } from '../store/index.js';
import { soundManager } from '../utils/soundManager.js';

export class ShopItem extends BaseComponent {
  constructor() {
    super();
    this.item = null;
  }

  static get observedAttributes() {
    return ['item-id', 'item-price', 'item-name'];
  }

  connectedCallback() {
    this.item = {
      id: this.getAttribute('item-id'),
      name: this.getAttribute('item-name'),
      price: parseInt(this.getAttribute('item-price')),
    };
    
    this.render();
    this.attachEventListeners();
    
    // Subscribe to gold changes to update button state
    this.unsubscribe = gameStore.subscribe((state) => {
      this.updateBuyButton(state);
    }, 'player.gold');
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  attachEventListeners() {
    const buyBtn = this.shadowRoot.querySelector('#buy-btn');
    buyBtn.addEventListener('click', () => this.handlePurchase());
  }

  updateBuyButton(state) {
    const buyBtn = this.shadowRoot.querySelector('#buy-btn');
    const canAfford = selectCanAfford(state, this.item.price);
    
    buyBtn.disabled = !canAfford;
    buyBtn.textContent = canAfford ? 'Buy' : 'Not Enough Gold';
  }

  handlePurchase() {
    const state = gameStore.getState();
    
    if (!selectCanAfford(state, this.item.price)) {
      soundManager.play('error');
      return;
    }

    // Purchase item via store
    gameStore.dispatch(spendGold(this.item.price));
    gameStore.dispatch(addItem(this.item));
    
    soundManager.play('purchase');
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('item-purchased', {
      detail: { item: this.item },
      bubbles: true,
    }));
  }

  render() {
    const state = gameStore.getState();
    const canAfford = selectCanAfford(state, this.item.price);

    this.shadowRoot.innerHTML = `
      <style>
        .shop-item {
          padding: 16px;
          border: 2px solid #6a42c2;
          border-radius: 12px;
          background: rgba(106, 66, 194, 0.1);
        }
        .item-name { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
        .item-price { color: gold; margin-bottom: 12px; }
        button {
          padding: 8px 16px;
          background: #6a42c2;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        button:disabled {
          background: #555;
          cursor: not-allowed;
        }
        button:not(:disabled):hover {
          background: #8b5cf6;
        }
      </style>
      
      <div class="shop-item">
        <div class="item-name">${this.item.name}</div>
        <div class="item-price">💰 ${this.item.price} Gold</div>
        <button id="buy-btn" ${!canAfford ? 'disabled' : ''}>
          ${canAfford ? 'Buy' : 'Not Enough Gold'}
        </button>
      </div>
    `;
  }
}

customElements.define('shop-item', ShopItem);
```

### Example: Level Progress Bar

```javascript
import { BaseComponent } from './BaseComponent.js';
import { gameStore, selectPlayerLevel, selectLevelProgress } from '../store/index.js';

export class LevelProgressBar extends BaseComponent {
  connectedCallback() {
    this.render();
    
    // Subscribe to XP changes
    this.unsubscribe = gameStore.subscribe((state) => {
      this.updateProgress(selectLevelProgress(state));
    }, 'player.xp');
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updateProgress(progress) {
    const progressBar = this.shadowRoot.querySelector('.progress-fill');
    const progressText = this.shadowRoot.querySelector('.progress-text');
    
    if (progressBar && progressText) {
      progressBar.style.width = `${progress.percentage}%`;
      progressText.textContent = `${progress.current} / ${progress.needed} XP`;
    }
  }

  render() {
    const state = gameStore.getState();
    const level = selectPlayerLevel(state);
    const progress = selectLevelProgress(state);

    this.shadowRoot.innerHTML = `
      <style>
        .level-container {
          padding: 16px;
          background: rgba(26, 13, 46, 0.8);
          border-radius: 12px;
        }
        .level-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .progress-bar {
          width: 100%;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6a42c2, #8b5cf6);
          transition: width 0.3s ease;
          width: ${progress.percentage}%;
        }
        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px black;
        }
      </style>
      
      <div class="level-container">
        <div class="level-info">
          <span>Level ${level}</span>
          <span>Next: Level ${level + 1}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
          <div class="progress-text">${progress.current} / ${progress.needed} XP</div>
        </div>
      </div>
    `;
  }
}

customElements.define('level-progress-bar', LevelProgressBar);
```

## Common Patterns

### Pattern 1: Optimistic UI Updates

```javascript
async function saveToServer(data) {
  // Update UI immediately
  gameStore.dispatch(updatePlayer(data));
  
  try {
    await api.save(data);
    // Success!
  } catch (error) {
    // Revert on error
    gameStore.undo();
    console.error('Save failed:', error);
  }
}
```

### Pattern 2: Batch Updates

```javascript
// Instead of multiple dispatches
function completeBattle(winner, stats) {
  // Single compound action
  gameStore.dispatch(endCombat(winner, stats));
  gameStore.dispatch(addGold(stats.goldEarned));
  gameStore.dispatch(addXP(stats.xpEarned));
  gameStore.dispatch(recordBattle(true, stats));
}
```

### Pattern 3: Derived State in Components

```javascript
class PlayerStatsComponent extends BaseComponent {
  connectedCallback() {
    this.render();
    
    // Subscribe and compute derived state
    this.unsubscribe = gameStore.subscribe((state) => {
      const stats = this.computeStats(state);
      this.updateUI(stats);
    });
  }

  computeStats(state) {
    const base = selectPlayer(state);
    const equipped = selectEquipped(state);
    
    // Compute total stats with equipment bonuses
    return {
      health: base.health + this.getEquipmentBonus(equipped, 'health'),
      strength: base.strength + this.getEquipmentBonus(equipped, 'strength'),
      defense: base.defense + this.getEquipmentBonus(equipped, 'defense'),
    };
  }

  getEquipmentBonus(equipped, stat) {
    // Calculate bonuses from equipped items
    return 0; // Implementation detail
  }
}
```

### Pattern 4: Conditional Subscriptions

```javascript
class CombatUI extends BaseComponent {
  connectedCallback() {
    this.render();
    
    // Only subscribe when combat is active
    this.mainSubscription = gameStore.subscribe((state) => {
      const active = selectIsCombatActive(state);
      
      if (active && !this.combatSubscription) {
        // Start combat subscriptions
        this.combatSubscription = gameStore.subscribe(
          (state) => this.updateCombat(state),
          'combat'
        );
      } else if (!active && this.combatSubscription) {
        // Clean up combat subscriptions
        this.combatSubscription();
        this.combatSubscription = null;
      }
    }, 'combat.active');
  }

  disconnectedCallback() {
    if (this.mainSubscription) this.mainSubscription();
    if (this.combatSubscription) this.combatSubscription();
  }
}
```

## Testing with Store

### Test Setup

```javascript
import { createStore } from './store/Store.js';
import { reducers } from './store/reducers.js';

// Create isolated test store
function createTestStore(initialState = {}) {
  return createStore({
    player: { gold: 100, level: 1, xp: 0, ...initialState.player },
    ...initialState,
  }, reducers);
}

// Test example
describe('Gold System', () => {
  it('should add gold correctly', () => {
    const store = createTestStore();
    
    store.dispatch(addGold(50));
    
    const state = store.getState();
    expect(selectPlayerGold(state)).toBe(150);
  });

  it('should not go below 0 gold', () => {
    const store = createTestStore({ player: { gold: 10 } });
    
    store.dispatch(spendGold(50));
    
    const state = store.getState();
    expect(selectPlayerGold(state)).toBe(0); // Clamped to 0
  });
});
```

## Performance Tips

1. **Use specific selectors** for subscriptions
2. **Memoize expensive computations** in selectors
3. **Batch related updates** into single actions
4. **Unsubscribe** when components unmount
5. **Avoid subscribing in loops** - subscribe once at top level

## Debugging Tips

```javascript
// Enable action logging
gameStore.use({
  before: (state, action) => {
    console.group(`Action: ${action.type}`);
    console.log('Payload:', action.payload);
    console.table(state);
  },
  after: (state) => {
    console.table(state);
    console.groupEnd();
  },
});

// Inspect store from console
console.log(window.__GAME_STORE__.inspect());

// Test actions manually
window.__GAME_STORE__.dispatch({ type: 'ADD_GOLD', payload: { amount: 100 } });

// Time-travel debugging
window.__GAME_STORE__.undo(); // Go back
window.__GAME_STORE__.redo(); // Go forward
```
