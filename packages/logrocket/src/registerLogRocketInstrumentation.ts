import type { TelemetryContext } from "@workleap/telemetry";
import LogRocket from "logrocket";
import LogrocketFuzzySanitizer from "logrocket-fuzzy-search-sanitizer";
import { applyTransformers, type LogRocketSdkOptionsTransformer } from "./applyTransformers.ts";
import { DeviceIdTrait, setTelemetryContext, TelemetryIdTrait } from "./createDefaultUserTraits.ts";
import { createRequestSanitizer } from "./createRequestSanitizer.ts";
import { createResponseSanitizer } from "./createResponseSanitizer.ts";
import { createUrlSanitizer } from "./createUrlSanitizer.ts";
import type { LogRocketSdkOptions } from "./logRocketTypes.ts";

/**
 * @see https://workleap.github.io/wl-tracking
 */
export interface RegisterLogRocketInstrumentationOptions {
    // Set to capture traffic from all subdomains under one session: https://docs.logrocket.com/reference/roothostname.
    rootHostname?: LogRocketSdkOptions["rootHostname"];
    privateFieldNames?: string[];
    privateQueryParameterNames?: string[];
    transformers?: LogRocketSdkOptionsTransformer[];
}

const DefaultPrivateFieldNames = [
    "email",
    "personalEmail",
    "phoneNumber",
    "password",
    "firstName",
    "lastName",
    "givenName",
    "fullName",
    "gender",
    "timeZone",
    "birthday"
];

const DefaultPrivateQueryParameterNames = [
    "token",
    "email",
    "password"
];

export function getLogRocketSdkOptions(options: RegisterLogRocketInstrumentationOptions) {
    const {
        rootHostname = "workleap.com",
        privateFieldNames = [],
        privateQueryParameterNames = [],
        transformers = []
    } = options;

    const mergedPrivateFieldNames = DefaultPrivateFieldNames.concat(privateFieldNames);
    const mergedPrivateQueryParameterNames = DefaultPrivateQueryParameterNames.concat(privateQueryParameterNames);

    // The "LogrocketFuzzySearch.setup" code is akward. For now, we prefer to play it safe and call it once here, then forward the sanitize functions
    // to the appropriate factories.
    // No clue why the "setup" method is not available. This package is shady.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { requestSanitizer: fuzzyRequestSanitizer, responseSanitizer: fuzzyResponseSanitizer } = LogrocketFuzzySanitizer.setup(mergedPrivateFieldNames);

    const sdkOptions = {
        console: {
            isEnabled: false
        },
        rootHostname,
        dom: {
            textSanitizer: true,
            inputSanitizer: true
        },
        network: {
            requestSanitizer: createRequestSanitizer(fuzzyRequestSanitizer),
            responseSanitizer: createResponseSanitizer(fuzzyResponseSanitizer)
        },
        browser: {
            urlSanitizer: createUrlSanitizer(mergedPrivateQueryParameterNames)
        }
    } satisfies LogRocketSdkOptions;

    return applyTransformers(sdkOptions, transformers);
}

/**
 * @see https://workleap.github.io/wl-tracking
 */
export function registerLogRocketInstrumentation(appId: string, telemetryContext: TelemetryContext, options: RegisterLogRocketInstrumentationOptions = {}) {
    const sdkOptions = getLogRocketSdkOptions(options);

    // Session starts anonymously when LogRocket.init() is called.
    LogRocket.init(appId, sdkOptions);

    // LogRocket maintains the same session even if the user starts as anonymous and later becomes identified via LogRocket.identify().
    // If LogRocket.identify is called multiple times during a recording, you can search for any of the identified users in the session.
    LogRocket.identify(telemetryContext.deviceId, {
        [DeviceIdTrait]: telemetryContext.deviceId,
        [TelemetryIdTrait]: telemetryContext.telemetryId
    });

    // Save the tracking id to include it as a trait if the user is identified.
    setTelemetryContext(telemetryContext);

    // Indicates to the host applications that logrocket has been initialized.
    // It's useful in cases where an "add-on", like the platform widgets needs
    // to know whether or not the host application is using LogRocket.
    // While there are ways that the host application could tell to an "add-on" if
    // it's using LogRocket or not, doing it this way is transparent for the consumer,
    // which is great for DX.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_IS_REGISTERED__ = true;
}
