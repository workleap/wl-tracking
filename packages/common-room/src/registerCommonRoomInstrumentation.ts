import { setCommonRoomContext } from "./context.ts";
import { HasExecutedGuard } from "./HasExecutedGuard.ts";

const registrationGuard = new HasExecutedGuard();

// This function should only be used by tests.
export function __resetRegistrationGuard() {
    registrationGuard.reset();
}

function loadSignals(siteId: string) {
    return new Promise<void>((resolve, reject) => {
        // Do not load the script as a "module" because it will mess with CORS.
        const script = document.createElement("script");
        script.src = `https://cdn.cr-relay.com/v1/site/${siteId}/signals.js`;
        script.async = true;

        script.onload = () => {
            resolve();
        };

        script.onerror = () => {
            reject();
        };

        // Must append the element after setting the event handlers for unit tests.
        document.head.appendChild(script);
    });
}

export type ReadyFunction = () => void;

export interface RegisterCommonRoomInstrumentationOptions {
    verbose?: boolean;
}

export function registerCommonRoomInstrumentation(siteId: string, options: RegisterCommonRoomInstrumentationOptions = {}) {
    const {
        verbose = false
    } = options;

    registrationGuard.throw("[common-room] The Common Room instrumentation has already been registered. Did you call the \"registerCommonRoomInstrumentation\" function twice?");

    loadSignals(siteId)
        .then(() => {
            setCommonRoomContext({
                verbose
            });

            if (verbose) {
                console.log("[common-room] Common Room instrumentation is registered.");
            }
        })
        .catch(() => {
            console.error("[common-room] Failed to load signals script.");
        });
}
