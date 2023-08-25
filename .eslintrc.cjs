module.exports = {
  root: true,
  env: {
    "browser": true,
    "node": true,
    "jasmine": true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  plugins: [
    '@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: {
      ts: "@typescript-eslint/parser",
    }
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
