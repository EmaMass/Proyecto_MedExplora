export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'models/**/*.js',
    'server.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000
}