import { OpenApi } from '@unisonht/unisonht';

export function updateSwaggerJson(swaggerJson: OpenApi, apiUrlPrefix: string, swaggerTags: string[]): void {
    swaggerJson.paths[`${apiUrlPrefix}/discover-all`] = {
        get: {
            tags: swaggerTags,
            parameters: [
                {
                    in: 'query',
                    name: 'timeout',
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
                                        ip: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    swaggerJson.paths[`${apiUrlPrefix}/apps`] = {
        get: {
            tags: swaggerTags,
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
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    swaggerJson.paths[`${apiUrlPrefix}/active`] = {
        get: {
            tags: swaggerTags,
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
                            },
                        },
                    },
                },
            },
        },
    };

    swaggerJson.paths[`${apiUrlPrefix}/media-player`] = {
        get: {
            tags: swaggerTags,
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

    swaggerJson.paths[`${apiUrlPrefix}/launch`] = {
        post: {
            tags: swaggerTags,
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

    swaggerJson.paths[`${apiUrlPrefix}/icon-info`] = {
        get: {
            tags: swaggerTags,
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
                            },
                        },
                    },
                },
            },
        },
    };

    swaggerJson.paths[`${apiUrlPrefix}/icon`] = {
        get: {
            tags: swaggerTags,
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

    swaggerJson.paths[`${apiUrlPrefix}/search`] = {
        get: {
            tags: swaggerTags,
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

    swaggerJson.paths[`${apiUrlPrefix}/info`] = {
        get: {
            tags: swaggerTags,
            responses: {
                200: {
                    description: 'info about the device',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
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
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}
