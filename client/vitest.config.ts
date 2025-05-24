// vitest.config.ts
import { defineConfig } from 'vitest/config'


const dirname = new URL('.', import.meta.url).pathname //*  Just for the alias

export default defineConfig({
  test: {
    environment: 'node', // 🔥 critical for middleware (not jsdom)
    include: ['test/middleware/**/*.test.ts'], // 🧠 avoid matching component/server test files,
    setupFiles: ['test/middleware/vitest.setup.ts'], // ← 👈 runs BEFORE any other file is loaded
    
    // forceRerunTriggers: ['src/**/*.ts'],
    forceRerunTriggers: ['**/src/**/*.ts']  //$ This is the only syntax that works.
    
  },
  resolve: {
    alias: {
      '@': `${dirname}src`,
      '@shared': `${dirname}../shared`,
    },

  },
})
