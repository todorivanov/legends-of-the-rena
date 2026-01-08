import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    ignores: ['dist/**', 'build/**', '*.bundle.js', 'node_modules/**']
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
    files: ['vite.config.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
