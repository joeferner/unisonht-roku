import {UnisonHT} from "unisonht";
import {Roku} from ".";

const port = 3000;
const unisonht = new UnisonHT({});

unisonht.use(new Roku('roku', {
    url: 'http://192.168.1.12:8060'
}));

async function discover() {
    const rokus = await Roku.discoverAll();
    rokus.forEach(roku => {
        console.log(roku);
    });
}

async function start() {
    await unisonht.listen(port);
    console.log(`Listening http://localhost:${port}`);
}

start();
