import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    ignores: [
      'dist/**',
      'build/**',
      '*.bundle.js',
      'node_modules/**',
      'coverage/**',
      'test-results/**',
      'playwright-report/**'
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error'
    }
  },
  {
    files: ['vite.config.js', 'vitest.config.js', 'playwright.config.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['tests/**/*.js', 'tests/**/*.test.js', 'tests/**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly'
      }
    }
  }
];
