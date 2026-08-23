import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc'],

  categories: {
    correctness: 'error',
  },

  env: {
    builtin: true,
  },

  options: {
    typeAware: true,
    typeCheck: false,
  },

  ignorePatterns: ['dist', '.yarn', 'node_modules'],
})
