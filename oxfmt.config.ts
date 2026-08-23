import { defineConfig } from 'oxfmt'

export default defineConfig({
  embeddedLanguageFormatting: 'auto',
  semi: false,
  singleQuote: true,
  sortImports: true,
  trailingComma: 'all',
  sortPackageJson: {
    sortScripts: true,
  },
  printWidth: 80,
  jsxSingleQuote: true,
  jsdoc: false,
  quoteProps: 'as-needed',
  insertFinalNewline: true,
  proseWrap: 'always',

  overrides: [
    {
      files: [
        '*.js',
        '*.cjs',
        '*.mjs',
        '*.ts',
        '*.cts',
        '*.mts',
        '*.jsx',
        '*.tsx',
      ],
      options: {
        printWidth: 100,
      },
    },

    {
      files: ['*.config.ts'],
      options: {
        printWidth: 80,
      },
    },

    {
      files: ['.github/workflows/*.yml'],
      options: {
        printWidth: 120,
      },
    },
  ],

  ignorePatterns: ['dist', '.yarn', 'node_modules'],
})
