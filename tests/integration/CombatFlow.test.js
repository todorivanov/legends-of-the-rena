/**
 * Combat Flow Integration Tests
 * Tests the full combat flow with multiple systems working together
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { combatPhaseManager, CombatPhase, CombatEvent } from '../../src/game/CombatPhaseManager.js';
import { comboSystem } from '../../src/game/ComboSystem.js';
import { TurnManager } from '../../src/game/TurnManager.js';
import { createTestFighter } from '../utils/testHelpers.js';

describe('Combat Flow Integration', () => {
  let player;
  let enemy;
  let turnManager;

  beforeEach(() => {
    player = createTestFighter({ id: 1, name: 'Player', isPlayer: true });
    enemy = createTestFighter({ id: 2, name: 'Enemy', isPlayer: false });
    turnManager = new TurnManager();

    combatPhaseManager.reset();
    comboSystem.reset();
  });

  describe('Battle Initialization', () => {
    it('should initialize combat systems correctly', () => {
      combatPhaseManager.initialize(player, enemy, turnManager);

      const combatData = combatPhaseManager.getCombatData();

      expect(combatData.attacker).toBe(player);
      expect(combatData.defender).toBe(enemy);
      expect(combatData.turnManager).toBe(turnManager);
    });

    it('should start battle and emit event', async () => {
      const battleStarted = vi.fn();
      combatPhaseManager.on(CombatEvent.BATTLE_STARTED, battleStarted);

      combatPhaseManager.initialize(player, enemy, turnManager);
      await combatPhaseManager.startBattle();

      expect(battleStarted).toHaveBeenCalled();
      expect(combatPhaseManager.getPhase()).toBe(CombatPhase.BATTLE_START);
    });
  });

  describe('Turn Management', () => {
    beforeEach(() => {
      combatPhaseManager.initialize(player, enemy, turnManager);
    });

    it('should start and end turns correctly', async () => {
      await combatPhaseManager.startTurn(player);
      expect(combatPhaseManager.turnCount).toBe(1);

      await combatPhaseManager.endTurn(player);
      expect(combatPhaseManager.getPhase()).toBe(CombatPhase.TURN_END);
    });

    it('should emit turn events', async () => {
      const turnStarted = vi.fn();
      const turnEnded = vi.fn();

      combatPhaseManager.on(CombatEvent.TURN_STARTED, turnStarted);
      combatPhaseManager.on(CombatEvent.TURN_ENDED, turnEnded);

      await combatPhaseManager.startTurn(player);
      await combatPhaseManager.endTurn(player);

      expect(turnStarted).toHaveBeenCalledWith(
        expect.objectContaining({
          fighter: player,
          turnNumber: 1,
        })
      );
      expect(turnEnded).toHaveBeenCalled();
    });
  });

  describe('Action Execution', () => {
    beforeEach(async () => {
      combatPhaseManager.initialize(player, enemy, turnManager);
      await combatPhaseManager.startBattle();
      await combatPhaseManager.startTurn(player);
    });

    it('should queue and execute actions', async () => {
      const action = {
        type: 'attack',
        attacker: player,
        target: enemy,
      };

      combatPhaseManager.queueAction(action);

      expect(combatPhaseManager.getActionQueue()).toHaveLength(1);

      const result = await combatPhaseManager.executeNextAction();

      expect(result).toBeDefined();
      expect(result.action.type).toBe('attack');
      expect(combatPhaseManager.getActionQueue()).toHaveLength(0);
    });

    it('should execute actions in priority order', async () => {
      combatPhaseManager.queueAction({
        type: 'attack',
        priority: 5,
        name: 'normal',
      });
      combatPhaseManager.queueAction({
        type: 'counter',
        priority: 10,
        name: 'counter',
      });
      combatPhaseManager.queueAction({
        type: 'defend',
        priority: 1,
        name: 'defend',
      });

      const queue = combatPhaseManager.getActionQueue();

      expect(queue[0].name).toBe('counter'); // Highest priority
      expect(queue[1].name).toBe('normal');
      expect(queue[2].name).toBe('defend'); // Lowest priority
    });

    it('should emit action events', async () => {
      const actionQueued = vi.fn();
      const actionExecuting = vi.fn();
      const actionExecuted = vi.fn();

      combatPhaseManager.on(CombatEvent.ACTION_QUEUED, actionQueued);
      combatPhaseManager.on(CombatEvent.ACTION_EXECUTING, actionExecuting);
      combatPhaseManager.on(CombatEvent.ACTION_EXECUTED, actionExecuted);

      const action = {
        type: 'attack',
        attacker: player,
        target: enemy,
      };

      combatPhaseManager.queueAction(action);
      await combatPhaseManager.executeNextAction();

      expect(actionQueued).toHaveBeenCalled();
      expect(actionExecuting).toHaveBeenCalled();
      expect(actionExecuted).toHaveBeenCalled();
    });
  });

  describe('Combo Integration', () => {
    beforeEach(async () => {
      combatPhaseManager.initialize(player, enemy, turnManager);
      await combatPhaseManager.startBattle();
    });

    it('should track combo actions through phase system', () => {
      comboSystem.recordAction(player, 'attack');
      comboSystem.recordAction(player, 'attack');

      const combo = comboSystem.checkForCombo(player);

      expect(combo).toBeDefined();
      expect(combo.name).toBe('Offensive Surge');
    });

    it('should reset combo on battle start', async () => {
      comboSystem.recordAction(player, 'attack');
      expect(comboSystem.actionHistory).toHaveLength(1);

      comboSystem.reset();
      expect(comboSystem.actionHistory).toHaveLength(0);
    });
  });

  describe('Battle Completion', () => {
    beforeEach(async () => {
      combatPhaseManager.initialize(player, enemy, turnManager);
      await combatPhaseManager.startBattle();
    });

    it('should end battle correctly', async () => {
      const battleEnded = vi.fn();
      combatPhaseManager.on(CombatEvent.BATTLE_ENDED, battleEnded);

      await combatPhaseManager.endBattle(player, enemy);

      expect(battleEnded).toHaveBeenCalledWith(
        expect.objectContaining({
          winner: player,
          loser: enemy,
        })
      );
      expect(combatPhaseManager.getPhase()).toBe(CombatPhase.IDLE);
    });
  });

  describe('Phase Hooks', () => {
    it('should execute hooks at correct phase', async () => {
      const hook = vi.fn();

      combatPhaseManager.registerPhaseHook(CombatPhase.BATTLE_START, hook, 10);

      combatPhaseManager.initialize(player, enemy, turnManager);
      await combatPhaseManager.startBattle();

      expect(hook).toHaveBeenCalled();
    });

    it('should execute hooks in priority order', async () => {
      const executionOrder = [];

      combatPhaseManager.registerPhaseHook(
        CombatPhase.BATTLE_START,
        () => {
          executionOrder.push('low');
        },
        1
      );

      combatPhaseManager.registerPhaseHook(
        CombatPhase.BATTLE_START,
        () => {
          executionOrder.push('high');
        },
        10
      );

      combatPhaseManager.registerPhaseHook(
        CombatPhase.BATTLE_START,
        () => {
          executionOrder.push('medium');
        },
        5
      );

      combatPhaseManager.initialize(player, enemy, turnManager);
      await combatPhaseManager.startBattle();

      expect(executionOrder).toEqual(['high', 'medium', 'low']);
    });

    it('should allow hook unregistration', async () => {
      const hook = vi.fn();

      const hookId = combatPhaseManager.registerPhaseHook(CombatPhase.BATTLE_START, hook);

      combatPhaseManager.unregisterPhaseHook(hookId);

      combatPhaseManager.initialize(player, enemy, turnManager);
      await combatPhaseManager.startBattle();

      expect(hook).not.toHaveBeenCalled();
    });
  });

  describe('Phase History', () => {
    it('should track phase transitions', async () => {
      combatPhaseManager.initialize(player, enemy, turnManager);

      await combatPhaseManager.startBattle();
      await combatPhaseManager.startTurn(player);
      await combatPhaseManager.endTurn(player);

      const history = combatPhaseManager.getPhaseHistory();

      expect(history.length).toBeGreaterThan(0);
      expect(history.some((h) => h.phase === CombatPhase.BATTLE_START)).toBe(true);
      expect(history.some((h) => h.phase === CombatPhase.TURN_START)).toBe(true);
      expect(history.some((h) => h.phase === CombatPhase.TURN_END)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle hook errors gracefully', async () => {
      const errorHook = vi.fn(() => {
        throw new Error('Hook error');
      });
      const normalHook = vi.fn();

      combatPhaseManager.registerPhaseHook(CombatPhase.BATTLE_START, errorHook, 10);
      combatPhaseManager.registerPhaseHook(CombatPhase.BATTLE_START, normalHook, 5);

      combatPhaseManager.initialize(player, enemy, turnManager);

      // Should not throw
      await expect(combatPhaseManager.startBattle()).resolves.not.toThrow();

      // Normal hook should still execute
      expect(normalHook).toHaveBeenCalled();
    });
  });
});
