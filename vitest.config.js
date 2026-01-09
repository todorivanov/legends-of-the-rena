import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'happy-dom',
    
    // Global test utilities
    globals: true,
    
    // Setup files
    setupFiles: ['./tests/setup.js'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.config.js',
        '**/*.spec.js',
        '**/*.test.js',
        'src/main-new.js', // Entry point
      ],
      all: true,
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
    
    // Test file patterns
    include: ['tests/**/*.{test,spec}.js', 'src/**/*.{test,spec}.js'],
    exclude: ['node_modules', 'dist', 'build'],
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Mock configuration
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    
    // Reporter configuration
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './test-results/index.html',
    },
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
});
