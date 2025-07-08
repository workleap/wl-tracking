export type { HoneycombSdkOptionsTransformer } from "./applyTransformers.ts";
export { registerFetchRequestHook, type FetchRequestPipelineHookFunction } from "./FetchRequestPipeline.ts";
export { setGlobalSpanAttribute, setGlobalSpanAttributes } from "./globalAttributes.ts";
export * from "./honeycombTypes.ts";
export {
    registerHoneycombInstrumentation,
    type DefineDocumentLoadInstrumentationOptionsFunction,
    type DefineFetchInstrumentationOptionsFunction,
    type DefineUserInteractionInstrumentationOptionsFunction,
    type DefineXmlHttpRequestInstrumentationOptionsFunction,
    type RegisterHoneycombInstrumentationOptions
} from "./registerHoneycombInstrumentation.ts";

