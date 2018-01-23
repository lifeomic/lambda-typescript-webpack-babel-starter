/**
 * This is module exports a `handler` function which is the entry point
 * for each invocation of this lambda function.
 */

import { sleep } from '~/src/util';
import { createLogger } from '~/src/logging';

const logger = createLogger(module);
const SLEEP_DURATION_IN_MILLISECONDS = 1000;

async function run (event: any, context: AWSLambda.Context) {
  logger.info({
    SLEEP_DURATION_IN_MILLISECONDS
  }, `Waiting...`);
  await sleep(SLEEP_DURATION_IN_MILLISECONDS);
  logger.info(`Finished waiting.`);
  return {
    name: 'func1'
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
