/* eslint @typescript-eslint/no-var-requires: "off" */
const builtins = require('module').builtinModules.join('|');

const sourceCodeDirs = 'src|public';

module.exports = {
  extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['simple-import-sort'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
      },
    },
    {
      files: ['index.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/no-duplicates': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          [`^(${builtins})(/.*)?(?<!\\u0000)$`, `^(${builtins})(/.*)?\\u0000$`],
          [`^(?!${sourceCodeDirs})@?\\w`, `^(?!${sourceCodeDirs})@?\\w.*\\u0000$`],
          ['(?<!\\u0000)$', '(?<=\\u0000)$'],
          [`^(${sourceCodeDirs})(/.*)?(?<!\\u0000)$`, `^(${sourceCodeDirs})(/.*)?\\u0000$`],
          ['^\\.', '^\\..*\\u0000$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [{ group: ['.*'], message: 'No relative imports' }],
      },
    ],
    'no-return-await': 'error',
  },
};