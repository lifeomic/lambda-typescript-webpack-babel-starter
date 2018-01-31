import test from 'ava';
import { handler as func2Handler } from '~/src/lambdas/func2';
import invokeLambdaHandler from './util/invokeLambdaHandler';

test('func2 lambda handler should return correct name and message if command ends with "world"', async (t) => {
  const context = {} as AWSLambda.Context;
  const input = { command: 'hello world' };
  const result = await invokeLambdaHandler(func2Handler, input, context);
  t.deepEqual(result, {
    name: 'func2',
    message: 'hello to world'
  });
});

test('func2 lambda handler should return correct name and message if command does not end with "world"', async (t) => {
  const context = {} as AWSLambda.Context;
  const event = { command: 'hello blah' };
  const result = await invokeLambdaHandler(func2Handler, event, context);
  t.deepEqual(result, {
    name: 'func2',
    message: 'hello to something else'
  });
});
