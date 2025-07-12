import { getMixpanelTrackingFunction, type GetMixpanelTrackingFunctionOptions } from "../js/getMixpanelTrackingFunction.ts";

export type UseMixpanelTrackingOptions = GetMixpanelTrackingFunctionOptions;

export function useMixpanelTracking(options?: UseMixpanelTrackingOptions) {
    return getMixpanelTrackingFunction(options);
}
