// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        browser: true,
        commonjs: true,
        browser: true,
    },
    extends: ['standard-react', 'standard'],
    plugins: [
        'react',
        'babel',
        'promise'
    ],
    // add your custom rules here
    rules: {
        'no-useless-constructor': 1,
        'comma-dangle': 1,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'max-len': 0,
        'indent': ['error', 4],
        'react/jsx-indent': [2, 4],
        'semi': [2, 'always'],
    }
}