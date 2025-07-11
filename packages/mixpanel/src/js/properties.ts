
import type { TelemetryContext } from "@workleap/telemetry";
import { browserName, browserVersion, deviceType, osName, referringDomain } from "./utils.ts";

export type TrackEventProperties = Record<string, unknown>;

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

export const TelemetryTrackingProperties = {
    DeviceId: "DeviceId",
    LogRocketSessionUrl: "LogRocketSessionUrl",
    TelemetryId: "TelemetryId"
} as const;

export function getBaseProperties() {
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
    } satisfies TrackEventProperties;
}

export function getTelemetryProperties(context: TelemetryContext) {
    return {
        [TelemetryTrackingProperties.TelemetryId]: context.telemetryId,
        [TelemetryTrackingProperties.DeviceId]: context.deviceId
    };
}
