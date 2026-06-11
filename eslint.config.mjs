import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import json from '@eslint/json';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import obsidianmd from 'eslint-plugin-obsidianmd';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    ignores: ['*.js', '*.mjs', 'node_modules/', '.cache/', 'coverage/'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      obsidianmd,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...obsidianmd.configs.recommended.rules,

      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',

      complexity: 'off',
      'max-depth': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',

      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/no-children-prop': 'warn',
      'react/no-direct-mutation-state': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern:
            '^_|(STYLES|CSS|STYLE_ID)$|[Ss]tyles$|[Ss]tylesInjected$|ReferenceCount$|referenceCount$|refCount$|isInjected$|StyleElement$|^inject.*Styles$|^getScoped.*Css$|^monthlyReviewStyles$|^applyCalendar|^applyConsistent|^setupCalendar',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/no-deprecated': 'error',

      'no-case-declarations': 'warn',
      'prefer-const': 'warn',
      'no-useless-escape': 'warn',
      'no-empty': 'warn',
      'no-prototype-builtins': 'warn',
      'no-mixed-spaces-and-tabs': 'warn',
      'no-unexpected-multiline': 'warn',
      'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],

      
      'obsidianmd/no-forbidden-elements': 'error',
      'obsidianmd/prefer-file-manager-trash-file': 'warn',
      'obsidianmd/validate-manifest': 'error',
      'obsidianmd/validate-license': 'error',

      
      'no-undef': 'off',
    },
  },
  {
    files: ['manifest.json'],
    language: 'json/json',
    plugins: {
      json,
      obsidianmd,
    },
    rules: {
      'no-irregular-whitespace': 'off',
      'obsidianmd/validate-manifest': 'error',
    },
  },
  eslintConfigPrettier,
]);
