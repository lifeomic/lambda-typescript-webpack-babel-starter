const path = require('path');
const fs = require('fs');
const lambdaDir = 'src/lambdas';
const lambdaNames = fs.readdirSync(path.join(__dirname, lambdaDir));
const nodeBuiltins = require('builtin-modules');
const DIST_DIR = path.join(__dirname, 'work/dist');

const entry = {};
const externalsArray = [
  'aws-sdk'
].concat(nodeBuiltins);

for (const lambdaName of lambdaNames) {
  entry[lambdaName] = path.join(DIST_DIR, lambdaDir, `${lambdaName}/index.js`);
}

const externals = {};

for (const external of externalsArray) {
  externals[external] = external;
}

module.exports = {
  entry,
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
  externals,
  resolve: {
    alias: {
      '~': DIST_DIR
    }
  }
};
