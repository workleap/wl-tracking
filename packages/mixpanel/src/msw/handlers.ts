import { delay, http, HttpResponse, type HttpHandler } from "msw";
import { MixpanelTrackingResponse, type MixpanelTrackingRequest } from "../mocks/index.ts";
import type { MixpanelEventProperties } from "../js/properties.ts";
import { MswMixpanelApiUrls } from "./urls.ts";

/**
 * Default delay for simulating network latency (in milliseconds)
 */
const DEFAULT_DELAY = 100;

/**
 * Interface for tracking request override options
 */
export interface TrackingRequestOverride {
    eventName?: string;
    productIdentifier?: string;
    targetProductIdentifier?: string | null;
    properties?: MixpanelEventProperties;
}

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
         * Handler that validates the request matches expected format
         */
        ValidateRequest: http.post(MswMixpanelApiUrls.Tracking.Track, async ({ request }) => {
            await delay(DEFAULT_DELAY);
            
            try {
                const body = await request.json() as MixpanelTrackingRequest;
                
                // Validate required fields
                if (!body.eventName || typeof body.eventName !== "string") {
                    return HttpResponse.json({ error: "eventName is required" }, { status: 400 });
                }
                
                if (!body.productIdentifier || typeof body.productIdentifier !== "string") {
                    return HttpResponse.json({ error: "productIdentifier is required" }, { status: 400 });
                }
                
                if (!body.properties || typeof body.properties !== "object") {
                    return HttpResponse.json({ error: "properties is required" }, { status: 400 });
                }
                
                const response = MixpanelTrackingResponse.Success();
                
                return HttpResponse.json(response);
            } catch {
                return HttpResponse.json({ error: "Invalid JSON" }, { status: 400 });
            }
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
     * Validate request format
     * @default false
     */
    validateRequests?: boolean;
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
    const { validateRequests = false, delay: customDelay, responseOverride } = options;

    if (responseOverride !== undefined || customDelay !== undefined) {
        return [MixpanelApiHandlers.Tracking.Custom(responseOverride, customDelay)];
    }

    if (validateRequests) {
        return [MixpanelApiHandlers.Tracking.ValidateRequest];
    }

    return [MixpanelApiHandlers.Tracking.Default];
}