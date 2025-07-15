import type { Span } from "@opentelemetry/api";
import type { FetchInstrumentationConfig, FetchRequestHookFunction } from "@opentelemetry/instrumentation-fetch";

export type FetchRequestPipelineHookFunction = (span: Span, request: Request | RequestInit) => void | true;

export class FetchRequestPipeline {
    private hooks: Set<FetchRequestPipelineHookFunction> = new Set();

    registerHook(hook: FetchRequestPipelineHookFunction) {
        this.hooks.add(hook);
    }

    registerHookAtStart(hook: FetchRequestPipelineHookFunction) {
        this.hooks = new Set([hook, ...this.hooks]);
    }

    dispatchRequest(span: Span, request: Request | RequestInit) {
        for (const hook of this.hooks) {
            const result = hook(span, request);

            // A hook can return "true" to stop the propagation to the subsequent hooks.
            if (result === true) {
                break;
            }
        }
    }

    get hookCount() {
        return this.hooks.size;
    }
}

const pipeline = new FetchRequestPipeline();

export function registerFetchRequestHook(hook: FetchRequestPipelineHookFunction) {
    if (hook) {
        pipeline.registerHook(hook);
    }
}

export function registerFetchRequestHookAtStart(hook: FetchRequestPipelineHookFunction) {
    if (hook) {
        pipeline.registerHookAtStart(hook);
    }
}

export function getFetchRequestHookCount() {
    return pipeline.hookCount;
}

const fetchRequestPipelineHook: FetchRequestHookFunction = (span: Span, request: Request | RequestInit) => {
    pipeline.dispatchRequest(span, request);
};

export function augmentFetchInstrumentationOptionsWithFetchRequestPipeline(options: FetchInstrumentationConfig) {
    if (options.requestHook) {
        registerFetchRequestHook(options.requestHook);
    }

    options.requestHook = fetchRequestPipelineHook;

    return options;
}
