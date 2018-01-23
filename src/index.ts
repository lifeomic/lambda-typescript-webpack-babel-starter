import { sleep } from '~/src/util';

async function run () {
  console.log('Going to sleep...');
  await sleep(1000);
  console.log('Finished sleeping.');
}

run().then(() => {
  console.log('DONE');
}).catch((err) => {
  console.error('ERROR:', err.stack || err.toString());
});
