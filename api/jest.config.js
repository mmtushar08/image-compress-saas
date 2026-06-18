module.exports = {
    testEnvironment: 'node',
    setupFiles:      ['<rootDir>/jest.setup.js'],
    testMatch:       ['**/__tests__/**/*.test.js'],
    testTimeout:     15000,
    clearMocks:      true,
    collectCoverageFrom: [
        'src/services/**/*.js',
        'src/controllers/**/*.js',
        '!src/services/db.js',
    ],
};
