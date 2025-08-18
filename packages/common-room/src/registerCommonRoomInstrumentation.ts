import { createCompositeLogger, type RootLogger } from "@workleap/logging";
import { setCommonRoomContext } from "./context.ts";
import { HasExecutedGuard } from "./HasExecutedGuard.ts";

const registrationGuard = new HasExecutedGuard();

// This function should only be used by tests.
export function __resetRegistrationGuard() {
    registrationGuard.reset();
}

function loadSignals(siteId: string) {
    return new Promise<void>((resolve, reject) => {
        const url = `https://cdn.cr-relay.com/v1/site/${siteId}/signals.js`;

        // Do not load the script as a "module" because it will mess with CORS.
        const script = document.createElement("script");
        script.src = url;
        script.async = true;

        script.onload = () => {
            resolve();
        };

        script.onerror = () => {
            reject(`Failed to load Common Room script at "${url}".`);
        };

        // Must append the element after setting the event handlers for unit tests.
        document.head.appendChild(script);
    });
}

export type ReadyFunction = () => void;

export interface RegisterCommonRoomInstrumentationOptions {
    verbose?: boolean;
    loggers?: RootLogger[];
}

export function registerCommonRoomInstrumentation(siteId: string, options: RegisterCommonRoomInstrumentationOptions = {}) {
    const {
        verbose = false,
        loggers = []
    } = options;

    registrationGuard.throw("[common-room] The Common Room instrumentation has already been registered. Did you call the \"registerCommonRoomInstrumentation\" function twice?");

    const logger = createCompositeLogger(verbose, loggers);

    setCommonRoomContext({
        logger
    });

    loadSignals(siteId)
        .then(() => {
            logger.debug("[common-room] Common Room instrumentation is registered.");
        })
        .catch((reason: string) => {
            logger.error(`[common-room] ${reason}`);
        });
}
