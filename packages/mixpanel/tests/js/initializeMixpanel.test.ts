import { beforeEach, test, vi } from "vitest";
import { GlobalFunctionName } from "../../src/js/getMixpanelTrackingFunction.ts";
import { initializeMixpanel } from "../../src/js/initializeMixpanel.ts";
import { BaseProperties, TelemetryProperties } from "../../src/js/properties.ts";

const fetchMock = vi.fn();
globalThis.fetch = fetchMock;

beforeEach(() => {
    vi.clearAllMocks();
});

test("when an event is tracked, sends a request to the default endpoint", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    await track("customEvent", {});

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe("http://api/navigation/tracking/track");
});

test.only("when called, sends a request to the default endpoint with merged properties", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    await track("event", { customProp: 123 });

    const [url, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(url).toBe("http://api/navigation/tracking/track");
    expect(body.properties[BaseProperties.IsMobile]).toBeFalsy();
    expect(body.properties.customProp).toBe(123);
    expect(body.productIdentifier).toBe("wlp");
    expect(body.targetProductIdentifier).toBeNull();
});

test("when an event is tracked, includes the event name in the request body", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    await track("customEvent", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body.eventName).toBe("customEvent");
});

test("when keepAlive is true, includes keepalive in the fetch options", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    await track("keepaliveEvent", {}, { keepAlive: true });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.keepalive).toBe(true);
});

test("when a targetProductId is provided, includes it in the request body", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    await track("event", {}, {
        targetProductId: "target-app"
    });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.targetProductIdentifier).toBe("target-app");
});

test("when targetProductId is not provided, add it from the request body with null", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    await track("event", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body).toHaveProperty("targetProductIdentifier", null);
});

test("when base URL ends with a slash, builds correct final URL", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation/");

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("http://api/navigation/tracking/track");
});

test("when env is passed, builds correct final URL", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "development");

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.platform.workleap-dev.com/shell/navigation/tracking/track");
});

test("telemetry properties are set", async ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    await track("event", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body.properties[TelemetryProperties.DeviceId]).toBeDefined();
    expect(body.properties[TelemetryProperties.TelemetryId]).toBeDefined();
});

test("global function is set", ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[GlobalFunctionName]).toBe(track);
});
