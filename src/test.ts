import { UnisonHT } from '@unisonht/unisonht';
import { Roku } from '.';
import Debug from 'debug';

const debug = Debug('roku:test');

const port = 3000;
const unisonht = new UnisonHT({});

unisonht.use(
  new Roku('roku', {
    url: 'http://192.168.1.12:8060',
  }),
);

async function discover() {
  const rokus = await Roku.discoverAll();
  rokus.forEach(roku => {
    debug('%o', roku);
  });
}

async function start() {
  await unisonht.listen(port);
  debug(`Listening http://localhost:${port}`);
}

start();
