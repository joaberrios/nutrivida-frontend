import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    globals: true,

    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.test.js',
        'src/**/*.test.jsx',
        'src/main.jsx'
      ],
      reporter: ['text', 'html']
    }
  }
})