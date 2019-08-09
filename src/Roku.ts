import {
    ButtonNotFoundError,
    DeviceStatus,
    NextFunction,
    NotFoundError,
    RouteHandlerRequest,
    RouteHandlerResponse,
    StandardKey,
    UnisonHT,
    UnisonHTDevice
} from "unisonht";
import Client, {keys} from 'roku-client';
import {KeyType} from "roku-client/dist/keyCommand";
import {App} from "roku-client/dist/client";
import Debug from 'debug';

const debug = Debug('roku');

export interface RokuOptions {
    url: string;
}

export interface RokuInfo {
    ip: string;
    udn?: string;
    serialNumber?: string;
    deviceId?: string;
    advertisingId?: string;
    vendorName?: string;
    modelName?: string;
    modelNumber?: string;
    modelRegion?: string;
    isTv?: boolean;
    isStick?: boolean;
    supportsEthernet?: boolean;
    wifiMac?: string;
    wifiDriver?: string;
    ethernetMac?: string;
    networkType?: string;
    friendlyDeviceName?: string;
    friendlyModelName?: string;
    defaultDeviceName?: string;
    userDeviceName?: string;
    buildNumber?: string;
    softwareVersion?: string;
    softwareBuild?: string;
    secureDevice?: boolean;
    language?: string;
    country?: string;
    locale?: string;
    timeZoneAuto?: boolean;
    timeZone?: string;
    timeZoneName?: string;
    timeZoneTz?: string;
    timeZoneOffset?: string;
    clockFormat?: string;
    uptime?: number;
    powerMode?: string;
    supportsSuspend?: boolean;
    supportsFindRemote?: boolean;
    findRemoteIsPossible?: boolean;
    supportsAudioGuide?: boolean;
    supportsRva?: boolean;
    developerEnabled?: boolean;
    keyedDeveloperId?: string;
    searchEnabled?: boolean;
    searchChannelsEnabled?: boolean;
    voiceSearchEnabled?: boolean;
    notificationsEnabled?: boolean;
    notificationsFirstUse?: boolean;
    supportsPrivateListening?: boolean;
    headphonesConnected?: boolean;
    supportsEcsTextedit?: boolean;
    supportsEcsMicrophone?: boolean;
    supportsWakeOnWlan?: boolean;
    hasPlayOnRoku?: boolean;
    hasMobileScreensaver?: boolean;
    supportUrl?: string;
    grandcentralVersion?: string;
    davinciVersion?: string;
}

interface ClientAndClientInfo {
    client: Client;
    clientInfo: Record<string, string>;
}

interface KeyMapItem {
    rokuKey: KeyType;
}

interface KeyMap {
    [key: string]: KeyMapItem;
}

const KEY_MAP: KeyMap = {
    [StandardKey.HOME]: {
        rokuKey: keys.HOME
    },
    [StandardKey.REVERSE]: {
        rokuKey: keys.REVERSE
    },
    [StandardKey.FORWARD]: {
        rokuKey: keys.FORWARD
    },
    [StandardKey.PLAY]: {
        rokuKey: keys.PLAY
    },
    [StandardKey.SELECT]: {
        rokuKey: keys.SELECT
    },
    [StandardKey.LEFT]: {
        rokuKey: keys.LEFT
    },
    [StandardKey.RIGHT]: {
        rokuKey: keys.RIGHT
    },
    [StandardKey.UP]: {
        rokuKey: keys.UP
    },
    [StandardKey.DOWN]: {
        rokuKey: keys.DOWN
    },
    [StandardKey.BACK]: {
        rokuKey: keys.BACK
    },
    [StandardKey.INFO]: {
        rokuKey: keys.INFO
    },
    [StandardKey.ENTER]: {
        rokuKey: keys.ENTER
    },
    [StandardKey.VOLUME_UP]: {
        rokuKey: keys.VOLUME_UP
    },
    [StandardKey.VOLUME_DOWN]: {
        rokuKey: keys.VOLUME_DOWN
    },
    [StandardKey.MUTE]: {
        rokuKey: keys.VOLUME_MUTE
    },
    [StandardKey.CHANNEL_UP]: {
        rokuKey: keys.CHANNEL_UP
    },
    [StandardKey.CHANNEL_DOWN]: {
        rokuKey: keys.CHANNEL_DOWN
    },
    [StandardKey.POWER_TOGGLE]: {
        rokuKey: keys.POWER
    },
    [StandardKey.INSTANT_REPLAY]: {
        rokuKey: keys.INSTANT_REPLAY
    },
    [StandardKey.BACKSPACE]: {
        rokuKey: keys.BACKSPACE
    },
    [StandardKey.SEARCH]: {
        rokuKey: keys.SEARCH
    },
    [StandardKey.FIND_REMOTE]: {
        rokuKey: keys.FIND_REMOTE
    },
    [StandardKey.INPUT_TUNER]: {
        rokuKey: keys.INPUT_TUNER
    },
    [StandardKey.INPUT_HDMI1]: {
        rokuKey: keys.INPUT_HDMI1
    },
    [StandardKey.INPUT_HDMI2]: {
        rokuKey: keys.INPUT_HDMI2
    },
    [StandardKey.INPUT_HDMI3]: {
        rokuKey: keys.INPUT_HDMI3
    },
    [StandardKey.INPUT_HDMI4]: {
        rokuKey: keys.INPUT_HDMI4
    },
    [StandardKey.INPUT_AV1]: {
        rokuKey: keys.INPUT_AV1
    },
};

export class Roku implements UnisonHTDevice {
    private readonly deviceName: string;
    private readonly client: Client;
    private apps: App[] | undefined;

    constructor(deviceName: string, options: RokuOptions) {
        this.deviceName = deviceName;
        this.client = new Client(options.url);
    }

    getDeviceName(): string {
        return this.deviceName;
    }

    async initialize(unisonht: UnisonHT): Promise<void> {
        unisonht.post(this, 'launch/:app', {
            handler: this.handleLaunch.bind(this)
        })
    }

    async handleLaunch(
        request: RouteHandlerRequest,
        response: RouteHandlerResponse,
        next: NextFunction
    ): Promise<void> {
        const app = request.parameters['app'];
        let appId: string | number = parseInt(app);
        if (isNaN(appId)) {
            const a: App | undefined = await this.findApp(app);
            if (!a) {
                return next(new NotFoundError(request.url));
            }
            appId = a.id;
        }
        debug(`launching "${app}" (appId: ${appId})`);
        await this.client.launch(appId);
        response.send();
    }

    private async findApp(app: string): Promise<App | undefined> {
        const filterMatches = (apps: App[]) => {
            return apps.filter(a => {
                return a.id === app
                    || a.name.toLocaleLowerCase() === app.toLocaleLowerCase();
            });
        };

        if (!this.apps) {
            this.apps = await this.client.apps();
        }
        let matches = filterMatches(this.apps);
        if (matches.length === 0) {
            this.apps = await this.client.apps();
            matches = filterMatches(this.apps);
            if (matches.length === 0) {
                return undefined;
            }
        }
        if (matches.length === 1) {
            return matches[0];
        }
        throw new Error(`Too many matches for "${app}". Expected 0 or 1 found ${matches.length}`);
    }

    async getStatus(): Promise<DeviceStatus> {
        const [info, active, apps] = await Promise.all([
            this.client.info(),
            this.client.active(),
            this.client.apps()
        ]);
        this.apps = apps;
        return {
            ...Roku.normalizeInfo(info),
            activeApp: active,
            apps
        };
    }

    async handleKeyPress(
        key: string,
        request: RouteHandlerRequest,
        response: RouteHandlerResponse,
        next: NextFunction
    ): Promise<void> {
        const k = KEY_MAP[key];
        if (!k) {
            return next(new ButtonNotFoundError(key));
        }
        await this.client.keypress(k.rokuKey);
        response.send();
    }

    static async discoverAll(timeout?: number): Promise<RokuInfo[]> {
        const clients = await Client.discoverAll(timeout);
        const clientAndClientInfos = await Promise.all(clients.map(client => {
            return new Promise<ClientAndClientInfo>((resolve, reject) => {
                client.info()
                    .then(clientInfo => {
                        return resolve({client, clientInfo});
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        }));
        return clientAndClientInfos.map(data => {
            const {client, clientInfo} = data;
            const obj: any = {
                ip: client.ip,
                ...clientInfo
            };
            Roku.normalizeInfo(obj);
            return obj as RokuInfo;
        });
    }

    private static normalizeInfo(obj: any): any {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (value === 'true') {
                obj[key] = true;
            } else if (value === 'false') {
                obj[key] = false;
            } else if (key === 'uptime') {
                obj[key] = parseInt(value);
            }
        });
        return obj;
    }
}
