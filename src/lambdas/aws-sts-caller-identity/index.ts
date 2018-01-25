import { createLogger } from '~/src/logging';
import { STS } from 'aws-sdk';

const logger = createLogger(module);

async function run (event: any, context: AWSLambda.Context) {
  const sts = new STS();
  return sts.getCallerIdentity({}).promise();
}

export function handler (event: any, context: AWSLambda.Context, callback: AWSLambda.Callback) {
  run(event, context).then((result: any) => {
    callback(null, result);
  }).catch((err) => {
    logger.error(err, 'Error occurred');
    callback(err);
  });
}
