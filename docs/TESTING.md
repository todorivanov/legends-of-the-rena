# Testing Guide

## Overview

The project uses a comprehensive testing strategy with three levels of tests:
1. **Unit Tests** - Test individual components/functions in isolation
2. **Integration Tests** - Test multiple components working together
3. **E2E Tests** - Test the complete application flow

## Tech Stack

- **Vitest** - Fast unit and integration testing (Vite-native)
- **Playwright** - Modern E2E testing across browsers
- **Happy-DOM** - Lightweight DOM implementation for tests
- **@vitest/coverage-v8** - Code coverage reporting

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Types
```bash
npm run test:unit        # Unit tests with coverage
npm run test:e2e         # E2E tests
npm run test:all         # Both unit and E2E
```

### Watch Mode
```bash
npm run test:watch       # Auto-run tests on file changes
```

### Interactive UI
```bash
npm run test:ui          # Vitest UI
npm run test:e2e:ui      # Playwright UI
```

### Coverage
```bash
npm run test:coverage    # Generate coverage report
```

## Project Structure

```
tests/
├── setup.js                 # Global test setup
├── utils/
│   └── testHelpers.js      # Reusable test utilities
├── unit/                    # Unit tests
│   ├── Fighter.test.js
│   ├── ComboSystem.test.js
│   └── ...
├── integration/             # Integration tests
│   ├── CombatFlow.test.js
│   └── ...
└── e2e/                     # End-to-end tests
    ├── gameFlow.spec.js
    └── ...
```

## Writing Unit Tests

### Basic Structure
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { MyClass } from '../src/MyClass.js';

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
import { createTestFighter } from '../utils/testHelpers.js';

const fighter = createTestFighter({ health: 50 });
expect(fighter.health).toBe(50);
```

### Mocking
```javascript
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn();
mockFn.mockReturnValue('value');

// Spy on method
vi.spyOn(Math, 'random').mockReturnValue(0.5);

// Restore mocks
vi.restoreAllMocks();
```

## Writing Integration Tests

### Testing Multiple Systems
```javascript
describe('Combat Integration', () => {
  it('should handle full combat flow', async () => {
    const player = createTestFighter();
    const enemy = createTestFighter();
    
    combatPhaseManager.initialize(player, enemy, turnManager);
    await combatPhaseManager.startBattle();
    
    // Test multiple systems working together
    const action = { type: 'attack', attacker: player, target: enemy };
    combatPhaseManager.queueAction(action);
    const result = await combatPhaseManager.executeNextAction();
    
    expect(result).toBeDefined();
    expect(enemy.health).toBeLessThan(100);
  });
});
```

## Writing E2E Tests

### Basic Page Test
```javascript
import { test, expect } from '@playwright/test';

test('should load game', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('title-screen')).toBeVisible();
});
```

### Interacting with Shadow DOM
```javascript
await page.evaluate(() => {
  const component = document.querySelector('my-component');
  const button = component.shadowRoot.querySelector('button');
  button.click();
});
```

### Setting Up Test Data
```javascript
await page.evaluate(() => {
  localStorage.setItem('key', 'value');
});
await page.reload();
```

## Test Coverage

### Coverage Thresholds
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Viewing Coverage
```bash
npm run test:coverage
```

Coverage reports are generated in:
- `coverage/` - Detailed HTML report
- `test-results/` - JSON/LCOV reports

### Excluded from Coverage
- `node_modules/`
- `tests/`
- `dist/`
- Config files
- Entry points (`main-new.js`)

## Best Practices

### Unit Tests
✅ **DO**:
- Test one thing per test
- Use descriptive test names
- Keep tests fast (< 100ms)
- Mock external dependencies
- Test edge cases

❌ **DON'T**:
- Test implementation details
- Make tests depend on each other
- Use real HTTP requests
- Test third-party code

### Integration Tests
✅ **DO**:
- Test realistic scenarios
- Use actual dependencies when possible
- Test error handling
- Verify system boundaries

❌ **DON'T**:
- Test too many scenarios in one test
- Duplicate unit test coverage
- Make tests too slow

### E2E Tests
✅ **DO**:
- Test critical user flows
- Test across browsers
- Use page objects for reusability
- Test responsive design

❌ **DON'T**:
- Test every detail (use unit tests)
- Make tests brittle (avoid implementation details)
- Ignore test flakiness

## Common Patterns

### Testing Async Code
```javascript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Events
```javascript
it('should emit events', () => {
  const handler = vi.fn();
  emitter.on('event', handler);
  
  emitter.emit('event', data);
  
  expect(handler).toHaveBeenCalledWith(data);
});
```

### Testing Components
```javascript
it('should render correctly', () => {
  const component = document.createElement('my-component');
  document.body.appendChild(component);
  
  const shadowRoot = component.shadowRoot;
  expect(shadowRoot.querySelector('.content')).toBeDefined();
});
```

### Testing localStorage
```javascript
beforeEach(() => {
  localStorage.clear();
});

it('should save data', () => {
  saveManager.save(data);
  expect(localStorage.getItem).toHaveBeenCalled();
});
```

## Debugging Tests

### Debug Single Test
```javascript
it.only('should debug this test', () => {
  // This test runs alone
});
```

### Skip Test
```javascript
it.skip('should skip this test', () => {
  // This test is skipped
});
```

### Debug E2E with UI
```bash
npm run test:e2e:debug
```

### Debug with Browser DevTools
```bash
npm run test:e2e:ui
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

## Continuous Testing

### Watch Mode
```bash
npm run test:watch
```

Files watched:
- `src/**/*.js`
- `tests/**/*.test.js`

### VS Code Integration
Install recommended extension:
- **Vitest** by Vitest Team

Provides:
- Inline test results
- Run/debug buttons
- Coverage gutters

## Troubleshooting

### Tests Time Out
```javascript
// Increase timeout
it('slow test', async () => {
  // test code
}, { timeout: 20000 });
```

### Flaky E2E Tests
```javascript
// Add explicit waits
await page.waitForSelector('selector', { state: 'visible' });

// Or wait for network
await page.waitForLoadState('networkidle');
```

### Mock Not Working
```javascript
// Ensure mocks are cleared
beforeEach(() => {
  vi.clearAllMocks();
});
```

### Coverage Not Accurate
```bash
# Clear coverage cache
rm -rf coverage .vitest
npm run test:coverage
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Happy-DOM](https://github.com/capricorn86/happy-dom)

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain coverage > 70%
4. Add E2E tests for user-facing features

---

**Version**: 4.5.0  
**Last Updated**: 2026-01-09
