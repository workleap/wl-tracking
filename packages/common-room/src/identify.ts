import { getCommonRoomContext } from "./context.ts";

export function identify(email: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!globalThis.signals) {
        console.error("[common-room] Cannot identify user because the signals scripts is not loaded. Did you initialize signals with the \"registerCommonRoomInstrumentation\" function?");

        return;
    }

    const context = getCommonRoomContext();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.signals.identify({
        email
    });

    if (context.verbose) {
        console.log("[common-room] User has been identified.");
    }
}
