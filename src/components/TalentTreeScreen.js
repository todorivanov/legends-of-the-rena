/**
 * TalentTreeScreen Web Component
 * Displays talent trees with nodes, dependencies, and point allocation
 */

import { BaseComponent } from './BaseComponent.js';
import { TalentManager } from '../game/TalentManager.js';
import { gameStore } from '../store/gameStore.js';
import talentTreeStyles from '../styles/components/TalentTreeScreen.scss?inline';

export class TalentTreeScreen extends BaseComponent {
  constructor() {
    super();
    this.selectedTree = 'tree1';
    this.hoveredTalent = null;
  }

  styles() {
    return talentTreeStyles;
  }

  template() {
    const state = gameStore.getState();
    const characterClass = state.player?.character?.class || 'WARRIOR';
    const trees = TalentManager.getTalentTrees(characterClass);

    if (!trees) {
      return '<div class="error">No talent trees available for your class</div>';
    }

    const totalPoints = TalentManager.getTotalTalentPoints();
    const spentPoints = TalentManager.getSpentTalentPoints();
    const availablePoints = TalentManager.getAvailableTalentPoints();

    return `
      <div class="talent-screen">
        <button class="back-btn" id="back-btn">← Back</button>

        <div class="talent-header">
          <h1 class="talent-title">⭐ Talent Trees ⭐</h1>
          <div class="points-display">
            <div class="points-available">
              <span class="points-number">${availablePoints}</span>
              <span class="points-label">Available</span>
            </div>
            <div class="points-spent">
              <span class="points-number">${spentPoints}/${totalPoints}</span>
              <span class="points-label">Spent</span>
            </div>
          </div>
        </div>

        ${this.renderTreeTabs(trees, characterClass)}
        ${this.renderTalentTree(trees[this.selectedTree], characterClass)}
        ${this.renderRespecButton()}
      </div>
    `;
  }

  renderTreeTabs(trees, characterClass) {
    return `
      <div class="tree-tabs">
        ${Object.keys(trees)
          .map((treeId) => {
            const tree = trees[treeId];
            const summary = TalentManager.getTreeSummary(characterClass, treeId);
            const isActive = treeId === this.selectedTree;

            return `
            <button 
              class="tree-tab ${isActive ? 'active' : ''}"
              data-tree="${treeId}"
            >
              <div class="tree-tab-icon">${tree.icon}</div>
              <div class="tree-tab-name">${tree.name}</div>
              <div class="tree-tab-points">${summary.pointsSpent} points</div>
              <div class="tree-tab-description">${tree.description}</div>
            </button>
          `;
          })
          .join('')}
      </div>
    `;
  }

  renderTalentTree(tree, characterClass) {
    if (!tree) return '';

    // Group talents by row
    const talentsByRow = {};
    tree.talents.forEach((talent) => {
      if (!talentsByRow[talent.row]) {
        talentsByRow[talent.row] = [];
      }
      talentsByRow[talent.row].push(talent);
    });

    const maxRow = Math.max(...tree.talents.map((t) => t.row));

    return `
      <div class="talent-tree-container">
        <div class="talent-tree">
          ${Array.from({ length: maxRow + 1 }, (_, row) =>
            this.renderTalentRow(talentsByRow[row] || [], row, characterClass)
          ).join('')}
        </div>
      </div>
    `;
  }

  renderTalentRow(talents, row, characterClass) {
    // Sort by column
    talents.sort((a, b) => a.column - b.column);

    const maxCol = Math.max(...talents.map((t) => t.column), 2);
    const gridTemplate = Array(maxCol + 1)
      .fill('1fr')
      .join(' ');

    return `
      <div class="talent-row" style="grid-template-columns: ${gridTemplate}">
        ${talents.map((talent) => this.renderTalentNode(talent, characterClass)).join('')}
      </div>
    `;
  }

  renderTalentNode(talent, characterClass) {
    const state = gameStore.getState();
    const playerTalents = state.player?.talents || {};
    const currentRank = playerTalents[this.selectedTree]?.[talent.id] || 0;

    const canLearn = TalentManager.canLearnTalent(characterClass, this.selectedTree, talent.id);
    const isMaxed = currentRank >= talent.maxRank;
    const isLearned = currentRank > 0;
    const isAvailable = canLearn.canLearn && !isMaxed;

    let statusClass = '';
    if (isMaxed) statusClass = 'maxed';
    else if (isLearned) statusClass = 'learned';
    else if (isAvailable) statusClass = 'available';
    else statusClass = 'locked';

    return `
      <div class="talent-node-wrapper" style="grid-column: ${talent.column + 1}">
        <div 
          class="talent-node ${statusClass}"
          data-talent-id="${talent.id}"
          data-tree-id="${this.selectedTree}"
          title="${talent.description}"
        >
          <div class="talent-icon">${talent.icon}</div>
          <div class="talent-name">${talent.name}</div>
          <div class="talent-rank">${currentRank}/${talent.maxRank}</div>
          ${
            !canLearn.canLearn && !isLearned
              ? `
            <div class="talent-requirement">${canLearn.reason}</div>
          `
              : ''
          }
        </div>
        ${this.renderTalentConnections(talent, playerTalents)}
      </div>
    `;
  }

  renderTalentConnections(talent, playerTalents) {
    if (!talent.requires || talent.requires.length === 0) return '';

    // Render connection line from this talent upward to prerequisites
    const isUnlocked = playerTalents[this.selectedTree]?.[talent.id] > 0;
    const hasPrereqMet = talent.requires.some(
      (reqId) => playerTalents[this.selectedTree]?.[reqId] > 0
    );

    return `
      <div class="talent-connection-line ${isUnlocked || hasPrereqMet ? 'active' : 'inactive'}"></div>
    `;
  }

  renderRespecButton() {
    const spentPoints = TalentManager.getSpentTalentPoints();
    const respecCost = this.calculateRespecCost();
    const state = gameStore.getState();
    const canAfford = state.player?.gold >= respecCost;

    if (spentPoints === 0) return '';

    return `
      <div class="respec-container">
        <button 
          class="respec-btn" 
          id="respec-btn"
          ${!canAfford ? 'disabled' : ''}
        >
          🔄 Reset Talents (${respecCost} 💰)
        </button>
      </div>
    `;
  }

  calculateRespecCost() {
    const spentPoints = TalentManager.getSpentTalentPoints();
    // Cost increases with more points spent
    return Math.floor(spentPoints * 50);
  }

  attachEventListeners() {
    // Back button
    const backBtn = this.shadowRoot.querySelector('#back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('navigate', { screen: 'profile' });
      });
    }

    // Tree tabs
    this.shadowRoot.querySelectorAll('.tree-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        this.selectedTree = tab.dataset.tree;
        this.render();
      });
    });

    // Talent nodes - left click to learn
    this.shadowRoot.querySelectorAll('.talent-node').forEach((node) => {
      node.addEventListener('click', (e) => {
        const talentId = node.dataset.talentId;
        const treeId = node.dataset.treeId;

        const success = TalentManager.learnTalent(treeId, talentId);
        if (success) {
          this.render();
          this.emit('talent-learned', { treeId, talentId });
        }
      });

      // Right click to unlearn
      node.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const talentId = node.dataset.talentId;
        const treeId = node.dataset.treeId;

        const success = TalentManager.unlearnTalent(treeId, talentId);
        if (success) {
          this.render();
          this.emit('talent-unlearned', { treeId, talentId });
        }
      });

      // Hover for tooltip
      node.addEventListener('mouseenter', (e) => {
        this.showTalentTooltip(node);
      });

      node.addEventListener('mouseleave', (e) => {
        this.hideTalentTooltip();
      });
    });

    // Respec button
    const respecBtn = this.shadowRoot.querySelector('#respec-btn');
    if (respecBtn) {
      respecBtn.addEventListener('click', () => {
        const cost = this.calculateRespecCost();
        const confirmed = confirm(
          `Reset all talents for ${cost} gold?\n\nThis will refund all talent points.`
        );

        if (confirmed) {
          const success = TalentManager.resetAllTalents(cost);
          if (success) {
            this.render();
            this.emit('talents-reset');
          }
        }
      });
    }
  }

  showTalentTooltip(node) {
    const state = gameStore.getState();
    const characterClass = state.player?.character?.class;
    const talentId = node.dataset.talentId;
    const treeId = node.dataset.treeId;

    const talent = TalentManager.getTalentNode(characterClass, treeId, talentId);
    if (!talent) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'talent-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-icon">${talent.icon}</span>
        <span class="tooltip-name">${talent.name}</span>
      </div>
      <div class="tooltip-description">${talent.description}</div>
      ${this.renderTalentEffects(talent)}
      ${
        talent.requires && talent.requires.length > 0
          ? `
        <div class="tooltip-requires">
          Requires: ${talent.requires
            .map((id) => {
              const req = TalentManager.getTalentNode(characterClass, treeId, id);
              return req?.name || id;
            })
            .join(', ')}
        </div>
      `
          : ''
      }
      ${
        talent.requiresPoints > 0
          ? `
        <div class="tooltip-points-required">
          Requires ${talent.requiresPoints} points in ${TalentManager.getTalentTrees(characterClass)[treeId].name}
        </div>
      `
          : ''
      }
    `;

    this.shadowRoot.appendChild(tooltip);

    // Position tooltip near cursor
    const rect = node.getBoundingClientRect();
    tooltip.style.left = `${rect.right + 10}px`;
    tooltip.style.top = `${rect.top}px`;
  }

  hideTalentTooltip() {
    const tooltip = this.shadowRoot.querySelector('.talent-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  renderTalentEffects(talent) {
    if (!talent.effects) return '';

    let html = '<div class="tooltip-effects">';

    // Stat modifiers
    if (talent.effects.stats) {
      html += '<div class="tooltip-stats">';
      Object.entries(talent.effects.stats).forEach(([stat, value]) => {
        const statNames = {
          strength: 'Strength',
          health: 'Health',
          defense: 'Defense',
          critChance: 'Crit Chance',
          critDamage: 'Crit Damage',
          manaRegen: 'Mana Regen',
          movementBonus: 'Movement',
        };
        html += `<div>+${value} ${statNames[stat] || stat} per rank</div>`;
      });
      html += '</div>';
    }

    // Passive effects
    if (talent.effects.passive) {
      html += '<div class="tooltip-passive">Passive Effect: Active</div>';
    }

    html += '</div>';
    return html;
  }
}

customElements.define('talent-tree-screen', TalentTreeScreen);
