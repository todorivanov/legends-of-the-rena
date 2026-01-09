/**
 * ActionQueue Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ActionQueue } from '../../src/game/ActionQueue.js';

describe('ActionQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new ActionQueue();
  });

  describe('Constructor', () => {
    it('should initialize with empty queue', () => {
      expect(queue.queue).toEqual([]);
      expect(queue.processing).toBe(false);
      expect(queue.paused).toBe(false);
      expect(queue.history).toEqual([]);
    });

    it('should set max history size', () => {
      expect(queue.maxHistorySize).toBe(50);
    });
  });

  describe('enqueue()', () => {
    it('should add action to queue', () => {
      const action = { type: 'attack', target: 'enemy' };
      const id = queue.enqueue(action);

      expect(queue.queue).toHaveLength(1);
      expect(id).toBeDefined();
      expect(queue.queue[0].type).toBe('attack');
    });

    it('should assign default priority of 0', () => {
      queue.enqueue({ type: 'move' });

      expect(queue.queue[0].priority).toBe(0);
    });

    it('should assign custom priority', () => {
      queue.enqueue({ type: 'attack', priority: 5 });

      expect(queue.queue[0].priority).toBe(5);
    });

    it('should add queuedAt timestamp', () => {
      const before = Date.now();
      queue.enqueue({ type: 'defend' });
      const after = Date.now();

      expect(queue.queue[0].queuedAt).toBeGreaterThanOrEqual(before);
      expect(queue.queue[0].queuedAt).toBeLessThanOrEqual(after);
    });

    it('should set status to queued', () => {
      queue.enqueue({ type: 'skill' });

      expect(queue.queue[0].status).toBe('queued');
    });

    it('should sort by priority after enqueue', () => {
      queue.enqueue({ type: 'low', priority: 1 });
      queue.enqueue({ type: 'high', priority: 10 });
      queue.enqueue({ type: 'medium', priority: 5 });

      expect(queue.queue[0].type).toBe('high');
      expect(queue.queue[1].type).toBe('medium');
      expect(queue.queue[2].type).toBe('low');
    });
  });

  describe('enqueueBatch()', () => {
    it('should add multiple actions', () => {
      const actions = [
        { type: 'attack' },
        { type: 'defend' },
        { type: 'move' },
      ];

      const ids = queue.enqueueBatch(actions);

      expect(ids).toHaveLength(3);
      expect(queue.queue).toHaveLength(3);
    });

    it('should return array of action IDs', () => {
      const actions = [{ type: 'a' }, { type: 'b' }];
      const ids = queue.enqueueBatch(actions);

      expect(Array.isArray(ids)).toBe(true);
      ids.forEach((id) => expect(typeof id).toBe('string'));
    });
  });

  describe('dequeue()', () => {
    it('should remove and return first action', () => {
      queue.enqueue({ type: 'first' });
      queue.enqueue({ type: 'second' });

      const action = queue.dequeue();

      expect(action.type).toBe('first');
      expect(queue.queue).toHaveLength(1);
    });

    it('should return null for empty queue', () => {
      const action = queue.dequeue();

      expect(action).toBeNull();
    });

    it('should add action to history', () => {
      queue.enqueue({ type: 'test' });
      queue.dequeue();

      expect(queue.history).toHaveLength(1);
      expect(queue.history[0].type).toBe('test');
    });

    it('should respect priority order', () => {
      queue.enqueue({ type: 'low', priority: 1 });
      queue.enqueue({ type: 'high', priority: 10 });

      const first = queue.dequeue();
      expect(first.type).toBe('high');
    });
  });

  describe('peek()', () => {
    it('should return first action without removing', () => {
      queue.enqueue({ type: 'peek_test' });
      const initial = queue.queue.length;

      const action = queue.peek();

      expect(action.type).toBe('peek_test');
      expect(queue.queue.length).toBe(initial);
    });

    it('should return null for empty queue', () => {
      const action = queue.peek();

      expect(action).toBeNull();
    });

    it('should return copy of action', () => {
      queue.enqueue({ type: 'original' });
      const peeked = queue.peek();
      peeked.type = 'modified';

      expect(queue.queue[0].type).toBe('original');
    });
  });

  describe('getById()', () => {
    it('should find action by ID', () => {
      const id = queue.enqueue({ type: 'findme' });
      const found = queue.getById(id);

      expect(found).toBeDefined();
      expect(found.type).toBe('findme');
    });

    it('should return null for non-existent ID', () => {
      const found = queue.getById('nonexistent');

      expect(found).toBeNull();
    });

    it('should return copy of action', () => {
      const id = queue.enqueue({ type: 'test' });
      const found = queue.getById(id);
      found.type = 'modified';

      const original = queue.queue.find((a) => a.id === id);
      expect(original.type).toBe('test');
    });
  });

  describe('removeById()', () => {
    it('should remove action by ID', () => {
      const id = queue.enqueue({ type: 'removeme' });
      const removed = queue.removeById(id);

      expect(removed).toBe(true);
      expect(queue.queue).toHaveLength(0);
    });

    it('should return false for non-existent ID', () => {
      const removed = queue.removeById('nonexistent');

      expect(removed).toBe(false);
    });

    it('should maintain order after removal', () => {
      queue.enqueue({ type: 'first', priority: 3 });
      const id = queue.enqueue({ type: 'middle', priority: 2 });
      queue.enqueue({ type: 'last', priority: 1 });

      queue.removeById(id);

      expect(queue.queue).toHaveLength(2);
      expect(queue.queue[0].type).toBe('first');
      expect(queue.queue[1].type).toBe('last');
    });
  });

  describe('clear()', () => {
    it('should clear all actions', () => {
      queue.enqueue({ type: 'a' });
      queue.enqueue({ type: 'b' });
      queue.enqueue({ type: 'c' });

      queue.clear();

      expect(queue.queue).toHaveLength(0);
    });

    it('should not clear history', () => {
      queue.enqueue({ type: 'test' });
      queue.dequeue();
      
      queue.clear();

      expect(queue.history).toHaveLength(1);
    });
  });

  describe('size()', () => {
    it('should return queue size', () => {
      expect(queue.size()).toBe(0);

      queue.enqueue({ type: 'a' });
      expect(queue.size()).toBe(1);

      queue.enqueue({ type: 'b' });
      expect(queue.size()).toBe(2);
    });
  });

  describe('isEmpty()', () => {
    it('should return true for empty queue', () => {
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false for non-empty queue', () => {
      queue.enqueue({ type: 'test' });
      expect(queue.isEmpty()).toBe(false);
    });
  });

  describe('pause() and resume()', () => {
    it('should pause the queue', () => {
      queue.pause();
      expect(queue.paused).toBe(true);
    });

    it('should resume the queue', () => {
      queue.pause();
      queue.resume();
      expect(queue.paused).toBe(false);
    });
  });

  describe('History Management', () => {
    it('should limit history size', () => {
      queue.maxHistorySize = 5;

      for (let i = 0; i < 10; i++) {
        queue.enqueue({ type: `action_${i}` });
        queue.dequeue();
      }

      expect(queue.history.length).toBeLessThanOrEqual(5);
    });
  });
});
