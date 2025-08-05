import { getCommonRoomContext } from "./context.ts";

declare global {
    interface Window {
        signals?: {
            identify: (options: { email?: string; name?: string }) => void;
        };
    }
}

export function identify(email: string) {
    if (!window.signals) {
        console.error("[common-room] Cannot identify user because the signals scripts is not loaded. Did you initialize signals with the \"initializeCommonRoom\" function?");

        return;
    }

    const context = getCommonRoomContext();

    window.signals.identify({
        email
    });

    if (context.verbose) {
        console.log("[common-room] User has been identified.");
    }
}
