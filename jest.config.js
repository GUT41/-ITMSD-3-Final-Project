module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
  },
};