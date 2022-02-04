module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: 'plugin:react/recommended',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    semi: 'off',
  },
}
