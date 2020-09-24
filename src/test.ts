import { UnisonHT, WebApi } from '@unisonht/unisonht';
import { Roku } from '.';

const port = 3000;
const unisonht = new UnisonHT({});
unisonht.use(new WebApi({ port }));

unisonht.use(
    new Roku('roku', {
        url: 'http://192.168.1.12:8060',
    }),
);

async function discover() {
    const rokus = await Roku.discoverAll();
    rokus.forEach((roku) => {
        console.log(roku);
    });
}

async function start() {
    await unisonht.start();
    console.log(`Listening http://localhost:${port}`);
}

start();
