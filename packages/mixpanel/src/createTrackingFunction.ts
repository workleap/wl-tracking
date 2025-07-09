import { getTrackingEndpoint, type Environment } from "./env.ts";
import { getBaseProperties, type TrackEventProperties } from "./properties.ts";

/**
 * @see https://workleap.github.io/wl-tracking
 */
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
 * @see https://workleap.github.io/wl-tracking
 */
export type TrackingFunction = (eventName: string, properties: TrackEventProperties, options?: TrackingOptions) => Promise<void>;

/**
 * @see https://workleap.github.io/wl-tracking
 */
export interface CreateTrackingFunctionOptions {
    /**
     * The product identifier of the target product.
     * @default null
     */
    targetProductId?: string | null;
}

/**
 * Creates a function that sends tracking events to the tracking API.
 * @param productId Your product identifier.
 * @param envOrTrackingApiBaseUrl The environment to get the navigation url from or a base URL.
 * @param options Options for creating the tracking function.
 * @returns A function that sends tracking events to the tracking API.
 * @see https://workleap.github.io/wl-tracking
 */
export function createTrackingFunction(productId: string, envOrTrackingApiBaseUrl: Environment | (string & {}), options?: CreateTrackingFunctionOptions) : TrackingFunction {
    const targetProductId = options?.targetProductId ?? null;
    const fullUrl = getTrackingEndpoint(envOrTrackingApiBaseUrl);

    return async (eventName, properties, _options) => {
        const baseProperties = getBaseProperties();
        const allProperties = { ...baseProperties, ...properties };

        await fetch(fullUrl, {
            method: "POST",
            credentials: "include",
            keepalive: _options?.keepAlive,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName,
                productIdentifier: productId,
                targetProductIdentifier : targetProductId,
                properties: allProperties
            })
        });
    };
}
