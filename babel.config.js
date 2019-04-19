module.exports = {
  exclude: 'node_modules/**',
  presets: [
    '@babel/flow',
    [
      '@babel/env',
      {
        targets: {
          node: 6,
          browsers: ['last 4 version', '> 1%', 'not dead'],
        },
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        modules: false,
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
  env: {
    script: {
      presets: [
        [
          '@babel/env',
          {
            targets: { node: 'current' },
            useBuiltIns: 'usage',
            corejs: { version: 3, proposals: true },
            modules: 'commonjs',
          },
        ],
      ],
    },
  },
};
