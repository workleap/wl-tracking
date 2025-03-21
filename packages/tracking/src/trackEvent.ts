import { resolveApiUrl } from "./resolveApiUrl.ts";
import { browserName, browserVersion, deviceType, osName, referringDomain } from "./utils.ts";

interface TrackEventProperties {
    [key: string]: unknown;
}

const BaseTrackingProperties = {
    AppVersion: "AppVersion",
    Browser: "$browser",
    BrowserVersion: "$browser_version",
    CurrentUrl: "$current_url",
    Device: "$device",
    IsMobile: "IsMobile",
    Os: "$os",
    Referrer: "$referrer",
    ReferringDomain: "$referring_domain",
    ScreenHeight: "$screen_height",
    ScreenWidth: "$screen_width"
} as const;

function getBaseProperties(): TrackEventProperties {
    const userAgent = navigator.userAgent;
    const device = deviceType(userAgent);

    return {
        [BaseTrackingProperties.Os]: osName(userAgent),
        [BaseTrackingProperties.Browser]: browserName(userAgent, navigator.vendor),
        [BaseTrackingProperties.Referrer]: document.referrer,
        [BaseTrackingProperties.ReferringDomain]: referringDomain(document.referrer),
        [BaseTrackingProperties.Device]: device,
        [BaseTrackingProperties.CurrentUrl]: window.location.href,
        [BaseTrackingProperties.BrowserVersion]: browserVersion(userAgent, navigator.vendor),
        [BaseTrackingProperties.ScreenHeight]: window.screen.height,
        [BaseTrackingProperties.ScreenWidth]: window.screen.width,
        [BaseTrackingProperties.IsMobile]: device.length > 0
    };
}

export interface TrackingOptions {
    /**
   * Whether to keep the connection alive for the tracking request.
   * It is mostly used for tracking links where the user might navigate away before the request is completed.
   *
   * Caution! The body size for keepalive requests is limited to 64 kibibytes.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive
   *
   * @default false
   */
    keepAlive?: boolean;
}

export type TrackingFunction = (eventName: string, properties: TrackEventProperties, options?: TrackingOptions) => Promise<void>;

export function buildTrackingFunction(productIdentifier: string, trackingApiBaseUrl: string) : TrackingFunction;
export function buildTrackingFunction(productIdentifier: string, targetProductIdentifier: string, trackingApiBaseUrl: string) : TrackingFunction;
export function buildTrackingFunction(productIdentifier: string, trackingApiBaseUrlOrTargetProductIdentifier: string, trackingApiBaseUrl?: string) : TrackingFunction {
    return async (eventName, properties, options) => {
        const baseProperties = getBaseProperties();
        const allProperties = { ...baseProperties, ...properties };

        const isTargetProductIdentifierSpecified = trackingApiBaseUrl !== undefined;
        const baseUrl = isTargetProductIdentifierSpecified ? trackingApiBaseUrl : trackingApiBaseUrlOrTargetProductIdentifier;
        const targetProductIdentifier = isTargetProductIdentifierSpecified ? trackingApiBaseUrlOrTargetProductIdentifier : null;

        await fetch(resolveApiUrl("tracking/track", baseUrl), {
            method: "POST",
            credentials: "include",
            keepalive: options?.keepAlive,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName,
                productIdentifier,
                targetProductIdentifier: targetProductIdentifier,
                properties: allProperties })
        });
    };
}
