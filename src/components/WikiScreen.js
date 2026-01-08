import { BaseComponent } from './BaseComponent.js';

export class WikiScreen extends BaseComponent {
  constructor() {
    super();
    this._activeTab = 'achievements';
  }

  template() {
    return `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .wiki-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #1a0d2e 0%, #0f051d 100%);
          padding: 40px;
          padding-top: 80px;
          overflow-y: auto;
          overflow-x: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #ffffff;
          box-sizing: border-box;
        }
        
        .wiki-container::-webkit-scrollbar {
          width: 12px;
        }
        
        .wiki-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        .wiki-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border-radius: 10px;
        }
        
        .wiki-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #FFA500, #FFD700);
        }

        .wiki-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .wiki-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 48px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        }

        .wiki-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Segoe UI', sans-serif;
        }

        .tab-navigation {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .tab-button {
          padding: 15px 30px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Segoe UI', sans-serif;
        }

        .tab-button:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.3));
          border-color: #FFD700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        .wiki-content {
          background: rgba(26, 13, 46, 0.6);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto 40px auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .content-section {
          display: none;
          animation: fadeIn 0.3s ease;
        }

        .content-section.active {
          display: block;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h1 {
          font-size: 36px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Press Start 2P', cursive;
        }

        h2 {
          font-size: 28px;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #FFD700;
          border-bottom: 2px solid rgba(255, 215, 0, 0.3);
          padding-bottom: 10px;
          font-family: 'Segoe UI', sans-serif;
          font-weight: 700;
        }

        h3 {
          font-size: 22px;
          margin-top: 25px;
          margin-bottom: 12px;
          color: #FFA500;
          font-family: 'Segoe UI', sans-serif;
          font-weight: 600;
        }

        p {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 15px;
          color: rgba(255, 255, 255, 0.9);
        }

        ul, ol {
          margin-left: 25px;
          margin-bottom: 15px;
        }

        li {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.9);
        }

        .info-box {
          background: rgba(255, 215, 0, 0.1);
          border-left: 4px solid #FFD700;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }

        .warning-box {
          background: rgba(255, 69, 0, 0.1);
          border-left: 4px solid #FF4500;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }

        .success-box {
          background: rgba(34, 197, 94, 0.1);
          border-left: 4px solid #22c55e;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          overflow: hidden;
        }

        th {
          background: rgba(255, 215, 0, 0.2);
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #FFD700;
          border-bottom: 2px solid rgba(255, 215, 0, 0.3);
        }

        td {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .icon {
          font-size: 24px;
          margin-right: 8px;
        }

        .back-button {
          position: fixed;
          top: 20px;
          left: 20px;
          padding: 12px 24px;
          background: rgba(26, 13, 46, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          z-index: 1000;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          font-family: 'Press Start 2P', cursive;
        }

        .back-button:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: #FFD700;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }

        code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          color: #FFD700;
        }

        pre {
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 15px 0;
        }

        pre code {
          background: none;
          padding: 0;
        }

        .stat-badge {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.5);
          border-radius: 4px;
          color: #FFD700;
          font-weight: 600;
          margin: 2px;
        }

        .rarity-common { color: #9ca3af; }
        .rarity-rare { color: #3b82f6; }
        .rarity-epic { color: #a855f7; }
        .rarity-legendary { color: #f97316; }

        @media (max-width: 768px) {
          .wiki-container {
            padding: 20px;
          }

          .wiki-title {
            font-size: 32px;
          }

          .wiki-content {
            padding: 20px;
          }

          h1 { font-size: 28px; }
          h2 { font-size: 22px; }
          h3 { font-size: 18px; }
        }
      </style>

      <button class="back-button" id="backBtn">← Back</button>

      <div class="wiki-container">
        <div class="wiki-header">
          <div class="wiki-title">📚 Game Wiki</div>
          <div class="wiki-subtitle">Everything you need to know about Object Fighter</div>
        </div>

        <div class="tab-navigation">
          <button class="tab-button ${this._activeTab === 'achievements' ? 'active' : ''}" data-tab="achievements">
            🏅 Achievements
          </button>
          <button class="tab-button ${this._activeTab === 'equipment' ? 'active' : ''}" data-tab="equipment">
            ⚔️ Equipment
          </button>
          <button class="tab-button ${this._activeTab === 'tournament' ? 'active' : ''}" data-tab="tournament">
            🏆 Tournament
          </button>
          <button class="tab-button ${this._activeTab === 'difficulty' ? 'active' : ''}" data-tab="difficulty">
            ⚙️ Difficulty
          </button>
        </div>

        <div class="wiki-content">
          ${this.renderAchievementsContent()}
          ${this.renderEquipmentContent()}
          ${this.renderTournamentContent()}
          ${this.renderDifficultyContent()}
        </div>
      </div>
    `;
  }

  renderAchievementsContent() {
    return `
      <div class="content-section ${this._activeTab === 'achievements' ? 'active' : ''}" id="achievements-content">
        <h1>🏅 Achievements System</h1>
        
        <div class="info-box">
          <strong>Total: 25 Achievements | 6,000+ XP Available</strong><br>
          Unlock achievements by completing challenges and earn massive XP rewards!
        </div>

        <h2>⚔️ Combat Achievements (10)</h2>
        <p>Prove your fighting prowess and dominate the arena!</p>
        <table>
          <tr>
            <th>Achievement</th>
            <th>Description</th>
            <th>Reward</th>
          </tr>
          <tr>
            <td>⚔️ First Blood</td>
            <td>Win your first battle</td>
            <td><span class="stat-badge">50 XP</span></td>
          </tr>
          <tr>
            <td>🗡️ Warrior</td>
            <td>Win 10 battles</td>
            <td><span class="stat-badge">100 XP</span></td>
          </tr>
          <tr>
            <td>⚔️ Veteran</td>
            <td>Win 50 battles</td>
            <td><span class="stat-badge">250 XP</span></td>
          </tr>
          <tr>
            <td>🏅 Legend</td>
            <td>Win 100 battles</td>
            <td><span class="stat-badge">500 XP</span></td>
          </tr>
          <tr>
            <td>💎 Flawless Victory</td>
            <td>Win without taking damage</td>
            <td><span class="stat-badge">200 XP</span></td>
          </tr>
          <tr>
            <td>💥 Critical Master</td>
            <td>Land 50 critical hits</td>
            <td><span class="stat-badge">150 XP</span></td>
          </tr>
          <tr>
            <td>⚡ Finishing Blow</td>
            <td>Win with a critical hit</td>
            <td><span class="stat-badge">100 XP</span></td>
          </tr>
          <tr>
            <td>🔥 Heavy Hitter</td>
            <td>Deal 500 damage in one hit</td>
            <td><span class="stat-badge">300 XP</span></td>
          </tr>
          <tr>
            <td>🔥 Winning Streak</td>
            <td>Win 5 battles in a row</td>
            <td><span class="stat-badge">200 XP</span></td>
          </tr>
          <tr>
            <td>⚡ Unstoppable</td>
            <td>Win 10 battles in a row</td>
            <td><span class="stat-badge">400 XP</span></td>
          </tr>
        </table>

        <h2>🎯 Strategic Achievements (4)</h2>
        <p>Master the art of tactical combat!</p>
        <table>
          <tr>
            <th>Achievement</th>
            <th>Description</th>
            <th>Reward</th>
          </tr>
          <tr>
            <td>🌟 Skill Master</td>
            <td>Use skills 50 times</td>
            <td><span class="stat-badge">150 XP</span></td>
          </tr>
          <tr>
            <td>💫 Combo King</td>
            <td>Build a 5-hit combo</td>
            <td><span class="stat-badge">150 XP</span></td>
          </tr>
          <tr>
            <td>✊ Basic Warrior</td>
            <td>Win using only basic attacks</td>
            <td><span class="stat-badge">200 XP</span></td>
          </tr>
          <tr>
            <td>🚫 Purist</td>
            <td>Win without using items</td>
            <td><span class="stat-badge">150 XP</span></td>
          </tr>
        </table>

        <h2>⭐ Special Achievements (7)</h2>
        <p>Complete unique challenges and earn legendary status!</p>
        <table>
          <tr>
            <th>Achievement</th>
            <th>Description</th>
            <th>Reward</th>
          </tr>
          <tr>
            <td>🏆 Tournament Champion</td>
            <td>Win your first tournament</td>
            <td><span class="stat-badge">300 XP</span></td>
          </tr>
          <tr>
            <td>💀 Hard Mode Champion</td>
            <td>Win tournament on Hard</td>
            <td><span class="stat-badge">500 XP</span></td>
          </tr>
          <tr>
            <td>👹 Nightmare Conqueror</td>
            <td>Win tournament on Nightmare</td>
            <td><span class="stat-badge">1,000 XP</span></td>
          </tr>
          <tr>
            <td>🏆 Serial Champion</td>
            <td>Win 10 tournaments</td>
            <td><span class="stat-badge">1,000 XP</span></td>
          </tr>
          <tr>
            <td>📦 Equipment Collector</td>
            <td>Collect 10 equipment pieces</td>
            <td><span class="stat-badge">200 XP</span></td>
          </tr>
          <tr>
            <td>🌟 Legendary Collector</td>
            <td>Collect a legendary item</td>
            <td><span class="stat-badge">500 XP</span></td>
          </tr>
        </table>

        <h2>📈 Progression Achievements (4)</h2>
        <p>Level up and become the ultimate fighter!</p>
        <table>
          <tr>
            <th>Achievement</th>
            <th>Description</th>
            <th>Reward</th>
          </tr>
          <tr>
            <td>⬆️ Rising Star</td>
            <td>Reach level 5</td>
            <td><span class="stat-badge">100 XP</span></td>
          </tr>
          <tr>
            <td>⬆️ Expert Fighter</td>
            <td>Reach level 10</td>
            <td><span class="stat-badge">250 XP</span></td>
          </tr>
          <tr>
            <td>👑 Master Fighter</td>
            <td>Reach level 20 (max)</td>
            <td><span class="stat-badge">500 XP</span></td>
          </tr>
          <tr>
            <td>💥 Damage Dealer</td>
            <td>Deal 10,000 total damage</td>
            <td><span class="stat-badge">300 XP</span></td>
          </tr>
        </table>

        <h2>💡 How to View Achievements</h2>
        <ol>
          <li>Click the <strong>🏅 Achievements</strong> button from the title screen</li>
          <li>View your overall progress percentage and unlocked count</li>
          <li>Filter by category: Combat, Strategic, Special, or Progression</li>
          <li>Track your progress with real-time updates</li>
        </ol>

        <div class="success-box">
          <h3>🎊 Unlock Notifications</h3>
          <p>When you unlock an achievement, you'll see an in-game notification in the battle log with the achievement icon, name, description, and XP reward. Your XP is awarded automatically!</p>
        </div>

        <h2>🏆 Achievement Strategies</h2>
        <h3>Easy to Unlock (Beginner):</h3>
        <ul>
          <li><strong>First Blood</strong> - Just win one battle</li>
          <li><strong>Rising Star</strong> - Reach level 5 through natural play</li>
          <li><strong>Skill Master</strong> - Use skills often in combat</li>
        </ul>

        <h3>Very Difficult:</h3>
        <ul>
          <li><strong>Legend</strong> - 100 wins requires dedication</li>
          <li><strong>Unstoppable</strong> - 10-win streak is tough</li>
          <li><strong>Nightmare Conqueror</strong> - Beat nightmare tournament</li>
          <li><strong>Serial Champion</strong> - Win 10 tournaments</li>
        </ul>

        <div class="info-box">
          <h3>🎁 100% Completion Rewards</h3>
          <p>Unlock all 25 achievements to earn 6,000+ total XP and achieve Master Status! 👑</p>
        </div>
      </div>
    `;
  }

  renderEquipmentContent() {
    return `
      <div class="content-section ${this._activeTab === 'equipment' ? 'active' : ''}" id="equipment-content">
        <h1>⚔️ Equipment System</h1>
        
        <div class="info-box">
          <strong>Collect powerful equipment to boost your stats!</strong><br>
          Win battles to earn random equipment drops (50% chance base rate)
        </div>

        <h2>📦 Equipment Types</h2>
        <table>
          <tr>
            <th>Type</th>
            <th>Icon</th>
            <th>Description</th>
          </tr>
          <tr>
            <td>Weapon</td>
            <td>⚔️</td>
            <td>Boosts attack and critical stats</td>
          </tr>
          <tr>
            <td>Armor</td>
            <td>🛡️</td>
            <td>Increases health and defense</td>
          </tr>
          <tr>
            <td>Accessory</td>
            <td>💍</td>
            <td>Provides special bonuses (crit, mana regen)</td>
          </tr>
        </table>

        <h2>🌟 Rarity System</h2>
        <table>
          <tr>
            <th>Rarity</th>
            <th>Color</th>
            <th>Drop Chance</th>
            <th>Power</th>
          </tr>
          <tr>
            <td><span class="rarity-common">Common</span></td>
            <td>Gray</td>
            <td>50%</td>
            <td>Basic stats</td>
          </tr>
          <tr>
            <td><span class="rarity-rare">Rare</span></td>
            <td>Blue</td>
            <td>30%</td>
            <td>Good stats</td>
          </tr>
          <tr>
            <td><span class="rarity-epic">Epic</span></td>
            <td>Purple</td>
            <td>15%</td>
            <td>Great stats</td>
          </tr>
          <tr>
            <td><span class="rarity-legendary">Legendary</span></td>
            <td>Orange</td>
            <td>5%</td>
            <td>Amazing stats</td>
          </tr>
        </table>

        <h2>⚔️ Weapons (10 items)</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Rarity</th>
            <th>Level</th>
            <th>Stats</th>
          </tr>
          <tr>
            <td>Wooden Sword</td>
            <td><span class="rarity-common">Common</span></td>
            <td>1</td>
            <td>+5 STR</td>
          </tr>
          <tr>
            <td>Iron Blade</td>
            <td><span class="rarity-common">Common</span></td>
            <td>3</td>
            <td>+10 STR, +3% Crit</td>
          </tr>
          <tr>
            <td>Steel Longsword</td>
            <td><span class="rarity-rare">Rare</span></td>
            <td>5</td>
            <td>+15 STR, +5% Crit</td>
          </tr>
          <tr>
            <td>Enchanted Staff</td>
            <td><span class="rarity-rare">Rare</span></td>
            <td>5</td>
            <td>+12 STR, +5 Mana Regen (Mage Only)</td>
          </tr>
          <tr>
            <td>Hunter's Bow</td>
            <td><span class="rarity-rare">Rare</span></td>
            <td>6</td>
            <td>+13 STR, +8% Crit (Ranger Only)</td>
          </tr>
          <tr>
            <td>Warhammer</td>
            <td><span class="rarity-epic">Epic</span></td>
            <td>8</td>
            <td>+22 STR, +8% Crit (Warrior Only)</td>
          </tr>
          <tr>
            <td>Arcane Scepter</td>
            <td><span class="rarity-epic">Epic</span></td>
            <td>10</td>
            <td>+18 STR, +10 Mana Regen (Mage Only)</td>
          </tr>
          <tr>
            <td>Shadow Daggers</td>
            <td><span class="rarity-epic">Epic</span></td>
            <td>10</td>
            <td>+16 STR, +15% Crit, +10% Crit Dmg (Ranger Only)</td>
          </tr>
          <tr>
            <td>Excalibur</td>
            <td><span class="rarity-legendary">Legendary</span></td>
            <td>15</td>
            <td>+35 STR, +15% Crit, +20% Crit Dmg</td>
          </tr>
          <tr>
            <td>Dragon Slayer</td>
            <td><span class="rarity-legendary">Legendary</span></td>
            <td>15</td>
            <td>+40 STR, +10% Crit, +15% Crit Dmg (Warrior Only)</td>
          </tr>
        </table>

        <h2>🛡️ Armor (8 items)</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Rarity</th>
            <th>Level</th>
            <th>Stats</th>
          </tr>
          <tr>
            <td>Leather Vest</td>
            <td><span class="rarity-common">Common</span></td>
            <td>1</td>
            <td>+20 HP</td>
          </tr>
          <tr>
            <td>Chainmail</td>
            <td><span class="rarity-common">Common</span></td>
            <td>3</td>
            <td>+30 HP, +5 DEF</td>
          </tr>
          <tr>
            <td>Knight's Plate</td>
            <td><span class="rarity-rare">Rare</span></td>
            <td>5</td>
            <td>+50 HP, +10 DEF (Warrior Only)</td>
          </tr>
          <tr>
            <td>Mage Robes</td>
            <td><span class="rarity-rare">Rare</span></td>
            <td>5</td>
            <td>+35 HP, +8 Mana Regen (Mage Only)</td>
          </tr>
          <tr>
            <td>Ranger's Leather</td>
            <td><span class="rarity-rare">Rare</span></td>
            <td>5</td>
            <td>+40 HP, +5 DEF, +3% Crit (Ranger Only)</td>
          </tr>
          <tr>
            <td>Dragon Scale Armor</td>
            <td><span class="rarity-epic">Epic</span></td>
            <td>10</td>
            <td>+80 HP, +15 DEF</td>
          </tr>
          <tr>
            <td>Titan's Fortress</td>
            <td><span class="rarity-legendary">Legendary</span></td>
            <td>15</td>
            <td>+120 HP, +25 DEF (Warrior Only)</td>
          </tr>
          <tr>
            <td>Aegis of Legends</td>
            <td><span class="rarity-legendary">Legendary</span></td>
            <td>15</td>
            <td>+100 HP, +20 DEF, +10% Crit</td>
          </tr>
        </table>

        <h2>💍 Accessories (6 items)</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Rarity</th>
            <th>Level</th>
            <th>Stats</th>
          </tr>
          <tr>
            <td>Bronze Ring</td>
            <td><span class="rarity-common">Common</span></td>
            <td>1</td>
            <td>+5 STR</td>
          </tr>
          <tr>
            <td>Silver Amulet</td>
            <td><span class="rarity-rare">Rare</span></td>
            <td>5</td>
            <td>+10 HP, +5% Crit</td>
          </tr>
          <tr>
            <td>Ruby Pendant</td>
            <td><span class="rarity-rare">Rare</span></td>
            <td>7</td>
            <td>+15 STR, +5% Crit</td>
          </tr>
          <tr>
            <td>Emerald Bracelet</td>
            <td><span class="rarity-epic">Epic</span></td>
            <td>10</td>
            <td>+20 HP, +10 STR, +5 Mana Regen</td>
          </tr>
          <tr>
            <td>Diamond Ring</td>
            <td><span class="rarity-epic">Epic</span></td>
            <td>12</td>
            <td>+15% Crit, +15% Crit Dmg</td>
          </tr>
          <tr>
            <td>Crown of Champions</td>
            <td><span class="rarity-legendary">Legendary</span></td>
            <td>15</td>
            <td>+30 HP, +20 STR, +10 DEF, +10% Crit</td>
          </tr>
        </table>

        <h2>📊 Equipment Stats</h2>
        <p>Available stat bonuses from equipment:</p>
        <ul>
          <li><strong>Strength (STR)</strong> - Increases damage dealt</li>
          <li><strong>Health (HP)</strong> - Increases maximum health</li>
          <li><strong>Defense (DEF)</strong> - Reduces damage taken</li>
          <li><strong>Crit Chance (%)</strong> - Increases critical hit chance</li>
          <li><strong>Crit Damage (%)</strong> - Increases critical hit damage multiplier</li>
          <li><strong>Mana Regen</strong> - Increases mana regeneration per turn</li>
        </ul>

        <h2>🎮 How to Use Equipment</h2>
        <div class="success-box">
          <h3>Access Equipment</h3>
          <ol>
            <li>From your <strong>Profile</strong>, click the <strong>"Equipment"</strong> tab</li>
            <li>View your currently equipped items and inventory</li>
            <li>See your total stat bonuses at the top</li>
          </ol>
        </div>

        <h3>Equip Items</h3>
        <ol>
          <li>Scroll to the <strong>Inventory</strong> section</li>
          <li>Filter by type: All, Weapons, Armor, or Accessories</li>
          <li>Click <strong>"EQUIP"</strong> on items that meet level/class requirements</li>
          <li>Items automatically replace existing items in that slot</li>
        </ol>

        <h3>Unequip Items</h3>
        <ol>
          <li>Find the equipped item in <strong>"Currently Equipped"</strong> section</li>
          <li>Click <strong>"Unequip"</strong></li>
          <li>Item returns to your inventory</li>
        </ol>

        <h2>💡 Pro Tips</h2>
        <div class="info-box">
          <ul>
            <li><strong>Level Up First</strong> - Higher levels unlock better equipment</li>
            <li><strong>Check Requirements</strong> - Red text = can't equip, Green = ready</li>
            <li><strong>Stack Bonuses</strong> - Equipment stacks with level bonuses</li>
            <li><strong>Class Synergy</strong> - Use class-specific items for best results</li>
            <li><strong>Legendary Hunt</strong> - Keep fighting for those orange drops!</li>
          </ul>
        </div>
      </div>
    `;
  }

  renderTournamentContent() {
    return `
      <div class="content-section ${this._activeTab === 'tournament' ? 'active' : ''}" id="tournament-content">
        <h1>🏆 Tournament Mode</h1>
        
        <div class="info-box">
          <strong>Bracket-style championship with massive rewards!</strong><br>
          Face 4 opponents in 3 successive rounds to become the ultimate champion!
        </div>

        <h2>🎯 Tournament Structure</h2>
        <pre>
You vs Opponent 1  →  Quarter Final (Round 1/3)
        ↓
Winner vs Opponent 2  →  Semi Final (Round 2/3)
        ↓
Winner vs Opponent 3  →  Grand Final (Round 3/3)
        ↓
   🏆 CHAMPION! 🏆
        </pre>

        <h2>💪 Difficulty Levels</h2>
        <table>
          <tr>
            <th>Difficulty</th>
            <th>Opponent Stats</th>
            <th>Recommended For</th>
            <th>Rewards</th>
          </tr>
          <tr>
            <td>⚔️ Normal</td>
            <td>Standard</td>
            <td>Everyone</td>
            <td><span class="stat-badge">300 XP</span> + Guaranteed <span class="rarity-rare">Rare</span> equipment</td>
          </tr>
          <tr>
            <td>💀 Hard</td>
            <td>+30% HP, +20% STR</td>
            <td>Experienced players</td>
            <td><span class="stat-badge">450 XP</span> + Guaranteed <span class="rarity-epic">Epic</span> equipment</td>
          </tr>
          <tr>
            <td>👹 Nightmare</td>
            <td>+50% HP, +50% STR</td>
            <td>Champions only!</td>
            <td><span class="stat-badge">600 XP</span> + Guaranteed <span class="rarity-legendary">Legendary</span> equipment</td>
          </tr>
        </table>

        <h2>🏅 Rewards Breakdown</h2>
        <h3>Normal Difficulty:</h3>
        <ul>
          <li>300 XP for winning the tournament</li>
          <li>Guaranteed Rare equipment piece</li>
          <li>"Champion" title and tournament win counter</li>
        </ul>

        <h3>Hard Difficulty:</h3>
        <ul>
          <li>450 XP for winning (+150 bonus)</li>
          <li>Guaranteed Epic equipment piece</li>
          <li>Higher chance for multiple drops</li>
        </ul>

        <h3>Nightmare Difficulty:</h3>
        <ul>
          <li>600 XP for winning (+300 bonus!)</li>
          <li>Guaranteed Legendary equipment piece</li>
          <li>Multiple equipment drops</li>
          <li>Ultimate bragging rights</li>
        </ul>

        <div class="warning-box">
          <h3>⚠️ Consolation Rewards (if defeated)</h3>
          <p>Lost but gave it a good try? Earn 50 XP per round won:</p>
          <ul>
            <li>Lost in Quarter Final: 0 XP</li>
            <li>Lost in Semi Final: 50 XP (1 win)</li>
            <li>Lost in Grand Final: 100 XP (2 wins)</li>
          </ul>
        </div>

        <h2>📋 How to Play</h2>
        <h3>Step 1: Access Tournament</h3>
        <p>From the title screen, click the <strong>"🏆 Tournament"</strong> button in the main menu</p>

        <h3>Step 2: Choose Difficulty</h3>
        <p>Select your challenge level:</p>
        <ul>
          <li><strong>⚔️ Normal</strong> - Standard challenge for learning</li>
          <li><strong>💀 Hard</strong> - Tough opponents, great rewards</li>
          <li><strong>👹 Nightmare</strong> - Extreme challenge, legendary rewards</li>
        </ul>

        <h3>Step 3: Select 4 Opponents</h3>
        <ol>
          <li>Browse the fighter gallery</li>
          <li>Click on fighters to select them</li>
          <li>Select exactly 4 opponents</li>
          <li>See the bracket preview at the bottom</li>
        </ol>

        <h3>Step 4: Start Tournament</h3>
        <ol>
          <li>Click <strong>"🏆 START TOURNAMENT 🏆"</strong></li>
          <li>See the epic tournament announcement</li>
          <li>Face your first opponent!</li>
        </ol>

        <h3>Step 5: Fight Through Rounds</h3>
        <ol>
          <li><strong>Quarter Final</strong> - Defeat Opponent 1</li>
          <li><strong>Semi Final</strong> - Defeat Opponent 2</li>
          <li><strong>Grand Final</strong> - Defeat Opponent 3</li>
          <li><strong>Victory!</strong> - Claim championship rewards!</li>
        </ol>

        <h2>💡 Pro Tips</h2>
        <div class="success-box">
          <h3>Preparation:</h3>
          <ul>
            <li><strong>Level Up First</strong> - Higher level = better stats</li>
            <li><strong>Equip Best Gear</strong> - Check Equipment before starting</li>
            <li><strong>Know Your Class</strong> - Use class-specific strategies</li>
            <li><strong>Full Health</strong> - Each round starts fresh</li>
          </ul>
        </div>

        <h3>Opponent Selection:</h3>
        <ul>
          <li>Check stats (HP and STR) before selecting</li>
          <li>Mix up opponent classes for variety</li>
          <li>Remember which opponent you'll face first</li>
          <li>Consider class matchups and strengths</li>
        </ul>

        <h3>During Tournament:</h3>
        <ul>
          <li><strong>Conserve Resources</strong> - Save strong skills for later rounds</li>
          <li><strong>Learn Patterns</strong> - Each opponent has unique strategies</li>
          <li><strong>Use Items Wisely</strong> - Don't waste healing potions early</li>
          <li><strong>Stay Calm</strong> - Tournament pressure is real!</li>
        </ul>

        <h2>🎯 Recommended Levels</h2>
        <table>
          <tr>
            <th>Difficulty</th>
            <th>Recommended Level</th>
            <th>Recommended Gear</th>
          </tr>
          <tr>
            <td>⚔️ Normal</td>
            <td>Level 3+</td>
            <td>Any equipment</td>
          </tr>
          <tr>
            <td>💀 Hard</td>
            <td>Level 7+</td>
            <td>Rare+ equipment</td>
          </tr>
          <tr>
            <td>👹 Nightmare</td>
            <td>Level 12+</td>
            <td>Epic/Legendary gear</td>
          </tr>
        </table>

        <h2>⚠️ Tournament Rules</h2>
        <div class="warning-box">
          <ul>
            <li>✅ Your created character always fights</li>
            <li>✅ Equipment persists throughout tournament</li>
            <li>✅ Level bonuses apply to all rounds</li>
            <li>✅ Each round is a new fight (health resets)</li>
            <li>❌ No changing equipment during tournament</li>
            <li>❌ No changing opponents after starting</li>
            <li>❌ Tournament ends if you lose any round</li>
          </ul>
        </div>

        <h2>🎊 Victory Celebrations</h2>
        <h3>Round Win:</h3>
        <pre>
🎯 Round 1 Complete!
Next: Semi Final
Opponent: [Next Fighter]
        </pre>

        <h3>Championship Win:</h3>
        <pre>
🏆 TOURNAMENT CHAMPION! 🏆
Flawless Victory: 3/3

🎁 +300-600 XP (based on difficulty)
⚔️ Guaranteed Epic/Legendary Equipment
🏆 Champion Title
        </pre>

        <div class="info-box">
          <h3>📊 Track Your Progress</h3>
          <p>View your tournament statistics in the <strong>Profile Screen</strong>:</p>
          <ul>
            <li>Tournaments Played</li>
            <li>Tournaments Won</li>
            <li>Win Rate</li>
          </ul>
        </div>

        <h2>🚀 Risk vs Reward</h2>
        <p><strong>Higher difficulty = Better rewards BUT Harder to win</strong></p>
        <ul>
          <li>Defeat = Only consolation XP (no equipment)</li>
          <li>Victory = Full rewards including guaranteed equipment</li>
          <li>Nightmare victory = Best rewards in the game!</li>
        </ul>
      </div>
    `;
  }

  renderDifficultyContent() {
    return `
      <div class="content-section ${this._activeTab === 'difficulty' ? 'active' : ''}" id="difficulty-content">
        <h1>⚙️ Difficulty System</h1>
        
        <div class="info-box">
          <strong>Customize your gameplay experience!</strong><br>
          Choose from 4 difficulty levels with unique modifiers, rewards, and challenges.
        </div>

        <h2>📊 Difficulty Levels Comparison</h2>
        <table>
          <tr>
            <th>Difficulty</th>
            <th>Player HP</th>
            <th>Player STR</th>
            <th>Enemy HP</th>
            <th>Enemy STR</th>
            <th>AI Mistakes</th>
            <th>XP</th>
            <th>Equipment Drop</th>
          </tr>
          <tr>
            <td>😊 Easy</td>
            <td>+30%</td>
            <td>+20%</td>
            <td>-20%</td>
            <td>-20%</td>
            <td>25%</td>
            <td>80%</td>
            <td>70%</td>
          </tr>
          <tr>
            <td>⚔️ Normal</td>
            <td>100%</td>
            <td>100%</td>
            <td>100%</td>
            <td>100%</td>
            <td>10%</td>
            <td>100%</td>
            <td>50%</td>
          </tr>
          <tr>
            <td>💀 Hard</td>
            <td>100%</td>
            <td>100%</td>
            <td>+30%</td>
            <td>+20%</td>
            <td>5%</td>
            <td>130%</td>
            <td>60%</td>
          </tr>
          <tr>
            <td>👹 Nightmare</td>
            <td>100%</td>
            <td>100%</td>
            <td>+60%</td>
            <td>+50%</td>
            <td>0%</td>
            <td>150%</td>
            <td>70%</td>
          </tr>
        </table>

        <h2>😊 Easy Mode</h2>
        <p><em>"Forgiving gameplay for newcomers"</em></p>
        
        <h3>Modifiers:</h3>
        <ul>
          <li>💚 <strong>+30% Health</strong> - You're tankier</li>
          <li>💪 <strong>+20% Strength</strong> - You hit harder</li>
          <li>❤️ <strong>-20% Enemy Health</strong> - Enemies have 80% HP</li>
          <li>⚔️ <strong>-20% Enemy Strength</strong> - Enemies do 80% damage</li>
          <li>🎲 <strong>25% AI mistake chance</strong> - AI makes frequent errors</li>
        </ul>

        <h3>Rewards:</h3>
        <ul>
          <li>📉 <strong>80% XP</strong> (penalty for easier difficulty)</li>
          <li>📦 <strong>70% equipment drop rate</strong> (higher loot chance)</li>
        </ul>

        <h3>Best For:</h3>
        <ul>
          <li>✅ New players learning the game</li>
          <li>✅ Casual play sessions</li>
          <li>✅ Experimenting with mechanics</li>
          <li>✅ Grinding equipment</li>
        </ul>

        <h2>⚔️ Normal Mode (Default)</h2>
        <p><em>"Balanced difficulty for most players"</em></p>
        
        <h3>Modifiers:</h3>
        <ul>
          <li>❤️ <strong>Standard Health</strong></li>
          <li>⚔️ <strong>Standard Strength</strong></li>
          <li>🎲 <strong>10% AI mistake chance</strong> - AI occasionally errs</li>
        </ul>

        <h3>Rewards:</h3>
        <ul>
          <li>✅ <strong>100% XP</strong> (standard rewards)</li>
          <li>📦 <strong>50% equipment drop rate</strong> (balanced loot)</li>
        </ul>

        <h3>Best For:</h3>
        <ul>
          <li>✅ Most players</li>
          <li>✅ Balanced challenge</li>
          <li>✅ Standard progression</li>
          <li>✅ Recommended first playthrough</li>
        </ul>

        <h2>💀 Hard Mode</h2>
        <p><em>"Challenging experience for skilled players"</em></p>
        
        <h3>Modifiers:</h3>
        <ul>
          <li>💚 <strong>+30% Enemy Health</strong> - Enemies have 130% HP</li>
          <li>💪 <strong>+20% Enemy Strength</strong> - Enemies do 120% damage</li>
          <li>🎲 <strong>5% AI mistake chance</strong> - AI makes very few errors</li>
        </ul>

        <h3>Rewards:</h3>
        <ul>
          <li>📈 <strong>130% XP</strong> (+30% bonus!)</li>
          <li>📦 <strong>60% equipment drop rate</strong> (better loot)</li>
        </ul>

        <h3>Best For:</h3>
        <ul>
          <li>✅ Experienced players</li>
          <li>✅ Faster leveling (bonus XP)</li>
          <li>✅ Challenge seekers</li>
          <li>✅ Better equipment drops</li>
        </ul>

        <h2>👹 Nightmare Mode</h2>
        <p><em>"Brutal challenge for true masters"</em></p>
        
        <h3>Modifiers:</h3>
        <ul>
          <li>💚 <strong>+60% Enemy Health</strong> - Enemies have 160% HP!</li>
          <li>💪 <strong>+50% Enemy Strength</strong> - Enemies do 150% damage!</li>
          <li>🎯 <strong>0% AI mistake chance</strong> - AI plays perfectly</li>
        </ul>

        <h3>Rewards:</h3>
        <ul>
          <li>🚀 <strong>150% XP</strong> (+50% bonus!!)</li>
          <li>📦 <strong>70% equipment drop rate</strong> (highest loot chance)</li>
        </ul>

        <h3>Best For:</h3>
        <ul>
          <li>✅ Elite players only</li>
          <li>✅ Maximum challenge</li>
          <li>✅ Fastest leveling</li>
          <li>✅ Best equipment farming</li>
          <li>✅ Bragging rights</li>
        </ul>

        <h2>🎮 How to Change Difficulty</h2>
        <div class="success-box">
          <h3>From Settings Screen:</h3>
          <ol>
            <li>From title screen, click <strong>"⚙️ Settings"</strong> button (top right, gear icon)</li>
            <li>View current difficulty in the summary section</li>
            <li>Click on any difficulty card to select it</li>
            <li>New difficulty takes effect <strong>next battle</strong></li>
          </ol>
        </div>

        <h2>💡 Strategic Considerations</h2>
        <h3>When to Use Each Difficulty:</h3>

        <h4>😊 Easy:</h4>
        <ul>
          <li>🎓 <strong>Learning phase</strong> - Understand mechanics without pressure</li>
          <li>🎯 <strong>Equipment farming</strong> - Higher drop rate + easier wins</li>
          <li>🧪 <strong>Testing builds</strong> - Experiment safely</li>
          <li>🎮 <strong>Casual gaming</strong> - Relax and have fun</li>
        </ul>

        <h4>⚔️ Normal:</h4>
        <ul>
          <li>🎯 <strong>Standard playthrough</strong> - Balanced experience</li>
          <li>📈 <strong>Steady progression</strong> - Fair challenge, fair rewards</li>
          <li>👥 <strong>Most players</strong> - Recommended default</li>
        </ul>

        <h4>💀 Hard:</h4>
        <ul>
          <li>⚡ <strong>Faster leveling</strong> - +30% XP accelerates progression</li>
          <li>🎯 <strong>Skill improvement</strong> - Forces better decisions</li>
          <li>📦 <strong>Better loot</strong> - 60% drop rate is solid</li>
          <li>🏆 <strong>Achievement hunting</strong> - Extra XP helps</li>
        </ul>

        <h4>👹 Nightmare:</h4>
        <ul>
          <li>👑 <strong>Maximum rewards</strong> - Best XP (+50%) and loot (70%)</li>
          <li>🎖️ <strong>Ultimate challenge</strong> - Test your mastery</li>
          <li>⚡ <strong>Speed leveling</strong> - Fastest way to level 20</li>
          <li>🏅 <strong>Prestige</strong> - Prove you're the best</li>
        </ul>

        <h2>📈 Leveling Speed Comparison</h2>
        <p><strong>To reach Level 10 (example):</strong></p>
        <table>
          <tr>
            <th>Difficulty</th>
            <th>Battles Needed</th>
            <th>Speed</th>
          </tr>
          <tr>
            <td>😊 Easy</td>
            <td>~125 battles</td>
            <td>Slower (80% XP)</td>
          </tr>
          <tr>
            <td>⚔️ Normal</td>
            <td>~100 battles</td>
            <td>Standard (100% XP)</td>
          </tr>
          <tr>
            <td>💀 Hard</td>
            <td>~77 battles</td>
            <td>23% faster!</td>
          </tr>
          <tr>
            <td>👹 Nightmare</td>
            <td>~67 battles</td>
            <td>33% faster!!</td>
          </tr>
        </table>

        <div class="info-box">
          <strong>Conclusion:</strong> Higher difficulties level you faster despite being harder!
        </div>

        <h2>🎁 Equipment Farming Strategy</h2>
        <table>
          <tr>
            <th>Game Stage</th>
            <th>Recommended Difficulty</th>
            <th>Reason</th>
          </tr>
          <tr>
            <td>Early Game (Low Level)</td>
            <td>😊 Easy</td>
            <td>High drop rate (70%), easy wins, build collection</td>
          </tr>
          <tr>
            <td>Mid Game (Level 5-10)</td>
            <td>💀 Hard</td>
            <td>Good drops (60%), bonus XP (130%), balanced</td>
          </tr>
          <tr>
            <td>Late Game (Level 15+)</td>
            <td>👹 Nightmare</td>
            <td>Highest drops (70%), maximum XP (150%)</td>
          </tr>
        </table>

        <h2>🎯 Tips for Success</h2>
        <div class="success-box">
          <h3>😊 Easy Mode:</h3>
          <ul>
            <li>Don't worry about strategy - you have huge advantages</li>
            <li>Great for trying new classes/skills</li>
            <li>Farm equipment efficiently</li>
          </ul>

          <h3>💀 Hard Mode:</h3>
          <ul>
            <li><strong>Maximize equipment</strong> - Every stat boost matters</li>
            <li><strong>Use skills wisely</strong> - Resource management crucial</li>
            <li><strong>Defend more</strong> - Enemies hit much harder</li>
            <li><strong>Level up first</strong> - Get to 5+ before attempting</li>
          </ul>

          <h3>👹 Nightmare Mode:</h3>
          <ul>
            <li><strong>Max level recommended</strong> - Level 15+ advised</li>
            <li><strong>Best equipment only</strong> - Epic/Legendary gear essential</li>
            <li><strong>Perfect strategy</strong> - AI won't make mistakes</li>
            <li><strong>Use ALL tools</strong> - Skills, items, combos, crits</li>
            <li><strong>Patience</strong> - Battles take longer, stay focused</li>
          </ul>
        </div>

        <h2>🚀 Recommended Progression Path</h2>
        <h3>New Player (Level 1-5):</h3>
        <ol>
          <li>Start on <strong>⚔️ Normal</strong> to learn the game</li>
          <li>If struggling, switch to <strong>😊 Easy</strong></li>
          <li>If breezing through, try <strong>💀 Hard</strong></li>
        </ol>

        <h3>Intermediate (Level 5-10):</h3>
        <ol>
          <li>Comfortable? Switch to <strong>💀 Hard</strong> for better rewards</li>
          <li>Still learning? Stay on <strong>⚔️ Normal</strong></li>
          <li>Want challenge? Test <strong>👹 Nightmare</strong></li>
        </ol>

        <h3>Advanced (Level 10-15):</h3>
        <ol>
          <li><strong>💀 Hard</strong> becomes standard</li>
          <li><strong>👹 Nightmare</strong> for maximum rewards</li>
          <li><strong>😊 Easy</strong> only for equipment farming</li>
        </ol>

        <h3>Max Level (15-20):</h3>
        <ol>
          <li><strong>👹 Nightmare</strong> for prestige and best rewards</li>
          <li><strong>💀 Hard</strong> for slightly easier battles</li>
          <li>Challenge yourself to clear everything on Nightmare!</li>
        </ol>

        <div class="warning-box">
          <h3>⚠️ What's NOT Affected by Difficulty:</h3>
          <ul>
            <li>❌ Tournament mode (uses separate difficulty system)</li>
            <li>❌ Level bonuses (applied independently)</li>
            <li>❌ Equipment stats (not scaled)</li>
            <li>❌ Achievement requirements (unchanged)</li>
          </ul>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Back button
    const backBtn = this.shadowRoot.getElementById('backBtn');
    backBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('back'));
    });

    // Tab buttons
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        this._activeTab = tab;
        this.render();
      });
    });
  }
}

customElements.define('wiki-screen', WikiScreen);
