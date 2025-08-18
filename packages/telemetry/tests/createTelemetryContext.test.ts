import { NoopLogger } from "@workleap/logging";
import { afterEach, test, vi } from "vitest";
import { __clearTelemetryContext, createTelemetryContext, TelemetryContextVariableName } from "../src/TelemetryContext.ts";
import { IdentityCookieName } from "../src/deviceId.ts";

afterEach(() => {
    vi.restoreAllMocks();

    __clearTelemetryContext();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete globalThis[TelemetryContextVariableName];
});

test("when an identity cookie is available, the device id is retrieved from the cookie", ({ expect }) => {
    const deviceId = "123";

    vi.spyOn(document, "cookie", "get").mockReturnValue(`${IdentityCookieName}=${JSON.stringify({ deviceId })}`);

    const result = createTelemetryContext(new NoopLogger());

    expect(result.deviceId).toBe(deviceId);
});

test("when called twice, the same telemetry context instance is returned", ({ expect }) => {
    const context1 = createTelemetryContext(new NoopLogger());
    const context2 = createTelemetryContext(new NoopLogger());

    expect(context1).toBe(context2);
});
