import { BootstrappingStore, TelemetryContext } from "@workleap/telemetry";
import { __clearBootstrappingStore, __clearTelemetryContext, __setBootstrappingStore, __setTelemetryContext } from "@workleap/telemetry/internal";
import { afterEach, test, vi } from "vitest";
import { TrackingFunctionName } from "../../src/js/getMixpanelTrackingFunction.ts";
import { __resetInitializationGuard, initializeMixpanel } from "../../src/js/initializeMixpanel.ts";
import { TelemetryProperties } from "../../src/js/properties.ts";

const fetchMock = vi.fn();
globalThis.fetch = fetchMock;

afterEach(() => {
    vi.clearAllMocks();

    __resetInitializationGuard();
    __clearBootstrappingStore();
    __clearTelemetryContext();
});

test("when honeycomb instrumentation has already been registered, throw an error", ({ expect }) => {
    initializeMixpanel("wlp", "http://api/navigation");

    expect(() => initializeMixpanel("wlp", "http://api/navigation")).toThrow("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");
});

test("telemetry properties are set", async ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    __setTelemetryContext(telemetryContext);

    const track = initializeMixpanel("wlp", "http://api/navigation");

    await track("event", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body.properties[TelemetryProperties.TelemetryId]).toBe(telemetryContext.telemetryId);
    expect(body.properties[TelemetryProperties.DeviceId]).toBe(telemetryContext.deviceId);
});

test("the global tracking function is set", ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[TrackingFunctionName]).toBe(track);
});

test("when logrocket is ready, register a listener for logrocket get session url", ({ expect }) => {
    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: true,
        isHoneycombReady: false
    });

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
    });

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
