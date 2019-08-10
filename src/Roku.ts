import {
  ButtonNotFoundError,
  DeviceStatus,
  NextFunction,
  NotFoundError,
  RouteHandlerRequest,
  RouteHandlerResponse,
  StandardKey,
  SupportedKey,
  SupportedKeys,
  UnisonHT,
  UnisonHTDevice,
} from '@unisonht/unisonht';
import Client, { keys } from 'roku-client';
import { KeyType } from 'roku-client/dist/keyCommand';
import { App } from 'roku-client/dist/client';
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

interface KeyMapItem extends SupportedKey {
  rokuKey: KeyType;
}

interface KeyMap {
  [key: string]: KeyMapItem;
}

export class Roku implements UnisonHTDevice {
  private readonly deviceName: string;
  private readonly client: Client;
  private readonly keyMap: KeyMap;
  private apps: App[] | undefined;

  constructor(deviceName: string, options: RokuOptions) {
    this.deviceName = deviceName;
    this.client = new Client(options.url);
    this.keyMap = {
      [StandardKey.HOME]: this.createKey('Home', keys.HOME),
      [StandardKey.REVERSE]: this.createKey('Reverse', keys.REVERSE),
      [StandardKey.FORWARD]: this.createKey('Forward', keys.FORWARD),
      [StandardKey.PLAY]: this.createKey('Play', keys.PLAY),
      [StandardKey.SELECT]: this.createKey('Select', keys.SELECT),
      [StandardKey.LEFT]: this.createKey('Left', keys.LEFT),
      [StandardKey.RIGHT]: this.createKey('Right', keys.RIGHT),
      [StandardKey.UP]: this.createKey('Up', keys.UP),
      [StandardKey.DOWN]: this.createKey('Down', keys.DOWN),
      [StandardKey.BACK]: this.createKey('Back', keys.BACK),
      [StandardKey.INFO]: this.createKey('Info', keys.INFO),
      [StandardKey.ENTER]: this.createKey('Enter', keys.ENTER),
      [StandardKey.VOLUME_UP]: this.createKey('Volume Up', keys.VOLUME_UP),
      [StandardKey.VOLUME_DOWN]: this.createKey('Volume Down', keys.VOLUME_DOWN),
      [StandardKey.MUTE]: this.createKey('Mute', keys.VOLUME_MUTE),
      [StandardKey.CHANNEL_UP]: this.createKey('Channel Up', keys.CHANNEL_UP),
      [StandardKey.CHANNEL_DOWN]: this.createKey('Channel Down', keys.CHANNEL_DOWN),
      [StandardKey.POWER_TOGGLE]: this.createKey('Power Toggle', keys.POWER),
      [StandardKey.INSTANT_REPLAY]: this.createKey('Instant Replay', keys.INSTANT_REPLAY),
      [StandardKey.BACKSPACE]: this.createKey('Backspace', keys.BACKSPACE),
      [StandardKey.SEARCH]: this.createKey('Search', keys.SEARCH),
      [StandardKey.FIND_REMOTE]: this.createKey('Find Remote', keys.FIND_REMOTE),
      [StandardKey.INPUT_TUNER]: this.createKey('Input: Tuner', keys.INPUT_TUNER),
      [StandardKey.INPUT_HDMI1]: this.createKey('Input: HDMI1', keys.INPUT_HDMI1),
      [StandardKey.INPUT_HDMI2]: this.createKey('Input: HDMI2', keys.INPUT_HDMI2),
      [StandardKey.INPUT_HDMI3]: this.createKey('Input: HDMI3', keys.INPUT_HDMI3),
      [StandardKey.INPUT_HDMI4]: this.createKey('Input: HDMI4', keys.INPUT_HDMI4),
      [StandardKey.INPUT_AV1]: this.createKey('Input: AV1', keys.INPUT_AV1),
    };
  }

  private createKey(name: string, rokuKey: any): KeyMapItem {
    return {
      name,
      rokuKey,
      handleKeyPress: async (
        key: string,
        request: RouteHandlerRequest,
        response: RouteHandlerResponse,
        next: NextFunction,
      ): Promise<void> => {
        const k = this.keyMap[key];
        if (!k) {
          return next(new ButtonNotFoundError(key));
        }
        await this.client.keypress(k.rokuKey);
        response.send();
      },
    };
  }

  public getSupportedKeys(): SupportedKeys {
    return this.keyMap;
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
      clients.map(client => {
        return new Promise<ClientAndClientInfo>((resolve, reject) => {
          client
            .info()
            .then(clientInfo => {
              return resolve({ client, clientInfo });
            })
            .catch(err => {
              return reject(err);
            });
        });
      }),
    );
    return clientAndClientInfos.map(data => {
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
    Object.keys(obj).forEach(key => {
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
