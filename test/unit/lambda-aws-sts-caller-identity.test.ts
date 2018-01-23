/**
 * This unit test is used to test a lambda function that uses
 * the `aws-sdk`. In this starter project, the `aws-sts-caller-identy`
 * Lambda function uses the `STS` class provided by the `aws-sdk` to
 * get the 'caller identity'. Since our test is not actually given
 * AWS credentials, we create a mock for `aws-sdk` and use `proxyquire`
 * to replace the actual `aws-sdk` our mock;
 */
import 'require-self-ref';
import test from 'ava';
import * as proxyquire from 'proxyquire';
import invokeLambdaHandler from './util/invokeLambdaHandler';

class MockSTS {
  getCallerIdentity () {
    return {
      promise () {
        return new Promise((resolve, reject) => {
          resolve({
            Account: '123456789012',
            Arn: 'arn:aws:iam::123456789012:user/Alice',
            UserId: 'AKIAI44QH8DHBEXAMPLE'
          });
        });
      }
    };
  }
}

const MockAWS = {
  STS: MockSTS
};

const lambdaCallerIdentity = proxyquire('~/src/lambdas/aws-sts-caller-identity', {
  'aws-sdk': MockAWS
});

test('aws-sts-caller-identity lambda handler should return result', async (t) => {
  const context = {} as AWSLambda.Context;
  const result: any = await invokeLambdaHandler(lambdaCallerIdentity.handler, {}, context);
  t.deepEqual(result, {
    Account: '123456789012',
    Arn: 'arn:aws:iam::123456789012:user/Alice',
    UserId: 'AKIAI44QH8DHBEXAMPLE'
  });
});
