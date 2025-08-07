
const EnvironmentList = ["development", "staging", "production", "local", "msw"] as const;

export type Environment = typeof EnvironmentList[number];

const NavigationApiBaseUrl: Record<Environment, string> = {
    "production": "https://api.platform.workleap.com/shell/navigation/",
    "staging": "https://api.platform.workleap-stg.com/shell/navigation/",
    "development": "https://api.platform.workleap-dev.com/shell/navigation/",
    "local": "https://api.platform.workleap-dev.com/shell/navigation/",
    "msw": "/api/shell/navigation/"
};

export function getTrackingBaseUrl(envOrTrackingApiBaseUrl: Environment | (string & {})): string {
    let baseUrl: string;

    if (EnvironmentList.includes(envOrTrackingApiBaseUrl as Environment)) {
        baseUrl = NavigationApiBaseUrl[envOrTrackingApiBaseUrl as Environment];
    } else {
        baseUrl = envOrTrackingApiBaseUrl;
    }

    return baseUrl;
}
