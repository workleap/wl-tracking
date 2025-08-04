import { delay, http, HttpResponse, type HttpHandler } from "msw";
import { MixpanelTrackingResponse, type MixpanelTrackingRequest } from "../mocks/index.ts";
import { MswMixpanelApiUrls } from "./urls.ts";

/**
 * Default delay for simulating network latency (in milliseconds)
 */
const DEFAULT_DELAY = 100;

/**
 * MSW handlers for Mixpanel API endpoints
 */
export const MixpanelApiHandlers = {
    Tracking: {
        /**
         * Default successful tracking handler
         */
        Default: http.post(MswMixpanelApiUrls.Tracking.Track, async () => {
            await delay(DEFAULT_DELAY);
            const response = MixpanelTrackingResponse.Success();
            
            return HttpResponse.json(response);
        }),

        /**
         * Handler that simulates network error
         */
        NetworkError: http.post(MswMixpanelApiUrls.Tracking.Track, async () => {
            await delay(DEFAULT_DELAY);
            
            return HttpResponse.error();
        }),

        /**
         * Handler that simulates server error
         */
        ServerError: http.post(MswMixpanelApiUrls.Tracking.Track, async () => {
            await delay(DEFAULT_DELAY);
            
            return HttpResponse.json({ error: "Internal server error" }, { status: 500 });
        }),

        /**
         * Handler that simulates timeout (very slow response)
         */
        Timeout: http.post(MswMixpanelApiUrls.Tracking.Track, async () => {
            await delay(5000);
            
            const response = MixpanelTrackingResponse.Success();
            
            return HttpResponse.json(response);
        }),

        /**
         * Custom handler that allows overriding the response
         */
        Custom: (responseOverride?: unknown, delayMs?: number) => {
            return http.post(MswMixpanelApiUrls.Tracking.Track, async () => {
                await delay(delayMs ?? DEFAULT_DELAY);
                
                const response = responseOverride ?? MixpanelTrackingResponse.Success();
                
                return HttpResponse.json(response);
            });
        }
    }
};

/**
 * Get default Mixpanel handlers for common testing scenarios
 */
export function getMixpanelHandlers(options: {
    /**
     * Simulate network delay in milliseconds
     * @default 100
     */
    delay?: number;
    /**
     * Custom response override
     */
    responseOverride?: unknown;
} = {}): HttpHandler[] {
    const { delay: customDelay, responseOverride } = options;

    if (responseOverride !== undefined || customDelay !== undefined) {
        return [MixpanelApiHandlers.Tracking.Custom(responseOverride, customDelay)];
    }

    return [MixpanelApiHandlers.Tracking.Default];
}