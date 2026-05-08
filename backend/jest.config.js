module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  setupFilesAfterFramework: ['./test/setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['controllers/**/*.js', 'middlewares/**/*.js']
};
