import { NoopLogger } from "@workleap/logging";
import { BootstrappingStore } from "@workleap/telemetry";
import { __clearBootstrappingStore, __clearTelemetryContext, __setBootstrappingStore } from "@workleap/telemetry/internal";
import { afterEach, test, vi } from "vitest";
import { MixpanelContextVariableName } from "../../src/js/context.ts";
import { __resetInitializationGuard, initializeMixpanel, IsInitializedVariableName } from "../../src/js/initializeMixpanel.ts";
import { __clearSuperProperties } from "../../src/js/properties.ts";

afterEach(() => {
    vi.clearAllMocks();

    __resetInitializationGuard();
    __clearSuperProperties();
    __clearBootstrappingStore();
    __clearTelemetryContext();
});

test("when honeycomb instrumentation has already been registered, throw an error", ({ expect }) => {
    initializeMixpanel("wlp", "http://api/navigation");

    expect(() => initializeMixpanel("wlp", "http://api/navigation")).toThrow("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");
});

test("when logrocket is ready, register a listener for logrocket get session url", ({ expect }) => {
    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: true,
        isHoneycombReady: false
    }, new NoopLogger());

    __setBootstrappingStore(bootstrappingStore);

    const registerGetSessionUrlListenerMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__ = registerGetSessionUrlListenerMock;

    initializeMixpanel("wlp", "http://api/navigation");

    expect(registerGetSessionUrlListenerMock).toHaveBeenCalledOnce();
});

test("when logrocket is not ready, register a listener for logrocket get session url once logrocket is ready", ({ expect }) => {
    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    __setBootstrappingStore(bootstrappingStore);

    const registerGetSessionUrlListenerMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__ = registerGetSessionUrlListenerMock;

    initializeMixpanel("wlp", "http://api/navigation");

    expect(registerGetSessionUrlListenerMock).not.toHaveBeenCalled();

    bootstrappingStore.dispatch({ type: "logrocket-ready" });

    expect(registerGetSessionUrlListenerMock).toHaveBeenCalledOnce();
});

test("the context global variable is set", ({ expect }) => {
    initializeMixpanel("wlp", "http://api/navigation");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[MixpanelContextVariableName]).toBeDefined();
});

test("the initialized global variable is set", ({ expect }) => {
    initializeMixpanel("wlp", "http://api/navigation");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[IsInitializedVariableName]).toBeDefined();
});
