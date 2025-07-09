import { afterEach, test } from "vitest";
import { __clearTelemetryContext, __setTelemetryContext, getTelemetryContext, TelemetryContext } from "../src/TelemetryContext.ts";

/*

- When a context instance is available, return the existing instance

- When a no context instance is available, create a new instance

*/
afterEach(() => {
    __clearTelemetryContext();
});

test("when a context instance is available, return the existing instance", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    __setTelemetryContext(telemetryContext);

    const result = getTelemetryContext();

    expect(result.telemetryId).toBe(telemetryContext.telemetryId);
    expect(result.deviceId).toBe(telemetryContext.deviceId);
});

test("when no context instance is available, create a new instance", ({ expect }) => {
    const result = getTelemetryContext();

    expect(result.telemetryId).toBeDefined();
    expect(result.deviceId).toBeDefined();
});
