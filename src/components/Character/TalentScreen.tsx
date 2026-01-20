import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { getTalentTreesForClass, canLearnTalent, getPointsInTree } from '../../data/talents';
import type { TalentTree, TalentNode } from '../../data/talents';
import './TalentScreen.scss';

export default function TalentScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;

  const trees = getTalentTreesForClass(player.class);
  const [selectedTree, setSelectedTree] = useState<TalentTree>(trees[0]);

  const learnedTalents = player.learnedTalents || {};
  const availablePoints = player.talentPoints || 0;
  const pointsInTree = getPointsInTree(selectedTree.id, learnedTalents);

  const handleLearnTalent = (talent: TalentNode) => {
    const currentRank = learnedTalents[talent.id] || 0;
    const check = canLearnTalent(talent, selectedTree.id, currentRank, learnedTalents, availablePoints);

    if (check.canLearn) {
      dispatch({
        type: 'LEARN_TALENT',
        payload: talent.id,
      });
    }
  };

  const handleResetTree = () => {
    if (window.confirm(`Reset ${selectedTree.name} tree? This will cost 100 gold.`)) {
      dispatch({
        type: 'RESET_TALENT_TREE',
        payload: selectedTree.id,
      });
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all talents? This will cost 500 gold.')) {
      dispatch({ type: 'RESET_ALL_TALENTS' });
    }
  };

  return (
    <div className="talent-screen">
      <div className="talent-screen__header">
        <h1>Talents</h1>
        <div className="talent-screen__points">
          <span className="talent-screen__points-available">
            {availablePoints} Points Available
          </span>
          <span className="talent-screen__points-spent">
            {pointsInTree} Points in {selectedTree.name}
          </span>
        </div>
      </div>

      <div className="talent-screen__trees">
        {trees.map(tree => (
          <button
            key={tree.id}
            className={`talent-screen__tree-button ${
              selectedTree.id === tree.id ? 'active' : ''
            }`}
            onClick={() => setSelectedTree(tree)}
          >
            <span className="talent-screen__tree-icon">{tree.icon}</span>
            <span className="talent-screen__tree-name">{tree.name}</span>
            <span className="talent-screen__tree-points">
              {getPointsInTree(tree.id, learnedTalents)}
            </span>
          </button>
        ))}
      </div>

      <div className="talent-screen__tree-info">
        <h2>
          {selectedTree.icon} {selectedTree.name}
        </h2>
        <p>{selectedTree.description}</p>
      </div>

      <div className="talent-screen__grid">
        {[...Array(4)].map((_, row) => (
          <div key={row} className="talent-screen__row">
            {selectedTree.talents
              .filter(t => t.row === row)
              .map(talent => (
                <TalentNodeComponent
                  key={talent.id}
                  talent={talent}
                  treeId={selectedTree.id}
                  currentRank={learnedTalents[talent.id] || 0}
                  learnedTalents={learnedTalents}
                  availablePoints={availablePoints}
                  onLearn={handleLearnTalent}
                />
              ))}
          </div>
        ))}
      </div>

      <div className="talent-screen__actions">
        <button className="btn btn-warning" onClick={handleResetTree}>
          Reset {selectedTree.name} (100g)
        </button>
        <button className="btn btn-danger" onClick={handleResetAll}>
          Reset All Talents (500g)
        </button>
      </div>
    </div>
  );
}

interface TalentNodeComponentProps {
  talent: TalentNode;
  treeId: string;
  currentRank: number;
  learnedTalents: Record<string, number>;
  availablePoints: number;
  onLearn: (talent: TalentNode) => void;
}

function TalentNodeComponent({
  talent,
  treeId,
  currentRank,
  learnedTalents,
  availablePoints,
  onLearn,
}: TalentNodeComponentProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const check = canLearnTalent(talent, treeId, currentRank, learnedTalents, availablePoints);

  const isMaxed = currentRank >= talent.maxRank;
  const hasRank = currentRank > 0;
  const canLearn = check.canLearn;

  let nodeClass = 'talent-node';
  if (isMaxed) nodeClass += ' talent-node--maxed';
  else if (hasRank) nodeClass += ' talent-node--learned';
  else if (canLearn) nodeClass += ' talent-node--available';

  return (
    <div
      className={nodeClass}
      style={{ gridColumn: talent.column + 1 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => !isMaxed && canLearn && onLearn(talent)}
    >
      <div className="talent-node__icon">{talent.icon}</div>
      <div className="talent-node__rank">
        {currentRank}/{talent.maxRank}
      </div>

      {showTooltip && (
        <div className="talent-tooltip">
          <div className="talent-tooltip__header">
            <strong>{talent.name}</strong>
            <span>
              Rank {currentRank}/{talent.maxRank}
            </span>
          </div>
          <div className="talent-tooltip__description">{talent.description}</div>

          {talent.effects.stats && (
            <div className="talent-tooltip__effects">
              {Object.entries(talent.effects.stats).map(([stat, value]) => (
                <div key={stat} className="talent-tooltip__stat">
                  +{value * (currentRank || 1)} {formatStatName(stat)}
                </div>
              ))}
            </div>
          )}

          {talent.effects.passive && (
            <div className="talent-tooltip__passive">
              Passive: {talent.effects.passive.type}
            </div>
          )}

          {talent.requires.length > 0 && (
            <div className="talent-tooltip__requires">
              Requires: Previous talents
            </div>
          )}

          {talent.requiresPoints > 0 && (
            <div className="talent-tooltip__requires">
              Requires: {talent.requiresPoints} points in tree
            </div>
          )}

          {!check.canLearn && check.reason && (
            <div className="talent-tooltip__warning">{check.reason}</div>
          )}
        </div>
      )}
    </div>
  );
}

function formatStatName(stat: string): string {
  const names: Record<string, string> = {
    strength: 'Strength',
    health: 'HP',
    defense: 'Defense',
    critChance: 'Crit %',
    critDamage: 'Crit Dmg',
    manaRegen: 'Mana Regen',
  };
  return names[stat] || stat;
}
