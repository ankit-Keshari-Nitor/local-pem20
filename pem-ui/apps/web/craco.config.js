const path = require('path');

const packages = [
  {
    folderPath: '../../../../b2bi-ui-shared/packages/shell/src',
    nodePath: '@b2bi/shell'
  },
  {
    folderPath: '../../../../b2bi-ui-shared/packages/styles',
    nodePath: '@b2bi/styles'
  },
  {
    folderPath: '../../packages/carbon-mappers/src',
    nodePath: '@b2bi/carbon-mappers'
  },
  {
    folderPath: '../../packages/flow-designer/src',
    nodePath: '@b2bi/flow-designer'
  },
  {
    folderPath: '../../packages/page-designer/src',
    nodePath: '@b2bi/page-designer'
  }
];

const getBabelAliases = () => {
  const aliases = {};
  packages.forEach((package) => {
    aliases[package.nodePath] = path.resolve(__dirname, package.folderPath);
  });
  return aliases;
};

module.exports = {
  babel: {
    presets: [],
    plugins: [
      [
        'module-resolver',
        {
          //root: ['./src'],
          alias: {
            ...getBabelAliases(),
            react: 'react', // Ensure React is resolved from your application's node_modules
            'react-dom': 'react-dom'
            // Add more aliases as needed
          }
        }
      ]
    ],
    //loaderOptions: {  },
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      console.log(babelLoaderOptions);
      return babelLoaderOptions;
    }
  },
  webpack: {
    configure: (webpackConfig) => {
      // Find the rule that processes JavaScript/TypeScript files
      console.log(webpackConfig.resolve.extensions);
      const jsRule = webpackConfig.module.rules.find((rule) => rule.oneOf);

      if (jsRule) {
        // Add 'node_modules' to the list of directories to compile with the Babel loader
        //const folderToCompile = path.resolve(__dirname, 'node_modules/@b2bi/es-lib');

        jsRule.oneOf.forEach((loadRule) => {
          if (loadRule.loader && loadRule.loader.includes('babel-loader')) {
            // Include 'node_modules' in the list of directories to process
            if (loadRule.include === undefined) {
              loadRule.include = [];
            }
            if (!Array.isArray(loadRule.include)) {
              loadRule.include = [loadRule.include];
            }
            packages.forEach((packageToInclude) => {
              /*if (packageToInclude.nodePath) {
                loadRule.include.push(path.resolve(__dirname, `node_modules/${packageToInclude.nodePath}`));
              }*/
              if (packageToInclude.folderPath) {
                loadRule.include.push(path.resolve(__dirname, `${packageToInclude.folderPath}`));
              }
            });
            console.log(loadRule.include);
            //console.log(JSON.stringify(loadRule.exclude));

            loadRule.resolve = {
              fullySpecified: false
            };
          }
        });
      }
      //console.log(JSON.stringify(webpackConfig));
      //console.log(jsRule);
      //console.log(JSON.stringify(jsRule));
      console.log(webpackConfig.module.rules);
      //console.log(webpackConfig);

      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter((plugin) => !(plugin && plugin.constructor && plugin.constructor.name === 'ModuleScopePlugin'));

      // Add aliases for the excluded folder if needed
      webpackConfig.resolve.alias = {
        // Add your aliases here
        // For example:
        //'@b2bi/shell': path.resolve(__dirname, '../../../../b2bi-ui-shared/packages/shell'),
        react: path.resolve(__dirname, '../../node_modules/react'),
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom')
      };

      console.log('webpackConfig.resolveLoader', webpackConfig.resolveLoader);
      webpackConfig.resolveLoader = {
        modules: ['node_modules']
      };
      return webpackConfig;
    }
  }
};
