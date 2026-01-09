/**
 * SaveManagementScreen - UI for managing save slots, backups, import/export
 */

import { BaseComponent } from './BaseComponent.js';
import SaveManagerV2 from '../utils/SaveManagerV2.js';

export class SaveManagementScreen extends BaseComponent {
  constructor() {
    super();
    this.currentSlot = 1;
    this.saveSlots = [];
    this.backups = [];
  }

  connectedCallback() {
    this.refresh();
    this.render();
    this.attachEventListeners();
  }

  refresh() {
    this.saveSlots = SaveManagerV2.listSaveSlots();
    this.backups = SaveManagerV2.listBackups(this.currentSlot);
  }

  attachEventListeners() {
    // Slot selection
    this.shadowRoot.querySelectorAll('.slot-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const slot = parseInt(card.dataset.slot);
          this.selectSlot(slot);
        }
      });
    });

    // Export button
    const exportBtn = this.shadowRoot.querySelector('#export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportSave());
    }

    // Import button
    const importBtn = this.shadowRoot.querySelector('#import-btn');
    const importFile = this.shadowRoot.querySelector('#import-file');
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', (e) => this.importSave(e.target.files[0]));
    }

    // Delete button
    const deleteBtn = this.shadowRoot.querySelector('#delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.deleteSave());
    }

    // Copy button
    const copyBtn = this.shadowRoot.querySelector('#copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copySave());
    }

    // Backup buttons
    this.shadowRoot.querySelectorAll('.restore-backup-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const timestamp = parseInt(e.target.dataset.timestamp);
        this.restoreBackup(timestamp);
      });
    });

    // Back button
    const backBtn = this.shadowRoot.querySelector('#back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.dispatchEvent(new Event('back'));
      });
    }
  }

  selectSlot(slot) {
    this.currentSlot = slot;
    this.refresh();
    this.render();
    this.attachEventListeners();
  }

  exportSave() {
    const success = SaveManagerV2.exportSave(this.currentSlot);
    if (success) {
      this.showNotification('Save exported successfully!', 'success');
    } else {
      this.showNotification('Export failed!', 'error');
    }
  }

  async importSave(file) {
    if (!file) return;

    const success = await SaveManagerV2.importSave(file, this.currentSlot);
    if (success) {
      this.showNotification('Save imported successfully!', 'success');
      this.refresh();
      this.render();
      this.attachEventListeners();
    } else {
      this.showNotification('Import failed! Invalid save file.', 'error');
    }
  }

  deleteSave() {
    if (confirm(`Delete save slot ${this.currentSlot}? This cannot be undone!`)) {
      const success = SaveManagerV2.deleteSave(this.currentSlot);
      if (success) {
        this.showNotification('Save deleted!', 'success');
        this.refresh();
        this.render();
        this.attachEventListeners();
      }
    }
  }

  copySave() {
    const targetSlot = prompt(`Copy to which slot? (1-3, not ${this.currentSlot})`);
    const slot = parseInt(targetSlot);

    if (slot && slot >= 1 && slot <= 3 && slot !== this.currentSlot) {
      const success = SaveManagerV2.copySave(this.currentSlot, slot);
      if (success) {
        this.showNotification(`Copied to slot ${slot}!`, 'success');
        this.refresh();
        this.render();
        this.attachEventListeners();
      }
    }
  }

  restoreBackup(timestamp) {
    if (confirm('Restore this backup? Current save will be replaced.')) {
      const success = SaveManagerV2.restoreBackup(this.currentSlot, timestamp);
      if (success) {
        this.showNotification('Backup restored!', 'success');
        window.location.reload(); // Reload to apply restored save
      }
    }
  }

  showNotification(message, type) {
    // Simple notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      border-radius: 8px;
      z-index: 99999;
      font-weight: bold;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  render() {
    const currentSave = this.saveSlots.find((s) => s.slot === this.currentSlot);
    const storageInfo = SaveManagerV2.getStorageInfo();

    const styles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        :host {
          display: block;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #1a0d2e 0%, #2d1b69 100%);
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px 20px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        h1 {
          font-size: 48px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 18px;
          opacity: 0.8;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .slot-card {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid ${currentSave?.slot === this.currentSlot ? '#667eea' : 'rgba(255, 255, 255, 0.2)'};
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slot-card:hover {
          transform: translateY(-4px);
          border-color: #667eea;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .slot-card.active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.2);
        }

        .slot-card.empty {
          opacity: 0.5;
        }

        .slot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .slot-number {
          font-size: 24px;
          font-weight: bold;
        }

        .slot-info p {
          margin: 8px 0;
          font-size: 14px;
        }

        .actions-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 40px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        button.danger {
          background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
        }

        button.secondary {
          background: rgba(255, 255, 255, 0.1);
        }

        .backups-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 40px;
        }

        .backup-list {
          margin-top: 20px;
        }

        .backup-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .storage-info {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }

        .storage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .storage-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: 8px;
        }

        .storage-value {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }

        input[type="file"] {
          display: none;
        }

        #back-btn {
          margin-top: 20px;
        }
      </style>
    `;

    const slotsHTML = this.saveSlots
      .map(
        (slot) => `
      <div class="slot-card ${slot.slot === this.currentSlot ? 'active' : ''} ${!slot.exists ? 'empty' : ''}" 
           data-slot="${slot.slot}">
        <div class="slot-header">
          <div class="slot-number">Slot ${slot.slot}</div>
          <div>${slot.exists ? '💾' : '📭'}</div>
        </div>
        <div class="slot-info">
          ${
            slot.exists && !slot.corrupted
              ? `
            <p><strong>${slot.playerName}</strong></p>
            <p>Level ${slot.level} • ${slot.gold} Gold</p>
            <p>Last played: ${slot.lastPlayed.toLocaleString()}</p>
            <p>Size: ${slot.size}KB • Backups: ${slot.backupCount}</p>
          `
              : slot.corrupted
                ? `<p style="color: #f44336;">⚠️ Corrupted save</p>`
                : `<p>Empty slot</p>`
          }
        </div>
      </div>
    `
      )
      .join('');

    const backupsHTML =
      this.backups.length > 0
        ? this.backups
            .map(
              (backup) => `
        <div class="backup-item">
          <div>
            <div><strong>${backup.date.toLocaleString()}</strong></div>
            <div style="font-size: 14px; opacity: 0.8;">
              ${backup.playerName || 'Unknown'} • Level ${backup.level || '?'} • ${backup.size}KB
            </div>
          </div>
          <button class="restore-backup-btn secondary" data-timestamp="${backup.timestamp}">
            Restore
          </button>
        </div>
      `
            )
            .join('')
        : '<p style="opacity: 0.6;">No backups available</p>';

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="container">
        <div class="header">
          <h1>💾 Save Management</h1>
          <p class="subtitle">Manage your save files, backups, and exports</p>
        </div>

        <div class="slots-grid">
          ${slotsHTML}
        </div>

        ${
          currentSave && currentSave.exists
            ? `
          <div class="actions-section">
            <h2>Actions for Slot ${this.currentSlot}</h2>
            <div class="actions-grid">
              <button id="export-btn">📤 Export Save</button>
              <button id="import-btn">📥 Import Save</button>
              <button id="copy-btn" class="secondary">📋 Copy to Another Slot</button>
              <button id="delete-btn" class="danger">🗑️ Delete Save</button>
            </div>
            <input type="file" id="import-file" accept=".json" />
          </div>

          <div class="backups-section">
            <h2>Backups (Last ${this.backups.length})</h2>
            <div class="backup-list">
              ${backupsHTML}
            </div>
          </div>
        `
            : `
          <div class="actions-section">
            <h2>Import Save</h2>
            <p style="margin-bottom: 16px; opacity: 0.8;">This slot is empty. You can import a save file.</p>
            <button id="import-btn">📥 Import Save</button>
            <input type="file" id="import-file" accept=".json" />
          </div>
        `
        }

        <div class="storage-info">
          <h2>Storage Information</h2>
          <div class="storage-grid">
            <div class="storage-item">
              <div class="storage-value">${storageInfo.saves}</div>
              <div>Saves</div>
            </div>
            <div class="storage-item">
              <div class="storage-value">${storageInfo.backups}</div>
              <div>Backups</div>
            </div>
            <div class="storage-item">
              <div class="storage-value">${storageInfo.total}</div>
              <div>Total Used</div>
            </div>
            <div class="storage-item">
              <div class="storage-value">${storageInfo.available}</div>
              <div>Available</div>
            </div>
          </div>
        </div>

        <button id="back-btn" class="secondary">← Back to Settings</button>
      </div>
    `;
  }
}

customElements.define('save-management-screen', SaveManagementScreen);
