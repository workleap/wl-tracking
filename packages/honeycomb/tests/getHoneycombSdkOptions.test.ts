import type { Instrumentation, InstrumentationConfig } from "@opentelemetry/instrumentation";
import type { SpanProcessor } from "@opentelemetry/sdk-trace-web";
import { test } from "vitest";
import { getFetchRequestHookCount } from "../src/FetchRequestPipeline.ts";
import { getHoneycombSdkOptions } from "../src/registerHoneycombInstrumentation.ts";

class DummyInstrumentation implements Instrumentation {
    instrumentationName: string = "dummy";
    instrumentationVersion: string = "1.0.0";

    disable(): void {
        throw new Error("Method not implemented.");
    }

    enable(): void {
        throw new Error("Method not implemented.");
    }

    setTracerProvider(): void {
        throw new Error("Method not implemented.");
    }

    setMeterProvider(): void {
        throw new Error("Method not implemented.");
    }

    setConfig(): void {
        throw new Error("Method not implemented.");
    }

    getConfig(): InstrumentationConfig {
        throw new Error("Method not implemented.");
    }
}

class DummySpanProcessor implements SpanProcessor {
    forceFlush(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    onStart(): void {
        throw new Error("Method not implemented.");
    }

    onEnd(): void {
        throw new Error("Method not implemented.");
    }

    shutdown(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeInstrumentationVersionsForSnapshot(options: any) {
    if (Array.isArray(options.instrumentations)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options.instrumentations.forEach(x => {
            if (x["instrumentationVersion"]) {
                delete x["instrumentationVersion"];
            }

            if (x["version"]) {
                delete x["version"];
            }

            if (x["_logger"] && x["_logger"]["version"]) {
                delete x["_logger"]["version"];
            }

            if (x["_tracer"] && x["_tracer"]["version"]) {
                delete x["_tracer"]["version"];
            }
        });
    }

    return options;
}

test.concurrent("do not throw when an api key is provided", ({ expect }) => {
    expect(() => getHoneycombSdkOptions("foo", ["/foo"], {
        apiKey: "123"
    })).not.toThrow();
});

test.concurrent("do not throw when a proxy is provided", ({ expect }) => {
    expect(() => getHoneycombSdkOptions("foo", ["/foo"], {
        proxy: "https://my-proxy.com"
    })).not.toThrow();
});

test.concurrent("throw when both the api key and proxy options are not provided", ({ expect }) => {
    expect(() => getHoneycombSdkOptions("foo", ["/foo"])).toThrow();
});

test.concurrent("when debug is true", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        debug: true,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when debug is false", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        debug: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("with custom instrumentations", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        instrumentations: [new DummyInstrumentation()],
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("with custom span processors", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        spanProcessors: [new DummySpanProcessor()],
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when fetch instrumentation is false", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        fetchInstrumentation: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when fetch instrumentation is a custom function", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        fetchInstrumentation: defaultOptions => ({ ...defaultOptions, ignoreNetworkEvents: false }),
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

// Intentionally not concurrent.
test("when fetch instrumentation custom function returns a request hook, automatically add the request hook to the pipeline", ({ expect }) => {
    getHoneycombSdkOptions("foo", ["/foo"], {
        fetchInstrumentation: defaultOptions => ({
            ...defaultOptions,
            requestHook: () => {
                console.log("toto");
            }
        }),
        apiKey: "123"
    });

    expect(getFetchRequestHookCount()).toBe(1);
});

test.concurrent("when xml http instrumentation is false", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        xmlHttpRequestInstrumentation: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when xml http instrumentation is a custom function", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        xmlHttpRequestInstrumentation: defaultOptions => ({ ...defaultOptions, ignoreNetworkEvents: false }),
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when document load instrumentation is false", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        documentLoadInstrumentation: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when document load instrumentation is a custom function", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        documentLoadInstrumentation: defaultOptions => ({ ...defaultOptions, ignoreNetworkEvents: false }),
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when user interaction instrumentation is false", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        userInteractionInstrumentation: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when user interaction instrumentation is a custom function", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        userInteractionInstrumentation: defaultOptions => ({ ...defaultOptions, ignoreNetworkEvents: false }),
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("with a single transformer", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        transformers: [
            options => {
                options.serviceName = "toto";

                return options;
            }
        ],
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("with multiple transformers", ({ expect }) => {
    const result = getHoneycombSdkOptions("foo", ["/foo"], {
        transformers: [
            options => {
                options.serviceName = "toto";

                return options;
            },
            options => {
                options.apiKey = "toto";

                return options;
            }
        ],
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});
