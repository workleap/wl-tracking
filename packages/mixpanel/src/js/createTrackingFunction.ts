import { getBootstrappingStore, getTelemetryContext } from "@workleap/telemetry";
import { getTrackingEndpoint, type Environment } from "./env.ts";
import { getBaseProperties, TelemetryTrackingProperties, type TrackEventProperties } from "./properties.ts";

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
    verbose?: boolean;
}

function registerLogRocketSessionUrlListener(superProperties: Map<string, string>, verbose = false) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__) {
        // Automatically add the LogRocket session URL to all Honeycomb traces as an attribute.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__((sessionUrl: string) => {
            if (verbose) {
                console.log("[mixpanel] Received LogRocket session replay URL:", sessionUrl);
            }

            superProperties.set(TelemetryTrackingProperties.LogRocketSessionUrl, sessionUrl);
        });
    } else if (verbose) {
        console.log("[mixpanel] Cannot integrate with LogRocket because \"globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__\" is not available.");
    }
}

/**
 * Creates a function that sends tracking events to the tracking API.
 * @param productId Your product identifier.
 * @param envOrTrackingApiBaseUrl The environment to get the navigation url from or a base URL.
 * @param options Options for creating the tracking function.
 * @returns A function that sends tracking events to the tracking API.
 * @see https://workleap.github.io/wl-tracking
 */
export function createTrackingFunction(productId: string, envOrTrackingApiBaseUrl: Environment | (string & {}), options: CreateTrackingFunctionOptions = {}) : TrackingFunction {
    const {
        targetProductId,
        verbose
    } = options;

    // Equivalent to: https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript#setting-super-properties.
    const superProperties = new Map<string, string>();

    const fullUrl = getTrackingEndpoint(envOrTrackingApiBaseUrl);
    const telemetryContext = getTelemetryContext({ verbose });

    superProperties.set(TelemetryTrackingProperties.TelemetryId, telemetryContext.telemetryId);
    superProperties.set(TelemetryTrackingProperties.DeviceId, telemetryContext.deviceId);

    const bootstrappingStore = getBootstrappingStore();

    // If LogRocket is already available, register the listener. Otherwise, subscribe to the bootstrapping store
    // and register the listener once a notification is received that LogRocket is registered.
    if (bootstrappingStore.state.isLogRocketReady) {
        registerLogRocketSessionUrlListener(superProperties, verbose);
    } else {
        bootstrappingStore.subscribe((action, store, unsubscribe) => {
            if (store.state.isLogRocketReady) {
                unsubscribe();
                registerLogRocketSessionUrlListener(superProperties, verbose);
            }
        });
    }

    return async (eventName, properties, _options) => {
        try {
            const baseProperties = getBaseProperties();

            const allProperties = {
                ...baseProperties,
                ...Object.fromEntries(superProperties),
                ...properties
            };

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            // Do nothing...
        }
    };
}
