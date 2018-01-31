import test from 'ava';
import { handler as func1Handler } from '~/src/lambdas/func1';
import invokeLambdaHandler from './util/invokeLambdaHandler';

test('func1 lambda handler should return proper name', async (t) => {
  const context = {} as AWSLambda.Context;
  const result: any = await invokeLambdaHandler(func1Handler, {}, context);
  t.is(result.name, 'func1');
});
