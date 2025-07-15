import type { AttributeValue, Span, SpanContext } from "@opentelemetry/api";

export class DummySpan implements Span {
    attributes: { key: string; value: unknown }[] = [];

    spanContext(): SpanContext {
        throw new Error("Method not implemented.");
    }

    setAttribute(key: string, value: AttributeValue): this {
        this.attributes.push({ key, value });

        return this;
    }

    setAttributes(): this {
        throw new Error("Method not implemented.");
    }

    addEvent(): this {
        throw new Error("Method not implemented.");
    }

    addLink(): this {
        throw new Error("Method not implemented.");
    }

    addLinks(): this {
        throw new Error("Method not implemented.");
    }

    setStatus(): this {
        throw new Error("Method not implemented.");
    }

    updateName(): this {
        throw new Error("Method not implemented.");
    }

    end(): void {
        throw new Error("Method not implemented.");
    }

    isRecording(): boolean {
        throw new Error("Method not implemented.");
    }

    recordException(): void {
        throw new Error("Method not implemented.");
    }
}
