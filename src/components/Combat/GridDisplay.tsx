import React from 'react';
import type { GridState, GridPosition, TerrainType } from '../../services/GridEngine';
import { TERRAIN_DEFS } from '../../services/GridEngine';
import './GridDisplay.scss';

interface GridDisplayProps {
  grid: GridState;
  playerPos: GridPosition;
  opponentPos: GridPosition;
  movablePositions?: GridPosition[];
  attackablePositions?: GridPosition[];
  selectedPath?: GridPosition[];
  onCellClick?: (pos: GridPosition) => void;
  showMovement?: boolean;
  showAttackRange?: boolean;
}

export const GridDisplay: React.FC<GridDisplayProps> = ({
  grid,
  playerPos,
  opponentPos,
  movablePositions = [],
  attackablePositions = [],
  selectedPath = [],
  onCellClick,
  showMovement = false,
  showAttackRange = false,
}) => {
  const isMovable = (x: number, y: number): boolean => {
    return movablePositions.some(pos => pos.x === x && pos.y === y);
  };

  const isAttackable = (x: number, y: number): boolean => {
    return attackablePositions.some(pos => pos.x === x && pos.y === y);
  };

  const isInPath = (x: number, y: number): boolean => {
    return selectedPath.some(pos => pos.x === x && pos.y === y);
  };

  const getTerrainEmoji = (terrain: TerrainType): string => {
    const emojiMap: Record<TerrainType, string> = {
      normal: '⬜',
      high_ground: '⛰️',
      forest: '🌲',
      water: '💧',
      wall: '🧱',
      lava: '🔥',
      ice: '❄️',
      trap: '⚠️',
      healing_shrine: '💚',
      mana_well: '💙',
    };
    return emojiMap[terrain] || '⬜';
  };

  const handleCellClick = (x: number, y: number) => {
    if (onCellClick) {
      onCellClick({ x, y });
    }
  };

  return (
    <div className="grid-display">
      <div className="grid-container" style={{ 
        gridTemplateColumns: `repeat(${grid.width}, 1fr)`,
        gridTemplateRows: `repeat(${grid.height}, 1fr)`,
      }}>
        {grid.cells.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            const isOpponent = opponentPos.x === x && opponentPos.y === y;
            const canMove = showMovement && isMovable(x, y);
            const canAttack = showAttackRange && isAttackable(x, y);
            const inPath = isInPath(x, y);
            const terrain = TERRAIN_DEFS[cell.terrain];

            return (
              <div
                key={`${x}-${y}`}
                className={`grid-cell ${cell.terrain} ${
                  isPlayer ? 'player-occupied' : ''
                } ${isOpponent ? 'opponent-occupied' : ''} ${
                  canMove ? 'movable' : ''
                } ${canAttack ? 'attackable' : ''} ${
                  inPath ? 'in-path' : ''
                } ${!terrain.walkable ? 'unwalkable' : ''}`}
                onClick={() => handleCellClick(x, y)}
                title={terrain.name}
              >
                <div className="grid-cell__terrain">
                  {getTerrainEmoji(cell.terrain)}
                </div>
                
                {isPlayer && (
                  <div className="grid-cell__occupant player">
                    🛡️
                  </div>
                )}
                
                {isOpponent && (
                  <div className="grid-cell__occupant opponent">
                    ⚔️
                  </div>
                )}

                {canMove && !isPlayer && !isOpponent && (
                  <div className="grid-cell__indicator move">
                    <span>→</span>
                  </div>
                )}

                {canAttack && isOpponent && (
                  <div className="grid-cell__indicator attack">
                    <span>🎯</span>
                  </div>
                )}

                {inPath && !isPlayer && (
                  <div className="grid-cell__path-marker" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="grid-legend">
        <div className="legend-title">Terrain Guide:</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon">⛰️</span>
            <span className="legend-text">High Ground: +20% def, +25% dmg</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🌲</span>
            <span className="legend-text">Forest: +30% def, -10% dmg</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">💧</span>
            <span className="legend-text">Water: Slow, -15% def</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🔥</span>
            <span className="legend-text">Lava: 50 dmg/turn</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">💚</span>
            <span className="legend-text">Shrine: +50 HP/turn</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">💙</span>
            <span className="legend-text">Well: +20 mana/turn</span>
          </div>
        </div>
      </div>
    </div>
  );
};
