import { test } from "vitest";

test("can import from /mocks export", async ({ expect }) => {
    const mocksModule = await import("../../src/mocks/index.ts");
    
    expect(mocksModule.MixpanelApiMocks).toBeDefined();
    expect(mocksModule.MixpanelTrackingResponse).toBeDefined();
    expect(mocksModule.MixpanelTrackingResponse.Success).toBeTypeOf("function");
});

test("can import from /msw export", async ({ expect }) => {
    const mswModule = await import("../../src/msw/index.ts");
    
    expect(mswModule.MixpanelApiHandlers).toBeDefined();
    expect(mswModule.getMixpanelHandlers).toBeTypeOf("function");
    expect(mswModule.MswMixpanelApiUrls).toBeDefined();
    expect(mswModule.MixpanelApiMocks).toBeDefined(); // Re-exported
});

test("MSW types are properly exported", async ({ expect }) => {
    const mswModule = await import("../../src/msw/index.ts");
    
    // Test that we can get types from the imports
    const handlers = mswModule.getMixpanelHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    
    const mockRequest = mswModule.MixpanelApiMocks.TrackingRequest.Default();
    expect(mockRequest.eventName).toBe("test_event");
});

test("URLs are correctly structured", async ({ expect }) => {
    const mswModule = await import("../../src/msw/index.ts");
    
    expect(mswModule.MswMixpanelApiUrls.Tracking.Track).toBe("/api/shell/navigation/tracking/track");
    
    const developmentUrls = mswModule.getMixpanelApiUrls("development");
    expect(developmentUrls.Tracking.Track).toContain("api.platform.workleap-dev.com");
    
    const productionUrls = mswModule.getMixpanelApiUrls("production");
    expect(productionUrls.Tracking.Track).toContain("api.platform.workleap.com");
});