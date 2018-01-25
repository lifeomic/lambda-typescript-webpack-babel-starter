import * as path from 'path';

const bunyan = require('bunyan');
const PROJECT_NAME = require('~/package.json').name;
const BASEDIR = path.normalize(path.join(__dirname, '../..'));

function getLoggerName (moduleOrFile: string | NodeModule): string {
  let moduleFilename;

  if (moduleOrFile) {
    if (moduleOrFile.constructor === String) {
      moduleFilename = moduleOrFile as string;
    } else {
      // NOTE: `webpack` module loader doesn't add a `filename` to `Module`
      // instance so we can't rely on that if this source file was bundled
      // via `webpack`.
      moduleFilename = (moduleOrFile as NodeModule).filename;
    }

    if (moduleFilename) {
      moduleFilename = moduleFilename.toString();
      const pos = moduleFilename.indexOf(BASEDIR);
      if (pos !== -1) {
        moduleFilename = moduleFilename.substring(BASEDIR.length + 1);
      }
    }
  }

  let name = moduleFilename || BASEDIR;
  if (name === '/') {
    name = PROJECT_NAME;
  }

  return name;
}

export function createLogger (moduleOrFile: string | NodeModule, options?: any) {
  let serializers;

  if (options) {
    if (options.serializers) {
      serializers = Object.assign({}, bunyan.stdSerializers, options.serializers);
    }
  }

  return bunyan.createLogger({
    level: 'info',
    name: getLoggerName(moduleOrFile),
    serializers: serializers || bunyan.stdSerializers
  });
}
