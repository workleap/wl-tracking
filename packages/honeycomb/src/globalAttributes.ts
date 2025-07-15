import type { Attributes, AttributeValue, Span } from "@opentelemetry/api";
import type { SpanProcessor } from "@opentelemetry/sdk-trace-web";

export class GlobalAttributeSpanProcessor implements SpanProcessor {
    // Not private to be available if the class is extended.
    _attributes: Attributes = {};

    onStart(span: Span) {
        if (Object.keys(this._attributes).length > 0) {
            span.setAttributes(this._attributes);
        }
    }

    onEnd() {}

    forceFlush() {
        return Promise.resolve();
    }

    shutdown() {
        return Promise.resolve();
    }

    setAttribute(key: string, value: AttributeValue) {
        this._attributes[key] = value;
    }

    setAttributes(attributes: Attributes) {
        this._attributes = {
            ...this._attributes,
            ...attributes
        };
    }
}

let globalAttributeSpanProcessor: GlobalAttributeSpanProcessor | undefined;

export function __setGlobalAttributeSpanProcessor(spanProcessor: GlobalAttributeSpanProcessor) {
    globalAttributeSpanProcessor = spanProcessor;
}

export function __clearGlobalAttributeSpanProcessor() {
    globalAttributeSpanProcessor = undefined;
}

export function getGlobalAttributeSpanProcessor() {
    if (!globalAttributeSpanProcessor) {
        globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    }

    return globalAttributeSpanProcessor;
}

export function setGlobalSpanAttribute(key: string, value: AttributeValue) {
    getGlobalAttributeSpanProcessor().setAttribute(key, value);
}

export function setGlobalSpanAttributes(attributes: Attributes) {
    getGlobalAttributeSpanProcessor().setAttributes(attributes);
}
