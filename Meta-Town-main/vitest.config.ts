import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    svgr({
      include: '**/*.svg',
    }),
  ],
  test: {
    coverage: {
      enabled: true,
      include: ['src/**'],
      exclude: ['**/*.stories.ts', '**/*.stories.tsx', 'src/stories/**'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    testTimeout: 15000,
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    watch: false,
  },
})
