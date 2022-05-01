import { OpenApi } from '@unisonht/unisonht';

export function updateOpenApi(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    updateOpenApiDiscoverAll(openApi, apiUrlPrefix, tags);
    updateOpenApiApps(openApi, apiUrlPrefix, tags);
    updateOpenApiActive(openApi, apiUrlPrefix, tags);
    updateOpenApiMediaPlayer(openApi, apiUrlPrefix, tags);
    updateOpenApiLaunch(openApi, apiUrlPrefix, tags);
    updateOpenApiIconInfo(openApi, apiUrlPrefix, tags);
    updateOpenApiIcon(openApi, apiUrlPrefix, tags);
    updateOpenApiSearch(openApi, apiUrlPrefix, tags);
    updateOpenApiInfo(openApi, apiUrlPrefix, tags);
}

const INFO = {
    advertisingId: {
        type: 'string',
    },
    buildNumber: {
        type: 'string',
    },
    canUseWifiExtender: {
        type: 'boolean',
    },
    clockFormat: {
        type: 'string',
    },
    country: {
        type: 'string',
    },
    davinciVersion: {
        type: 'string',
    },
    defaultDeviceName: {
        type: 'string',
    },
    developerEnabled: {
        type: 'boolean',
    },
    deviceId: {
        type: 'string',
    },
    ethernetMac: {
        type: 'string',
    },
    expertPqEnabled: {
        type: 'string',
    },
    friendlyDeviceName: {
        type: 'string',
    },
    friendlyModelName: {
        type: 'string',
    },
    grandcentralVersion: {
        type: 'string',
    },
    hasMobileScreensaver: {
        type: 'boolean',
    },
    hasPlayOnRoku: {
        type: 'boolean',
    },
    hasWifi5GSupport: {
        type: 'boolean',
    },
    hasWifiExtender: {
        type: 'boolean',
    },
    headphonesConnected: {
        type: 'boolean',
    },
    isStick: {
        type: 'boolean',
    },
    isTv: {
        type: 'boolean',
    },
    keyedDeveloperId: {
        type: 'string',
    },
    language: {
        type: 'string',
    },
    locale: {
        type: 'string',
    },
    modelName: {
        type: 'string',
    },
    modelNumber: {
        type: 'string',
    },
    modelRegion: {
        type: 'string',
    },
    networkName: {
        type: 'string',
    },
    networkType: {
        type: 'string',
        enum: ['wifi', 'ethernet'],
    },
    notificationsEnabled: {
        type: 'boolean',
    },
    notificationsFirstUse: {
        type: 'boolean',
    },
    panelId: {
        type: 'string',
    },
    powerMode: {
        type: 'string',
        enum: ['Ready', 'Headless', 'DisplayOff', 'PowerOn'],
    },
    screenSize: {
        type: 'string',
    },
    searchChannelsEnabled: {
        type: 'boolean',
    },
    searchEnabled: {
        type: 'boolean',
    },
    secureDevice: {
        type: 'boolean',
    },
    serialNumber: {
        type: 'string',
    },
    softwareBuild: {
        type: 'string',
    },
    softwareVersion: {
        type: 'string',
    },
    supportUrl: {
        type: 'string',
    },
    supportsAudioGuide: {
        type: 'boolean',
    },
    supportsEcsMicrophone: {
        type: 'boolean',
    },
    supportsEcsTextedit: {
        type: 'boolean',
    },
    supportsEthernet: {
        type: 'boolean',
    },
    supportsFindRemote: {
        type: 'boolean',
    },
    supportsPrivateListening: {
        type: 'boolean',
    },
    supportsPrivateListeningDtv: {
        type: 'boolean',
    },
    supportsRva: {
        type: 'boolean',
    },
    supportsSuspend: {
        type: 'boolean',
    },
    supportsWakeOnWlan: {
        type: 'boolean',
    },
    supportsWarmStandby: {
        type: 'boolean',
    },
    timeZone: {
        type: 'string',
    },
    timeZoneAuto: {
        type: 'boolean',
    },
    timeZoneName: {
        type: 'string',
    },
    timeZoneOffset: {
        type: 'string',
    },
    timeZoneTz: {
        type: 'string',
    },
    trcVersion: {
        type: 'string',
    },
    trcChannelVersion: {
        type: 'string',
    },
    tunerType: {
        type: 'string',
    },
    udn: {
        type: 'string',
    },
    uptime: {
        type: 'string',
    },
    userDeviceLocation: {
        type: 'string',
    },
    userDeviceName: {
        type: 'string',
    },
    vendorName: {
        type: 'string',
    },
    voiceSearchEnabled: {
        type: 'boolean',
    },
    wifiDriver: {
        type: 'string',
    },
    wifiMac: {
        type: 'string',
    },
};

const INFO_REQUIRED = [
    'advertisingId',
    'buildNumber',
    'canUseWifiExtender',
    'clockFormat',
    'country',
    'davinciVersion',
    'defaultDeviceName',
    'developerEnabled',
    'deviceId',
    'ethernetMac',
    'expertPqEnabled',
    'friendlyDeviceName',
    'friendlyModelName',
    'grandcentralVersion',
    'hasMobileScreensaver',
    'hasPlayOnRoku',
    'hasWifi5GSupport',
    'hasWifiExtender',
    'headphonesConnected',
    'isStick',
    'isTv',
    'keyedDeveloperId',
    'language',
    'locale',
    'modelName',
    'modelNumber',
    'modelRegion',
    'networkName',
    'networkType',
    'notificationsEnabled',
    'notificationsFirstUse',
    'panelId',
    'powerMode',
    'screenSize',
    'searchChannelsEnabled',
    'searchEnabled',
    'secureDevice',
    'serialNumber',
    'softwareBuild',
    'softwareVersion',
    'supportUrl',
    'supportsAudioGuide',
    'supportsEcsMicrophone',
    'supportsEcsTextedit',
    'supportsEthernet',
    'supportsFindRemote',
    'supportsPrivateListening',
    'supportsPrivateListeningDtv',
    'supportsRva',
    'supportsSuspend',
    'supportsWakeOnWlan',
    'supportsWarmStandby',
    'timeZone',
    'timeZoneAuto',
    'timeZoneName',
    'timeZoneOffset',
    'timeZoneTz',
    'trcVersion',
    'trcChannelVersion',
    'tunerType',
    'udn',
    'uptime',
    'userDeviceLocation',
    'userDeviceName',
    'vendorName',
    'voiceSearchEnabled',
    'wifiDriver',
    'wifiMac',
];

function updateOpenApiDiscoverAll(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/discover-all`] = {
        get: {
            tags,
            parameters: [
                {
                    description: 'timeout in milliseconds to wait for Rokus to respond',
                    in: 'query',
                    name: 'timeoutMs',
                    required: false,
                    schema: {
                        type: 'number',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'discovered devices',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        url: {
                                            type: 'string',
                                        },
                                        ...INFO,
                                    },
                                    required: ['url', ...INFO_REQUIRED],
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}

function updateOpenApiApps(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/apps`] = {
        get: {
            tags,
            responses: {
                200: {
                    description: 'get apps',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'string',
                                        },
                                        name: {
                                            type: 'string',
                                        },
                                        type: {
                                            type: 'string',
                                        },
                                        version: {
                                            type: 'string',
                                        },
                                    },
                                    required: ['id', 'name', 'type', 'version'],
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}

function updateOpenApiActive(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/active`] = {
        get: {
            tags,
            responses: {
                200: {
                    description: 'get active app',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                    },
                                    name: {
                                        type: 'string',
                                    },
                                    type: {
                                        type: 'string',
                                    },
                                    version: {
                                        type: 'string',
                                    },
                                },
                                required: ['id', 'name', 'type', 'version'],
                            },
                        },
                    },
                },
            },
        },
    };
}

function updateOpenApiMediaPlayer(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/media-player`] = {
        get: {
            tags,
            responses: {
                200: {
                    description: 'get media player data',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                    },
                },
            },
        },
    };
}

function updateOpenApiLaunch(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/launch`] = {
        post: {
            tags,
            parameters: [
                {
                    in: 'query',
                    name: 'appId',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'launch an app',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                    },
                },
            },
        },
    };
}

function updateOpenApiIconInfo(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/icon-info`] = {
        get: {
            tags,
            parameters: [
                {
                    in: 'query',
                    name: 'appId',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'get app icon info',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    type: {
                                        type: 'string',
                                    },
                                    extension: {
                                        type: 'string',
                                    },
                                },
                                required: [],
                            },
                        },
                    },
                },
            },
        },
    };
}

function updateOpenApiIcon(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/icon`] = {
        get: {
            tags,
            parameters: [
                {
                    in: 'query',
                    name: 'appId',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'get app icon',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'string',
                                format: 'binary',
                            },
                        },
                    },
                },
            },
        },
    };
}

function updateOpenApiSearch(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/search`] = {
        get: {
            tags,
            parameters: [
                {
                    in: 'query',
                    name: 'keyword',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                },
                {
                    in: 'query',
                    name: 'title',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                },
                {
                    in: 'query',
                    name: 'type',
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['movie', 'tv-show', 'person', 'channel', 'game'],
                    },
                },
                {
                    in: 'query',
                    name: 'tmsid',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                },
                {
                    in: 'query',
                    name: 'season',
                    required: false,
                    schema: {
                        type: 'number',
                    },
                },
                {
                    in: 'query',
                    name: 'showUnavailable',
                    required: false,
                    schema: {
                        type: 'boolean',
                    },
                },
                {
                    in: 'query',
                    name: 'matchAny',
                    required: false,
                    schema: {
                        type: 'boolean',
                    },
                },
                {
                    in: 'query',
                    name: 'launch',
                    required: false,
                    schema: {
                        type: 'boolean',
                    },
                },
                {
                    in: 'query',
                    name: 'provider',
                    required: false,
                    schema: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
            ],
            responses: {
                200: {
                    description: 'launch Roku search',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                    },
                },
            },
        },
    };
}

function updateOpenApiInfo(openApi: OpenApi, apiUrlPrefix: string, tags: string[]): void {
    openApi.paths[`${apiUrlPrefix}/info`] = {
        get: {
            tags,
            responses: {
                200: {
                    description: 'info about the device',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ...INFO,
                                },
                                required: INFO_REQUIRED,
                            },
                        },
                    },
                },
            },
        },
    };
}
