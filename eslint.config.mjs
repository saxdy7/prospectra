import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * ESLint flat config.
 *
 * Next.js 16 removed `next lint`, and `next build` no longer lints, so ESLint
 * runs on its own via the `lint` script. `eslint-config-next` ships native
 * flat config arrays, so no FlatCompat shim is needed.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
  {
    /* Build output, dependencies and generated types are not ours to lint.
       In flat config a bare `ignores` block replaces .eslintignore. */
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'next-env.d.ts'
    ]
  },

  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    rules: {
      /* An unused value is usually a leftover, but an intentionally ignored
         one is normal in destructuring and catch clauses. Allow the
         underscore convention rather than turning the rule off. */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  }
];

export default config;
