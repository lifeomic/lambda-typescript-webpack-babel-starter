import { sleep } from '~/src/util';
import { createLogger } from '~/src/logging';

const logger = createLogger(module);
const SLEEP_DURATION_IN_MILLISECONDS = 1000;
const endsWith = require('~/src/util/endsWith');

async function run (event: any, context: AWSLambda.Context) {
  logger.info({
    SLEEP_DURATION_IN_MILLISECONDS
  }, `Waiting...`);
  await sleep(1000);
  logger.info(`Finished waiting.`);

  const message = (endsWith(event.command, 'world'))
    ? 'hello to world'
    : 'hello to something else';

  return {
    name: 'func2',
    message
  };
}

export function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {
  run(event, context).then((result) => {
    logger.info({
      event
    }, `${result.name} finished`);
    callback(null, result);
  }).catch((err) => {
    logger.error(err, 'Error occurred');
    callback(err);
  });
}
