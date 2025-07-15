import { getMixpanelTrackingFunction, type GetMixpanelTrackingFunctionOptions } from "../js/getMixpanelTrackingFunction.ts";

/**
 * @see https://workleap.github.io/wl-tracking
 */
export type UseMixpanelTrackingOptions = GetMixpanelTrackingFunctionOptions;

/**
 * Retrieve the track function.
 * @returns A function that sends tracking events to the tracking API.
 * @see https://workleap.github.io/wl-tracking
 */
export function useMixpanelTracking(options?: UseMixpanelTrackingOptions) {
    return getMixpanelTrackingFunction(options);
}
