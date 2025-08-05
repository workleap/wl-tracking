export const ContextVariableName = "__WLP_COMMON_ROOM_CONTEXT__";

export interface CommonRootContext {
    verbose: boolean;
}

export function setCommonRoomContext(context: CommonRootContext) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[ContextVariableName] = context;
}

export function getCommonRoomContext() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const context = globalThis[ContextVariableName] as CommonRootContext;

    if (!context) {
        throw new Error("[common-room] The Common Room context is not available. Did you initialize signals with the \"initializeCommonRoom\" function?");
    }

    return context;
}
