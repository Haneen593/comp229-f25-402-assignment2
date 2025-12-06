module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg|pdf)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    testMatch: ['<rootDir>/src/tests/**/*.test.jsx']
};