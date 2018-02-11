/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */
const path = require('path');
const fs = require('fs');
const nodeBuiltins = require('builtin-modules');

const lambdaDir = 'src/lambdas';
const lambdaNames = fs.readdirSync(path.join(__dirname, lambdaDir));

const DIST_DIR = path.join(__dirname, 'work/dist');

const entry = lambdaNames
  .reduce((entryMap, lambdaName) => {
    entryMap[lambdaName] = [
      'source-map-support/register',
      path.join(DIST_DIR, lambdaDir, `${lambdaName}/index.js`)
    ];
    return entryMap;
  }, {});

const externals = ['aws-sdk']
  .concat(nodeBuiltins)
  .reduce((externalsMap, moduleName) => {
    externalsMap[moduleName] = moduleName;
    return externalsMap;
  }, {});

module.exports = {
  entry,
  externals,

  output: {
    path: path.join(__dirname, 'work/dist'),
    libraryTarget: 'commonjs',
    filename: '[name]/index.js'
  },

  target: 'node',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [],
        use: 'babel-loader'
      }
    ]
  },

  resolve: {
    alias: {
      '~': DIST_DIR
    }
  },

  devtool: 'source-map'
};
