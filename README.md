# lambda-webpack-babel-typescript-starter

This project demonstrates using the following technologies:

- [AWS Lambda](https://aws.amazon.com/lambda/): AWS Lambda allows developers
  to deploy packages of executable JavaScript code to the AWS infrastructure
  and make it executable without having to worry about managing servers.

- [webpack](https://webpack.js.org/): `webpack` is used to create
  optimized bundles from JavaScript code that leverage ES6 modules.

- [babel](https://babeljs.io/): `babel` transpiles JavaScript code to
  JavaScript code that is compatible with various runtimes.

- [TypeScript](https://www.typescriptlang.org/): TypeScript is a typed
  superset of JavaScript that compiles to plain JavaScript.

- [bunyan](https://github.com/trentm/node-bunyan): `bunyan` provides
  structured JSON logging.

- [ava](https://github.com/avajs/ava): `ava` is a test runner.

- [tslint](https://github.com/palantir/tslint): `tslint` is a TypeScript linter.

- [yarn](https://yarnpkg.com/): `yarn` is a dependency manager that is an
  alternative to `npm`.

- [nyc](https://github.com/istanbuljs/nyc): `nyc` provides a command-line
  interface for calculating test code coverage with
  [istanbul](https://github.com/istanbuljs/istanbuljs).

- [chalk](https://github.com/chalk/chalk): `chalk` is used to add color to
  console output.

- [proxyquire](https://github.com/thlorenz/proxyquire): `proxyquire` is used
  to substitute mock modules at runtime when running tests.

## Usage

Clone this repo and make changes as you see fit. Push your changes
to your own repo.

## Goals

- Allow developers to use TypeScript for lambda functions, tests, and
  other source code.

- Also allow JavaScript files to be used (hopefully sparingly).

- Automatically compile JavaScript code related to AWS Lambda functions
  down to level supported by `node` `6.10` (which is currently the latest
  Node.js runtime that AWS lambda supports).

- Calculate test code coverage using `nyc` when running tests using `ava`.

- Create a bundle using `webpack` for each AWS Lambda function located at
  `src/lambdas/*`.

## Non-goals

- Create a server and relaunch when file changes (this is not necessary
  due to the nature of testing and deploying lambda functions).

- Provide a starter project that works for everyone.

- Provide deployment scripts (use something like [terraform](https://www.terraform.io/docs/providers/aws/r/lambda_function.html),
  [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html), or [aws-cli](https://docs.aws.amazon.com/cli/latest/reference/lambda/) if you need to deploy lambda functions).

## Scripts

- `yarn test`: Use this command to lint, compile `test/**/*` files with
  TypeScript, and run tests with `ava` and `nyc`. We use the following
  glob pattern for unit tests: `test/**/*.test.js`.

- `yarn build`: Use this command to compile and package lambda functions
  at `src/lambdas/*` to `work/dist/*.zip` files.

- `yarn lint`: Use this command to lint the `src/**/*` and `test/**/*`
  files with `tslint` (does not require compilation).

## Why do some module paths start with `~/`?

This starter project uses [require-self-ref](https://github.com/patrick-steele-idem/require-self-ref)
to make it possible to `require`/`import` relative to the root of the project.

For example, `import { sleep } from '~/src/util'` will always import
the `sleep` function from `src/util/index.ts` no matter which file
the import file is found in.

In the `webpack` configuration we provide an `resolve.alias` property
that automatically resolves `~/*` paths relative to the root of the project.

In the `tsc` (TypeScript compiler) configuration, we use a combination of
the `compilerOptions.baseUrl` and `compilerOptions.paths` properties to
configure how `~/*` paths are resolved.

At runtime, all test files include `import 'require-self-ref'` which
loads the `require-self-ref` module which tweaks the Node.js module
loader so that `~/*` paths are properly resolved at runtime. It's
not necessary to use `require-self-ref` for lambda functions because
the `webpack` bundling job will automatically inline all modules into
a single bundle.

## TypeScript (compiler)

[TypeScript](https://www.typescriptlang.org/) was chosen because it helps
developers write code with more compile-time safety checks via it's
flexible and powerful static typing.

### TypeScript Configuration

This project provides multiple TypeScript configuration files and their
usage is explained below.

- `tsconfig.json`: This TypeScript configuration file is used by IDEs such
  as Visual Studio Code and Atom Editor. The `includes` for this configuration
  include `src/**/*` and `test/**/*`.

  The _compilation_ scripts in this project **do not** use this configuration
  when compiling files because the output settings for `test` and `src`
  are different.

- `tsconfig-test.json`: This TypeScript configuration file is used to
  compile files in `test/` directory and the `module` output setting is
  `commonjs` so that they can be executed directly by Node.js runtime
  without having to be bundled or transpiled with `webpack` and `babel`.

- `tsconfig-src.json`: This TypeScript configuration file is used to
  compile files in `src/` directory and the `module` output setting is
  `ES6` and the output files cannot be executed directly by Node.js.
  It is assumed that `webpack` and `babel` will be used to create a
  JavaScript bundle that targets the Node.js runtime supported by
  AWS Lambda.

## WebPack (bundling)

The [webpack](https://webpack.js.org/) tool is used to create an
optimized bundle for each lambda function located at `src/lambdas/`.

The `webpack` tool is invoked via `yarn webpack` which cause `webpack` to
use the default configuration located at `webpack.config.json`.

This project **does not** use `webpack` to process code in the `test/*`
directory when running tests. The test code is only compiled by
the TypeScript compiler (`tsc`). The source files in `test/*` are
compiled from TypeScript down to `commonjs` modules so that they can be
loaded directly by the Node.js runtime.

**NOTE:** In earlier versions of this starter project, we tried to use
`rollup` but `rollup` poorly handled transforming JavaScript files
that had both ES6 `import`/`export` statements and CommonJS `require(...)`
statements in the same file.

In our use case, we wanted to be able to `require(...)` normal JavaScript files
and use `import`/`export` for ES6 modules created from TypeScript compiler.
That is, in our use case a single JavaScript file compiled from TypeScript
file might have a mix of `import`/`export` and `require(...)` statements.
When the [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs)
plugin saw `import`/`export` in a file then it didn't bother traversing
the `require(...)` statements (because it assumed that you don't mix
both in the same file). This caused code referenced in these `require(...)`
statements to not be bundled properly.

### WebPack Configuration

The webpack configuration for each lambda function is dynamically produced
inside `webpack.config.js`. `webpack` will automatically create a bundle as
described by the `entry` property. The `entry` property value is an object in
which each key is a bundle name and each associated value is the entry point
file.

## Babel (JavaScript to JavaScript transpiler)

The `babel` transpiler is integrated with `webpack` via `babel-loader` plugin.
This project is only configured to use `babel` when creating the AWS lambda
bundle files because we need to transpile all JavaScript files so that they
are compatible with the Node.js runtime supported by AWS Lambda. Currently,
the highest Node.js version supported bye AWS Lambda is `node` `6.10`.

### Babel Configuration

The `babel` configuration is embedded inside the `webpack` configuration which
allows flexibility in the future for having multiple `babel` configurations
for the various output targets.

The `babel-preset-env` package provides presets for `babel` that can be
used to target specific runtime environments (for example, `node` `6.10`).

The `babel` configuration is provided to `webpack-plugin-babel` instance and
it looks like the following for AWS Lambda functions:

```javascript
{
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
}
```

## Bunyan (logging)

This project uses `bunyan` because it uses structured JSON logging.

### Bunyan Configuration

Bunyan loggers are created and configured when they are created via
the `createLogger` function of `src/logging/index.ts`.

## Yarn Package Manager

This project provides a `yarn.lock` file and uses `yarn` as its package manager.
If you prefer `npm` then delete the `yarn.lock` file and run `npm install`
which will create a `package-lock.json` file.

## License

All source code for this project is provided under the MIT License.

See `LICENSE` file.

## Contributing

If you see ways to improve this project then please create a Pull Request
or an Issue.
