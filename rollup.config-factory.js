/**
 * Thius module exports a `createLambdaConfig` function that is used to
 * create `rollup` configuration for given lambda function name.
 *
 * It is used by `tools/bin/bundle` to create a bundle for each
 * lambda function at `src/lambdas/*`.
 */
const resolvePlugin = require('rollup-plugin-node-resolve');
const babelPlugin = require('rollup-plugin-babel');
const commonjsPlugin = require('rollup-plugin-commonjs');
const resolve = require('resolve');
const path = require('path');

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

exports.createLambdaConfig = function (lambdaFuncName) {
  // See rollup JavaScript API documentation https://rollupjs.org/guide/en
  // for description of `inputOptions` and `outputOptions`.

  const inputOptions = {
    external: ['aws-sdk'],
    input: path.join(INPUT_DIR, `src/lambdas/${lambdaFuncName}/index.js`),
    plugins: [
      projectResolver,
      resolvePlugin({
        preferBuiltins: true
      }),
      commonjsPlugin({
        ignore: ['aws-sdk']
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
    ]
  };

  const outputOptions = {
    file: path.join(OUTPUT_DIR, `${lambdaFuncName}/index.js`),
    format: 'cjs'
  };

  return {
    inputOptions,
    outputOptions
  };
};
