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
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "quotes": ["error", "double"],
    "semi": [
      "error",
      "always"
    ],
    "brace-style": "off",
    "@typescript-eslint/brace-style": 0,
    "max-len": 0,
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
    "no-restricted-syntax": 0,
    "no-shadow": 0,
    "operator-linebreak": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "padded-blocks": 0,
    "no-alert": 0,
    "no-console": 0,
    "react/sort-comp": 0
  },
};