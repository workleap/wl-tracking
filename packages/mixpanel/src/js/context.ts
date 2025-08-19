import type { Logger } from "@workleap/logging";
import type { SuperProperties } from "./properties.ts";

export const MixpanelContextVariableName = "__WLP_MIXPANEL_CONTEXT__";

export interface MixpanelContext {
    productId: string;
    endpoint: string;
    superProperties: SuperProperties;
    logger: Logger;
}

export function setMixpanelContext(context: MixpanelContext) {
    // Will be used by the "track" function.
    // It's important to share the context with a global DOM object rather than
    // a singleton because projects like the platform widgets will use a distinct instance
    // of this package than the host application.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[MixpanelContextVariableName] = context;
}

export function getMixpanelContext() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const context = globalThis[MixpanelContextVariableName] as MixpanelContext;

    if (!context) {
        throw new Error("[mixpanel] The Mixpanel context is not available. Did you initialize Mixpanel with the \"initializeMixpanel\" function?");
    }

    return context;
}


