import { getCommonRoomContext } from "./context.ts";

export function identify(email: string) {
    const {
        logger
    } = getCommonRoomContext();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const signals = globalThis.signals;

    if (!signals) {
        logger.error("[common-room] Cannot identify user because the signals scripts is not loaded. Did you initialize signals with the \"registerCommonRoomInstrumentation\" function?");

        return;
    }

    signals.identify({
        email
    });

    logger.debug("[common-room] User has been identified.");
}
