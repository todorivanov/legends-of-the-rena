/**
 * BehaviorTree - AI decision-making using behavior trees
 *
 * Behavior trees provide hierarchical, modular AI decision-making
 * More flexible and maintainable than simple if/else chains
 */

import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

/**
 * Node Status - Result of node execution
 */
export const NodeStatus = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  RUNNING: 'running',
};

/**
 * Base Behavior Node
 */
export class BehaviorNode {
  constructor(name = 'Node') {
    this.name = name;
    this.status = null;
  }

  /**
   * Execute the node
   * @param {Object} context - AI context (fighter, opponent, etc.)
   * @returns {string} NodeStatus
   */
  execute(_context) {
    throw new Error('execute() must be implemented by subclass');
  }

  /**
   * Reset node state
   */
  reset() {
    this.status = null;
  }
}

/**
 * Composite Node - Has children
 */
export class CompositeNode extends BehaviorNode {
  constructor(name, children = []) {
    super(name);
    this.children = children;
    this.currentChildIndex = 0;
  }

  addChild(child) {
    this.children.push(child);
    return this;
  }

  reset() {
    super.reset();
    this.currentChildIndex = 0;
    this.children.forEach((child) => child.reset());
  }
}

/**
 * Selector Node - Try children until one succeeds (OR logic)
 * Returns SUCCESS if any child succeeds
 * Returns FAILURE if all children fail
 */
export class Selector extends CompositeNode {
  constructor(name, children = []) {
    super(name, children);
  }

  execute(context) {
    for (let i = this.currentChildIndex; i < this.children.length; i++) {
      const child = this.children[i];
      const status = child.execute(context);

      if (status === NodeStatus.SUCCESS) {
        this.reset();
        return NodeStatus.SUCCESS;
      }

      if (status === NodeStatus.RUNNING) {
        this.currentChildIndex = i;
        return NodeStatus.RUNNING;
      }

      // FAILURE - try next child
    }

    // All children failed
    this.reset();
    return NodeStatus.FAILURE;
  }
}

/**
 * Sequence Node - Execute children in order (AND logic)
 * Returns SUCCESS if all children succeed
 * Returns FAILURE if any child fails
 */
export class Sequence extends CompositeNode {
  constructor(name, children = []) {
    super(name, children);
  }

  execute(context) {
    for (let i = this.currentChildIndex; i < this.children.length; i++) {
      const child = this.children[i];
      const status = child.execute(context);

      if (status === NodeStatus.FAILURE) {
        this.reset();
        return NodeStatus.FAILURE;
      }

      if (status === NodeStatus.RUNNING) {
        this.currentChildIndex = i;
        return NodeStatus.RUNNING;
      }

      // SUCCESS - continue to next child
    }

    // All children succeeded
    this.reset();
    return NodeStatus.SUCCESS;
  }
}

/**
 * Condition Node - Evaluates a condition
 */
export class Condition extends BehaviorNode {
  constructor(name, conditionFn) {
    super(name);
    this.conditionFn = conditionFn;
  }

  execute(context) {
    const result = this.conditionFn(context);
    this.status = result ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
    return this.status;
  }
}

/**
 * Action Node - Performs an action
 */
export class Action extends BehaviorNode {
  constructor(name, actionFn) {
    super(name);
    this.actionFn = actionFn;
  }

  execute(context) {
    try {
      const result = this.actionFn(context);
      this.status = result ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
      return this.status;
    } catch (error) {
      ConsoleLogger.error(LogCategory.AI, `Action ${this.name} failed:`, error);
      this.status = NodeStatus.FAILURE;
      return this.status;
    }
  }
}

/**
 * Decorator Node - Modifies child behavior
 */
export class Decorator extends BehaviorNode {
  constructor(name, child) {
    super(name);
    this.child = child;
  }

  reset() {
    super.reset();
    if (this.child) {
      this.child.reset();
    }
  }
}

/**
 * Inverter - Inverts child result (SUCCESS <-> FAILURE)
 */
export class Inverter extends Decorator {
  execute(context) {
    const status = this.child.execute(context);

    if (status === NodeStatus.SUCCESS) {
      return NodeStatus.FAILURE;
    } else if (status === NodeStatus.FAILURE) {
      return NodeStatus.SUCCESS;
    }

    return status; // RUNNING stays RUNNING
  }
}

/**
 * Repeater - Repeats child N times
 */
export class Repeater extends Decorator {
  constructor(name, child, count = 1) {
    super(name, child);
    this.count = count;
    this.currentCount = 0;
  }

  execute(context) {
    while (this.currentCount < this.count) {
      const status = this.child.execute(context);

      if (status === NodeStatus.RUNNING) {
        return NodeStatus.RUNNING;
      }

      if (status === NodeStatus.FAILURE) {
        this.reset();
        return NodeStatus.FAILURE;
      }

      this.currentCount++;
      this.child.reset();
    }

    this.reset();
    return NodeStatus.SUCCESS;
  }

  reset() {
    super.reset();
    this.currentCount = 0;
  }
}

/**
 * UntilFail - Repeats child until it fails
 */
export class UntilFail extends Decorator {
  execute(context) {
    const status = this.child.execute(context);

    if (status === NodeStatus.FAILURE) {
      this.reset();
      return NodeStatus.SUCCESS;
    }

    return NodeStatus.RUNNING;
  }
}

/**
 * RandomSelector - Randomly shuffles children before selecting
 */
export class RandomSelector extends Selector {
  execute(context) {
    // Shuffle children on first execution
    if (this.currentChildIndex === 0) {
      this.shuffleChildren();
    }

    return super.execute(context);
  }

  shuffleChildren() {
    for (let i = this.children.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.children[i], this.children[j]] = [this.children[j], this.children[i]];
    }
  }
}

/**
 * WeightedSelector - Selects children based on weights
 */
export class WeightedSelector extends Selector {
  constructor(name, childrenWithWeights = []) {
    // childrenWithWeights = [{ child, weight }, ...]
    super(name, []);
    this.childrenWithWeights = childrenWithWeights;
  }

  execute(context) {
    // Sort by weight on first execution
    if (this.currentChildIndex === 0) {
      this.sortByWeights(context);
    }

    return super.execute(context);
  }

  sortByWeights(context) {
    // Calculate total weight
    const totalWeight = this.childrenWithWeights.reduce((sum, item) => {
      const weight = typeof item.weight === 'function' ? item.weight(context) : item.weight;
      return sum + weight;
    }, 0);

    // Weighted random selection
    const random = Math.random() * totalWeight;
    let currentWeight = 0;

    for (const item of this.childrenWithWeights) {
      const weight = typeof item.weight === 'function' ? item.weight(context) : item.weight;
      currentWeight += weight;

      if (random <= currentWeight) {
        this.children = [item.child];
        return;
      }
    }

    // Fallback
    this.children = [this.childrenWithWeights[0]?.child];
  }
}

/**
 * BehaviorTree - Main behavior tree class
 */
export class BehaviorTree {
  constructor(name, rootNode) {
    this.name = name;
    this.rootNode = rootNode;
  }

  /**
   * Execute the behavior tree
   * @param {Object} context - AI context
   * @returns {string} Final status
   */
  execute(context) {
    if (!this.rootNode) {
      ConsoleLogger.warn(LogCategory.AI, `BehaviorTree ${this.name} has no root node`);
      return NodeStatus.FAILURE;
    }

    const status = this.rootNode.execute(context);

    ConsoleLogger.info(LogCategory.AI, `🤖 AI Decision (${this.name}):`, {
      status,
      action: context.chosenAction,
    });

    return status;
  }

  /**
   * Reset the tree
   */
  reset() {
    if (this.rootNode) {
      this.rootNode.reset();
    }
  }
}
