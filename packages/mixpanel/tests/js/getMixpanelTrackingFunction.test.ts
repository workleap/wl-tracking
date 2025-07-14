import { test } from "vitest";
import { getMixpanelTrackingFunction } from "../../src/js/getMixpanelTrackingFunction.ts";
import { initializeMixpanel } from "../../src/js/initializeMixpanel.ts";

test("when the tracking function is undefined, throw an error", ({ expect }) => {
    expect(() => getMixpanelTrackingFunction()).toThrow("[mixpanel] The tracking function is undefined. Did you call the \"initializeMixpanel\" function?");
});

test("when \"throwOnUndefined\" is false and the tracking function us undefined, do not throw an error", ({ expect }) => {
    expect(() => getMixpanelTrackingFunction({ throwOnUndefined: false })).not.toThrow();
});

test("when the tracking function is available, return the tracking function", ({ expect }) => {
    const track = initializeMixpanel("wlp", "http://api/navigation");

    expect(getMixpanelTrackingFunction()).toBe(track);
});
