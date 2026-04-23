module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  setupFiles: ['<rootDir>/__tests__/setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { presets: ['@babel/preset-typescript'] }],
  },
};