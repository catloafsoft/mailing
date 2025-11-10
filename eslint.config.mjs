import nextConfig from 'eslint-config-next';

const config = [
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      'node_modules/**',
      '**/dist/**',
      '**/generated/**',
      '**/runs/**',
      '.mailing/**',
      '**/__test__/**',
      '**/__integration__/**',
      '**/__mocks__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.js',
      '**/*.test.jsx',
      '**/vite.config.ts',
      '**/vite.config.js',
    ],
  },

  // Import Next.js flat config
  ...nextConfig,

  // Additional global settings
  {
    languageOptions: {
      globals: {
        prisma: true,
      },
    },
  },

  // TypeScript-specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.json',
          './packages/cli/tsconfig.json',
          './packages/core/tsconfig.json',
          './packages/web/tsconfig.json',
          './packages/cli/cypress/tsconfig.json',
        ],
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['arrowFunctions'] },
      ],
      'react/no-unknown-property': [
        2,
        {
          ignore: ['jsx', 'global'],
        },
      ],
    },
  },

  // CLI pages specific rules
  {
    files: ['packages/cli/pages/**/*'],
    rules: {
      '@next/next/no-html-link-for-pages': ['error', 'packages/cli/pages'],
      '@next/next/no-img-element': 'error',
    },
  },

  // Web pages specific rules
  {
    files: ['packages/web/pages/**/*'],
    rules: {
      '@next/next/no-html-link-for-pages': ['error', 'packages/web/pages'],
      '@next/next/no-img-element': 'error',
    },
  },

  // Module manifest special case
  {
    files: ['**/moduleManifest.js'],
    rules: {
      'import/newline-after-import': 'off',
    },
  },

  // Additional custom rules
  {
    rules: {
      semi: 'off',
      '@next/next/google-font-display': 'off',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-anonymous-default-export': [
        'error',
        {
          allowObject: true,
        },
      ],
      'react/no-unknown-property': [
        2,
        {
          ignore: ['jsx'],
        },
      ],
    },
  },
];

export default config;
