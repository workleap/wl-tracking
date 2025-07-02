import type { LogRocketSdkOptions } from "./logRocketTypes.ts";

export type LogRocketSdkOptionsTransformer = (options: LogRocketSdkOptions) => LogRocketSdkOptions;

export function applyTransformers(options: LogRocketSdkOptions, transformers: LogRocketSdkOptionsTransformer[]) {
    return transformers.reduce((acc, transformer) => transformer(acc), options);
}


