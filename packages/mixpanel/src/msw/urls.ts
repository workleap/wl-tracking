import type { Environment } from "../js/env.ts";
import { NavigationApiBaseUrl } from "../js/env.ts";

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
        Track: resolveUrl("tracking/track", NavigationApiBaseUrl[environment])
    }
});

/**
 * MSW-specific URLs (using relative paths for MSW)
 */
export const MswMixpanelApiUrls = getMixpanelApiUrls("msw");