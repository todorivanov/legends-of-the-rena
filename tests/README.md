# Tests Directory

This directory contains all test files for the Legends of the Arena game.

## Structure

```
tests/
├── setup.js              # Global test setup (runs before all tests)
├── utils/                # Test utilities and helpers
│   └── testHelpers.js   # Reusable functions for tests
├── unit/                 # Unit tests (test individual functions/classes)
│   ├── Fighter.test.js
│   └── ComboSystem.test.js
├── integration/          # Integration tests (test systems working together)
│   └── CombatFlow.test.js
└── e2e/                  # End-to-end tests (test full user flows)
    └── gameFlow.spec.js
```

## Quick Start

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx vitest run tests/unit/Fighter.test.js
```

### Watch Mode
```bash
npm run test:watch
```

### E2E Tests
```bash
npm run test:e2e
```

## Writing Tests

### Unit Test Template
```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyClass', () => {
  let instance;

  beforeEach(() => {
    instance = new MyClass();
  });

  it('should do something', () => {
    const result = instance.method();
    expect(result).toBe(expected);
  });
});
```

### Using Test Helpers
```javascript
import { createTestFighter, mockLocalStorage } from './utils/testHelpers.js';

// Create test fighter
const fighter = createTestFighter({ health: 50 });

// Mock localStorage
mockLocalStorage({ key: 'value' });
```

## Test Conventions

### File Naming
- Unit tests: `*.test.js`
- Integration tests: `*.test.js`
- E2E tests: `*.spec.js`

### Test Naming
```javascript
describe('ClassName or FeatureName', () => {
  describe('methodName() or feature area', () => {
    it('should describe expected behavior', () => {
      // test code
    });
  });
});
```

### Assertions
```javascript
// Equality
expect(value).toBe(expected);
expect(object).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeDefined();

// Numbers
expect(number).toBeGreaterThan(5);
expect(number).toBeLessThan(10);
expect(number).toBeCloseTo(9.9, 1);

// Arrays/Objects
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key');

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenCalledTimes(3);

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow(Error);
```

## Available Helpers

### Test Fighters
```javascript
import { createTestFighter, createTestFighters } from './utils/testHelpers.js';

const fighter = createTestFighter({ health: 50, strength: 100 });
const fighters = createTestFighters(5); // Create 5 fighters
```

### Mock Data
```javascript
import { createMockSaveData, mockLocalStorage } from './utils/testHelpers.js';

const saveData = createMockSaveData({ level: 10 });
const store = mockLocalStorage({ key: 'value' });
```

### Utilities
```javascript
import { wait, flushPromises, simulateEvent } from './utils/testHelpers.js';

await wait(100); // Wait 100ms
await flushPromises(); // Flush promise queue
simulateEvent(element, 'click'); // Trigger event
```

### Shadow DOM
```javascript
import { getShadowElement, createMockComponent } from './utils/testHelpers.js';

const component = createMockComponent('my-component');
const element = getShadowElement(component, '.selector');
```

## Mocking

### Functions
```javascript
import { vi } from 'vitest';

const mock = vi.fn();
mock.mockReturnValue('value');
mock.mockResolvedValue('async value');
mock.mockRejectedValue(new Error('error'));
```

### Modules
```javascript
vi.mock('../src/module.js', () => ({
  default: vi.fn(),
  namedExport: vi.fn(),
}));
```

### Timers
```javascript
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.runAllTimers();
vi.useRealTimers();
```

## Coverage

View coverage report:
```bash
npm run test:coverage
open coverage/index.html
```

Coverage thresholds:
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

## Debugging

### Debug Single Test
```javascript
it.only('should debug this', () => {
  // Only this test runs
});
```

### Skip Test
```javascript
it.skip('should skip this', () => {
  // This test is skipped
});
```

### Console Debugging
```javascript
console.log('Debug:', value); // Will show in test output
```

### Debug E2E
```bash
npm run test:e2e:debug  # Opens debugger
npm run test:e2e:ui     # Opens Playwright UI
```

## Best Practices

✅ **DO**:
- Write descriptive test names
- Test one thing per test
- Use `beforeEach` for setup
- Mock external dependencies
- Test edge cases
- Keep tests fast

❌ **DON'T**:
- Test implementation details
- Make tests depend on each other
- Use real HTTP requests in unit tests
- Skip error cases
- Write brittle tests

## CI/CD

Tests run automatically on:
- Push to any branch
- Pull requests
- Before deployment

## Resources

- [Main Testing Guide](../docs/TESTING.md)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)

---

**Need Help?** See [docs/TESTING.md](../docs/TESTING.md) for comprehensive guide.
