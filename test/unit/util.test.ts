import test from 'ava';
import * as util from '~/src/util';

test('addAsync should add two numbers asynchronously', async (t) => {
  const answer = await util.addAsync(1, 2);
  t.is(answer, 3);
});
