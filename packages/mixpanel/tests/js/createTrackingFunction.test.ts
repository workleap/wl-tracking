import { afterEach, test } from "vitest";
import { createTrackingFunction } from "../../src/js/createTrackingFunction.ts";
import { __clearSuperProperties } from "../../src/js/properties.ts";

afterEach(() => {
    __clearSuperProperties();
});

test("when the mixpanel context is not defined, throw an error", ({ expect }) => {
    expect(() => createTrackingFunction()).toThrow("[mixpanel] The Mixpanel context is not available. Did you initialize Mixpanel with the \"initializeMixpanel\" function?");
});
