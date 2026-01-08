# Story Mode Combat Integration

## Overview
Story mode combat is now fully integrated with the existing combat system, allowing players to experience missions with objective tracking, rewards, and progression.

## How It Works

### 1. Mission Flow
1. Player selects a region on the Campaign Map
2. Player selects a mission from the available missions
3. Mission Briefing screen shows objectives and rewards
4. Player clicks "Start Mission"
5. Combat begins with mission tracking
6. After combat, mission results are displayed
7. Player returns to Campaign Map

### 2. Combat Tracking
During story mission combat, the following events are tracked:

- **Rounds Completed**: Total number of combat rounds
- **Damage Dealt**: Total damage dealt by player
- **Damage Taken**: Total damage taken by player
- **Critical Hits**: Number of critical hits landed
- **Skills Used**: Number of skills activated
- **Items Used**: Number of items consumed
- **Healing Used**: Whether healing items were used
- **Defended**: Whether the player used the defend action
- **Max Combo**: Highest combo achieved
- **Max Single Hit**: Highest damage in a single attack

### 3. Objective Evaluation
After winning a mission, objectives are evaluated:

#### Objective Types
- `win`: Complete the mission (always required)
- `no_items`: Win without using items
- `no_healing`: Win without using healing items
- `no_defend`: Win without defending
- `rounds`: Complete within X rounds
- `damage_dealt`: Deal X or more total damage
- `damage_taken`: Take X or less total damage
- `health_percent`: Finish with X% HP or more
- `crits`: Land X or more critical hits
- `combo`: Build a combo of X or higher
- `skills_used`: Use skills X or more times
- `single_hit`: Deal X or more damage in one hit

### 4. Star Ratings
- **1 Star**: Automatically earned for completing the mission
- **2-3 Stars**: Earned by completing bonus objectives (marked with ⭐)
- Stars are tracked per mission and saved
- Better star ratings unlock additional achievements

### 5. Rewards
Rewards are calculated based on:
- Mission difficulty (1-15)
- Stars earned (1-3)

#### Reward Types
- **Gold**: Base reward + star bonus
- **XP**: Base XP + bonus for extra stars
- **Equipment**: Guaranteed equipment drops

Formula:
```javascript
Gold = 50 + (difficulty * 10) + (stars * 20)
XP = baseXP + ((stars - 1) * 50)
```

### 6. Story Progression
After completing a mission:
- Mission is marked as completed
- New missions/regions may unlock based on mission.unlocks
- Story progress is saved automatically

### 7. Durability System
- Equipment durability decreases after each story mission
- This is consistent with regular combat
- Repair equipment at the Marketplace

## Key Files Modified

### `src/game/game.js`
- Added `currentStoryMission` tracking variable
- Modified `startGame()` to accept optional `missionId` parameter
- Added story mode event tracking throughout combat:
  - Round completion
  - Damage dealt/taken
  - Critical hits
  - Skill usage
  - Item usage
  - Defend actions
  - Combo tracking
- Modified victory condition to call `StoryMode.completeMission()`
- Separated story mode rewards from regular combat rewards

### `src/main-new.js`
- Added `startStoryMission(missionId)` function
- Creates player and enemy fighters from mission data
- Launches combat with mission tracking
- Added `showMissionResults(missionResult)` function
- Displays mission completion status, stars, objectives, and rewards
- Returns player to Campaign Map after completion
- Exported `showMissionResults` to window for Game class access

### `src/game/StoryMode.js`
- Already contained complete mission tracking logic
- `startMission()`: Initializes mission tracking
- `trackMissionEvent()`: Records combat events
- `completeMission()`: Evaluates objectives and awards rewards
- `evaluateObjectives()`: Checks which objectives were completed
- `awardMissionRewards()`: Distributes gold, XP, and equipment

### `src/game/EconomyManager.js`
- `calculateStoryReward()`: Calculates gold based on difficulty and stars

## Testing Checklist

### Basic Mission Flow
- [ ] Can start a mission from Campaign Map
- [ ] Mission briefing displays correctly
- [ ] Combat starts with correct fighters
- [ ] Mission tracking works during combat
- [ ] Victory triggers mission completion
- [ ] Results screen shows correct information
- [ ] Returns to Campaign Map after completion

### Objective Tracking
- [ ] Required objectives marked correctly
- [ ] Bonus objectives tracked properly
- [ ] Stars awarded accurately
- [ ] Objectives display in results

### Rewards
- [ ] Gold awarded correctly
- [ ] XP awarded correctly
- [ ] Equipment added to inventory
- [ ] Higher stars = better rewards

### Progression
- [ ] Completed missions marked as done
- [ ] New missions unlock properly
- [ ] New regions unlock when appropriate
- [ ] Progress persists after closing game

### Edge Cases
- [ ] Losing a mission works properly
- [ ] Surrendering during story mission
- [ ] Running out of items during mission
- [ ] Equipment breaking during mission

## Future Enhancements

### Survival Missions (Multi-Wave)
Currently, survival missions only fight the first wave. To fully implement:
1. After defeating first wave enemy, check if there are more waves
2. Create next wave enemy
3. Restore player health partially between waves
4. Continue combat tracking across all waves
5. Complete mission after final wave

### Mission Dialogue
- Display mission.dialogue.before at combat start
- Display mission.dialogue.after at combat end
- Add NPC portraits/avatars

### Cutscenes
- Add story cutscenes between major regions
- Boss introduction cutscenes
- Victory celebration animations

### Difficulty Scaling
- Allow replaying missions on higher difficulties
- Add "Heroic" or "Legendary" difficulty modes
- Better rewards for harder difficulties

### Achievements Integration
- Add story mode-specific achievements
- "Perfect Victory" (3 stars on all missions)
- "Speed Runner" (complete region in X time)
- "Pacifist" (complete mission without attacking)

## Conclusion
Story mode combat is now fully integrated! Players can progress through the campaign, complete objectives, earn rewards, and unlock new content. The system is extensible and ready for future enhancements.
