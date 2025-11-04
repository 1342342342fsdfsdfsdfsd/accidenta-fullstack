import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false, // ✅ muestra los logs y resultados test por test
  silent: false, // ❌ no silencia los console.log
  setupFilesAfterEnv: ['./test/setup.ts'], // si necesitás inicializar mocks/db
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  testMatch: ['**/test/**/*.test.ts'],
};

export default config;
