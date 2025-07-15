import type { MixpanelTrackingFunction } from "./initializeMixpanel.ts";

export const TrackingFunctionName = "__WLP_MIXPANEL_TRACKING_FUNCTION__";

/**
 * @see https://workleap.github.io/wl-tracking
 */
export interface GetMixpanelTrackingFunctionOptions {
    throwOnUndefined?: boolean;
}

/**
 * Retrieve the track function.
 * @returns A function that sends tracking events to the tracking API.
 * @see https://workleap.github.io/wl-tracking
 */
export function getMixpanelTrackingFunction(options: GetMixpanelTrackingFunctionOptions = {}) {
    const {
        throwOnUndefined = true
    } = options;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const trackFunction = globalThis[TrackingFunctionName];

    if (!trackFunction && throwOnUndefined) {
        throw new Error("[mixpanel] The tracking function is undefined. Did you call the \"initializeMixpanel\" function?");
    }

    return trackFunction as MixpanelTrackingFunction;
}
