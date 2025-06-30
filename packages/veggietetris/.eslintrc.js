module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn'],
        'no-console': ['warn']
    },
    globals: {
        'VEGETABLES': 'readonly',
        'TETROMINO_SHAPES': 'readonly',
        'Tetromino': 'readonly',
        'Board': 'readonly',
        'Renderer': 'readonly',
        'InputHandler': 'readonly',
        'Storage': 'readonly',
        'getRandomTetromino': 'readonly',
        'getVegetableInfo': 'readonly',
        'getRandomFact': 'readonly',
        'updateVegetableDisplay': 'readonly',
        'restartGame': 'readonly'
    }
};