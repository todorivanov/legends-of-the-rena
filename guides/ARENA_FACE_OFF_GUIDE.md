# Arena Face-Off: Single Fight UI Feature Guide

## 🎯 Overview

The **Arena Face-Off** feature is a dramatic pre-battle screen that appears after selecting an opponent in Single Combat mode. It replaces the previous direct transition to combat with an immersive "Versus Lobby" experience, featuring:

- **Split-screen layout** with player vs opponent
- **Live stat comparison bars** with animations
- **Difficulty rating system** based on power levels
- **Glassmorphism design** with modern UI aesthetics
- **Quick action buttons** for entering arena or editing loadout

## 🎮 User Flow

### Previous Flow
```
Title Screen → Opponent Selection → Combat Arena
```

### New Flow
```
Title Screen → Opponent Selection → Face-Off Screen → Combat Arena
                                         ↓
                                   Edit Loadout (Optional)
```

## 🏗️ Architecture

### Component Structure

**File:** `src/components/FaceOffComponent.js`
- Extends `BaseComponent`
- Web Component: `<face-off-component>`
- Props: `player`, `opponent`
- Events: `start-battle`, `edit-loadout`, `back`

**Styles:** `src/styles/components/FaceOffComponent.scss`
- Glassmorphism design pattern
- CSS animations for stat bars and glows
- Responsive layout (desktop, tablet, mobile)

### Integration Points

1. **Main Application** (`src/main-new.js`)
   - `showOpponentSelection()` - Modified to show face-off after selection
   - `showFaceOffScreen(player, opponent)` - New function to display face-off
   
2. **Component Registration** (`src/components/index.js`)
   - Exports `FaceOffComponent` for auto-registration

## 📊 Key Features

### 1. Difficulty Rating System

The difficulty is calculated dynamically based on power level comparison:

```javascript
const playerPower = player.health + player.strength * 10;
const opponentPower = opponent.health + opponent.strength * 10;
const delta = (opponentPower - playerPower) / playerPower;
```

**Difficulty Tiers:**
- **Easy Victory** (delta < -0.3) - Green 😎
- **Favorable** (delta < -0.1) - Light Green 💪
- **Fair Fight** (delta < 0.1) - Yellow ⚔️
- **Challenging** (delta < 0.3) - Orange 🔥
- **Dangerous** (delta < 0.5) - Red ⚠️
- **Lethal** (delta ≥ 0.5) - Dark Red 💀

### 2. Stat Comparison Bars

Four key stats are compared side-by-side:
- **❤️ Health (HP)** - Red gradient bars
- **⚔️ Attack (STR)** - Orange gradient bars
- **⚡ Speed** - Blue gradient bars
- **📏 Range** - Purple gradient bars

**Animation:** Bars animate from 0% to their final value over 1.5 seconds using cubic-bezier easing.

### 3. Visual Design

**Player Section (Left):**
- Blue glow effect
- Fighter image with float animation
- Glass panel with fighter info

**Opponent Section (Right):**
- Red/orange glow effect
- Fighter image with float animation
- Glass panel with fighter info

**Center Section:**
- Rotating VS logo with dual-colored glow
- Difficulty badge
- Stat comparison panel
- Action buttons

### 4. Interactive Elements

**Three Main Buttons:**

1. **Enter Arena** (Primary)
   - Large, pulsing red gradient button
   - Emits `start-battle` event
   - Proceeds to combat

2. **Edit Loadout** (Secondary)
   - Smaller, glassmorphism button
   - Emits `edit-loadout` event
   - Opens equipment screen

3. **Back** (Navigation)
   - Top-left corner button
   - Emits `back` event
   - Returns to opponent selection

## 🎨 Design System

### Glassmorphism Effects

```scss
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Animation Library

- `fadeIn` - General entrance
- `fadeInScale` - Scale up entrance
- `fadeInUp` - Slide up entrance
- `slideInLeft` / `slideInRight` - Fighter sections
- `pulse` - Glow effects
- `floatAnimation` - Fighter images
- `fillBar` - Stat bar filling
- `shimmer` - Stat bar shine effect
- `rotateGlow` - VS logo rotation

## 🔧 Usage

### Creating a Face-Off Screen

```javascript
const faceOff = document.createElement('face-off-component');
faceOff.player = playerFighterObject;
faceOff.opponent = opponentFighterObject;

faceOff.addEventListener('start-battle', (e) => {
  startBattle([e.detail.player, e.detail.opponent]);
});

faceOff.addEventListener('edit-loadout', () => {
  navigateToEquipment();
});

faceOff.addEventListener('back', () => {
  returnToOpponentSelection();
});

document.getElementById('root').appendChild(faceOff);
```

### Fighter Data Requirements

Both player and opponent objects should have:
- `name` (string)
- `image` (string URL)
- `health` (number)
- `strength` (number)
- `class` (string)
- `speed` (number, optional - defaults to 50)
- `equipment` (object, optional)
- `getAttackRange()` (method, optional)

## 🧪 Testing

### E2E Tests

Located in `tests/e2e/combat.spec.js`:

1. **Navigation Test:** Verifies face-off screen appears after opponent selection
2. **Component Test:** Checks all required elements (buttons, stats, VS logo)
3. **Back Navigation Test:** Ensures back button returns to opponent selection
4. **Combat Flow Test:** Full flow from title screen through face-off to combat

### Running Tests

```bash
npm run test:e2e
```

## 📱 Responsive Design

### Desktop (1600px+)
- 3-column grid layout
- Large fighter images (350px)
- Full stat comparison panel

### Tablet (1200px - 1600px)
- Narrower 3-column grid
- Medium fighter images (280px)
- Compact panels

### Mobile (< 1200px)
- Single column layout
- Horizontal fighter cards
- Smaller images (150px - 200px)
- Stacked action buttons

## 🎯 Game Balance Impact

### Strategic Benefits

1. **Information Advantage:** Players can see exact stat comparisons before committing
2. **Preparation Time:** Edit loadout option prevents "impossible" fights
3. **Risk Assessment:** Clear difficulty ratings help decision-making
4. **No Direct Combat Impact:** Mathematical balance unchanged

### Player Psychology

- **Builds Anticipation:** Dramatic presentation increases engagement
- **Reduces Frustration:** Clear warnings for difficult fights
- **Empowers Players:** Full information leads to better strategic choices

## 🚀 Future Enhancements

Potential improvements for future versions:

1. **Fighter Abilities Preview:** Show special skills/passives
2. **Win/Loss Predictions:** AI-powered outcome probability
3. **Historical Data:** Show previous match records
4. **Trash Talk System:** Dynamic pre-fight dialogue
5. **Arena Selection:** Choose combat environment
6. **Betting System:** Wager currency on the outcome
7. **Spectator Mode:** Share face-off screen with friends
8. **Custom Taunts:** Player-selected pre-battle emotes

## 📚 Related Documentation

- [Combat System Guide](./guides/COMBAT_PHASES.md)
- [Equipment System](./guides/EQUIPMENT_SYSTEM_GUIDE.md)
- [Difficulty System](./guides/DIFFICULTY_SYSTEM_GUIDE.md)
- [UI/UX Standards](./docs/STATE_MANAGEMENT.md)

## 🐛 Known Issues

None at initial release (v4.x)

## 📝 Version History

- **v4.x** - Initial implementation of Arena Face-Off feature
  - Split-screen layout
  - Stat comparison bars
  - Difficulty rating system
  - Glassmorphism design
  - Full responsive support

## 👥 Credits

**Feature Request:** GitHub Issue #[NUMBER]
**Design:** Community-driven spec
**Implementation:** Development Team
**Testing:** QA Team

---

## Quick Reference

### Component Props
```typescript
interface FaceOffComponentProps {
  player: Fighter;
  opponent: Fighter;
}
```

### Events
```typescript
interface FaceOffEvents {
  'start-battle': { player: Fighter, opponent: Fighter }
  'edit-loadout': void
  'back': void
}
```

### Class Names (for testing)
- `.face-off-container` - Main container
- `.player-section` - Left fighter section
- `.opponent-section` - Right fighter section
- `.vs-logo` - Center VS display
- `.stats-comparison` - Stat comparison panel
- `.difficulty-badge` - Difficulty indicator
- `#enter-arena-btn` - Primary action button
- `#edit-loadout-btn` - Secondary action button
- `#back-btn` - Back navigation button
