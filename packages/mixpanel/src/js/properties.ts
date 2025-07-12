
import { browserName, browserVersion, deviceType, osName, referringDomain } from "./utils.ts";

export type MixpanelTrackEventProperties = Record<string, unknown>;

export const BaseProperties = {
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

export const TelemetryProperties = {
    DeviceId: "Device Id",
    LogRocketSessionUrl: "LogRocket Session Url",
    TelemetryId: "Telemetry Id"
} as const;

export function getBaseProperties() {
    const userAgent = navigator.userAgent;
    const device = deviceType(userAgent);

    return {
        [BaseProperties.Os]: osName(userAgent),
        [BaseProperties.Browser]: browserName(userAgent, navigator.vendor),
        [BaseProperties.Referrer]: document.referrer,
        [BaseProperties.ReferringDomain]: referringDomain(document.referrer),
        [BaseProperties.Device]: device,
        [BaseProperties.CurrentUrl]: window.location.href,
        [BaseProperties.BrowserVersion]: browserVersion(userAgent, navigator.vendor),
        [BaseProperties.ScreenHeight]: window.screen.height,
        [BaseProperties.ScreenWidth]: window.screen.width,
        [BaseProperties.IsMobile]: device.length > 0
    } satisfies MixpanelTrackEventProperties;
}
