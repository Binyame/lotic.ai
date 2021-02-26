module.exports = {
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '\\.(gql|graphql)$': '@jagi/jest-transform-graphql',
  },
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**'],
  setupFilesAfterEnv: ['<rootDir>/globalTestSetup.js', 'jest-expect-message'],
  testPathIgnorePatterns: ['/node_modules/'],
};
