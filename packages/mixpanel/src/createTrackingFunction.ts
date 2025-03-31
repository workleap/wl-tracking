import { getTrackingEndpoint, type Environment } from "./env.ts";
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

export interface CreateTrackingFunctionOptions {
    /**
     * The product identifier of the target product.
     * @default null
     */
    targetProductId?: string | null;
}

/**
 * Creates a function that sends tracking events to the tracking API.
 * @param productId Your product identifier. e.g. "wlp", "ov"
 * @param env The environment to get the navigation url from . e.g. "local", "prod"
 * @param createOptions Options for creating the tracking function.
 * @returns A function that sends tracking events to the tracking API.
 */
export function createTrackingFunction(productId: string, env: Environment, createOptions?: CreateTrackingFunctionOptions) : TrackingFunction;
/**
 * Creates a function that sends tracking events to the tracking API.
 * @param productId Your product identifier. e.g. "wlp", "ov"
 * @param trackingApiBaseUrl The base Url to get the tracking api from . e.g. "https://api.platform.workleap-dev.com/shell/navigation/"
 * @param createOptions Options for creating the tracking function.
 * @returns A function that sends tracking events to the tracking API.
 */
export function createTrackingFunction(productId: string, trackingApiBaseUrl: string, createOptions?: CreateTrackingFunctionOptions) : TrackingFunction;
export function createTrackingFunction(productId: string, envOrTrackingApiBaseUrl: Environment | (string & {}), createOptions: CreateTrackingFunctionOptions = {}) : TrackingFunction {
    const targetProductId = createOptions?.targetProductId ?? null;
    const fullUrl = getTrackingEndpoint(envOrTrackingApiBaseUrl);

    return async (eventName, properties, options) => {
        const baseProperties = getBaseProperties();
        const allProperties = { ...baseProperties, ...properties };

        await fetch(fullUrl, {
            method: "POST",
            credentials: "include",
            keepalive: options?.keepAlive,
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
