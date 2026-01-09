import { BaseComponent } from './BaseComponent.js';

export class WikiScreen extends BaseComponent {
  constructor() {
    super();
    this._activeTab = 'grid-combat';
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

        /* Grid Combat Styles */
        .terrain-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .terrain-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 15px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .terrain-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 215, 0, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .terrain-card.highlight {
          border-color: rgba(76, 175, 80, 0.6);
          background: rgba(76, 175, 80, 0.1);
        }

        .terrain-card.danger {
          border-color: rgba(244, 67, 54, 0.6);
          background: rgba(244, 67, 54, 0.1);
        }

        .terrain-card.impassable {
          border-color: rgba(158, 158, 158, 0.6);
          background: rgba(0, 0, 0, 0.3);
        }

        .terrain-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .terrain-card h4 {
          margin: 10px 0;
          color: #FFD700;
          font-size: 16px;
        }

        .terrain-card p {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin: 10px 0;
          min-height: 40px;
        }

        .terrain-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .terrain-stats span {
          background: rgba(0, 0, 0, 0.3);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .mechanic-card {
          background: rgba(106, 66, 194, 0.1);
          border-left: 4px solid #6a42c2;
          border-radius: 8px;
          padding: 20px;
          margin: 15px 0;
        }

        .mechanic-card h3 {
          margin-top: 0;
          color: #FFD700;
        }

        .mechanic-card ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .mechanic-card li {
          margin: 8px 0;
        }

        .tips {
          display: grid;
          gap: 15px;
          margin: 20px 0;
        }

        .tip {
          background: rgba(255, 215, 0, 0.1);
          border-left: 4px solid #FFD700;
          padding: 15px;
          border-radius: 8px;
        }

        .tip strong {
          color: #FFD700;
          display: block;
          margin-bottom: 5px;
        }

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

          .terrain-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <button class="back-button" id="backBtn">← Back</button>

      <div class="wiki-container">
        <div class="wiki-header">
          <div class="wiki-title">📚 Game Wiki</div>
          <div class="wiki-subtitle">Everything you need to know about Object Fighter</div>
        </div>

        <div class="tab-navigation">
          <button class="tab-button ${this._activeTab === 'grid-combat' ? 'active' : ''}" data-tab="grid-combat">
            🗺️ Grid Combat
          </button>
          <button class="tab-button ${this._activeTab === 'story' ? 'active' : ''}" data-tab="story">
            📖 Story Mode
          </button>
          <button class="tab-button ${this._activeTab === 'status-effects' ? 'active' : ''}" data-tab="status-effects">
            🎯 Status Effects
          </button>
          <button class="tab-button ${this._activeTab === 'marketplace' ? 'active' : ''}" data-tab="marketplace">
            🏪 Marketplace
          </button>
          <button class="tab-button ${this._activeTab === 'economy' ? 'active' : ''}" data-tab="economy">
            💰 Economy
          </button>
          <button class="tab-button ${this._activeTab === 'classes' ? 'active' : ''}" data-tab="classes">
            🎭 Classes
          </button>
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
          ${this.renderGridCombatContent()}
          ${this.renderStoryContent()}
          ${this.renderStatusEffectsContent()}
          ${this.renderMarketplaceContent()}
          ${this.renderEconomyContent()}
          ${this.renderClassesContent()}
          ${this.renderAchievementsContent()}
          ${this.renderEquipmentContent()}
          ${this.renderTournamentContent()}
          ${this.renderDifficultyContent()}
        </div>
      </div>
    `;
  }

  renderGridCombatContent() {
    return `
      <div class="content-section ${this._activeTab === 'grid-combat' ? 'active' : ''}" id="grid-combat-content">
        <h1>🗺️ Tactical Grid Combat System</h1>
        
        <div class="info-box">
          <strong>5x5 Tactical Grid | 10 Terrain Types | Strategic Positioning | Weapon Ranges</strong><br>
          Master positioning and terrain to dominate every battle!
        </div>

        <h2>🎯 Core Mechanics</h2>
        <p>All combat takes place on a <strong>5x5 tactical grid</strong> where positioning matters! Fighters occupy grid cells, and you must strategically move, position, and attack to win.</p>

        <div class="mechanic-card">
          <h3>📍 Grid Positioning</h3>
          <ul>
            <li><strong>Cell-Based Movement</strong> - Fighters occupy single cells</li>
            <li><strong>Starting Positions</strong> - Player starts bottom-left, enemy top-right</li>
            <li><strong>Line of Sight</strong> - Some terrain blocks vision and ranged attacks</li>
            <li><strong>Distance Matters</strong> - Must be in range to attack</li>
          </ul>
        </div>

        <div class="mechanic-card">
          <h3>🏃 Movement System</h3>
          <ul>
            <li><strong>Movement Skills</strong> - Each class has a unique movement ability</li>
            <li><strong>Mana Cost</strong> - Movement requires 10-15 mana</li>
            <li><strong>Cooldowns</strong> - Skills have 0-2 turn cooldowns</li>
            <li><strong>Interactive</strong> - Click highlighted cells to move</li>
            <li><strong>Strategic Choice</strong> - Must choose between moving, attacking, or defending</li>
          </ul>
          <p><strong>Class Movement Skills:</strong></p>
          <ul>
            <li>⚔️ Warrior: <em>Reposition</em> (15 mana, 1 cooldown)</li>
            <li>🛡️ Tank: <em>Steady Advance</em> (10 mana, 2 cooldown)</li>
            <li>⚖️ Balanced: <em>Tactical Move</em> (10 mana, 1 cooldown)</li>
            <li>🗡️ Assassin: <em>Shadow Step</em> (12 mana, 0 cooldown)</li>
            <li>🪄 Mage: <em>Arcane Step</em> (15 mana, 1 cooldown)</li>
            <li>⚡ Berserker: <em>Rage Rush</em> (10 mana, 1 cooldown)</li>
            <li>✝️ Paladin: <em>Divine Stride</em> (12 mana, 1 cooldown)</li>
            <li>💀 Necromancer: <em>Death Walk</em> (15 mana, 2 cooldown)</li>
            <li>👊 Brawler: <em>Quick Step</em> (10 mana, 0 cooldown)</li>
          </ul>
        </div>

        <div class="mechanic-card">
          <h3>🎯 Weapon Range System</h3>
          <ul>
            <li><strong>Melee Weapons</strong> - Range 1 (swords, axes, hammers)</li>
            <li><strong>Ranged Weapons</strong> - Range 2-4 (staves, wands)</li>
            <li><strong>Class Ranges</strong> - Mages have 3-cell base range, others have 1</li>
            <li><strong>Out of Range</strong> - Attack button disabled when too far</li>
            <li><strong>Must Move</strong> - Use movement skills to get closer</li>
          </ul>
        </div>

        <h2>🌍 Terrain Types (10 Total)</h2>

        <div class="terrain-grid">
          <div class="terrain-card">
            <div class="terrain-icon">◻️</div>
            <h4>Normal Ground</h4>
            <p>Standard battlefield terrain with no bonuses or penalties.</p>
            <div class="terrain-stats">
              <span>Move: 1</span>
              <span>Def: +0%</span>
              <span>Atk: +0%</span>
            </div>
          </div>

          <div class="terrain-card">
            <div class="terrain-icon">🌱</div>
            <h4>Grassland</h4>
            <p>Open grassland, easy to traverse.</p>
            <div class="terrain-stats">
              <span>Move: 1</span>
              <span>Def: +0%</span>
              <span>Atk: +0%</span>
            </div>
          </div>

          <div class="terrain-card">
            <div class="terrain-icon">🌳</div>
            <h4>Dense Forest</h4>
            <p>Provides cover but hinders attacks. Blocks line of sight!</p>
            <div class="terrain-stats">
              <span>Move: 2</span>
              <span>Def: +15%</span>
              <span>Atk: -10%</span>
            </div>
          </div>

          <div class="terrain-card">
            <div class="terrain-icon">💧</div>
            <h4>Shallow Water</h4>
            <p>Difficult to move through, reduces combat effectiveness.</p>
            <div class="terrain-stats">
              <span>Move: 3</span>
              <span>Def: -10%</span>
              <span>Atk: -15%</span>
            </div>
          </div>

          <div class="terrain-card">
            <div class="terrain-icon">🟤</div>
            <h4>Muddy Ground</h4>
            <p>Slows movement and reduces stability.</p>
            <div class="terrain-stats">
              <span>Move: 2</span>
              <span>Def: -5%</span>
              <span>Atk: -10%</span>
            </div>
          </div>

          <div class="terrain-card">
            <div class="terrain-icon">⬜</div>
            <h4>Rocky Terrain</h4>
            <p>Stable ground provides slight defensive advantage.</p>
            <div class="terrain-stats">
              <span>Move: 1</span>
              <span>Def: +10%</span>
              <span>Atk: +5%</span>
            </div>
          </div>

          <div class="terrain-card highlight">
            <div class="terrain-icon">🏔️</div>
            <h4>High Ground</h4>
            <p><strong>BEST POSITION!</strong> Elevated position grants huge combat advantage.</p>
            <div class="terrain-stats">
              <span>Move: 1</span>
              <span>Def: +20%</span>
              <span>Atk: +25%</span>
            </div>
          </div>

          <div class="terrain-card danger">
            <div class="terrain-icon">⬛</div>
            <h4>Low Ground</h4>
            <p><strong>AVOID!</strong> Depression in terrain, disadvantageous position.</p>
            <div class="terrain-stats">
              <span>Move: 1</span>
              <span>Def: -15%</span>
              <span>Atk: -10%</span>
            </div>
          </div>

          <div class="terrain-card impassable">
            <div class="terrain-icon">🧱</div>
            <h4>Stone Wall</h4>
            <p><strong>IMPASSABLE!</strong> Cannot move through. Blocks line of sight.</p>
            <div class="terrain-stats">
              <span>Move: ∞</span>
              <span>Def: —</span>
              <span>Atk: —</span>
            </div>
          </div>

          <div class="terrain-card impassable">
            <div class="terrain-icon">⚫</div>
            <h4>Deep Pit</h4>
            <p><strong>IMPASSABLE!</strong> Dangerous pit, cannot be crossed.</p>
            <div class="terrain-stats">
              <span>Move: ∞</span>
              <span>Def: —</span>
              <span>Atk: —</span>
            </div>
          </div>
        </div>

        <h2>🎯 Tactical Mechanics</h2>

        <div class="mechanic-card">
          <h3>⚔️ Flanking</h3>
          <p>Attack enemies from behind or sides for bonus damage!</p>
          <ul>
            <li><strong>+15% Damage</strong> when attacking from flanking position</li>
            <li>Flanking detected automatically</li>
            <li>Position yourself strategically to flank</li>
          </ul>
        </div>

        <div class="mechanic-card">
          <h3>👁️ Line of Sight</h3>
          <p>Some terrain blocks vision and ranged attacks:</p>
          <ul>
            <li>🌳 <strong>Forest</strong> blocks line of sight</li>
            <li>🧱 <strong>Walls</strong> block line of sight</li>
            <li>Cannot attack targets you can't see!</li>
          </ul>
        </div>

        <div class="mechanic-card">
          <h3>🏰 Predefined Battlefields</h3>
          <p>Story missions use unique battlefield layouts:</p>
          <ul>
            <li><strong>Training Grounds</strong> - Balanced mix of terrain</li>
            <li><strong>Forest Clearing</strong> - Dense forest with central opening</li>
            <li><strong>Desert Ruins</strong> - Rocky terrain with walls</li>
            <li><strong>Treacherous Swamp</strong> - Mud and water obstacles</li>
            <li><strong>Mountain Pass</strong> - High and low ground</li>
            <li><strong>Combat Arena</strong> - Walled perimeter with rock cover</li>
          </ul>
        </div>

        <h2>💡 Pro Tips</h2>
        <div class="tips">
          <div class="tip">
            <strong>🏔️ Secure High Ground</strong> - The +25% attack bonus is massive! Rush for elevated positions early.
          </div>
          <div class="tip">
            <strong>🌳 Use Cover</strong> - Forest provides +15% defense and blocks enemy line of sight.
          </div>
          <div class="tip">
            <strong>💧 Avoid Water & Mud</strong> - These terrains reduce your combat effectiveness significantly.
          </div>
          <div class="tip">
            <strong>⚡ Assassins Excel</strong> - Shadow Step has 0 cooldown for maximum mobility!
          </div>
          <div class="tip">
            <strong>🎯 Range Matters</strong> - Mages can attack from 3 cells away, melee must close in.
          </div>
          <div class="tip">
            <strong>⚔️ Flank Enemies</strong> - Position yourself behind enemies for +15% damage bonus.
          </div>
        </div>

        <div class="info-box">
          <strong>📚 For Technical Details:</strong> See <code>docs/GRID_COMBAT_SYSTEM.md</code> and <code>docs/WEAPON_RANGE_SYSTEM.md</code>
        </div>
      </div>
    `;
  }

  renderStoryContent() {
    return `
      <div class="content-section ${this._activeTab === 'story' ? 'active' : ''}" id="story-content">
        <h1>📖 Story Mode Campaign</h1>
        
        <div class="info-box">
          <strong>25 Epic Missions | 5 Unique Regions | 75 Stars to Earn</strong><br>
          Journey from novice to legend in an epic campaign!
        </div>

        <h2>🗺️ Campaign Regions</h2>
        <table>
          <tr>
            <th>Region</th>
            <th>Missions</th>
            <th>Difficulty</th>
            <th>Description</th>
          </tr>
          <tr>
            <td>🎯 Tutorial Arena</td>
            <td>2</td>
            <td>1-2</td>
            <td>Learn combat basics</td>
          </tr>
          <tr>
            <td>⚔️ Novice Grounds</td>
            <td>3</td>
            <td>3-5</td>
            <td>Stop the bandit threat</td>
          </tr>
          <tr>
            <td>🌲 Forest of Trials</td>
            <td>3</td>
            <td>6-8</td>
            <td>Face corrupted beasts</td>
          </tr>
          <tr>
            <td>⛰️ Mountain Pass</td>
            <td>3</td>
            <td>6-8</td>
            <td>Climb treacherous peaks</td>
          </tr>
          <tr>
            <td>🌑 Shadow Realm</td>
            <td>3</td>
            <td>9-12</td>
            <td>Battle nightmares</td>
          </tr>
          <tr>
            <td>👑 Champions' Valley</td>
            <td>3</td>
            <td>13-15</td>
            <td>Face legendary heroes</td>
          </tr>
        </table>

        <h2>🎯 Mission Types</h2>
        <ul>
          <li><strong>⚔️ Standard</strong> - 1v1 battles with objectives</li>
          <li><strong>🛡️ Survival</strong> - Face 3 waves of enemies</li>
          <li><strong>👑 Boss</strong> - Epic encounters with legendary opponents</li>
        </ul>

        <h2>⭐ Star Rating System</h2>
        <ul>
          <li><strong>1 Star</strong> - Complete the mission</li>
          <li><strong>2 Stars</strong> - Complete 1 optional objective</li>
          <li><strong>3 Stars</strong> - Complete ALL objectives (Perfect!)</li>
        </ul>

        <h2>🎁 Rewards</h2>
        <ul>
          <li><strong>💰 Gold</strong> - 50-600 per mission (difficulty + stars)</li>
          <li><strong>✨ XP</strong> - 100-1500 per mission</li>
          <li><strong>🎁 Equipment</strong> - Guaranteed drops</li>
          <li><strong>📖 Story</strong> - Unlock new regions and narrative</li>
        </ul>

        <div class="tip-box">
          <strong>💡 Pro Tip:</strong> Complete missions with 3 stars for maximum rewards! You can replay missions anytime to improve your rating.
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <strong>📚 For detailed mission list and strategies, see STORY_MODE_GUIDE.md</strong>
        </p>
      </div>
    `;
  }

  renderStatusEffectsContent() {
    return `
      <div class="content-section ${this._activeTab === 'status-effects' ? 'active' : ''}" id="status-effects-content">
        <h1>🎯 Status Effects System</h1>
        
        <div class="info-box">
          <strong>17 Unique Effects | 11 Interactions | Strategic Depth</strong><br>
          Master status effects to dominate combat with powerful combos!
        </div>

        <h2>🔴 Damage Over Time (DOT)</h2>
        <table>
          <tr>
            <th>Effect</th>
            <th>Duration</th>
            <th>Damage/Turn</th>
            <th>Special</th>
          </tr>
          <tr>
            <td>☠️ Poison</td>
            <td>4 turns</td>
            <td>10 HP</td>
            <td>Stackable (max 5)</td>
          </tr>
          <tr>
            <td>🔥 Burn</td>
            <td>3 turns</td>
            <td>12 HP</td>
            <td>Stackable (max 3), Fire element</td>
          </tr>
          <tr>
            <td>🩸 Bleed</td>
            <td>4 turns</td>
            <td>8 HP</td>
            <td>Stackable (max 5), Increases with actions</td>
          </tr>
          <tr>
            <td>⚡ Shock</td>
            <td>2 turns</td>
            <td>15 HP</td>
            <td>Chains, Amplified when Wet (x2)</td>
          </tr>
        </table>

        <h2>💚 Healing & Buffs</h2>
        <table>
          <tr>
            <th>Effect</th>
            <th>Duration</th>
            <th>Bonus</th>
            <th>Special</th>
          </tr>
          <tr>
            <td>💚 Regeneration</td>
            <td>5 turns</td>
            <td>+15 HP/turn</td>
            <td>Stackable (max 3)</td>
          </tr>
          <tr>
            <td>💪 Strength Boost</td>
            <td>3 turns</td>
            <td>+20 Strength</td>
            <td>Flat bonus</td>
          </tr>
          <tr>
            <td>🛡️ Defense Boost</td>
            <td>3 turns</td>
            <td>+15 Defense</td>
            <td>Flat bonus</td>
          </tr>
          <tr>
            <td>✨ Bless</td>
            <td>3 turns</td>
            <td>+25% damage</td>
            <td>Cancels Curse</td>
          </tr>
          <tr>
            <td>💨 Haste</td>
            <td>3 turns</td>
            <td>+40% speed</td>
            <td>Cancels Slow</td>
          </tr>
          <tr>
            <td>⛰️ Fortify</td>
            <td>3 turns</td>
            <td>-30% damage taken</td>
            <td>Stackable (max 2)</td>
          </tr>
          <tr>
            <td>😡 Enrage</td>
            <td>2 turns</td>
            <td>+40% dmg, -20% def</td>
            <td>High risk, high reward</td>
          </tr>
          <tr>
            <td>🧠 Clarity</td>
            <td>3 turns</td>
            <td>-50% mana costs</td>
            <td>Great for casters</td>
          </tr>
        </table>

        <h2>😰 Debuffs</h2>
        <table>
          <tr>
            <th>Effect</th>
            <th>Duration</th>
            <th>Penalty</th>
            <th>Special</th>
          </tr>
          <tr>
            <td>😰 Weakness</td>
            <td>3 turns</td>
            <td>-15 all stats</td>
            <td>General debuff</td>
          </tr>
          <tr>
            <td>🌑 Curse</td>
            <td>4 turns</td>
            <td>-50% healing</td>
            <td>Cancels Bless, reduces heals</td>
          </tr>
          <tr>
            <td>🐌 Slow</td>
            <td>3 turns</td>
            <td>-30% speed</td>
            <td>Cancels Haste</td>
          </tr>
          <tr>
            <td>💔 Vulnerable</td>
            <td>2 turns</td>
            <td>+50% damage taken</td>
            <td>Very dangerous!</td>
          </tr>
        </table>

        <h2>🛡️ Protection Effects</h2>
        <table>
          <tr>
            <th>Effect</th>
            <th>Duration</th>
            <th>Protection</th>
            <th>Special</th>
          </tr>
          <tr>
            <td>🔰 Shield</td>
            <td>3 turns</td>
            <td>Absorbs 50 damage</td>
            <td>Tracks absorbed damage</td>
          </tr>
          <tr>
            <td>🪞 Reflect</td>
            <td>2 turns</td>
            <td>Reflects 30% damage</td>
            <td>Returns damage to attacker</td>
          </tr>
          <tr>
            <td>🌹 Thorns</td>
            <td>4 turns</td>
            <td>Returns 15 damage</td>
            <td>Stackable (max 3)</td>
          </tr>
        </table>

        <h2>🎯 Crowd Control</h2>
        <table>
          <tr>
            <th>Effect</th>
            <th>Duration</th>
            <th>Effect</th>
            <th>Special</th>
          </tr>
          <tr>
            <td>💫 Stun</td>
            <td>1 turn</td>
            <td>Cannot act</td>
            <td>Complete disable</td>
          </tr>
          <tr>
            <td>❄️ Frozen</td>
            <td>2 turns</td>
            <td>-30% speed</td>
            <td>Shatterable! Vulnerable to heavy damage</td>
          </tr>
          <tr>
            <td>🔇 Silence</td>
            <td>2 turns</td>
            <td>Cannot use skills</td>
            <td>Blocks all abilities</td>
          </tr>
        </table>

        <h2>⚡ Effect Interactions</h2>
        <p>Status effects can interact with each other strategically:</p>

        <h3>🔥 Fire vs Ice ❄️</h3>
        <ul>
          <li><strong>Burn removes Frozen</strong> - Fire melts ice</li>
          <li><strong>Frozen removes Burn</strong> - Ice extinguishes fire</li>
        </ul>

        <h3>💥 Combo Interactions</h3>
        <table>
          <tr>
            <th>Trigger</th>
            <th>Result</th>
            <th>Effect</th>
          </tr>
          <tr>
            <td>❄️ Frozen + Heavy Damage</td>
            <td>💥 SHATTER</td>
            <td>+30 bonus damage!</td>
          </tr>
          <tr>
            <td>⚡ Shock + 💧 Wet</td>
            <td>Amplify</td>
            <td>Double shock damage (x2)</td>
          </tr>
          <tr>
            <td>☠️ Poison + 💚 Regeneration</td>
            <td>Reduce Both</td>
            <td>Effects partially cancel (50%)</td>
          </tr>
          <tr>
            <td>🌑 Curse + ✨ Bless</td>
            <td>Dispel Both</td>
            <td>Light and dark cancel out</td>
          </tr>
          <tr>
            <td>💨 Haste + 🐌 Slow</td>
            <td>Dispel Both</td>
            <td>Time effects cancel</td>
          </tr>
          <tr>
            <td>🩸 Bleed + Action Taken</td>
            <td>Stack Bleed</td>
            <td>Taking actions worsens bleeding</td>
          </tr>
          <tr>
            <td>💔 Vulnerable + ⛰️ Fortify</td>
            <td>Reduce Both</td>
            <td>Partially cancel (50%)</td>
          </tr>
        </table>

        <h2>💡 Strategic Combos</h2>

        <h3>🔴 Offensive Combos</h3>
        <div class="success-box">
          <h4>DOT Stack</h4>
          <p><code>Poison + Burn + Bleed</code> = Massive sustained damage (30+ HP/turn!)</p>

          <h4>Burst Damage</h4>
          <p><code>Bless + Enrage + Vulnerable (on enemy)</code> = Maximum burst potential</p>

          <h4>Shatter Combo</h4>
          <p><code>1. Apply Frozen → 2. Deal heavy damage → 3. SHATTER (+30 bonus!)</code></p>
        </div>

        <h3>🛡️ Defensive Combos</h3>
        <div class="info-box">
          <h4>Tank Build</h4>
          <p><code>Fortify + Shield + Thorns</code> = Absorb and reflect damage</p>

          <h4>Sustain Build</h4>
          <p><code>Regeneration (stacked x3) + Clarity</code> = Continuous healing with mana</p>
        </div>

        <h3>⚔️ Counter-Plays</h3>
        <ul>
          <li><strong>vs Healing:</strong> Apply Curse (-50% healing received)</li>
          <li><strong>vs Casters:</strong> Apply Silence (can't use skills)</li>
          <li><strong>vs DOTs:</strong> Stack Regeneration or end fight quickly</li>
          <li><strong>vs Buffs:</strong> Use Vulnerable to bypass shields</li>
        </ul>

        <h2>📊 Effect Stacking</h2>
        <p>Some effects can stack for increased power:</p>
        <table>
          <tr>
            <th>Effect</th>
            <th>Max Stacks</th>
            <th>Total Power at Max</th>
          </tr>
          <tr>
            <td>☠️ Poison</td>
            <td>5 stacks</td>
            <td>50 HP/turn</td>
          </tr>
          <tr>
            <td>🔥 Burn</td>
            <td>3 stacks</td>
            <td>36 HP/turn</td>
          </tr>
          <tr>
            <td>🩸 Bleed</td>
            <td>5 stacks</td>
            <td>40 HP/turn</td>
          </tr>
          <tr>
            <td>💚 Regeneration</td>
            <td>3 stacks</td>
            <td>45 HP/turn heal</td>
          </tr>
          <tr>
            <td>⛰️ Fortify</td>
            <td>2 stacks</td>
            <td>-60% damage taken</td>
          </tr>
          <tr>
            <td>🌹 Thorns</td>
            <td>3 stacks</td>
            <td>45 damage returned</td>
          </tr>
        </table>

        <h2>🎮 How to Apply Effects</h2>
        <p>Status effects are applied through:</p>
        <ul>
          <li><strong>⚔️ Skills</strong> - Most skills apply status effects</li>
          <li><strong>🎁 Items</strong> - Some consumables grant buffs</li>
          <li><strong>⚙️ Equipment</strong> - Certain legendary items apply effects</li>
          <li><strong>🎭 Class Abilities</strong> - Passive effects from your class</li>
        </ul>

        <h2>💡 Pro Tips</h2>
        <div class="success-box">
          <ul>
            <li><strong>Stack Early</strong> - Apply multiple DOTs at fight start</li>
            <li><strong>Watch for Combos</strong> - Look for interaction opportunities</li>
            <li><strong>Counter Enemy Strategy</strong> - Use Curse vs healers, Silence vs casters</li>
            <li><strong>Time Your Dispels</strong> - Save dispels for critical debuffs</li>
            <li><strong>Shatter Setup</strong> - Frozen + Heavy hit = free +30 damage</li>
            <li><strong>Elemental Advantage</strong> - Use fire vs ice, ice vs fire</li>
          </ul>
        </div>

        <h2>⚠️ Important Notes</h2>
        <div class="warning-box">
          <ul>
            <li>Effects tick at the START of each turn</li>
            <li>Some effects can be dispelled, others are permanent</li>
            <li>Interactions trigger automatically when conditions are met</li>
            <li>Stacking effects refresh duration on new application</li>
            <li>CC effects (Stun, Frozen, Silence) are very powerful - use wisely!</li>
          </ul>
        </div>

        <h2>📈 Advanced Strategy</h2>
        <h3>Early Game (Level 1-5):</h3>
        <ul>
          <li>Focus on simple buffs (Strength, Defense)</li>
          <li>Use Regeneration for sustain</li>
          <li>Learn basic interactions</li>
        </ul>

        <h3>Mid Game (Level 5-10):</h3>
        <ul>
          <li>Start stacking DOTs for damage</li>
          <li>Experiment with combos</li>
          <li>Use CC strategically</li>
        </ul>

        <h3>Late Game (Level 10+):</h3>
        <ul>
          <li>Master all interactions</li>
          <li>Build specialized strategies</li>
          <li>Shatter combo for burst</li>
          <li>Counter enemy strategies</li>
        </ul>

        <p style="text-align: center; margin-top: 30px;">
          <strong>📚 For complete details and API reference, see STATUS_EFFECTS.md</strong>
        </p>
      </div>
    `;
  }

  renderMarketplaceContent() {
    return `
      <div class="content-section ${this._activeTab === 'marketplace' ? 'active' : ''}" id="marketplace-content">
        <h1>🏪 Marketplace System</h1>
        
        <div class="info-box">
          <strong>Buy, Sell, Repair | Rotating Shop | 24-Hour Refresh</strong><br>
          Your one-stop shop for all equipment needs!
        </div>

        <h2>🛍️ Shop Tabs</h2>
        <table>
          <tr>
            <th>Tab</th>
            <th>Description</th>
          </tr>
          <tr>
            <td>⚔️ Equipment Shop</td>
            <td>6-8 rotating items, refreshes every 24 hours (or force refresh for 100 gold!)</td>
          </tr>
          <tr>
            <td>🧪 Consumables</td>
            <td>Health & Mana potions (always available)</td>
          </tr>
          <tr>
            <td>🔧 Repair Shop</td>
            <td>Restore durability of damaged equipment</td>
          </tr>
          <tr>
            <td>💰 Sell Items</td>
            <td>Sell unwanted equipment for 50% value</td>
          </tr>
        </table>

        <h2>💎 Equipment Prices</h2>
        <table>
          <tr>
            <th>Rarity</th>
            <th>Price Range</th>
            <th>Sell Value</th>
          </tr>
          <tr>
            <td><span class="rarity-common">Common</span></td>
            <td>50-150 gold</td>
            <td>25-75 gold</td>
          </tr>
          <tr>
            <td><span class="rarity-rare">Rare</span></td>
            <td>200-500 gold</td>
            <td>100-250 gold</td>
          </tr>
          <tr>
            <td><span class="rarity-epic">Epic</span></td>
            <td>600-1200 gold</td>
            <td>300-600 gold</td>
          </tr>
          <tr>
            <td><span class="rarity-legendary">Legendary</span></td>
            <td>1500-3000 gold</td>
            <td>750-1500 gold</td>
          </tr>
        </table>

        <h2>🔧 Repair Costs</h2>
        <ul>
          <li><strong>Formula</strong> - 5% of item's purchase price</li>
          <li><strong>Common</strong> - ~5-8 gold per repair</li>
          <li><strong>Rare</strong> - ~20-25 gold per repair</li>
          <li><strong>Epic</strong> - ~50-60 gold per repair</li>
          <li><strong>Legendary</strong> - ~125-150 gold per repair</li>
        </ul>

        <h2>🧪 Consumable Prices</h2>
        <ul>
          <li><strong>💚 Health Potion</strong> - 30 gold (restores 20 HP)</li>
          <li><strong>💙 Mana Potion</strong> - 25 gold (restores 30 Mana)</li>
        </ul>

        <h2>🔄 Force Refresh</h2>
        <div class="info-box" style="border-color: #673ab7;">
          <strong>Don't want to wait for the 24-hour refresh?</strong><br>
          Pay <strong>100 gold</strong> to instantly refresh the shop inventory!<br><br>
          Click the <strong>"🔄 Refresh"</strong> button in the marketplace header.<br>
          Great for when you're hunting for specific items or legendary gear.
        </div>

        <div class="tip-box">
          <strong>💡 Pro Tip:</strong> Check the marketplace daily! The shop refreshes every 24 hours automatically, or pay 100 gold to refresh instantly. Save gold for legendary items at level 15+!
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <strong>📚 For detailed shopping strategies, see MARKETPLACE_GUIDE.md</strong>
        </p>
      </div>
    `;
  }

  renderEconomyContent() {
    return `
      <div class="content-section ${this._activeTab === 'economy' ? 'active' : ''}" id="economy-content">
        <h1>💰 Economy System</h1>
        
        <div class="info-box">
          <strong>Gold Currency | Earn, Spend, Manage</strong><br>
          Master the economy to become a legendary champion!
        </div>

        <h2>💸 Earning Gold</h2>
        <table>
          <tr>
            <th>Source</th>
            <th>Gold Earned</th>
          </tr>
          <tr>
            <td>⚔️ Battle Victory (Easy)</td>
            <td>24-40 gold</td>
          </tr>
          <tr>
            <td>⚔️ Battle Victory (Normal)</td>
            <td>30-50 gold</td>
          </tr>
          <tr>
            <td>⚔️ Battle Victory (Hard)</td>
            <td>45-75 gold</td>
          </tr>
          <tr>
            <td>⚔️ Battle Victory (Nightmare)</td>
            <td>60-100 gold</td>
          </tr>
          <tr>
            <td>📖 Story Mission</td>
            <td>50-200 gold (+ star bonus)</td>
          </tr>
          <tr>
            <td>🏆 Tournament (Normal)</td>
            <td>350 gold total</td>
          </tr>
          <tr>
            <td>🏆 Tournament (Hard)</td>
            <td>700 gold total</td>
          </tr>
          <tr>
            <td>🏆 Tournament (Nightmare)</td>
            <td>1050 gold total</td>
          </tr>
          <tr>
            <td>💰 Selling Equipment</td>
            <td>50% of purchase price</td>
          </tr>
        </table>

        <h2>💳 Spending Gold</h2>
        <ul>
          <li><strong>🏪 Equipment</strong> - 50-3000 gold per item</li>
          <li><strong>🔧 Repairs</strong> - 5-150 gold per repair</li>
          <li><strong>🧪 Consumables</strong> - 25-30 gold each</li>
        </ul>

        <h2>📊 Gold Management Tips</h2>
        <ul>
          <li><strong>Early Game</strong> - Buy 1-2 common items, save rest</li>
          <li><strong>Mid Game</strong> - Upgrade to rare/epic, maintain 500g reserve</li>
          <li><strong>Late Game</strong> - Hunt legendaries, keep 2000g+ saved</li>
          <li><strong>Always</strong> - Keep 20% gold as emergency fund</li>
        </ul>

        <h2>💎 Fast Gold Farming</h2>
        <ol>
          <li><strong>Nightmare Tournaments</strong> - 1050g per run (best gold/hour)</li>
          <li><strong>Story Missions</strong> - 100-200g + guaranteed equipment</li>
          <li><strong>Hard Battles</strong> - 45-75g quick and consistent</li>
          <li><strong>Selling Duplicates</strong> - Clean inventory for 200-500g</li>
        </ol>

        <div class="tip-box">
          <strong>💡 Pro Tip:</strong> Start with 100 gold! Buy a weapon first, then armor. Keep 20% of your gold as reserve for repairs and emergencies.
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <strong>📚 For advanced economy strategies, see ECONOMY_GUIDE.md</strong>
        </p>
      </div>
    `;
  }

  renderClassesContent() {
    return `
      <div class="content-section ${this._activeTab === 'classes' ? 'active' : ''}" id="classes-content">
        <h1>🎭 Character Classes</h1>
        
        <div class="info-box">
          <strong>10 Unique Classes | Unique Passives | Distinct Playstyles</strong><br>
          Choose your path to glory! Each class has different stats and passive abilities.
        </div>

        <h2>🌟 Beginner Classes</h2>
        
        <h3>⚖️ Balanced Fighter</h3>
        <div class="info-box" style="border-color: #4caf50;">
          <strong>Difficulty: ★ Beginner</strong><br>
          <strong>HP:</strong> 400 | <strong>STR:</strong> 10 | <strong>Crit:</strong> 15% | <strong>Mana:</strong> +5/turn<br>
          <strong>Passive - Versatility ✨:</strong> Gain +5% to all stats for each different action type used (attack, skill, defend, item). Use all 4 = +20% bonus!<br>
          <strong>Best For:</strong> New players learning game mechanics
        </div>

        <h3>⚔️ Warrior</h3>
        <div class="info-box" style="border-color: #f44336;">
          <strong>Difficulty: ★ Beginner</strong><br>
          <strong>HP:</strong> 360 (-10%) | <strong>STR:</strong> 13 (+30%) | <strong>Crit:</strong> 20% (+33%) | <strong>Crit Dmg:</strong> 175%<br>
          <strong>Passive - Battle Fury 🔥:</strong> Critical hits reduce skill cooldowns by 1 turn and grant +10% damage on next attack. +5% damage per combo hit.<br>
          <strong>Best For:</strong> Aggressive damage dealers
        </div>

        <h3>⚜️ Paladin</h3>
        <div class="info-box" style="border-color: #ffd700;">
          <strong>Difficulty: ★ Beginner</strong><br>
          <strong>HP:</strong> 480 (+20%) | <strong>STR:</strong> 10.5 (+5%) | <strong>DEF:</strong> 115% | <strong>Mana:</strong> +7/turn<br>
          <strong>Passive - Divine Protection ✝️:</strong> Heal 3% max HP each turn. Defending heals additional 8% max HP. +40% healing from items.<br>
          <strong>Best For:</strong> Survivability and sustain
        </div>

        <h3>👊 Bruiser</h3>
        <div class="info-box" style="border-color: #9c27b0;">
          <strong>Difficulty: ★ Beginner</strong><br>
          <strong>HP:</strong> 500 (+25%) | <strong>STR:</strong> 9 (-10%) | <strong>DEF:</strong> 110% | <strong>Healing:</strong> +15%<br>
          <strong>Passive - Lifesteal 💪:</strong> Heal for 10% of damage dealt. Gain 2% max HP permanently every 3 kills. Grows stronger over time!<br>
          <strong>Best For:</strong> Tank + heal through combat
        </div>

        <h2>🛡️ Defensive Class</h2>

        <h3>🛡️ Tank</h3>
        <div class="info-box" style="border-color: #607d8b;">
          <strong>Difficulty: ★ Beginner</strong><br>
          <strong>HP:</strong> 600 (+50%) | <strong>STR:</strong> 6 (-40%) | <strong>DEF:</strong> 150% (+50%)<br>
          <strong>Passive - Iron Will 🛡️:</strong> Defending grants shield that absorbs 30% of next damage. Heal 5% max HP each turn. +30% defend bonus (80% total reduction!).<br>
          <strong>Best For:</strong> Outlasting enemies
        </div>

        <h2>🔥 Offense Classes</h2>

        <h3>💥 Glass Cannon</h3>
        <div class="info-box" style="border-color: #ff5722;">
          <strong>Difficulty: ★★★ Advanced</strong><br>
          <strong>HP:</strong> 300 (-25%) | <strong>STR:</strong> 20 (+100%) | <strong>Crit:</strong> 25% | <strong>Crit Dmg:</strong> 200%<br>
          <strong>Passive - Glass Cannon 💥:</strong> Deal 15% more damage for every 25% HP missing (up to +60%!). Skills cost 30% less mana. +8% per combo.<br>
          <strong>WARNING:</strong> Very fragile, 20% less effective defend<br>
          <strong>Best For:</strong> Expert players who can avoid damage
        </div>

        <h3>🗡️ Assassin</h3>
        <div class="info-box" style="border-color: #9e9e9e;">
          <strong>Difficulty: ★★★ Advanced</strong><br>
          <strong>HP:</strong> 320 (-20%) | <strong>STR:</strong> 12 (+20%) | <strong>Crit:</strong> 30% (highest!) | <strong>Crit Dmg:</strong> 220%<br>
          <strong>Passive - First Strike ⚡:</strong> First attack each combat deals DOUBLE damage. 15% chance to attack again immediately. +10% per combo (highest!).<br>
          <strong>Best For:</strong> Burst damage and high crits
        </div>

        <h3>🪓 Berserker</h3>
        <div class="info-box" style="border-color: #d32f2f;">
          <strong>Difficulty: ★★★ Advanced</strong><br>
          <strong>HP:</strong> 440 (+10%) | <strong>STR:</strong> 11.5 (+15%) | <strong>DEF:</strong> 80% (-20%)<br>
          <strong>Passive - Rage 😡:</strong> Gain 3% damage and 1% crit for every 10% HP missing. At 10% HP = +27% damage, +9% crit! Taking damage grants +5 mana.<br>
          <strong>WARNING:</strong> 25% less effective defend, 20% less healing<br>
          <strong>Best For:</strong> High risk, high reward playstyle
        </div>

        <h2>🔮 Magic Classes</h2>

        <h3>🔮 Mage</h3>
        <div class="info-box" style="border-color: #3f51b5;">
          <strong>Difficulty: ★★ Intermediate</strong><br>
          <strong>HP:</strong> 340 (-15%) | <strong>STR:</strong> 8 (-20%) | <strong>Crit Dmg:</strong> 250% (highest!) | <strong>Mana:</strong> +10/turn (highest!)<br>
          <strong>Passive - Arcane Power ✨:</strong> Skills deal 30% more damage. Using skill grants +20% damage on next basic attack. Skills cost 20% less mana.<br>
          <strong>Best For:</strong> Skill-focused playstyle
        </div>

        <h3>💀 Necromancer</h3>
        <div class="info-box" style="border-color: #4a148c;">
          <strong>Difficulty: ★★★ Advanced</strong><br>
          <strong>HP:</strong> 360 (-10%) | <strong>STR:</strong> 8.5 (-15%) | <strong>Mana:</strong> +8/turn | <strong>Crit Dmg:</strong> 170%<br>
          <strong>Passive - Life Drain 🩸:</strong> Heal for 15% of SKILL damage dealt. Defeating enemies permanently increases max HP by 5%. Skills cost 25% less mana.<br>
          <strong>Best For:</strong> Dark magic lifesteal builds
        </div>

        <h2>📊 Class Comparison</h2>
        <table>
          <tr>
            <th>Stat</th>
            <th>Highest</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>❤️ HP</td>
            <td>Tank</td>
            <td>600</td>
          </tr>
          <tr>
            <td>⚔️ Strength</td>
            <td>Glass Cannon</td>
            <td>20 (double!)</td>
          </tr>
          <tr>
            <td>🛡️ Defense</td>
            <td>Tank</td>
            <td>150%</td>
          </tr>
          <tr>
            <td>💎 Crit Chance</td>
            <td>Assassin</td>
            <td>30%</td>
          </tr>
          <tr>
            <td>💥 Crit Damage</td>
            <td>Mage</td>
            <td>250%</td>
          </tr>
          <tr>
            <td>✨ Mana Regen</td>
            <td>Mage</td>
            <td>+10/turn</td>
          </tr>
        </table>

        <h2>💡 Choosing Your Class</h2>
        <p>
          <strong>New Players:</strong> Start with Balanced, Warrior, Paladin, or Bruiser for more forgiving gameplay.<br><br>
          <strong>Experienced Players:</strong> Try Glass Cannon, Assassin, Berserker, or Necromancer for higher skill ceiling.<br><br>
          <strong>Like Tanking:</strong> Tank, Paladin<br>
          <strong>Like Healing:</strong> Paladin, Bruiser, Necromancer<br>
          <strong>Like Big Crits:</strong> Assassin, Mage, Glass Cannon<br>
          <strong>Like Skills:</strong> Mage, Necromancer<br>
          <strong>Like Basic Attacks:</strong> Warrior, Berserker<br>
          <strong>Like Versatility:</strong> Balanced
        </p>

        <div class="warning-box">
          ⚠️ <strong>Pro Tip:</strong> Your class defines your entire playstyle! Read the passive abilities carefully and choose a class that matches how you want to play. You cannot change your class after creation!
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
          Win battles, complete story missions, or buy from marketplace. Equipment has durability and needs repairs!
        </div>

        <h2>🔧 Durability System (NEW!)</h2>
        <ul>
          <li><strong>100 Durability</strong> - All items start at full durability</li>
          <li><strong>5-10 Loss/Battle</strong> - Items degrade with each battle</li>
          <li><strong>Effectiveness Penalties:</strong>
            <ul>
              <li>100-51%: Full power ✅</li>
              <li>50-26%: -10% effectiveness ⚠️</li>
              <li>25-1%: -25% effectiveness ❌</li>
              <li>0%: Item breaks and unequips 💔</li>
            </ul>
          </li>
          <li><strong>Repair at Marketplace</strong> - 5% of purchase price</li>
        </ul>

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
    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        this._activeTab = tab;
        this.render();
      });
    });
  }
}

customElements.define('wiki-screen', WikiScreen);
