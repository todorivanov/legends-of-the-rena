import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import {
  STORY_REGIONS,
  STORY_MISSIONS,
  getMissionsByRegion,
  isMissionUnlocked,
  isRegionUnlocked,
  type Mission,
  type Region,
} from '../../data/story';
import type { CharacterClass } from '../../types/game';
import './StoryScreen.scss';

export default function StoryScreen() {
  const { state, dispatch } = useGame();
  const { player, story } = state;

  const [selectedRegion, setSelectedRegion] = useState<Region>(STORY_REGIONS[0]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const regionMissions = getMissionsByRegion(selectedRegion.id);

  const handleSelectMission = (mission: Mission) => {
    setSelectedMission(mission);
  };

  const handleStartMission = () => {
    if (!selectedMission) return;

    // Check if mission is unlocked
    if (!isMissionUnlocked(selectedMission.id, story.unlockedMissions)) {
      alert('This mission is not yet unlocked!');
      return;
    }

    // Check level requirement
    if (player.level < selectedMission.requiredLevel) {
      alert(`You need to be level ${selectedMission.requiredLevel} to attempt this mission.`);
      return;
    }

    // Start combat with mission opponent
    dispatch({
      type: 'START_COMBAT',
      payload: {
        opponentName: selectedMission.opponent.name,
        opponentClass: selectedMission.opponent.class as CharacterClass,
        opponentLevel: selectedMission.opponent.level,
      },
    });

    // Store current mission
    dispatch({
      type: 'UPDATE_COMBAT_STATE',
      payload: {
        currentMissionId: selectedMission.id,
      },
    });

    // Navigate to combat
    dispatch({ type: 'CHANGE_SCREEN', payload: 'combat' });
  };

  const handleBack = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'title' });
  };

  const getMissionStars = (missionId: string): number => {
    return story.completedMissions[missionId]?.stars || 0;
  };

  const getTotalStars = (): number => {
    return Object.values(story.completedMissions).reduce(
      (sum, mission) => sum + mission.stars,
      0
    );
  };

  const getCompletedMissionsCount = (): number => {
    return Object.keys(story.completedMissions).length;
  };

  return (
    <div className="story-screen">
      <div className="story-screen__header">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <h1>Story Mode</h1>
        <div className="story-screen__progress">
          <span className="story-screen__missions">
            {getCompletedMissionsCount()}/{STORY_MISSIONS.length} Missions
          </span>
          <span className="story-screen__stars">
            ⭐ {getTotalStars()}/{STORY_MISSIONS.length * 3} Stars
          </span>
        </div>
      </div>

      <div className="story-screen__content">
        {/* Region Selection */}
        <div className="story-screen__regions">
          <h2>Regions</h2>
          <div className="regions-list">
            {STORY_REGIONS.map(region => {
              const unlocked = isRegionUnlocked(region.id, player.level);
              const regionMissions = getMissionsByRegion(region.id);
              const completedCount = regionMissions.filter(m =>
                story.completedMissions[m.id]
              ).length;

              return (
                <button
                  key={region.id}
                  className={`region-card ${
                    selectedRegion.id === region.id ? 'active' : ''
                  } ${!unlocked ? 'locked' : ''}`}
                  onClick={() => unlocked && setSelectedRegion(region)}
                  disabled={!unlocked}
                >
                  <div className="region-card__icon">{region.icon}</div>
                  <div className="region-card__info">
                    <div className="region-card__name">{region.name}</div>
                    <div className="region-card__progress">
                      {completedCount}/{regionMissions.length}
                    </div>
                  </div>
                  {!unlocked && (
                    <div className="region-card__lock">
                      🔒 Level {region.requiredLevel}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mission List */}
        <div className="story-screen__missions">
          <h2>{selectedRegion.name}</h2>
          <p className="region-description">{selectedRegion.description}</p>

          <div className="missions-list">
            {regionMissions.map(mission => {
              const unlocked = isMissionUnlocked(mission.id, story.unlockedMissions);
              const stars = getMissionStars(mission.id);
              const completed = stars > 0;

              return (
                <button
                  key={mission.id}
                  className={`mission-card ${
                    selectedMission?.id === mission.id ? 'selected' : ''
                  } ${!unlocked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
                  onClick={() => unlocked && handleSelectMission(mission)}
                  disabled={!unlocked}
                >
                  <div className="mission-card__header">
                    <div className="mission-card__name">{mission.name}</div>
                    <div className="mission-card__type">{getMissionTypeIcon(mission.type)}</div>
                  </div>

                  <div className="mission-card__info">
                    <span className="mission-card__level">Lv. {mission.requiredLevel}</span>
                    <span className="mission-card__opponent">{mission.opponent.name}</span>
                  </div>

                  <div className="mission-card__stars">
                    {[1, 2, 3].map(starNum => (
                      <span key={starNum} className={starNum <= stars ? 'earned' : ''}>
                        ⭐
                      </span>
                    ))}
                  </div>

                  {!unlocked && <div className="mission-card__lock">🔒 Locked</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mission Details */}
        <div className="story-screen__details">
          {selectedMission ? (
            <div className="mission-details">
              <h2>{selectedMission.name}</h2>

              <div className="mission-details__badges">
                <span className={`badge badge-${selectedMission.type.toLowerCase()}`}>
                  {selectedMission.type}
                </span>
                <span className="badge badge-level">Level {selectedMission.requiredLevel}</span>
                <span className="badge badge-difficulty">
                  Difficulty: {selectedMission.difficulty}/16
                </span>
              </div>

              <p className="mission-details__description">{selectedMission.description}</p>

              <div className="mission-details__opponent">
                <h3>Opponent</h3>
                <div className="opponent-info">
                  <span className="opponent-info__name">{selectedMission.opponent.name}</span>
                  <span className="opponent-info__class">{selectedMission.opponent.class}</span>
                  <span className="opponent-info__level">
                    Level {selectedMission.opponent.level}
                  </span>
                </div>
              </div>

              <div className="mission-details__objectives">
                <h3>Objectives (⭐ Stars)</h3>
                <ul>
                  {selectedMission.objectives.map(obj => (
                    <li key={obj.id}>
                      {obj.description} <span className="stars">({obj.stars}⭐)</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mission-details__rewards">
                <h3>Rewards</h3>
                <div className="rewards-list">
                  <div className="reward-item">
                    <span className="reward-item__icon">✨</span>
                    <span className="reward-item__value">{selectedMission.rewards.xp} XP</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-item__icon">💰</span>
                    <span className="reward-item__value">{selectedMission.rewards.gold} Gold</span>
                  </div>
                  {selectedMission.rewards.equipment && (
                    <div className="reward-item">
                      <span className="reward-item__icon">⚔️</span>
                      <span className="reward-item__value">
                        {formatEquipmentName(selectedMission.rewards.equipment)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={handleStartMission}
                disabled={
                  !isMissionUnlocked(selectedMission.id, story.unlockedMissions) ||
                  player.level < selectedMission.requiredLevel
                }
              >
                Start Mission
              </button>

              {player.level < selectedMission.requiredLevel && (
                <p className="mission-details__warning">
                  ⚠️ You need to be level {selectedMission.requiredLevel} to attempt this mission.
                </p>
              )}
            </div>
          ) : (
            <div className="mission-details mission-details--empty">
              <p>Select a mission to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getMissionTypeIcon(type: string): string {
  switch (type) {
    case 'STANDARD':
      return '⚔️';
    case 'SURVIVAL':
      return '🛡️';
    case 'BOSS':
      return '👑';
    default:
      return '❓';
  }
}

function formatEquipmentName(equipmentId: string): string {
  return equipmentId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
