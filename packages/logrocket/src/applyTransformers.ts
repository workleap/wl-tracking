import type { LogRocketSdkOptions } from "./logRocketTypes.ts";

/**
 * @see https://workleap.github.io/wl-tracking
 */
export interface LogRocketSdkOptionsTransformerContext {
    verbose: boolean;
}

export type LogRocketSdkOptionsTransformer = (options: LogRocketSdkOptions, context: LogRocketSdkOptionsTransformerContext) => LogRocketSdkOptions;

export function applyTransformers(options: LogRocketSdkOptions, transformers: LogRocketSdkOptionsTransformer[], context: LogRocketSdkOptionsTransformerContext) {
    return transformers.reduce((acc, transformer) => transformer(acc, context), options);
}


