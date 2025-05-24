import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'node',

                //* setupFiles VS setupFilesAfterEnv
    //! setupFiles runs in isolation before the test environment is set up.

    //! beforeEach, afterAll, expect, etc., aren’t available there.
    //setupFiles: ['<rootDir>/test/actions/jest.setup.ts'],
    
    //$ However, setupFilesAfterEnv runs after Jest has loaded the test environment (like Node or JSDOM), so hooks work.
    setupFilesAfterEnv: ['<rootDir>/test/actions/jest.setup.ts'],


  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/../shared/$1',
  },
  testMatch: ['<rootDir>/test/actions/**/*.test.ts'],
};

export default createJestConfig(config);