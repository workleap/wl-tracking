import { getMixpanelContext } from "./context.ts";
import { getBaseProperties, type MixpanelEventProperties } from "./properties.ts";

/**
 * @see https://workleap.github.io/wl-telemetry
 */
export interface CreateTrackingFunctionOptions {
    /**
     * The product identifier of the target product.
     */
    targetProductId?: string;
    /**
     * The endpoint to use for tracking events.
     * If not provided, the default endpoint will be used.
     * @default "tracking/track"
     */
    trackingEndpoint?: string;
}

/**
 * @see https://workleap.github.io/wl-telemetry
 */
export interface TrackingFunctionOptions {
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
 * @see https://workleap.github.io/wl-telemetry
 */
export type TrackingFunction = (eventName: string, properties: MixpanelEventProperties, options?: TrackingFunctionOptions) => Promise<void>;

// Cannot use URL() because it doesn't support relative base url: https://github.com/whatwg/url/issues/531.
function resolveApiUrl(path: string, baseUrl: string | undefined) : string {
    return `${baseUrl}${baseUrl!.endsWith("/") ? "" : "/"}${path.startsWith("/") ? path.substring(1) : path}`;
}

export function createTrackingFunction(options: CreateTrackingFunctionOptions = {}) {
    const {
        targetProductId,
        trackingEndpoint = "tracking/track"
    } = options;

    const {
        productId,
        baseUrl,
        superProperties
    } = getMixpanelContext();

    const trackFunction: TrackingFunction = async (eventName, properties, _options = {}) => {
        try {
            const {
                keepAlive = false
            } = _options;

            const baseProperties = getBaseProperties();

            const allProperties = {
                ...baseProperties,
                ...Object.fromEntries(superProperties),
                ...properties
            };

            await fetch(resolveApiUrl(trackingEndpoint, baseUrl), {
                method: "POST",
                credentials: "include",
                keepalive: keepAlive,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventName,
                    productIdentifier: productId,
                    // Not sure why, but it seems important to send "null" if not target product identifier
                    // are provided.
                    targetProductIdentifier : targetProductId ?? null,
                    properties: allProperties
                })
            });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            // Do nothing...
        }
    };

    return trackFunction;
}
