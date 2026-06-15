import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import json from '@eslint/json';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import obsidianmd from 'eslint-plugin-obsidianmd';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    ignores: [
      '*.js',
      '*.mjs',
      'node_modules/',
      '.cache/',
      'coverage/',
      '**/*.test.{ts,tsx}',
      '**/*.integration.test.{ts,tsx}',
    ],
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
      'react-hooks': reactHooksPlugin,
      obsidianmd,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',

      complexity: 'off',
      'max-depth': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
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
      'prefer-promise-reject-errors': 'error',
      'no-useless-escape': 'warn',
      'no-empty': 'warn',
      'no-prototype-builtins': 'warn',
      'no-mixed-spaces-and-tabs': 'warn',
      'no-unexpected-multiline': 'warn',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['node:*'],
              message:
                'Node built-ins are not available in Obsidian plugin runtime.',
            },
          ],
          paths: [
            {
              name: 'fs',
              message: 'Use Obsidian Vault APIs instead of Node fs.',
            },
            {
              name: 'path',
              message:
                'Use Obsidian normalizePath/Vault APIs instead of Node path.',
            },
            {
              name: 'electron',
              message:
                'Avoid top-level electron imports. Use Platform plus a guarded dynamic require only when necessary.',
            },
            {
              name: 'child_process',
              message:
                'Node child_process is not available in Obsidian plugins.',
            },
            {
              name: 'axios',
              message: 'Use Obsidian requestUrl for plugin network requests.',
            },
            {
              name: 'node-fetch',
              message: 'Use Obsidian requestUrl for plugin network requests.',
            },
          ],
        },
      ],

      'no-restricted-globals': [
        'error',
        {
          name: 'setTimeout',
          message: 'Use window.setTimeout for Obsidian review compatibility.',
        },
        {
          name: 'clearTimeout',
          message: 'Use window.clearTimeout for Obsidian review compatibility.',
        },
        {
          name: 'requestAnimationFrame',
          message:
            'Use window.requestAnimationFrame for Obsidian review compatibility.',
        },
        {
          name: 'document',
          message:
            'Use activeDocument/window.activeDocument in Obsidian UI code.',
        },
        {
          name: 'XMLHttpRequest',
          message:
            'Use Obsidian requestUrl unless a documented multipart upload boundary requires XMLHttpRequest.',
        },
        {
          name: 'fetch',
          message: 'Use Obsidian requestUrl for plugin network requests.',
        },
        {
          name: 'alert',
          message: 'Use Obsidian Notice or Modal instead of native alert.',
        },
        {
          name: 'confirm',
          message: 'Use an Obsidian Modal instead of native confirm.',
        },
        {
          name: 'prompt',
          message: 'Use an Obsidian Modal instead of native prompt.',
        },
        {
          name: 'WebSocket',
          message:
            'Do not add direct WebSocket connections without an explicit reviewed network boundary.',
        },
        {
          name: 'indexedDB',
          message:
            'Do not use browser IndexedDB directly. Use Obsidian/plugin storage boundaries.',
        },
        {
          name: 'caches',
          message:
            'Do not use browser Cache Storage directly. Use service-owned/plugin storage boundaries.',
        },
        {
          name: 'BroadcastChannel',
          message:
            'Do not add cross-context browser channels without an explicit reviewed boundary.',
        },
        {
          name: 'Worker',
          message:
            'Do not add browser workers without an explicit reviewed runtime boundary.',
        },
        {
          name: 'SharedWorker',
          message:
            'Do not add browser workers without an explicit reviewed runtime boundary.',
        },
        {
          name: 'localStorage',
          message:
            'Use Obsidian app.loadLocalStorage/app.saveLocalStorage or plugin settings/UI state.',
        },
        {
          name: 'sessionStorage',
          message:
            'Use Obsidian app.loadLocalStorage/app.saveLocalStorage or plugin settings/UI state.',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[property.name='innerHTML']",
          message:
            'Avoid HTML string injection. Use React nodes, createEl/createSpan, or safe MarkdownRenderer paths.',
        },
        {
          selector: "MemberExpression[property.name='outerHTML']",
          message:
            'Avoid HTML string injection. Use React nodes, createEl/createSpan, or safe MarkdownRenderer paths.',
        },
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message:
            'Avoid HTML string injection. Use React nodes, createEl/createSpan, or safe MarkdownRenderer paths.',
        },
        {
          selector:
            "CallExpression[callee.property.name='createElement'] Literal[value='script']",
          message: 'Do not create runtime script elements.',
        },
        {
          selector:
            "CallExpression[callee.property.name='createElement'] Literal[value='style']",
          message:
            'Do not create runtime style elements. Author modular style constants and regenerate styles.css.',
        },
        {
          selector:
            "CallExpression[callee.property.name='createElement'] Literal[value=/^(iframe|object|embed)$/]",
          message:
            'Do not create embedded remote-content elements in plugin UI.',
        },
        {
          selector: 'JSXIdentifier[name=/^(iframe|object|embed)$/]',
          message:
            'Do not render embedded remote-content elements in plugin UI.',
        },
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'Avoid dangerouslySetInnerHTML. Render React nodes instead.',
        },
        {
          selector: "Property[key.name='hotkeys']",
          message: 'Do not ship default command hotkeys.',
        },
        {
          selector:
            "MemberExpression[object.property.name='workspace'][property.name='activeLeaf']",
          message:
            'Avoid deprecated workspace.activeLeaf. Use activeEditor/getActiveViewOfType or tracked workspace context.',
        },
        {
          selector: "MemberExpression[property.name='require']",
          message:
            'Avoid window.require except in a guarded platform-specific helper.',
        },
      ],

      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'localStorage',
          message:
            'Use Obsidian app.loadLocalStorage/app.saveLocalStorage or plugin settings/UI state.',
        },
        {
          object: 'window',
          property: 'sessionStorage',
          message:
            'Use Obsidian app.loadLocalStorage/app.saveLocalStorage or plugin settings/UI state.',
        },
        {
          object: 'globalThis',
          property: 'localStorage',
          message:
            'Use Obsidian app.loadLocalStorage/app.saveLocalStorage or plugin settings/UI state.',
        },
        {
          object: 'globalThis',
          property: 'sessionStorage',
          message:
            'Use Obsidian app.loadLocalStorage/app.saveLocalStorage or plugin settings/UI state.',
        },
        {
          object: 'window',
          property: 'document',
          message: 'Use window.activeDocument in Obsidian UI code.',
        },
        {
          object: 'globalThis',
          property: 'document',
          message: 'Use window.activeDocument in Obsidian UI code.',
        },
        {
          object: 'window',
          property: 'open',
          message: 'Use the validated openExternalUrl helper.',
        },
        {
          object: 'window',
          property: 'location',
          message:
            'Use the validated openExternalUrl helper for external navigation.',
        },
        {
          object: 'document',
          property: 'location',
          message:
            'Use the validated openExternalUrl helper for external navigation.',
        },
        {
          object: 'navigator',
          property: 'clipboard',
          message:
            'Use the centralized clipboard helpers from src/utils/clipboard.ts.',
        },
        {
          object: 'window',
          property: 'app',
          message: 'Use injected app/plugin context instead of window.app.',
        },
        {
          object: 'window',
          property: 'journalitPlugin',
          message:
            'Use pluginContext/usePlugin instead of global plugin references.',
        },
      ],

      
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
  ...obsidianmd.configs.recommended,
  {
    files: ['manifest.json'],
    rules: {
      'no-irregular-whitespace': 'off',
      'obsidianmd/no-plugin-as-component': 'off',
      'obsidianmd/no-view-references-in-plugin': 'off',
      'obsidianmd/no-unsupported-api': 'off',
      'obsidianmd/prefer-file-manager-trash-file': 'off',
      'obsidianmd/prefer-instanceof': 'off',
    },
  },
  {
    files: ['src/utils/externalLinks.ts'],
    rules: {
      
      'no-restricted-properties': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['src/utils/clipboard.ts'],
    rules: {
      
      'no-restricted-properties': 'off',
    },
  },
  {
    files: ['src/utils/secureLogging.ts'],
    rules: {
      
      'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
    },
  },
  {
    files: ['src/services/tradeImport/BackendTradeImportService.ts'],
    rules: {
      
      'no-restricted-globals': 'off',
    },
  },
  eslintConfigPrettier,
]);
