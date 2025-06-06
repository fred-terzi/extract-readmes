import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    exclude: ['**/*.test.js'],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  esbuild: {
    target: 'esnext',
  },
});
