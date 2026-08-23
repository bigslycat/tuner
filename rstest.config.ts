import { withRsbuildConfig } from '@rstest/adapter-rsbuild'
import { defineConfig } from '@rstest/core'

export default defineConfig({
  extends: withRsbuildConfig(),

  source: {
    tsconfigPath: './tsconfig.test.json',
  },

  testEnvironment: 'happy-dom',
  globals: false,

  coverage: {
    provider: 'istanbul',
    include: ['src/**/*.ts'],
    reporters: ['text', 'json-summary', 'lcovonly', 'cobertura'],
    reportOnFailure: true,
  },
})
