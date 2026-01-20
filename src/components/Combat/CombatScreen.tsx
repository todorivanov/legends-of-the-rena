import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Progress, Typography, Modal, Tag } from 'antd';
import { 
  SafetyOutlined,
  ThunderboltOutlined,
  MedicineBoxOutlined,
  FireOutlined
} from '@ant-design/icons';
import { useGame } from '../../hooks/useGame';
import { getClassById, calculatePlayerStats } from '../../data/classes';
import { getSkillById } from '../../utils/skills';
import { 
  calculateDamage, 
  applyDamage,
  applyHealing, 
  processStatusEffects, 
  canAct, 
  regenerateMana, 
  spendMana,
  isDefeated,
  generateOpponent,
  calculateRewards
} from '../../services/CombatEngine';
import { applySkillEffects, tickSkillCooldowns } from '../../services/SkillsEngine';
import { getStatusEffectDef } from '../../data/statusEffects';
import { checkForCombo, type ComboAction, type ComboDefinition, type ComboBonus } from '../../data/combos';
import { getMissionById } from '../../data/story';
import { applyDifficultyToFighter } from '../../data/difficulty';
import { AIDecisionEngine, generateRandomPersonality } from '../../ai/AIEngine';
import { 
  createGrid, 
  generateRandomGrid, 
  placeFighters, 
  moveFighter, 
  getMovementRange, 
  getAttackRange, 
  isInRange, 
  findPath, 
  getTerrainModifiers, 
  applyTerrainEffects, 
  getMovementSpeed, 
  getFighterAttackRange,
  type GridState,
  type GridPosition
} from '../../services/GridEngine';
import { GridDisplay } from './GridDisplay';
import type { Fighter, StatusEffect, Skill } from '../../types/game';
import './CombatScreen.scss';

const { Title, Text, Paragraph } = Typography;

export const CombatScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(1);
  const [turnCount, setTurnCount] = useState(0); // Total turns for mission objectives
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [combatLog, setCombatLog] = useState<string[]>(['Battle started!']);
  const [actionHistory, setActionHistory] = useState<ComboAction[]>([]);
  const [activeCombo, setActiveCombo] = useState<ComboDefinition | null>(null);
  const [comboBonus, setComboBonus] = useState<ComboBonus | null>(null);

  // Grid Combat State
  const [grid, setGrid] = useState<GridState>(() => {
    const newGrid = generateRandomGrid(5, 5, 0.15); // 15% terrain complexity
    return placeFighters(newGrid, { x: 0, y: 0 }, { x: 4, y: 4 });
  });
  const [playerGridPos, setPlayerGridPos] = useState<GridPosition>({ x: 0, y: 0 });
  const [opponentGridPos, setOpponentGridPos] = useState<GridPosition>({ x: 4, y: 4 });
  const [movementMode, setMovementMode] = useState(false);
  const [targetingMode, setTargetingMode] = useState(false);
  const [movablePositions, setMovablePositions] = useState<GridPosition[]>([]);
  const [attackablePositions, setAttackablePositions] = useState<GridPosition[]>([]);
  const [selectedPath, setSelectedPath] = useState<GridPosition[]>([]);

  const playerStats = calculatePlayerStats(player);
  const classData = getClassById(player.class);

  // Apply difficulty modifiers to player stats
  const difficultyModifiedStats = applyDifficultyToFighter(
    playerStats.health,
    playerStats.strength,
    state.settings.difficulty,
    true // isPlayer = true
  );

  // Load player's learned skills
  const playerSkills: Skill[] = player.learnedSkills
    .map(skillId => getSkillById(skillId))
    .filter((skill): skill is Skill => skill !== null);

  // Initialize fighters
  const [playerFighter, setPlayerFighter] = useState<Fighter>(() => ({
    name: player.name,
    class: player.class,
    level: player.level,
    maxHealth: difficultyModifiedStats.health,
    currentHealth: difficultyModifiedStats.health,
    maxMana: playerStats.mana,
    currentMana: playerStats.mana,
    currentStrength: difficultyModifiedStats.damage,
    currentDefense: playerStats.defense,
    critChance: playerStats.critChance,
    critDamage: playerStats.critDamage,
    manaRegen: playerStats.manaRegen,
    attackRange: playerStats.attackRange,
    statusEffects: [],
    skills: playerSkills,
    position: { x: 0, y: 0 },
  }));

  const [opponentFighter, setOpponentFighter] = useState<Fighter>(() => 
    generateOpponent(player.level, state.settings.difficulty)
  );

  // Initialize AI engine with personality
  const [aiEngine] = useState(() => {
    const opponent = generateOpponent(player.level, state.settings.difficulty);
    const personality = generateRandomPersonality(opponent.level);
    return new AIDecisionEngine(personality);
  });

  const executeOpponentTurn = () => {
    let updatedOpponent = { ...opponentFighter };
    let updatedPlayer = { ...playerFighter };

    // Process status effects
    const { fighter: opponentAfterEffects, log: opponentLog } = processStatusEffects(updatedOpponent);
    updatedOpponent = opponentAfterEffects;
    opponentLog.forEach(addToLog);

    if (isDefeated(updatedOpponent)) {
      setOpponentFighter(updatedOpponent);
      handleVictory();
      return;
    }

    // Check if opponent can act
    if (!canAct(updatedOpponent)) {
      addToLog(`${updatedOpponent.name} is unable to act!`);
      setOpponentFighter(updatedOpponent);
      endTurn();
      return;
    }

    // AI Decision System
    const aiDecision = aiEngine.makeDecision(
      updatedOpponent,
      updatedPlayer,
      state.settings.difficulty
    );

    if (aiDecision.action === 'attack') {
      // Basic attack
      const { damage, isCritical } = calculateDamage(updatedOpponent, updatedPlayer);
      updatedPlayer = applyDamage(updatedPlayer, damage);
      
      addToLog(
        `${updatedOpponent.name} attacks ${updatedPlayer.name} for ${damage} damage!${isCritical ? ' 💥 CRITICAL HIT!' : ''}`
      );
      aiEngine.updateLastTurnOutcome('hit');
    } else if (aiDecision.action === 'skill' && aiDecision.skillId) {
      // Use skill
      const skill = updatedOpponent.skills.find(s => s.id === aiDecision.skillId);
      if (skill && updatedOpponent.currentMana >= skill.manaCost) {
        updatedOpponent = spendMana(updatedOpponent, skill.manaCost);
        
        const result = applySkillEffects(
          updatedOpponent,
          updatedPlayer,
          skill
        );
        
        updatedOpponent = result.caster;
        updatedPlayer = result.target;
        
        addToLog(`${updatedOpponent.name} uses ${skill.name}!`);
        result.log.forEach(addToLog);
        aiEngine.updateLastTurnOutcome('skill_success');
      } else {
        // Fallback to basic attack if skill unavailable
        const { damage, isCritical } = calculateDamage(updatedOpponent, updatedPlayer);
        updatedPlayer = applyDamage(updatedPlayer, damage);
        addToLog(`${updatedOpponent.name} attacks for ${damage} damage!${isCritical ? ' 💥' : ''}`);
        aiEngine.updateLastTurnOutcome('hit');
      }
    } else if (aiDecision.action === 'defend') {
      // Defend
      addToLog(`${updatedOpponent.name} takes a defensive stance! 🛡️`);
      aiEngine.updateLastTurnOutcome('defended');
    }

    // Regenerate mana
    updatedOpponent = regenerateMana(updatedOpponent);

    setOpponentFighter(updatedOpponent);
    setPlayerFighter(updatedPlayer);
    endTurn();
  };

  // Process turn
  useEffect(() => {
    if (!isPlayerTurn && !isDefeated(playerFighter) && !isDefeated(opponentFighter)) {
      // Opponent's turn with delay
      const timer = setTimeout(() => {
        executeOpponentTurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn]);

  const addToLog = (text: string) => {
    setCombatLog(prev => [...prev, text]);
  };

  const recordAction = (type: 'attack' | 'defend' | 'skill' | 'item', skillId?: string) => {
    const newAction: ComboAction = {
      type,
      skill: skillId,
      timestamp: Date.now(),
    };
    
    const newHistory = [...actionHistory, newAction].slice(-5); // Keep last 5
    setActionHistory(newHistory);
    
    // Check for combo
    const combo = checkForCombo(newHistory, player.class);
    if (combo) {
      setActiveCombo(combo);
      setComboBonus(combo.bonus);
      addToLog(`💫 COMBO: ${combo.name}! ${combo.description}`);
      
      // Clear combo after 2 seconds
      setTimeout(() => {
        setActiveCombo(null);
        setComboBonus(null);
      }, 2000);
    }
  };

  const endTurn = () => {
    // Apply terrain effects (on-stay)
    const playerTerrainResult = applyTerrainEffects(grid, playerGridPos, playerFighter, 'stay');
    const opponentTerrainResult = applyTerrainEffects(grid, opponentGridPos, opponentFighter, 'stay');
    
    if (playerTerrainResult.messages.length > 0) {
      setPlayerFighter(playerTerrainResult.fighter);
      playerTerrainResult.messages.forEach(addToLog);
    }
    
    if (opponentTerrainResult.messages.length > 0) {
      setOpponentFighter(opponentTerrainResult.fighter);
      opponentTerrainResult.messages.forEach(addToLog);
    }

    // Check for victory/defeat after terrain effects
    if (isDefeated(opponentTerrainResult.fighter)) {
      setOpponentFighter(opponentTerrainResult.fighter);
      handleVictory();
      return;
    }
    if (isDefeated(playerTerrainResult.fighter)) {
      setPlayerFighter(playerTerrainResult.fighter);
      handleDefeat();
      return;
    }

    // Switch turns
    if (isPlayerTurn) {
      // Tick cooldowns on player's skills
      setPlayerFighter(prev => tickSkillCooldowns(prev));
      setIsPlayerTurn(false);
      setTurnCount(prev => prev + 1); // Increment turn count for mission tracking
    } else {
      setTurn(prev => prev + 1);
      setRound(Math.ceil((turn + 1) / 2));
      // Tick cooldowns on opponent's skills
      setOpponentFighter(prev => tickSkillCooldowns(prev));
      setIsPlayerTurn(true);
    }
  };

  const handleAttack = () => {
    let updatedPlayer = { ...playerFighter };
    let updatedOpponent = { ...opponentFighter };

    // Process player's status effects
    const { fighter: playerAfterEffects, log: playerLog } = processStatusEffects(updatedPlayer);
    updatedPlayer = playerAfterEffects;
    playerLog.forEach(addToLog);

    if (!canAct(updatedPlayer)) {
      addToLog(`${updatedPlayer.name} is unable to act!`);
      setPlayerFighter(updatedPlayer);
      endTurn();
      return;
    }

    // Calculate and apply damage
    const damageCalc = calculateDamage(updatedPlayer, updatedOpponent);
    let damage = damageCalc.damage;
    const isCritical = damageCalc.isCritical;
    const blocked = damageCalc.blocked;
    
    // Apply terrain modifiers
    const playerTerrainMods = getTerrainModifiers(grid, playerGridPos);
    const opponentTerrainMods = getTerrainModifiers(grid, opponentGridPos);
    damage = Math.floor(damage * (1 + playerTerrainMods.damage) * (1 + opponentTerrainMods.defense));
    
    // Record action for combo tracking
    recordAction('attack');
    
    // Apply combo bonuses
    if (comboBonus) {
      if (comboBonus.damageMultiplier) {
        damage = Math.floor(damage * comboBonus.damageMultiplier);
      }
      if (comboBonus.extraDamage) {
        damage += comboBonus.extraDamage;
      }
      if (comboBonus.heal) {
        updatedPlayer = applyHealing(updatedPlayer, comboBonus.heal);
        addToLog(`${updatedPlayer.name} heals for ${comboBonus.heal} HP! 💚`);
      }
      if (comboBonus.manaRestore) {
        updatedPlayer.currentMana = Math.min(
          updatedPlayer.maxMana,
          updatedPlayer.currentMana + comboBonus.manaRestore
        );
        addToLog(`${updatedPlayer.name} restores ${comboBonus.manaRestore} mana! 💙`);
      }
    }
    
    updatedOpponent = applyDamage(updatedOpponent, damage);
    
    addToLog(
      `${updatedPlayer.name} attacks for ${damage} damage!${isCritical ? ' 💥 CRITICAL HIT!' : ''}${comboBonus ? ' ⚡ COMBO!' : ''} (${blocked} blocked)`
    );

    // Regenerate mana
    updatedPlayer = regenerateMana(updatedPlayer);

    setPlayerFighter(updatedPlayer);
    setOpponentFighter(updatedOpponent);
    endTurn();
  };

  const handleDefend = () => {
    let updatedPlayer = { ...playerFighter };

    // Process status effects
    const { fighter: playerAfterEffects, log: playerLog } = processStatusEffects(updatedPlayer);
    updatedPlayer = playerAfterEffects;
    playerLog.forEach(addToLog);

    if (!canAct(updatedPlayer)) {
      addToLog(`${updatedPlayer.name} is unable to act!`);
      setPlayerFighter(updatedPlayer);
      endTurn();
      return;
    }

    // Boost defense temporarily
    addToLog(`${updatedPlayer.name} takes a defensive stance! Defense increased! 🛡️`);
    
    // Record action for combo tracking
    recordAction('defend');
    
    // Apply combo bonuses
    if (comboBonus) {
      if (comboBonus.heal) {
        updatedPlayer = applyHealing(updatedPlayer, comboBonus.heal);
        addToLog(`${updatedPlayer.name} heals for ${comboBonus.heal} HP! 💚`);
      }
    }

    // Regenerate mana
    updatedPlayer = regenerateMana(updatedPlayer);

    setPlayerFighter(updatedPlayer);
    endTurn();
  };

  const handleUseItem = () => {
    addToLog('Item usage coming soon!');
  };

  const handleUseSkill = (skill: Skill) => {
    let updatedPlayer = { ...playerFighter };
    let updatedOpponent = { ...opponentFighter };

    // Check mana cost
    if (updatedPlayer.currentMana < skill.manaCost) {
      addToLog(`Not enough mana! Need ${skill.manaCost - updatedPlayer.currentMana} more.`);
      return;
    }

    // Check cooldown
    if (skill.cooldownRemaining > 0) {
      addToLog(`${skill.name} is on cooldown! (${skill.cooldownRemaining} turns remaining)`);
      return;
    }

    // Process status effects
    const { fighter: playerAfterEffects, log: playerLog } = processStatusEffects(updatedPlayer);
    updatedPlayer = playerAfterEffects;
    playerLog.forEach(addToLog);

    if (!canAct(updatedPlayer)) {
      addToLog(`${updatedPlayer.name} is unable to act!`);
      setPlayerFighter(updatedPlayer);
      endTurn();
      return;
    }

    // Spend mana
    updatedPlayer = spendMana(updatedPlayer, skill.manaCost);
    addToLog(`${updatedPlayer.name} uses ${skill.name}! (${skill.manaCost} mana) ✨`);
    
    // Record action for combo tracking
    recordAction('skill', skill.id);

    // Apply skill effects
    const { caster, target, log: skillLog } = applySkillEffects(
      updatedPlayer,
      updatedOpponent,
      skill
    );
    updatedPlayer = caster;
    updatedOpponent = target;
    skillLog.forEach(addToLog);

    // Set skill on cooldown
    updatedPlayer = {
      ...updatedPlayer,
      skills: updatedPlayer.skills.map(s =>
        s.id === skill.id ? { ...s, cooldownRemaining: s.cooldown } : s
      ),
    };

    // Regenerate mana
    updatedPlayer = regenerateMana(updatedPlayer);

    setPlayerFighter(updatedPlayer);
    setOpponentFighter(updatedOpponent);
    setSkillModalVisible(false);
    endTurn();
  };

  const handleVictory = () => {
    const rewards = calculateRewards(player.level, opponentFighter.level, true, state.settings.difficulty);
    
    // Check if this was a story mission
    const missionId = state.combat.currentMissionId;
    let missionStars = 0;
    let missionRewards: { xp: number; gold: number; equipment?: string } | null = null;
    
    if (missionId) {
      const mission = getMissionById(missionId);
      
      if (mission) {
        // Calculate stars based on objectives
        missionStars = calculateMissionStars(mission, turnCount, playerFighter);
        missionRewards = mission.rewards;
        
        // Unlock next missions
        if (mission.unlocks) {
          mission.unlocks.forEach((missionToUnlock: string) => {
            dispatch({ type: 'UNLOCK_MISSION', payload: missionToUnlock });
          });
        }
        
        // Complete the mission
        dispatch({
          type: 'COMPLETE_MISSION',
          payload: { missionId, stars: missionStars },
        });
      }
    }
    
    Modal.success({
      title: missionId ? '🎉 Mission Complete!' : '🎉 Victory!',
      content: (
        <div>
          <p>You defeated {opponentFighter.name}!</p>
          {missionId && missionStars > 0 && (
            <p style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>
              {'⭐'.repeat(missionStars)} ({missionStars}/3 Stars)
            </p>
          )}
          <p><strong>Rewards:</strong></p>
          <p>💰 Gold: +{missionRewards?.gold || rewards.gold}</p>
          <p>⭐ XP: +{missionRewards?.xp || rewards.xp}</p>
          {missionRewards?.equipment && (
            <p>⚔️ Equipment: {missionRewards.equipment}</p>
          )}
        </div>
      ),
      onOk: () => {
        dispatch({ type: 'ADD_XP', payload: missionRewards?.xp || rewards.xp });
        dispatch({ type: 'ADD_GOLD', payload: missionRewards?.gold || rewards.gold });
        
        if (missionRewards?.equipment) {
          dispatch({
            type: 'ADD_EQUIPMENT',
            payload: { id: missionRewards.equipment, durability: 100 },
          });
        }
        
        dispatch({ type: 'INCREMENT_STAT', payload: { stat: 'totalWins' } });
        dispatch({ type: 'INCREMENT_STAT', payload: { stat: 'totalFightsPlayed' } });
        dispatch({ type: 'UPDATE_STREAK', payload: { won: true } });
        
        // Return to story screen if this was a mission, otherwise title
        dispatch({ type: 'CHANGE_SCREEN', payload: missionId ? 'story' : 'title' });
      },
    });
  };
  
  // Helper function to calculate mission stars
  const calculateMissionStars = (mission: { objectives: Array<{ id: string; description: string }> }, turns: number, fighter: Fighter): number => {
    let stars = 1; // Always get 1 star for winning
    
    // Check objectives
    for (const objective of mission.objectives) {
      if (objective.id === 'no_items') {
        // Track if items were used (would need to add state tracking)
        stars += 1;
      } else if (objective.id === 'fast_clear') {
        // Extract turn limit from objective description
        const turnMatch = objective.description.match(/(\d+) turns/);
        if (turnMatch && turns <= parseInt(turnMatch[1])) {
          stars += 1;
        }
      } else if (objective.id === 'no_damage') {
        // Extract damage limit from objective description
        const damageMatch = objective.description.match(/(\d+) damage/);
        if (damageMatch) {
          const maxDamage = parseInt(damageMatch[1]);
          const damageTaken = fighter.maxHealth - fighter.currentHealth;
          if (damageTaken <= maxDamage) {
            stars += 1;
          }
        } else if (objective.description.includes('Take no damage')) {
          if (fighter.currentHealth === fighter.maxHealth) {
            stars += 1;
          }
        }
      } else if (objective.id === 'perfect') {
        // All other objectives must be met
        stars += 1;
      }
    }
    
    return Math.min(stars, 3);
  };

  const handleDefeat = () => {
    Modal.error({
      title: '💀 Defeated',
      content: `You were defeated by ${opponentFighter.name}. Better luck next time!`,
      onOk: () => {
        dispatch({ type: 'INCREMENT_STAT', payload: { stat: 'totalLosses' } });
        dispatch({ type: 'INCREMENT_STAT', payload: { stat: 'totalFightsPlayed' } });
        dispatch({ type: 'UPDATE_STREAK', payload: { won: false } });
        dispatch({ type: 'CHANGE_SCREEN', payload: 'title' });
      },
    });
  };

  // Grid Combat Functions
  const handleMoveClick = () => {
    if (!isPlayerTurn) return;
    
    setMovementMode(true);
    setTargetingMode(false);
    const moveSpeed = getMovementSpeed(playerFighter);
    const reachable = getMovementRange(grid, playerGridPos, moveSpeed);
    setMovablePositions(reachable);
    addToLog('Select a cell to move to...');
  };

  const handleTargetClick = () => {
    if (!isPlayerTurn) return;
    
    setTargetingMode(true);
    setMovementMode(false);
    const range = getFighterAttackRange(playerFighter);
    const targets = getAttackRange(grid, playerGridPos, range);
    setAttackablePositions(targets);
    addToLog('Select a target to attack...');
  };

  const handleGridCellClick = (pos: GridPosition) => {
    if (!isPlayerTurn) return;

    // Movement mode
    if (movementMode) {
      const isValidMove = movablePositions.some(p => p.x === pos.x && p.y === pos.y);
      if (isValidMove) {
        const moveSpeed = getMovementSpeed(playerFighter);
        const path = findPath(grid, playerGridPos, pos, moveSpeed);
        
        if (path) {
          // Execute movement
          const newGrid = moveFighter(grid, playerGridPos, pos, 'player');
          setGrid(newGrid);
          setPlayerGridPos(pos);
          
          // Update fighter position
          setPlayerFighter(prev => ({ ...prev, position: pos }));
          
          // Apply terrain effects
          const { fighter: updatedFighter, messages } = applyTerrainEffects(grid, pos, playerFighter, 'enter');
          if (updatedFighter.currentHealth !== playerFighter.currentHealth || 
              updatedFighter.currentMana !== playerFighter.currentMana) {
            setPlayerFighter(updatedFighter);
          }
          messages.forEach(addToLog);
          
          addToLog(`${playerFighter.name} moved to (${pos.x}, ${pos.y})`);
          setMovementMode(false);
          setMovablePositions([]);
          setSelectedPath([]);
        }
      }
    }

    // Targeting mode
    if (targetingMode) {
      const isValidTarget = attackablePositions.some(p => p.x === pos.x && p.y === pos.y);
      const isOpponent = pos.x === opponentGridPos.x && pos.y === opponentGridPos.y;
      
      if (isValidTarget && isOpponent) {
        setTargetingMode(false);
        setAttackablePositions([]);
        handleAttack(); // Use existing attack logic
      }
    }

    // Show path preview in movement mode
    if (movementMode) {
      const moveSpeed = getMovementSpeed(playerFighter);
      const path = findPath(grid, playerGridPos, pos, moveSpeed);
      if (path) {
        setSelectedPath(path);
      }
    }
  };

  const handleFlee = () => {
    Modal.confirm({
      title: 'Flee from Battle?',
      content: 'Are you sure you want to flee? You will lose any progress in this battle.',
      okText: 'Flee',
      okType: 'danger',
      cancelText: 'Stay',
      onOk: () => {
        dispatch({ type: 'CHANGE_SCREEN', payload: 'title' });
      },
    });
  };

  return (
    <div className="combat-screen">
      <div className="combat-screen__header">
        <Button 
          onClick={handleFlee}
          danger
          className="combat-screen__back"
        >
          Flee Battle
        </Button>
        <div className="combat-screen__round">
          <Text className="combat-screen__round-text">
            Round {round} • Turn {turn} {isPlayerTurn ? '(Your Turn)' : '(Opponent Turn)'}
          </Text>
        </div>
      </div>

      <div className="combat-screen__arena">
        {/* Combo Banner */}
        {activeCombo && (
          <div className="combo-banner">
            <div className="combo-banner__content">
              <div className="combo-banner__icon">{activeCombo.icon}</div>
              <div className="combo-banner__text">
                <Title level={3} className="combo-banner__name">
                  {activeCombo.name}
                </Title>
                <Text className="combo-banner__description">
                  {activeCombo.description}
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Grid Combat Display */}
        <GridDisplay
          grid={grid}
          playerPos={playerGridPos}
          opponentPos={opponentGridPos}
          movablePositions={movementMode ? movablePositions : []}
          attackablePositions={targetingMode ? attackablePositions : []}
          selectedPath={selectedPath}
          onCellClick={handleGridCellClick}
          showMovement={movementMode}
          showAttackRange={targetingMode}
        />
        
        <Row gutter={[24, 24]} className="combat-screen__fighters">{/* Player Fighter */}
          <Col xs={24} md={12}>
            <Card className="fighter-card fighter-card--player">
              <div className="fighter-card__header">
                <div className="fighter-card__icon">{classData?.icon || '⚔️'}</div>
                <div className="fighter-card__info">
                  <Title level={4} className="fighter-card__name">
                    {playerFighter.name}
                  </Title>
                  <Text className="fighter-card__details">
                    Level {playerFighter.level} {classData?.name}
                  </Text>
                </div>
              </div>

              <div className="fighter-card__stats">
                <div className="stat-bar">
                  <div className="stat-bar__label">
                    <Text>Health</Text>
                    <Text strong>
                      {playerFighter.currentHealth} / {playerFighter.maxHealth}
                    </Text>
                  </div>
                  <Progress 
                    percent={(playerFighter.currentHealth / playerFighter.maxHealth) * 100}
                    strokeColor="#52c41a"
                    showInfo={false}
                  />
                </div>

                <div className="stat-bar">
                  <div className="stat-bar__label">
                    <Text>Mana</Text>
                    <Text strong>
                      {playerFighter.currentMana} / {playerFighter.maxMana}
                    </Text>
                  </div>
                  <Progress 
                    percent={(playerFighter.currentMana / playerFighter.maxMana) * 100}
                    strokeColor="#1890ff"
                    showInfo={false}
                  />
                </div>
              </div>

              {playerFighter.statusEffects.length > 0 && (
                <div className="fighter-card__effects">
                  {playerFighter.statusEffects.map((effect: StatusEffect, idx: number) => {
                    const effectDef = getStatusEffectDef(effect.type);
                    return (
                      <Tag key={idx} color={effectDef?.color}>
                        {effectDef?.icon} {effectDef?.name} ({effect.duration})
                      </Tag>
                    );
                  })}
                </div>
              )}
            </Card>
          </Col>

          {/* Opponent Fighter */}
          <Col xs={24} md={12}>
            <Card className="fighter-card fighter-card--opponent">
              <div className="fighter-card__header">
                <div className="fighter-card__icon">🎯</div>
                <div className="fighter-card__info">
                  <Title level={4} className="fighter-card__name">
                    {opponentFighter.name}
                  </Title>
                  <Text className="fighter-card__details">
                    Level {opponentFighter.level} • {aiEngine.getPersonality().name}
                  </Text>
                </div>
              </div>

              <div className="fighter-card__stats">
                <div className="stat-bar">
                  <div className="stat-bar__label">
                    <Text>Health</Text>
                    <Text strong>
                      {opponentFighter.currentHealth} / {opponentFighter.maxHealth}
                    </Text>
                  </div>
                  <Progress 
                    percent={(opponentFighter.currentHealth / opponentFighter.maxHealth) * 100}
                    strokeColor="#f5222d"
                    showInfo={false}
                  />
                </div>

                <div className="stat-bar">
                  <div className="stat-bar__label">
                    <Text>Mana</Text>
                    <Text strong>
                      {opponentFighter.currentMana} / {opponentFighter.maxMana}
                    </Text>
                  </div>
                  <Progress 
                    percent={(opponentFighter.currentMana / opponentFighter.maxMana) * 100}
                    strokeColor="#722ed1"
                    showInfo={false}
                  />
                </div>
              </div>

              {opponentFighter.statusEffects.length > 0 && (
                <div className="fighter-card__effects">
                  {opponentFighter.statusEffects.map((effect: StatusEffect, idx: number) => {
                    const effectDef = getStatusEffectDef(effect.type);
                    return (
                      <Tag key={idx} color={effectDef?.color}>
                        {effectDef?.icon} {effectDef?.name} ({effect.duration})
                      </Tag>
                    );
                  })}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Combat Actions */}
        <Card className="combat-actions" title="Actions">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Button
                size="large"
                icon={<span>🏃</span>}
                onClick={handleMoveClick}
                disabled={!isPlayerTurn || isDefeated(playerFighter) || isDefeated(opponentFighter) || movementMode}
                block
                className="action-button action-button--move"
                type={movementMode ? 'primary' : 'default'}
              >
                Move
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button
                type="primary"
                size="large"
                icon={<FireOutlined />}
                onClick={handleAttack}
                disabled={!isPlayerTurn || isDefeated(playerFighter) || isDefeated(opponentFighter) || !isInRange(playerGridPos, opponentGridPos, getFighterAttackRange(playerFighter))}
                block
                className="action-button action-button--attack"
              >
                Attack
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button
                size="large"
                icon={<SafetyOutlined />}
                onClick={handleDefend}
                disabled={!isPlayerTurn || isDefeated(playerFighter) || isDefeated(opponentFighter)}
                block
                className="action-button action-button--defend"
              >
                Defend
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button
                size="large"
                icon={<ThunderboltOutlined />}
                onClick={() => setSkillModalVisible(true)}
                disabled={!isPlayerTurn || isDefeated(playerFighter) || isDefeated(opponentFighter)}
                block
                className="action-button action-button--skill"
              >
                Skills
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button
                size="large"
                icon={<MedicineBoxOutlined />}
                onClick={handleUseItem}
                disabled={!isPlayerTurn || isDefeated(playerFighter) || isDefeated(opponentFighter)}
                block
                className="action-button action-button--item"
              >
                Items
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Combat Log */}
        <Card className="combat-log" title="Combat Log">
          <div className="combat-log__content">
            {combatLog.slice(-10).reverse().map((log, idx) => (
              <div key={idx} className="combat-log__entry">
                <Text>{log}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skills Modal */}
      <Modal
        title={`${playerFighter.name}'s Skills`}
        open={skillModalVisible}
        onCancel={() => setSkillModalVisible(false)}
        footer={null}
        width={600}
      >
        {playerFighter.skills.length === 0 ? (
          <Paragraph>No skills learned yet!</Paragraph>
        ) : (
          <Row gutter={[16, 16]}>
            {playerFighter.skills.map((skill) => {
              const canUse = 
                playerFighter.currentMana >= skill.manaCost && 
                skill.cooldownRemaining === 0;
              const onCooldown = skill.cooldownRemaining > 0;
              const notEnoughMana = playerFighter.currentMana < skill.manaCost;

              return (
                <Col xs={24} key={skill.id}>
                  <Card
                    hoverable={canUse}
                    style={{ 
                      opacity: canUse ? 1 : 0.6,
                      borderColor: canUse ? '#1890ff' : '#d9d9d9'
                    }}
                  >
                    <Row gutter={16} align="middle">
                      <Col flex="none">
                        <div style={{ fontSize: 32 }}>{skill.icon}</div>
                      </Col>
                      <Col flex="auto">
                        <div>
                          <Text strong style={{ fontSize: 16 }}>
                            {skill.name}
                          </Text>
                          {onCooldown && (
                            <Tag color="orange" style={{ marginLeft: 8 }}>
                              Cooldown: {skill.cooldownRemaining}
                            </Tag>
                          )}
                          {notEnoughMana && !onCooldown && (
                            <Tag color="red" style={{ marginLeft: 8 }}>
                              Need {skill.manaCost - playerFighter.currentMana} mana
                            </Tag>
                          )}
                        </div>
                        <Paragraph style={{ margin: '8px 0', fontSize: 13 }}>
                          {skill.description}
                        </Paragraph>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                          <Text type="secondary">
                            💧 Mana: {skill.manaCost}
                          </Text>
                          <Text type="secondary">
                            ⏱️ Cooldown: {skill.cooldown} turns
                          </Text>
                          <Text type="secondary">
                            📁 Type: {skill.type}
                          </Text>
                        </div>
                      </Col>
                      <Col flex="none">
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => handleUseSkill(skill)}
                          disabled={!canUse}
                          style={{ minWidth: 80 }}
                        >
                          Use
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Modal>
    </div>
  );
};
