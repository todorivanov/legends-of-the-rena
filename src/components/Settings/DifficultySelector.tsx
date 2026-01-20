import { useGame } from '../../hooks/useGame';
import { DIFFICULTIES, isDifficultyUnlocked, type DifficultyConfig } from '../../data/difficulty';
import type { DifficultyLevel } from '../../types/game';
import './DifficultySelector.scss';

interface DifficultySelectorProps {
  onSelect?: () => void;
}

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const { state, dispatch } = useGame();
  const { player, settings } = state;

  const handleSelectDifficulty = (difficulty: DifficultyLevel) => {
    if (!isDifficultyUnlocked(difficulty, player.level)) {
      return;
    }

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { difficulty },
    });

    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div className="difficulty-selector">
      <h2>Select Difficulty</h2>
      <p className="difficulty-selector__subtitle">
        Choose your challenge level. Higher difficulties offer greater rewards!
      </p>

      <div className="difficulty-list">
        {Object.values(DIFFICULTIES).map((config: DifficultyConfig) => {
          const unlocked = isDifficultyUnlocked(config.id, player.level);
          const selected = settings.difficulty === config.id;

          return (
            <button
              key={config.id}
              className={`difficulty-card ${selected ? 'selected' : ''} ${
                !unlocked ? 'locked' : ''
              }`}
              style={
                {
                  '--difficulty-color': config.color,
                } as React.CSSProperties
              }
              onClick={() => handleSelectDifficulty(config.id)}
              disabled={!unlocked}
            >
              <div className="difficulty-card__header">
                <span className="difficulty-card__icon">{config.icon}</span>
                <h3 className="difficulty-card__name">{config.name}</h3>
              </div>

              <p className="difficulty-card__description">{config.description}</p>

              <div className="difficulty-card__modifiers">
                <h4>Modifiers:</h4>
                <div className="modifier-grid">
                  <div className="modifier-item">
                    <span className="modifier-label">Your Health:</span>
                    <span
                      className={
                        config.modifiers.playerHealthMultiplier >= 1 ? 'positive' : 'negative'
                      }
                    >
                      {formatMultiplier(config.modifiers.playerHealthMultiplier)}
                    </span>
                  </div>
                  <div className="modifier-item">
                    <span className="modifier-label">Your Damage:</span>
                    <span
                      className={
                        config.modifiers.playerDamageMultiplier >= 1 ? 'positive' : 'negative'
                      }
                    >
                      {formatMultiplier(config.modifiers.playerDamageMultiplier)}
                    </span>
                  </div>
                  <div className="modifier-item">
                    <span className="modifier-label">Enemy Health:</span>
                    <span
                      className={
                        config.modifiers.opponentHealthMultiplier <= 1 ? 'positive' : 'negative'
                      }
                    >
                      {formatMultiplier(config.modifiers.opponentHealthMultiplier)}
                    </span>
                  </div>
                  <div className="modifier-item">
                    <span className="modifier-label">Enemy Damage:</span>
                    <span
                      className={
                        config.modifiers.opponentDamageMultiplier <= 1 ? 'positive' : 'negative'
                      }
                    >
                      {formatMultiplier(config.modifiers.opponentDamageMultiplier)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="difficulty-card__rewards">
                <h4>Rewards:</h4>
                <div className="reward-grid">
                  <div className="reward-item">
                    <span>XP:</span>
                    <span className={config.modifiers.xpMultiplier >= 1 ? 'positive' : 'negative'}>
                      {formatMultiplier(config.modifiers.xpMultiplier)}
                    </span>
                  </div>
                  <div className="reward-item">
                    <span>Gold:</span>
                    <span
                      className={config.modifiers.goldMultiplier >= 1 ? 'positive' : 'negative'}
                    >
                      {formatMultiplier(config.modifiers.goldMultiplier)}
                    </span>
                  </div>
                </div>
              </div>

              {!unlocked && (
                <div className="difficulty-card__lock">
                  🔒 Unlocks at Level {config.requiredLevel}
                </div>
              )}

              {selected && <div className="difficulty-card__selected">✓ Selected</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatMultiplier(value: number): string {
  const percentage = Math.round((value - 1) * 100);
  if (percentage === 0) return '±0%';
  return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
}
