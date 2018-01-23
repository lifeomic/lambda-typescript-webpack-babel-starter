# lambda-rollup-babel-typescript-starter

This project demonstrates using the following technologies:

- [AWS Lambda](https://aws.amazon.com/lambda/): AWS Lambda allows developers
  to deploy packages of executable JavaScript code to the AWS infrastructure
  and make it executable without having to worry about managing servers.

- [rollup](https://github.com/rollup/rollup): `rollup` is used to create
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

- [nyc](https://github.com/istanbuljs/nyc): `nyc` is a test code coverage tool.

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

- Create a bundle using `rollup` for each AWS Lambda function located at
  `src/lambdas/*`.

## Non-goals

- Create a server and relaunch when file changes (this is not necessary
  due to the nature of testing and deploying lambda functions).

## Scripts

- `yarn test`: Use this command to lint, compile `test/**/*` files with
  TypeScript, and run tests with `ava` and `nyc`. We use the following
  glob pattern for unit tests: `test/**/*.test.js`.

- `yarn build`: Use this command to compile and package lambda functions
  at `src/lambdas/*` to `work/dist/*.zip` files.

- `yarn lint`: Use this command to lint the `src/**/*` and `test/**/*`
  files with `tslint` (does not require compilation).

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
  without having to be bundled or transpiled with `rollup` and `babel`.

- `tsconfig-src.json`: This TypeScript configuration file is used to
  compile files in `src/` directory and the `module` output setting is
  `ES6` and the output files cannot be executed directly by Node.js.
  It is assumed that `rollup` and `babel` will be used to create a
  JavaScript bundle that targets the Node.js runtime supported by
  AWS Lambda.

## Rollup (bundling)

The [rollup](https://github.com/rollup/rollup) tool is used to create an
optimized bundle for each lambda function located at `src/lambdas`.

The `rollup` is invoked `tools/bin/bundle-lambda` which uses the `rollup`
JavaScript API. The JavaScript API is used instead of the CLI because this
allows us to dynamically read the contents of `src/lambdas/*` at build time and
automatically generate a unique bundle configuration for each lambda function.

This project **does not** use `rollup` to pre-process code in the `test/*`
directory when running tests. The test code is only pre-processed once by
the TypeScript compiler (`tsc`). The source files in `test/*` are automatically
compiled down to `commonjs` modules so that they can be loaded directly by
the Node.js runtime.

### Rollup Configuration

The rollup configuration for each lambda function is dynamically produced
by the `rollup.config-factory.js` moodule at the root of the project.

For example, `require('./rollup.config-factory.js').createLambdaConfig('func1')`
will create the `rollup` configuration for the `func1` AWS lambda function.

## Babel (JavaScript to JavaScript transpiler)

The `babel` transpiler is integrated with `rollup` via `rollup-plugin-babel`.
This project is only configured to use `babel` when creating the AWS lambda
bundle files because we need to transpile all JavaScript files so that they
are compatible with the Node.js runtime supported by AWS Lambda. Currently,
the highest Node.js version supported bye AWS Lambda is `node` `6.10`.

### Babel Configuration

The `babel` configuration is embedded inside the `rollup` configuration which
allows flexibility in the future for having multiple `babel` configurations
for the various output targets.

The `babel-preset-env` package provides presets for `babel` that can be
used to target specific runtime environments (for example, `node` `6.10`).

The `babel` configuration is provided to `rollup-plugin-babel` instance and
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
