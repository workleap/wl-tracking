import { setCommonRoomContext } from "./context.ts";
import { HasExecutedGuard } from "./HasExecutedGuard.ts";

const initializeGuard = new HasExecutedGuard();

// This function should only be used by tests.
export function __resetInitializeGuard() {
    initializeGuard.reset();
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

export interface InitializeCommonRoomOptions {
    verbose?: boolean;
}

export function initializeCommonRoom(siteId: string, options: InitializeCommonRoomOptions = {}) {
    const {
        verbose = false
    } = options;

    initializeGuard.throw("[common-room] Common Room has already been initialized. Did you call the \"initializeCommonRoom\" function twice?");

    loadSignals(siteId)
        .then(() => {
            setCommonRoomContext({
                verbose
            });

            if (verbose) {
                console.log("[common-room] Common Room is initialized.");
            }
        })
        .catch(() => {
            console.error("[common-room] Failed to load signals script.");
        });
}
