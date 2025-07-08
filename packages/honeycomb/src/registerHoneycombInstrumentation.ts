import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations, type InstrumentationConfigMap } from "@opentelemetry/auto-instrumentations-web";
import type { DocumentLoadInstrumentationConfig } from "@opentelemetry/instrumentation-document-load";
import type { FetchInstrumentationConfig } from "@opentelemetry/instrumentation-fetch";
import type { UserInteractionInstrumentationConfig } from "@opentelemetry/instrumentation-user-interaction";
import type { XMLHttpRequestInstrumentationConfig } from "@opentelemetry/instrumentation-xml-http-request";
import type { PropagateTraceHeaderCorsUrls, SpanProcessor } from "@opentelemetry/sdk-trace-web";
import type { TelemetryContext } from "@workleap/telemetry";
import { applyTransformers, type HoneycombSdkOptionsTransformer } from "./applyTransformers.ts";
import { augmentFetchInstrumentationOptionsWithFetchRequestPipeline, registerFetchRequestHook, registerFetchRequestHookAtStart } from "./FetchRequestPipeline.ts";
import { globalAttributeSpanProcessor, setGlobalSpanAttribute } from "./globalAttributes.ts";
import type { HoneycombSdkInstrumentations, HoneycombSdkOptions } from "./honeycombTypes.ts";
import { normalizeAttributesSpanProcessor } from "./NormalizeAttributesSpanProcessor.ts";
import { patchXmlHttpRequest } from "./patchXmlHttpRequest.ts";

/**
 * @see https://workleap.github.io/wl-tracking
 */
export type DefineFetchInstrumentationOptionsFunction = (defaultOptions: FetchInstrumentationConfig) => FetchInstrumentationConfig;

/**
 * @see https://workleap.github.io/wl-tracking
 */
export type DefineXmlHttpRequestInstrumentationOptionsFunction = (defaultOptions: XMLHttpRequestInstrumentationConfig) => XMLHttpRequestInstrumentationConfig;

/**
 * @see https://workleap.github.io/wl-tracking
 */
export type DefineDocumentLoadInstrumentationOptionsFunction = (defaultOptions: DocumentLoadInstrumentationConfig) => DocumentLoadInstrumentationConfig;

/**
 * @see https://workleap.github.io/wl-tracking
 */
export type DefineUserInteractionInstrumentationOptionsFunction = (defaultOptions: UserInteractionInstrumentationConfig) => UserInteractionInstrumentationConfig;

const defaultDefineFetchInstrumentationOptions: DefineFetchInstrumentationOptionsFunction = defaultOptions => {
    return defaultOptions;
};

const defaultDefineDocumentLoadInstrumentationOptions: DefineDocumentLoadInstrumentationOptionsFunction = defaultOptions => {
    return defaultOptions;
};

/**
 * @see https://workleap.github.io/wl-tracking
 */
export interface RegisterHoneycombInstrumentationOptions {
    proxy?: string;
    apiKey?: HoneycombSdkOptions["apiKey"];
    verbose?: boolean;
    instrumentations?: HoneycombSdkInstrumentations;
    spanProcessors?: SpanProcessor[];
    fetchInstrumentation?: false | DefineFetchInstrumentationOptionsFunction;
    xmlHttpRequestInstrumentation?: false | DefineXmlHttpRequestInstrumentationOptionsFunction;
    documentLoadInstrumentation?: false | DefineDocumentLoadInstrumentationOptionsFunction;
    userInteractionInstrumentation?: false | DefineUserInteractionInstrumentationOptionsFunction;
    transformers?: HoneycombSdkOptionsTransformer[];
}

export function getHoneycombSdkOptions(serviceName: NonNullable<HoneycombSdkOptions["serviceName"]>, apiServiceUrls: PropagateTraceHeaderCorsUrls, options: RegisterHoneycombInstrumentationOptions = {}) {
    const {
        proxy,
        apiKey,
        verbose = false,
        instrumentations = [],
        spanProcessors = [],
        fetchInstrumentation = defaultDefineFetchInstrumentationOptions,
        xmlHttpRequestInstrumentation = false,
        documentLoadInstrumentation = defaultDefineDocumentLoadInstrumentationOptions,
        userInteractionInstrumentation = false,
        transformers = []
    } = options;

    if (!proxy && !apiKey) {
        throw new Error("[honeycomb] Instrumentation must be initialized with either a \"proxy\" or \"apiKey\" option.");
    }

    const instrumentationOptions = {
        ignoreNetworkEvents: true,
        propagateTraceHeaderCorsUrls: apiServiceUrls
    };

    const autoInstrumentations: InstrumentationConfigMap = {};

    if (fetchInstrumentation) {
        autoInstrumentations["@opentelemetry/instrumentation-fetch"] =
            augmentFetchInstrumentationOptionsWithFetchRequestPipeline(
                fetchInstrumentation(instrumentationOptions)
            );
    } else {
        autoInstrumentations["@opentelemetry/instrumentation-fetch"] = {
            enabled: false
        };
    }

    if (xmlHttpRequestInstrumentation) {
        autoInstrumentations["@opentelemetry/instrumentation-xml-http-request"] = xmlHttpRequestInstrumentation(instrumentationOptions);
    } else {
        autoInstrumentations["@opentelemetry/instrumentation-xml-http-request"] = {
            enabled: false
        };
    }

    if (documentLoadInstrumentation) {
        autoInstrumentations["@opentelemetry/instrumentation-document-load"] = documentLoadInstrumentation(instrumentationOptions);
    } else {
        autoInstrumentations["@opentelemetry/instrumentation-document-load"] = {
            enabled: false
        };
    }

    if (userInteractionInstrumentation) {
        autoInstrumentations["@opentelemetry/instrumentation-user-interaction"] = userInteractionInstrumentation({});
    } else {
        autoInstrumentations["@opentelemetry/instrumentation-user-interaction"] = {
            enabled: false
        };
    }

    const sdkOptions = {
        endpoint: proxy,
        apiKey,
        debug: verbose,
        localVisualizations: verbose,
        serviceName,
        // Watch out, getWebAutoInstrumentations enables by default all the supported instrumentations.
        // It's important to disabled those that we don't want.
        instrumentations: [
            ...getWebAutoInstrumentations(autoInstrumentations),
            ...instrumentations
        ],
        spanProcessors: [globalAttributeSpanProcessor, normalizeAttributesSpanProcessor, ...spanProcessors]
    } satisfies HoneycombSdkOptions;

    return applyTransformers(sdkOptions, transformers, {
        verbose
    });
}

/**
 * @see https://workleap.github.io/wl-tracking
 */
export function registerHoneycombInstrumentation(namespace: string, serviceName: NonNullable<HoneycombSdkOptions["serviceName"]>, apiServiceUrls: PropagateTraceHeaderCorsUrls, telemetryContext: TelemetryContext, options: RegisterHoneycombInstrumentationOptions = {}) {
    if (options.proxy) {
        patchXmlHttpRequest(options?.proxy);
    }

    const sdkOptions = getHoneycombSdkOptions(serviceName, apiServiceUrls, options);
    const instance = new HoneycombWebSDK(sdkOptions);

    instance.start();

    // This is a custom field recommended by Honeycomb to organize the data.
    setGlobalSpanAttribute("service.namespace", namespace);

    // Correlation ids.
    setGlobalSpanAttribute("app.telemetry_id", telemetryContext.telemetryId);
    setGlobalSpanAttribute("app.device_id", telemetryContext.deviceId);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__) {
        // If LogRocket instrumentation is registered, when the LogRocket session URL is ready,
        // it's automatically added to all Honeycomb traces.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__((sessionUrl: string) => {
            setGlobalSpanAttribute("app.logrocket_session_url", sessionUrl);
        });
    }

    // Indicates to the host applications that the Honeycomb instrumentation
    // has been registered.
    // It's useful in cases where an "add-on", like the platform widgets needs
    // to know whether or not the host application is using Honeycomb.
    // While there are ways that the host application could tell to an "add-on" if
    // it's using Honeycomb or not, doing it this way is transparent for the consumer,
    // which is great for DX.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_HONEYCOMB_INSTRUMENTATION_IS_REGISTERED__ = true;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK = registerFetchRequestHook;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK_AT_START = registerFetchRequestHookAtStart;
}
