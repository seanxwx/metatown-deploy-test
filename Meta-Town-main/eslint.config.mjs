import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cspellPlugin from '@cspell/eslint-plugin'
import { includeIgnoreFile } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import pluginPromise from 'eslint-plugin-promise'
import pluginRegex from 'eslint-plugin-regex'
import testingLibrary from 'eslint-plugin-testing-library'
import vitest from 'eslint-plugin-vitest'
import {
  config as tseslintConfig,
  configs as tseslintConfigs,
  parser as tseslintParser,
} from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  includeIgnoreFile(gitignorePath),
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    rules: {
      // Common rules
      'arrow-body-style': 'error',
      'object-shorthand': 'error',
      'no-restricted-globals': ['error', 'React'],
      'no-console': 'error',
      curly: ['error', 'all'],

      // React rules
      'react/jsx-boolean-value': [
        'error',
        'never',
        { assumeUndefinedIsFalse: true },
      ],
      'react/jsx-curly-brace-presence': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'react/require-default-props': [
        'error',
        { functions: 'defaultArguments' },
      ],
    },
  }),
  ...tseslintConfig(
    eslint.configs.recommended,
    tseslintConfigs.recommendedTypeChecked,
    tseslintConfigs.stylisticTypeChecked,
    {
      languageOptions: {
        parser: tseslintParser,
        parserOptions: {
          projectService: true,
        },
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // TypeScript rules
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-shadow': 'error',
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        // Test rules
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.mjs'],
      extends: [tseslintConfigs.disableTypeChecked],
    }
  ),
  pluginPromise.configs['flat/recommended'],
  {
    rules: {
      'promise/prefer-await-to-then': 'error',
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Stylistic rules
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'multiline-expression',
          next: 'multiline-expression',
        },
        { blankLine: 'always', prev: '*', next: 'interface' },
        { blankLine: 'always', prev: 'interface', next: '*' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'never', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: '*', next: 'multiline-const' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
  ...compat.config({
    extends: ['plugin:import/recommended', 'plugin:import/typescript'],
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          pathGroups: [
            { pattern: '@/**', group: 'external', position: 'after' },
          ],
        },
      ],
      'import/prefer-default-export': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    },
  }),
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      // Test rules
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
      'vitest/consistent-test-filename': 'error',
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  {
    files: ['**/*.test.tsx'],
    ...testingLibrary.configs['flat/react'],
  },
  {
    plugins: {
      regex: pluginRegex,
    },
    rules: {
      'regex/invalid': [
        'error',
        [
          {
            regex: 'import .* from (\'|")(~/|./|../).*\\b(\\w+)/\\3\\b(\'|")',
            message: 'Please remove duplicate path from local import path',
            replacement: {
              function:
                'const last = text.lastIndexOf(captured[2]); return last === -1 ? text : text.slice(0, last - 1) + text.slice(last + captured[2].length)',
            },
          },
        ],
      ],
    },
  },
  {
    plugins: { '@cspell': cspellPlugin },
    rules: {
      '@cspell/spellchecker': [
        'error',
        {
          configFile: new URL(
            './cspell.config.yaml',
            import.meta.url
          ).toString(),
        },
      ],
    },
  },
]

export default eslintConfig
