import {
    Device,
    DeviceConfig,
    DeviceFactory, Get, PowerState,
    StandardButtons,
    StandardInputs,
    UnisonHTServer
} from '@unisonht/unisonht';
import { Request, Response } from 'express-serve-static-core';
import Client, {
    Keys,
    RokuApp,
    RokuAppId,
    RokuClient,
    RokuDeviceInfo,
    RokuMediaInfo,
    RokuSearchParams
} from 'roku-client';
import { getType, Type } from 'tst-reflect';

export class RokuDeviceFactory implements DeviceFactory<RokuDeviceConfig> {
    async createDevice(
        server: UnisonHTServer,
        config: DeviceConfig<RokuDeviceConfig>,
    ): Promise<Device<RokuDeviceConfig>> {
        return new RokuDevice(server, config);
    }
}

export class RokuDevice extends Device<RokuDeviceConfig> {
    private readonly client: Client;

    constructor(server: UnisonHTServer, config: DeviceConfig<RokuDeviceConfig>) {
        super(server, config);
        this.client = new Client(config.data.url);

        this.router.get(
            `${this.apiUrlPrefix}/discover-all`,
            async (
                req: Request<unknown, DiscoverAllResponse[], unknown, DiscoverAllQuery>,
                resp: Response<DiscoverAllResponse[]>,
            ) => {
                resp.json(await this.discoverAll(req.query.timeoutMs));
            },
        );

        this.router.get(`${this.apiUrlPrefix}/info`, async (_req: Request, resp: Response<RokuDeviceInfo>) => {
            resp.json(await this.info());
        });

        this.router.get(`${this.apiUrlPrefix}/apps`, async (_req: Request, resp: Response<RokuApp[]>) => {
            resp.json(await this.apps());
        });

        this.router.get(`${this.apiUrlPrefix}/active`, async (_req: Request, resp: Response<RokuApp | null>) => {
            resp.json(await this.active());
        });

        this.router.get(
            `${this.apiUrlPrefix}/icon-info`,
            async (req: Request<unknown, IconInfoResponse, unknown, IconQuery>, resp: Response<IconInfoResponse>) => {
                const icon = await this.icon(req.query.appId);
                resp.json({
                    extension: icon.extension,
                    type: icon.type,
                });
            },
        );

        this.router.get(
            `${this.apiUrlPrefix}/icon`,
            async (req: Request<unknown, Buffer, unknown, IconQuery>, resp: Response<Buffer>) => {
                const icon = await this.icon(req.query.appId);
                resp.writeHead(200, {
                    'Content-Type': icon.type,
                    'Content-Length': icon.data?.byteLength,
                });
                resp.end(icon.data);
            },
        );

        this.router.get(
            `${this.apiUrlPrefix}/search`,
            async (req: Request<unknown, unknown, unknown, RokuSearchParams>, resp: Response<unknown>) => {
                await this.search(req.query);
                resp.json({});
            },
        );

        this.router.get(`${this.apiUrlPrefix}/media-player`, async (_req: Request, resp: Response<RokuMediaInfo>) => {
            resp.json(await this.mediaPlayer());
        });

        this.router.post(
            `${this.apiUrlPrefix}/launch`,
            async (req: Request<unknown, unknown, unknown, LaunchQuery>, resp: Response) => {
                resp.json(await this.launch(req.query.appId));
            },
        );
    }

    override async handleButtonPress(button: string): Promise<void> {
        const key = BUTTONS_TO_KEYS[button];
        if (!key) {
            throw new Error(`invalid button: ${button}`);
        }
        await this.client.keypress(key);
    }

    override async switchMode(_oldModeId: string | undefined, _newModeId: string): Promise<void> {
        // do nothing
    }

    override async switchInput(inputName: string): Promise<void> {
        const key = INPUTS_TO_KEYS[inputName];
        if (!key) {
            throw new Error(`invalid input: ${inputName}`);
        }
        await this.client.keypress(key);
    }

    override async getPowerState(): Promise<PowerState> {
        try {
            await this.client.info();
            return PowerState.ON;
        } catch (err) {
            this.debug('failed to get info %s: %o', this.config.data.url, err);
            return PowerState.OFF;
        }
    }

    override get buttons(): string[] {
        return Object.keys(BUTTONS_TO_KEYS);
    }

    override getOpenApiType(): Type | undefined {
        return getType<RokuDevice>();
    }

    // TODO remove
    // override updateOpenApi(openApi: OpenApi): void {
    //     super.updateOpenApi(openApi);
    //     updateOpenApi(openApi, this.apiUrlPrefix, this.openApiTags);
    // }

    @Get('`${this.apiUrlPrefix}/discover-all`')
    async discoverAll(timeoutMs?: number): Promise<DiscoverAllResponse[]> {
        const discoverAllResults = await RokuClient.discoverAll(timeoutMs);
        return Promise.all(
            discoverAllResults.map(async (discoverAllResult) => {
                const client = new Client(discoverAllResult.ip);
                const info = await client.info();
                return {
                    url: discoverAllResult.ip,
                    ...info,
                };
            }),
        );
    }

    @Get('`${this.apiUrlPrefix}/info`')
    info(): Promise<RokuDeviceInfo> {
        return this.client.info();
    }

    @Get('`${this.apiUrlPrefix}/apps`')
    apps(): Promise<RokuApp[]> {
        return this.client.apps();
    }

    active(): Promise<RokuApp | null> {
        return this.client.active();
    }

    async icon(appId: RokuAppId): Promise<IconData> {
        const icon = await this.client.icon(appId);
        return {
            extension: icon.extension,
            type: icon.type,
            data: Buffer.from(await icon.response.arrayBuffer()),
        };
    }

    search(query: RokuSearchParams): Promise<void> {
        return this.client.search(query);
    }

    mediaPlayer(): Promise<RokuMediaInfo> {
        return this.client.mediaPlayer();
    }

    launch(appId: RokuAppId): Promise<void> {
        return this.client.launch(appId);
    }
}

export interface DiscoverAllResponse extends RokuDeviceInfo {
    url: string;
}

export interface RokuDeviceConfig {
    url: string;
}

export interface DiscoverAllQuery {
    timeoutMs?: number;
}

export interface LaunchQuery {
    appId: RokuAppId;
}

export interface IconQuery {
    appId: RokuAppId;
}

export interface IconData {
    type?: string;
    extension?: string;
    data?: Buffer;
}

export interface IconInfoResponse {
    type?: string;
    extension?: string;
}

export const INPUTS_TO_KEYS: { [input: string]: { command: string; name: string } } = {
    [StandardInputs.TUNER]: Keys.INPUT_TUNER,
    [StandardInputs.HDMI1]: Keys.INPUT_HDMI1,
    [StandardInputs.HDMI2]: Keys.INPUT_HDMI2,
    [StandardInputs.HDMI3]: Keys.INPUT_HDMI3,
    [StandardInputs.HDMI4]: Keys.INPUT_HDMI4,
    [StandardInputs.AV1]: Keys.INPUT_AV1,
};

export const BUTTONS_TO_KEYS: { [button: string]: { command: string; name: string } } = {
    [StandardButtons.HOME]: Keys.HOME,
    [StandardButtons.REVERSE]: Keys.REVERSE,
    [StandardButtons.FORWARD]: Keys.FORWARD,
    [StandardButtons.PLAY]: Keys.PLAY,
    [StandardButtons.SELECT]: Keys.SELECT,
    [StandardButtons.LEFT]: Keys.LEFT,
    [StandardButtons.RIGHT]: Keys.RIGHT,
    [StandardButtons.DOWN]: Keys.DOWN,
    [StandardButtons.UP]: Keys.UP,
    [StandardButtons.BACK]: Keys.BACK,
    [StandardButtons.INSTANT_REPLAY]: Keys.INSTANT_REPLAY,
    [StandardButtons.INFO]: Keys.INFO,
    [StandardButtons.STAR]: Keys.STAR,
    [StandardButtons.OPTIONS]: Keys.OPTIONS,
    [StandardButtons.BACKSPACE]: Keys.BACKSPACE,
    [StandardButtons.SEARCH]: Keys.SEARCH,
    [StandardButtons.ENTER]: Keys.ENTER,
    [StandardButtons.FIND_REMOTE]: Keys.FIND_REMOTE,
    [StandardButtons.VOLUME_DOWN]: Keys.VOLUME_DOWN,
    [StandardButtons.VOLUME_UP]: Keys.VOLUME_UP,
    [StandardButtons.VOLUME_MUTE]: Keys.VOLUME_MUTE,
    [StandardButtons.CHANNEL_UP]: Keys.CHANNEL_UP,
    [StandardButtons.CHANNEL_DOWN]: Keys.CHANNEL_DOWN,
    [StandardButtons.INPUT_TUNER]: Keys.INPUT_TUNER,
    [StandardButtons.INPUT_HDMI1]: Keys.INPUT_HDMI1,
    [StandardButtons.INPUT_HDMI2]: Keys.INPUT_HDMI2,
    [StandardButtons.INPUT_HDMI3]: Keys.INPUT_HDMI3,
    [StandardButtons.INPUT_HDMI4]: Keys.INPUT_HDMI4,
    [StandardButtons.INPUT_AV1]: Keys.INPUT_AV1,
    [StandardButtons.POWER]: Keys.POWER,
    [StandardButtons.POWER_OFF]: Keys.POWER_OFF,
    [StandardButtons.POWER_ON]: Keys.POWER_ON,
};
