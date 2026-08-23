import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'

export default defineConfig({
  source: {
    entry: {
      index: './src/app/index.tsx',
    },
    tsconfigPath: './tsconfig.app.json',
  },

  output: {
    polyfill: 'usage',
  },

  plugins: [pluginReact()],

  tools: {
    rspack: {
      plugins: [
        process.env.RSDOCTOR === 'true' && new RsdoctorRspackPlugin<[]>(),
      ],
    },
  },
})
