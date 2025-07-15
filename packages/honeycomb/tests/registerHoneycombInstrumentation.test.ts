import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { BootstrappingStore, TelemetryContext } from "@workleap/telemetry";
import { __clearBootstrappingStore, __clearTelemetryContext, __setBootstrappingStore, __setTelemetryContext } from "@workleap/telemetry/internal";
import { afterEach, test, vi } from "vitest";
import { __clearGlobalAttributeSpanProcessor, __setGlobalAttributeSpanProcessor, GlobalAttributeSpanProcessor } from "../src/globalAttributes.ts";
import {
    __clearHoneycombSdkFactory,
    __resetRegistrationGuard,
    __setHoneycombSdkFactory,
    DeviceIdAttributeName,
    IsRegisteredFunctionName,
    RegisterDynamicFetchRequestHookAtStartFunctionName,
    RegisterDynamicFetchRequestHookFunctionName,
    registerHoneycombInstrumentation,
    ServiceNamespaceAttributeName,
    TelemetryIdAttributeName
} from "../src/registerHoneycombInstrumentation.ts";

class DummyHoneycombWebSdk extends HoneycombWebSDK {
    start(): void { }
}

class DummyGlobalAttributeSpanProcessor extends GlobalAttributeSpanProcessor {
    get attributes() {
        return this._attributes;
    }
}

afterEach(() => {
    vi.clearAllMocks();

    __resetRegistrationGuard();
    __clearHoneycombSdkFactory();
    __clearGlobalAttributeSpanProcessor();
    __clearTelemetryContext();
    __clearBootstrappingStore();
});

test("when honeycomb instrumentation has already been registered, throw an error", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    expect(() => registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    })).toThrow("[honeycomb] The Honeycomb instrumentation has already been registered. Did you call the \"registerHoneycombInstrumentation\" function twice?");
});

test("set the namespace global attribute", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();

    __setGlobalAttributeSpanProcessor(globalAttributeSpanProcessor);

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    expect(globalAttributeSpanProcessor.attributes[ServiceNamespaceAttributeName]).toBe("foo");
});

test("set the telemetry global attributes", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();

    __setGlobalAttributeSpanProcessor(globalAttributeSpanProcessor);

    const telemetryContext = new TelemetryContext("123", "456");

    __setTelemetryContext(telemetryContext);

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    expect(globalAttributeSpanProcessor.attributes[TelemetryIdAttributeName]).toBe(telemetryContext.telemetryId);
    expect(globalAttributeSpanProcessor.attributes[DeviceIdAttributeName]).toBe(telemetryContext.deviceId);
});

test("is registered global variable is true", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[IsRegisteredFunctionName]).toBeTruthy();
});

test("register dynamic fetch request hook function is defined", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(typeof globalThis[RegisterDynamicFetchRequestHookFunctionName]).toBe("function");
});

test("register dynamic fetch request hook at start function is defined", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(typeof globalThis[RegisterDynamicFetchRequestHookAtStartFunctionName]).toBe("function");
});

test("when logrocket is ready, register a listener for logrocket get session url", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: true,
        isHoneycombReady: false
    });

    __setBootstrappingStore(bootstrappingStore);

    const registerGetSessionUrlListenerMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__ = registerGetSessionUrlListenerMock;

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    expect(registerGetSessionUrlListenerMock).toHaveBeenCalledOnce();
});

test("when logrocket is not ready, register a listener for logrocket get session url once logrocket is ready", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    });

    __setBootstrappingStore(bootstrappingStore);

    const registerGetSessionUrlListenerMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__ = registerGetSessionUrlListenerMock;

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    expect(registerGetSessionUrlListenerMock).not.toHaveBeenCalled();

    bootstrappingStore.dispatch({ type: "logrocket-ready" });

    expect(registerGetSessionUrlListenerMock).toHaveBeenCalledOnce();
});

test("honeycomb is marked as ready", ({ expect }) => {
    __setHoneycombSdkFactory(options => {
        return new DummyHoneycombWebSdk({
            endpoint: options.endpoint,
            serviceName: options.serviceName
        });
    });

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    });

    __setBootstrappingStore(bootstrappingStore);

    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    expect(bootstrappingStore.state.isHoneycombReady).toBeTruthy();
});


