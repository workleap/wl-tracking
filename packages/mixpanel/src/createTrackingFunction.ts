import { getBaseProperties, type TrackEventProperties } from "./properties.ts";

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

/**
 * A function that sends tracking events to the tracking API.
 * @param eventName The name of the event to track.
 * @param properties The properties to send with the event.
 * @param options Options for tracking the event.
 */
export type TrackingFunction = (eventName: string, properties: TrackEventProperties, options?: TrackingOptions) => Promise<void>;

// Cannot use URL() because it doesn't support relative base url: https://github.com/whatwg/url/issues/531.
function resolveApiUrl(path: string, baseUrl: string | undefined) : string {
    return `${baseUrl}${baseUrl!.endsWith("/") ? "" : "/"}${path.startsWith("/") ? path.substring(1) : path}`;
}

interface CreateTrackingFunctionOptions {
    /**
     * The product identifier of the target product.
     * @default null
     */
    targetProductId?: string | null;
    /**
     * The endpoint to send the tracking event to.
     * @default "tracking/track"
     */
    trackingEndpoint?: string;
}

/**
 * Creates a function that sends tracking events to the tracking API.
 * @param productId Your product identifier. e.g. "wlp", "ov"
 * @param trackingApiUrl The base URL of the tracking controlled. e.g. "/api/navigation"
 * @param createOptions Options for creating the tracking function.
 * @returns A function that sends tracking events to the tracking API.
 */
export function createTrackingFunction(productId: string, trackingApiBaseUrl: string, createOptions: CreateTrackingFunctionOptions = {}) : TrackingFunction {
    const endpoint = createOptions?.trackingEndpoint ?? "tracking/track";
    const targetProductId = createOptions?.targetProductId ?? null;

    return async (eventName, properties, options) => {
        const baseProperties = getBaseProperties();
        const allProperties = { ...baseProperties, ...properties };

        await fetch(resolveApiUrl(endpoint, trackingApiBaseUrl), {
            method: "POST",
            credentials: "include",
            keepalive: options?.keepAlive,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName,
                productId,
                targetProductId: targetProductId,
                properties: allProperties
            })
        });
    };
}
