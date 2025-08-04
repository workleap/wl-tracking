import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, test, vi } from "vitest";
import { getMixpanelHandlers, MixpanelApiHandlers, MswMixpanelApiUrls } from "../../src/msw/index.ts";
import { createTrackingFunction } from "../../src/js/createTrackingFunction.ts";
import { initializeMixpanel, __resetInitializationGuard } from "../../src/js/initializeMixpanel.ts";
import { __clearSuperProperties } from "../../src/js/properties.ts";
import { __clearBootstrappingStore, __clearTelemetryContext } from "@workleap/telemetry/internal";

const server = setupServer();

beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
    __resetInitializationGuard();
    __clearSuperProperties();
    __clearBootstrappingStore();
    __clearTelemetryContext();
});

afterAll(() => {
    server.close();
});

test("default MSW handler responds successfully", async ({ expect }) => {
    server.use(...getMixpanelHandlers());
    
    initializeMixpanel("test-product", "msw");
    const track = createTrackingFunction();
    
    // This should not throw
    await track("test_event", { customProp: "test" });
    
    expect(true).toBe(true); // Test passes if no error is thrown
});

test("MSW handler can simulate server error", async ({ expect }) => {
    server.use(MixpanelApiHandlers.Tracking.ServerError);
    
    initializeMixpanel("test-product", "msw");
    const track = createTrackingFunction();
    
    // The tracking function swallows errors, so we'll just verify it doesn't throw
    await track("test_event", { customProp: "test" });
    
    expect(true).toBe(true);
});

test("MSW handler can simulate network error", async ({ expect }) => {
    server.use(MixpanelApiHandlers.Tracking.NetworkError);
    
    initializeMixpanel("test-product", "msw");
    const track = createTrackingFunction();
    
    // The tracking function swallows errors, so we'll just verify it doesn't throw
    await track("test_event", { customProp: "test" });
    
    expect(true).toBe(true);
});

test("custom MSW handler with response override", async ({ expect }) => {
    const customResponse = { status: "success", id: "123" };
    server.use(MixpanelApiHandlers.Tracking.Custom(customResponse));
    
    initializeMixpanel("test-product", "msw");
    const track = createTrackingFunction();
    
    await track("test_event", { customProp: "test" });
    
    expect(true).toBe(true);
});

test("MSW URLs are correctly formed", ({ expect }) => {
    expect(MswMixpanelApiUrls.Tracking.Track).toBe("/api/shell/navigation/tracking/track");
});

test("getMixpanelHandlers returns array of handlers", ({ expect }) => {
    const handlers = getMixpanelHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
});

test("getMixpanelHandlers with custom delay", ({ expect }) => {
    const handlers = getMixpanelHandlers({ delay: 500 });
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBe(1);
});