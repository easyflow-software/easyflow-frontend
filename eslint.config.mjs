import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['node_modules/*', '.next/*', '.out/*', '!**/.prettierrc'],
  },
  ...compat.extends('eslint:recommended'),
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 14,
      sourceType: 'module',

      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  },
  ...compat
    .extends(
      'eslint:recommended',
<<<<<<< HEAD
=======
      'plugin:@next/next/recommended',
      'plugin:@typescript-eslint/recommended',
>>>>>>> origin
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:prettier/recommended',
      'plugin:@typescript-eslint/recommended',
    )
    .map(config => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/ignore': ['.css$', 'node_modules/*'],
    },

    rules: {
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true,
        },
      ],

      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],

      '@typescript-eslint/no-explicit-any': ['error'],
      '@typescript-eslint/no-floating-promises': ['error'],
      '@next/next/no-duplicate-head': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
    },
  },
];
