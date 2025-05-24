
//! Since I split my tests between setup and tests, I need to load environment variables up here.
import dotenv from 'dotenv';
dotenv.config({path: '.env.test'})



// vitest.config.ts
import { defineConfig } from 'vitest/config'


const dirname = new URL('.', import.meta.url).pathname //*  Just for the alias

export default defineConfig({
  test: {
    environment: 'node', // 🔥 critical for middleware (not jsdom)
    include: ['test/**/*.test.ts'], // 🧠 avoid matching component/server test files,
    setupFiles: ['test/setup.ts'], // ← 👈 runs BEFORE any other file is loaded
    // forceRerunTriggers: ['src/**/*.ts'],
    // forceRerunTriggers: ['**/src/**/*.ts']  //$ This is the only syntax that works.
    
  },
  resolve: {
    alias: {
      // '@': `${dirname}src`,
      '@shared': `${dirname}../shared`,
    },

  },
})
