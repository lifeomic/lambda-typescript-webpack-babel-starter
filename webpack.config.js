/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */
const path = require('path');
const fs = require('fs');
const lambdaDir = 'src/lambdas';
const lambdaNames = fs.readdirSync(path.join(__dirname, lambdaDir));
const nodeBuiltins = require('builtin-modules');
const DIST_DIR = path.join(__dirname, 'work/dist');

module.exports = {
  entry: lambdaNames.reduce((entry, lambdaName) => {
    entry[lambdaName] = path.join(DIST_DIR, lambdaDir, `${lambdaName}/index.js`);
    return entry;
  }, {}),
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
  externals: ['aws-sdk'].concat(nodeBuiltins).reduce((externals, moduleName) => {
    externals[moduleName] = moduleName;
    return externals;
  }, {}),
  resolve: {
    alias: {
      '~': DIST_DIR
    }
  }
};
