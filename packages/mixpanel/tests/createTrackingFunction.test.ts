import { beforeEach, test, vi } from "vitest";
import { createTrackingFunction } from "../src/createTrackingFunction.ts";

const fetchMock = vi.fn();
globalThis.fetch = fetchMock;

beforeEach(() => {
    vi.clearAllMocks();
});

const mockBaseProps = { baseProp: "base" };

vi.mock("../src/properties.ts", () => ({
    getBaseProperties: () => mockBaseProps
}));


test("when an event is tracked, sends a request to the default endpoint", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation");

    await track("customEvent", {});

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe("/api/navigation/tracking/track");
});

test("when called, sends a request to the default endpoint with merged properties", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation");

    await track("event", { customProp: 123 });

    const [url, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(url).toBe("/api/navigation/tracking/track");
    expect(body.properties).toMatchObject({
        baseProp: "base",
        customProp: 123
    });
    expect(body.productId).toBe("wlp");
    expect(body.targetProductId).toBeNull();
});

test("when an event is tracked, includes the event name in the request body", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation");

    await track("customEvent", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body.eventName).toBe("customEvent");
});

test("when a custom endpoint is provided, uses the custom endpoint", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation", {
        trackingEndpoint: "custom/track"
    });

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/navigation/custom/track");
});

test("when keepAlive is true, includes keepalive in the fetch options", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation");

    await track("keepaliveEvent", {}, { keepAlive: true });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.keepalive).toBe(true);
});

test("when a targetProductId is provided, includes it in the request body", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation", {
        targetProductId: "target-app"
    });

    await track("event", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.targetProductId).toBe("target-app");
});

test("when targetProductId is not provided, add it from the request body with null", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation");

    await track("event", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body).toHaveProperty("targetProductId", null);
});

test("when base URL ends with a slash, builds correct final URL", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation/");

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/navigation/tracking/track");
});

test("when endpoint starts with a slash, builds correct final URL", async ({ expect }) => {
    const track = createTrackingFunction("wlp", "/api/navigation", {
        trackingEndpoint: "/custom"
    });

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/navigation/custom");
});
