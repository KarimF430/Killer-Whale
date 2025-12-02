export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/client/src/$1',
        '^@shared/(.*)$': '<rootDir>/shared/$1',
        '^uuid$': '<rootDir>/__mocks__/uuid.ts',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            isolatedModules: true,
        }],
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
        'node_modules/(?!(uuid)/)',
    ],
    collectCoverageFrom: [
        'server/**/*.{ts,tsx}',
        '!server/**/*.d.ts',
        '!server/**/*.test.ts',
        '!**/node_modules/**',
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    testTimeout: 10000,
}
