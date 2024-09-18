const babel = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const postcss = require('rollup-plugin-postcss');
const path = require('path');

module.exports = {
  input: 'src/index.js', // Entry point of your library
  external: [/node_modules/],
  output: [
    /*{
      file: 'dist/bundle1.js', // Output bundle file
      format: 'umd', // UMD format works well for libraries
      name: '@b2bi/shell', // The global variable name for your library
      exports: "named",
    },*/
    {
      file: 'dist/bundle1.esm.js', // Output ES module file
      format: 'esm', // ES module format
      exports: 'named'
    }
  ],
  plugins: [
    nodeResolve(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**', // Exclude node_modules
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: ['extends browserslist-config-carbon']
            }
          }
        ],
        '@babel/preset-react'
      ],
      plugins: [
        'dev-expression',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-react-constant-elements'
      ],
      babelHelpers: 'bundled'
    }),
    postcss({
      use: [
        [
          'sass',
          {
            includePaths: ['../../node_modules', path.resolve('node_modules')]
          }
        ]
      ]
    })
  ]
};
