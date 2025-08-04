import type { Environment } from "../js/env.ts";

/**
 * Base URLs for Mixpanel API per environment
 */
export const MixpanelApiBaseUrl: Record<Environment, string> = {
    "production": "https://api.platform.workleap.com/shell/navigation/",
    "staging": "https://api.platform.workleap-stg.com/shell/navigation/",
    "development": "https://api.platform.workleap-dev.com/shell/navigation/",
    "local": "https://api.platform.workleap-dev.com/shell/navigation/",
    "msw": "/api/shell/navigation/"
};

/**
 * Resolve URL by combining base URL and path
 */
function resolveUrl(path: string, baseUrl: string): string {
    return `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}${path.startsWith("/") ? path.substring(1) : path}`;
}

/**
 * Get Mixpanel API URLs for a specific environment
 */
export const getMixpanelApiUrls = (environment: Environment) => ({
    Tracking: {
        Track: resolveUrl("tracking/track", MixpanelApiBaseUrl[environment])
    }
});

/**
 * MSW-specific URLs (using relative paths for MSW)
 */
export const MswMixpanelApiUrls = getMixpanelApiUrls("msw");