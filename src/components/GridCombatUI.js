import { BaseComponent } from './BaseComponent.js';
import { TerrainEffectProcessor } from '../game/TerrainSystem.js';

/**
 * GridCombatUI - Visual component for the 5x5 tactical grid
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
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 600px;
          margin: 20px auto;
        }

        .grid-container {
          background: linear-gradient(135deg, #1a0d2e 0%, #0f051d 100%);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .grid-header {
          text-align: center;
          margin-bottom: 15px;
        }

        .grid-title {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 5px;
        }

        .grid-mode {
          font-size: 14px;
          color: #b39ddb;
          font-weight: 600;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(5, 1fr);
          gap: 4px;
          aspect-ratio: 1;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px;
          border-radius: 12px;
        }

        .grid-cell {
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          aspect-ratio: 1;
          overflow: hidden;
        }

        .grid-cell:hover {
          transform: scale(1.05);
          border-color: rgba(255, 215, 0, 0.5);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
          z-index: 10;
        }

        .grid-cell.occupied {
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
        }

        .grid-cell.selected {
          border: 3px solid #FFD700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          transform: scale(1.08);
          z-index: 15;
        }

        .grid-cell.valid-move {
          border-color: rgba(0, 230, 118, 0.8);
          background: rgba(0, 230, 118, 0.1);
          animation: pulse-green 1.5s ease-in-out infinite;
        }

        .grid-cell.valid-target {
          border-color: rgba(255, 23, 68, 0.8);
          background: rgba(255, 23, 68, 0.1);
          animation: pulse-red 1.5s ease-in-out infinite;
        }

        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 230, 118, 0.4); }
          50% { box-shadow: 0 0 20px rgba(0, 230, 118, 0.8); }
        }

        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 23, 68, 0.4); }
          50% { box-shadow: 0 0 20px rgba(255, 23, 68, 0.8); }
        }

        .terrain-icon {
          position: absolute;
          font-size: 28px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.6;
          pointer-events: none;
          z-index: 1;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .fighter-icon {
          font-size: 38px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
          animation: bounce 2s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }

        .fighter-icon.player {
          color: #00e676;
        }

        .fighter-icon.enemy {
          color: #ff1744;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes water-shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        @keyframes fire-pulse {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.3) saturate(1.2); }
        }

        @keyframes ice-sparkle {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.25); }
        }

        .cell-info {
          position: absolute;
          bottom: 2px;
          right: 4px;
          font-size: 10px;
          color: white;
          background: rgba(0, 0, 0, 0.6);
          padding: 2px 4px;
          border-radius: 3px;
          pointer-events: none;
        }

        .grid-legend {
          margin-top: 15px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border-left: 4px solid #6a42c2;
        }

        .legend-title {
          font-size: 14px;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 10px;
        }

        .legend-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 8px;
          font-size: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.9);
        }

        .legend-icon {
          font-size: 16px;
        }

        .grid-stats {
          margin-top: 10px;
          padding: 10px;
          background: rgba(106, 66, 194, 0.2);
          border-radius: 8px;
          display: flex;
          justify-content: space-around;
          font-size: 13px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
        }

        .stat-value {
          color: #FFD700;
          font-weight: 700;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .grid-container {
            padding: 12px;
          }

          .grid {
            gap: 2px;
            padding: 4px;
          }

          .grid-cell {
            font-size: 24px;
          }

          .fighter-icon {
            font-size: 28px;
          }

          .terrain-icon {
            font-size: 14px;
          }

          .grid-title {
            font-size: 18px;
          }

          .grid-mode {
            font-size: 12px;
          }
        }
      </style>

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

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
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
    const icon = fighter.isPlayer ? '🦸' : '👹';
    const className = fighter.isPlayer ? 'player' : 'enemy';

    return `<div class="fighter-icon ${className}">${icon}</div>`;
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
