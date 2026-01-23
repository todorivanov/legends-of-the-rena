import { BaseComponent } from './BaseComponent.js';
import { TerrainEffectProcessor } from '../game/TerrainSystem.js';
import { EnemyIconMapper } from '../utils/EnemyIconMapper.js';
import styles from '../styles/components/GridCombatUI.scss?inline';

/**
 * GridCombatUI - Visual component for the 9x9 tactical grid
 */
export class GridCombatUI extends BaseComponent {
  constructor() {
    super();
    this.gridManager = null;
    this.selectedCell = null;
    this.validMoves = [];
    this.validTargets = [];
    this.mode = 'view'; // 'view', 'move', 'attack'
    this.onCellClick = null;
  }

  setGridManager(gridManager) {
    this.gridManager = gridManager;
    this.render();
  }

  setMode(mode, data = {}) {
    this.mode = mode;
    this.validMoves = data.validMoves || [];
    this.validTargets = data.validTargets || [];
    this.render();
  }

  selectCell(x, y) {
    this.selectedCell = { x, y };
    this.render();
  }

  clearSelection() {
    this.selectedCell = null;
    this.validMoves = [];
    this.validTargets = [];
    this.render();
  }

  highlightCells(cells) {
    this.validMoves = cells || [];
    this.render();
  }

  clearHighlights() {
    this.validMoves = [];
    this.validTargets = [];
    this.selectedCell = null;
    this.render();
  }

  template() {
    if (!this.gridManager) {
      return '<div class="grid-placeholder">Loading grid...</div>';
    }

    return `
      <style>${styles}</style>

      <div class="grid-container">
        <div class="grid-header">
          <div class="grid-title">⚔️ Tactical Grid ⚔️</div>
          <div class="grid-mode">${this.getModeText()}</div>
        </div>

        <div class="grid">
          ${this.renderGrid()}
        </div>

        ${this.renderLegend()}
        ${this.renderStats()}
      </div>
    `;
  }

  getModeText() {
    switch (this.mode) {
      case 'move':
        return '🏃 Select destination to move';
      case 'attack':
        return '⚔️ Select enemy to attack';
      default:
        return '👁️ Viewing battlefield';
    }
  }

  renderGrid() {
    let html = '';

    for (let y = 0; y < this.gridManager.height; y++) {
      for (let x = 0; x < this.gridManager.width; x++) {
        const cell = this.gridManager.getCell(x, y);
        const isSelected =
          this.selectedCell && this.selectedCell.x === x && this.selectedCell.y === y;
        const isValidMove = this.validMoves.some((m) => m.x === x && m.y === y);
        const isValidTarget = this.validTargets.some((t) => t.x === x && t.y === y);

        const classes = [
          'grid-cell',
          cell.isOccupied() ? 'occupied' : '',
          isSelected ? 'selected' : '',
          isValidMove ? 'valid-move' : '',
          isValidTarget ? 'valid-target' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const terrainStyle = this.getTerrainStyle(cell.terrain);

        html += `
          <div 
            class="${classes}"
            data-x="${x}"
            data-y="${y}"
            style="${terrainStyle}"
            title="${this.getCellTooltip(cell)}"
          >
            <div class="terrain-icon">${TerrainEffectProcessor.getTerrainIcon(cell.terrain)}</div>
            ${this.renderFighter(cell)}
            ${isValidMove ? `<div class="cell-info">${this.validMoves.find((m) => m.x === x && m.y === y).cost}</div>` : ''}
          </div>
        `;
      }
    }

    return html;
  }

  getTerrainStyle(terrain) {
    const styles = {
      normal: `
        background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      `,
      grass: `
        background: linear-gradient(135deg, #81c784 0%, #66bb6a 50%, #4caf50 100%);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        background-image: 
          linear-gradient(135deg, #81c784 0%, #66bb6a 50%, #4caf50 100%),
          repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(56, 142, 60, 0.1) 10px, rgba(56, 142, 60, 0.1) 20px);
      `,
      forest: `
        background: linear-gradient(135deg, #43a047 0%, #388e3c 50%, #2e7d32 100%);
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
        border-color: rgba(27, 94, 32, 0.6);
        background-image: 
          linear-gradient(135deg, #43a047 0%, #388e3c 50%, #2e7d32 100%),
          repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(27, 94, 32, 0.2) 5px, rgba(27, 94, 32, 0.2) 10px);
      `,
      water: `
        background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #03a9f4 100%);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 10px rgba(3, 169, 244, 0.3);
        animation: water-shimmer 3s ease-in-out infinite;
        background-image: 
          linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #03a9f4 100%),
          repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255, 255, 255, 0.1) 8px, rgba(255, 255, 255, 0.1) 16px);
      `,
      mud: `
        background: linear-gradient(135deg, #8d6e63 0%, #6d4c41 50%, #5d4037 100%);
        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
        background-image: 
          radial-gradient(circle at 20% 30%, rgba(93, 64, 55, 0.5) 2px, transparent 3px),
          radial-gradient(circle at 70% 60%, rgba(93, 64, 55, 0.5) 2px, transparent 3px),
          radial-gradient(circle at 40% 80%, rgba(93, 64, 55, 0.5) 2px, transparent 3px),
          linear-gradient(135deg, #8d6e63 0%, #6d4c41 50%, #5d4037 100%);
      `,
      rock: `
        background: linear-gradient(135deg, #9e9e9e 0%, #757575 50%, #616161 100%);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), inset 2px 2px 0 rgba(255, 255, 255, 0.2);
        background-image: 
          linear-gradient(135deg, #9e9e9e 0%, #757575 50%, #616161 100%),
          repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(97, 97, 97, 0.3) 8px, rgba(97, 97, 97, 0.3) 16px);
      `,
      high_ground: `
        background: linear-gradient(135deg, #bcaaa4 0%, #a1887f 50%, #8d6e63 100%);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3);
        border: 3px solid rgba(121, 85, 72, 0.5);
        transform: scale(1.05);
      `,
      low_ground: `
        background: linear-gradient(135deg, #6d4c41 0%, #5d4037 50%, #4e342e 100%);
        box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.5);
        transform: scale(0.95);
        filter: brightness(0.7);
      `,
      wall: `
        background: linear-gradient(135deg, #757575 0%, #616161 50%, #424242 100%);
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(0, 0, 0, 0.5);
        background-image: 
          repeating-linear-gradient(0deg, #757575, #757575 10px, #616161 10px, #616161 20px),
          repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 10px, rgba(0, 0, 0, 0.1) 20px);
        cursor: not-allowed;
      `,
      pit: `
        background: radial-gradient(circle, #424242 0%, #212121 50%, #000000 100%);
        box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.9);
        border: 2px solid rgba(0, 0, 0, 0.8);
        cursor: not-allowed;
      `,
    };

    return styles[terrain] || styles.normal;
  }

  renderFighter(cell) {
    if (!cell.occupant) return '';

    const fighter = cell.occupant;
    const icon = EnemyIconMapper.getIconWithBossIndicator(fighter);
    const className = fighter.isPlayer ? 'player' : 'enemy';
    const color = EnemyIconMapper.getEnemyColor(fighter);
    const style = `color: ${color}; text-shadow: 0 0 8px ${color}aa;`;

    return `<div class="fighter-icon ${className}" style="${style}">${icon}</div>`;
  }

  getCellTooltip(cell) {
    let tooltip = TerrainEffectProcessor.getTerrainDescription(cell.terrain);

    if (cell.occupant) {
      tooltip += `\n\n🎭 ${cell.occupant.name}\n❤️ HP: ${Math.round(cell.occupant.health)}/${cell.occupant.maxHealth}`;
    }

    return tooltip;
  }

  renderLegend() {
    return `
      <div class="grid-legend">
        <div class="legend-title">🗺️ Terrain Types</div>
        <div class="legend-items">
          <div class="legend-item"><span class="legend-icon">🟩</span> Normal Ground</div>
          <div class="legend-item"><span class="legend-icon">🌲</span> Forest (+Def, Blocks LOS)</div>
          <div class="legend-item"><span class="legend-icon">🌊</span> Water (Slow)</div>
          <div class="legend-item"><span class="legend-icon">⛰️</span> High Ground (+Atk/Def)</div>
          <div class="legend-item"><span class="legend-icon">🪨</span> Rock (+Def)</div>
          <div class="legend-item"><span class="legend-icon">🧱</span> Wall (Impassable)</div>
        </div>
      </div>
    `;
  }

  renderStats() {
    if (!this.gridManager) return '';

    // Count fighters
    let playerCount = 0;
    let enemyCount = 0;

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const cell = this.gridManager.getCell(x, y);
        if (cell.occupant) {
          if (cell.occupant.isPlayer) playerCount++;
          else enemyCount++;
        }
      }
    }

    return `
      <div class="grid-stats">
        <div class="stat-item">
          <div class="stat-label">Allies</div>
          <div class="stat-value" style="color: #00e676;">🦸 ${playerCount}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Enemies</div>
          <div class="stat-value" style="color: #ff1744;">👹 ${enemyCount}</div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const cells = this.shadowRoot.querySelectorAll('.grid-cell');

    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        // Emit event for external listeners
        this.emit('cell-clicked', { x, y });

        // Call callback if provided (legacy support)
        if (this.onCellClick) {
          this.onCellClick(x, y);
        }
      });
    });
  }
}

customElements.define('grid-combat-ui', GridCombatUI);
