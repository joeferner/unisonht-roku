import {
    ButtonNotFoundError,
    DeviceStatus,
    NextFunction,
    NotFoundError,
    RouteHandlerRequest,
    RouteHandlerResponse,
    StandardButton,
    SupportedButton,
    SupportedButtons,
    UnisonHT,
    UnisonHTDevice,
} from '@unisonht/unisonht';
import Client, { Keys } from 'roku-client';
import { KeyType } from 'roku-client/dist/keyCommand';
import { RokuApp } from 'roku-client/dist/client';
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

interface ButtonMapItem extends SupportedButton {
    rokuKey: KeyType;
}

interface ButtonMap {
    [button: string]: ButtonMapItem;
}

export class Roku implements UnisonHTDevice {
    private readonly deviceName: string;
    private readonly client: Client;
    private readonly buttonMap: ButtonMap;
    private apps: RokuApp[] | undefined;

    constructor(deviceName: string, options: RokuOptions) {
        this.deviceName = deviceName;
        this.client = new Client(options.url);
        this.buttonMap = {
            [StandardButton.HOME]: this.createButton('Home', Keys.HOME),
            [StandardButton.REVERSE]: this.createButton('Reverse', Keys.REVERSE),
            [StandardButton.FORWARD]: this.createButton('Forward', Keys.FORWARD),
            [StandardButton.PLAY]: this.createButton('Play', Keys.PLAY),
            [StandardButton.SELECT]: this.createButton('Select', Keys.SELECT),
            [StandardButton.LEFT]: this.createButton('Left', Keys.LEFT),
            [StandardButton.RIGHT]: this.createButton('Right', Keys.RIGHT),
            [StandardButton.UP]: this.createButton('Up', Keys.UP),
            [StandardButton.DOWN]: this.createButton('Down', Keys.DOWN),
            [StandardButton.BACK]: this.createButton('Back', Keys.BACK),
            [StandardButton.INFO]: this.createButton('Info', Keys.INFO),
            [StandardButton.ENTER]: this.createButton('Enter', Keys.ENTER),
            [StandardButton.VOLUME_UP]: this.createButton('Volume Up', Keys.VOLUME_UP),
            [StandardButton.VOLUME_DOWN]: this.createButton('Volume Down', Keys.VOLUME_DOWN),
            [StandardButton.MUTE]: this.createButton('Mute', Keys.VOLUME_MUTE),
            [StandardButton.CHANNEL_UP]: this.createButton('Channel Up', Keys.CHANNEL_UP),
            [StandardButton.CHANNEL_DOWN]: this.createButton('Channel Down', Keys.CHANNEL_DOWN),
            [StandardButton.POWER_TOGGLE]: this.createButton('Power Toggle', Keys.POWER),
            [StandardButton.INSTANT_REPLAY]: this.createButton('Instant Replay', Keys.INSTANT_REPLAY),
            [StandardButton.BACKSPACE]: this.createButton('Backspace', Keys.BACKSPACE),
            [StandardButton.SEARCH]: this.createButton('Search', Keys.SEARCH),
            [StandardButton.FIND_REMOTE]: this.createButton('Find Remote', Keys.FIND_REMOTE),
            [StandardButton.INPUT_TUNER]: this.createButton('Input: Tuner', Keys.INPUT_TUNER),
            [StandardButton.INPUT_HDMI1]: this.createButton('Input: HDMI1', Keys.INPUT_HDMI1),
            [StandardButton.INPUT_HDMI2]: this.createButton('Input: HDMI2', Keys.INPUT_HDMI2),
            [StandardButton.INPUT_HDMI3]: this.createButton('Input: HDMI3', Keys.INPUT_HDMI3),
            [StandardButton.INPUT_HDMI4]: this.createButton('Input: HDMI4', Keys.INPUT_HDMI4),
            [StandardButton.INPUT_AV1]: this.createButton('Input: AV1', Keys.INPUT_AV1),
        };
    }

    private createButton(name: string, rokuKey: any): ButtonMapItem {
        return {
            name,
            rokuKey,
            handleButtonPress: async (
                key: string,
                request: RouteHandlerRequest,
                response: RouteHandlerResponse,
                next: NextFunction,
            ): Promise<void> => {
                const k = this.buttonMap[key];
                if (!k) {
                    return next(new ButtonNotFoundError(key));
                }
                await this.client.keypress(k.rokuKey);
                response.send();
            },
        };
    }

    public getSupportedButtons(): SupportedButtons {
        return this.buttonMap;
    }

    public getDeviceName(): string {
        return this.deviceName;
    }

    public async initialize(unisonht: UnisonHT): Promise<void> {
        unisonht.post(this, 'launch/:app', {
            handler: this.handleLaunch.bind(this),
        });
    }

    private async handleLaunch(
        request: RouteHandlerRequest,
        response: RouteHandlerResponse,
        next: NextFunction,
    ): Promise<void> {
        const app = request.parameters.app;
        let appId: string | number = parseInt(app, 10);
        if (isNaN(appId)) {
            const a: RokuApp | undefined = await this.findApp(app);
            if (!a) {
                return next(new NotFoundError(request.url));
            }
            appId = a.id;
        }
        debug(`launching "${app}" (appId: ${appId})`);
        await this.client.launch(appId);
        response.send();
    }

    private async findApp(app: string): Promise<RokuApp | undefined> {
        const filterMatches = (apps: RokuApp[]) => {
            return apps.filter((a) => {
                return a.id === app || a.name.toLocaleLowerCase() === app.toLocaleLowerCase();
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

    public async getStatus(): Promise<DeviceStatus> {
        const [info, active, apps] = await Promise.all([this.client.info(), this.client.active(), this.client.apps()]);
        this.apps = apps;
        return {
            ...Roku.normalizeInfo(info),
            activeApp: active,
            apps,
        };
    }

    public static async discoverAll(timeout?: number): Promise<RokuInfo[]> {
        const clients = await Client.discoverAll(timeout);
        const clientAndClientInfos = await Promise.all(
            clients.map((client) => {
                return new Promise<ClientAndClientInfo>((resolve, reject) => {
                    client
                        .info()
                        .then((clientInfo) => {
                            return resolve({ client, clientInfo });
                        })
                        .catch((err) => {
                            return reject(err);
                        });
                });
            }),
        );
        return clientAndClientInfos.map((data) => {
            const { client, clientInfo } = data;
            const obj: any = {
                ip: client.ip,
                ...clientInfo,
            };
            Roku.normalizeInfo(obj);
            return obj as RokuInfo;
        });
    }

    private static normalizeInfo(obj: any): any {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            if (value === 'true') {
                obj[key] = true;
            } else if (value === 'false') {
                obj[key] = false;
            } else if (key === 'uptime') {
                obj[key] = parseInt(value, 10);
            }
        });
        return obj;
    }
}
