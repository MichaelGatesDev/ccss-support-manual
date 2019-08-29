module.exports = {
  env: {
    browser: true,
    es6: true,
    "jest": true
  },
  extends: [
    'airbnb',
    "airbnb-typescript"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "indent": ["error", 4, { "SwitchCase": 1 }],
    "quotes": ["error", "double"],
    "semi": [
      "error",
      "always"
    ]
  },
};