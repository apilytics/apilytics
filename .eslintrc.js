/* eslint @typescript-eslint/no-var-requires: "off" */
const fs = require('fs');
const path = require('path');

const builtins = require('module').builtinModules.join('|');

const modulesUnderSrc = fs.readdirSync('src').map((file) => path.parse(file).name);
const ownModules = `${modulesUnderSrc.join('|')}|__tests__|public`;

module.exports = {
  extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['simple-import-sort'],
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
          [`^(?!${ownModules})@?\\w`, `^(?!${ownModules})@?\\w.*\\u0000$`],
          ['(?<!\\u0000)$', '(?<=\\u0000)$'],
          [`^(${ownModules})(/.*)?(?<!\\u0000)$`, `^(${ownModules})(/.*)?\\u0000$`],
          ['^\\.', '^\\..*\\u0000$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['.*'], message: "Don't use relative imports!" },
          { group: ['src/*'], message: "Don't prefix src/ to imports!" },
          { group: ['@apilytics/next'], message: 'Import @apilytics/next from utils/apilytics!' },
        ],
      },
    ],
    'no-return-await': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
      },
    },
  ],
};
