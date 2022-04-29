import Client, { Keys } from 'roku-client';
import {
    Device,
    DeviceConfig,
    DeviceFactory,
    PowerState,
    StandardButtons,
    StandardInputs,
    UnisonHTServer,
} from '@unisonht/unisonht';

export class RokuDeviceFactory implements DeviceFactory<RokuDeviceConfig> {
    async createDevice(
        server: UnisonHTServer,
        config: DeviceConfig<RokuDeviceConfig>,
    ): Promise<Device<RokuDeviceConfig>> {
        return new RokuDevice(config, server);
    }
}

export class RokuDevice extends Device<RokuDeviceConfig> {
    private readonly client: Client;

    constructor(config: DeviceConfig<RokuDeviceConfig>, server: UnisonHTServer) {
        super(config, server);
        this.client = new Client(config.data.url);
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
}

export interface RokuDeviceConfig {
    url: string;
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
