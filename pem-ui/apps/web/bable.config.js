const transpileModules = require('babel-plugin-transpile-modules');

module.exports = function (api) {
  api.cache(true);

  const presets = ['@babel/preset-env', '@babel/preset-react'];

  const plugins = [
    transpileModules(['package-to-transform', 'another-package'])
    // Add any other plugins you need
  ];

  return {
    presets,
    plugins
  };
};
