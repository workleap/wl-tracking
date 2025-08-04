import { test } from "vitest";
import { MixpanelApiMocks, MixpanelTrackingResponse } from "../../src/mocks/index.ts";

test("MixpanelApiMocks.Track.Default returns valid request", ({ expect }) => {
    const request = MixpanelApiMocks.Track.Default();
    
    expect(request.eventName).toBe("test_event");
    expect(request.productIdentifier).toBe("test_product");
    expect(request.targetProductIdentifier).toBeNull();
    expect(request.properties).toBeTypeOf("object");
    expect(request.properties["$browser"]).toBe("Chrome");
    expect(request.properties["Is Mobile"]).toBe(false);
});

test("MixpanelApiMocks.Track.WithTargetProduct includes target product", ({ expect }) => {
    const request = MixpanelApiMocks.Track.WithTargetProduct();
    
    expect(request.targetProductIdentifier).toBe("target_product");
    expect(request.eventName).toBe("test_event");
    expect(request.productIdentifier).toBe("test_product");
});

test("MixpanelApiMocks.Track.Mobile has mobile properties", ({ expect }) => {
    const request = MixpanelApiMocks.Track.Mobile();
    
    expect(request.properties["$device"]).toBe("iPhone");
    expect(request.properties["Is Mobile"]).toBe(true);
    expect(request.properties["$screen_width"]).toBe(375);
    expect(request.properties["$screen_height"]).toBe(812);
});

test("MixpanelApiMocks.Track.WithCustomProperties merges custom properties", ({ expect }) => {
    const customProps = { customProp: "customValue", userRole: "admin" };
    const request = MixpanelApiMocks.Track.WithCustomProperties(customProps);
    
    expect(request.properties.customProp).toBe("customValue");
    expect(request.properties.userRole).toBe("admin");
    expect(request.properties["$browser"]).toBe("Chrome"); // Default properties still present
});

test("MixpanelApiMocks.Track.Custom allows full customization", ({ expect }) => {
    const customData = {
        eventName: "custom_event",
        productIdentifier: "custom_product",
        targetProductIdentifier: "custom_target",
        properties: {
            customProp: "customValue"
        }
    };
    
    const request = MixpanelApiMocks.Track.Custom(customData);
    
    expect(request.eventName).toBe("custom_event");
    expect(request.productIdentifier).toBe("custom_product");
    expect(request.targetProductIdentifier).toBe("custom_target");
    expect(request.properties.customProp).toBe("customValue");
    expect(request.properties["$browser"]).toBe("Chrome"); // Default properties merged
});

test("MixpanelApiMocks.Track.Custom with partial properties", ({ expect }) => {
    const customData = {
        eventName: "custom_event",
        properties: {
            customProp: "customValue",
            "$browser": "Firefox" // Override default
        }
    };
    
    const request = MixpanelApiMocks.Track.Custom(customData);
    
    expect(request.eventName).toBe("custom_event");
    expect(request.productIdentifier).toBe("test_product"); // Default
    expect(request.properties.customProp).toBe("customValue");
    expect(request.properties["$browser"]).toBe("Firefox"); // Overridden
});

test("MixpanelTrackingResponse.Success returns null", ({ expect }) => {
    const response = MixpanelTrackingResponse.Success();
    expect(response).toBeNull();
});