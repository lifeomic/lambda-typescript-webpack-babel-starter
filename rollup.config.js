/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */

const resolvePlugin = require('rollup-plugin-node-resolve');
const babelPlugin = require('rollup-plugin-babel');
const commonjsPlugin = require('rollup-plugin-commonjs');
const resolve = require('resolve');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'work/dist');
const INPUT_DIR = OUTPUT_DIR;

const resolveOptions = {
  basedir: INPUT_DIR
};

const projectResolver = {
  resolveId (importee, importer) {
    if (importee.startsWith('~/')) {
      return resolve.sync(path.join(INPUT_DIR, importee.substring(2)), resolveOptions);
    }
  }
};

const configs = [];

const lambdaNames = fs.readdirSync(path.join(__dirname, 'src/lambdas'));

for (let i = 0; i < lambdaNames.length; i++) {
  const lambdaName = lambdaNames[i];
  configs.push({
    external: [
      'aws-sdk',
      'path',
      'os',
      'fs',
      'util',
      'assert',
      'events',
      'stream'
    ],
    input: path.join(INPUT_DIR, `src/lambdas/${lambdaName}/index.js`),
    plugins: [
      projectResolver,
      commonjsPlugin({
        include: 'node_modules/**'
      }),
      resolvePlugin({
        preferBuiltins: true
      }),
      babelPlugin({
        presets: [
          [
            'env',
            {
              targets: {
                node: '6.10'
              },
              modules: false
            }
          ]
        ],
        plugins: [
          'external-helpers'
        ]
      })
    ],
    output: {
      file: path.join(OUTPUT_DIR, `${lambdaName}/index.js`),
      format: 'cjs'
    }
  });
}

export default configs;
