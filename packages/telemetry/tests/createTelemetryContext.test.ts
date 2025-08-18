import { afterEach, test, vi } from "vitest";
import { __clearTelemetryContext, createTelemetryContext } from "../src/TelemetryContext.ts";
import { IdentityCookieName } from "../src/deviceId.ts";

afterEach(() => {
    vi.restoreAllMocks();

    __clearTelemetryContext();
});

test("when an identity cookie is available, the device id is retrieved from the cookie", ({ expect }) => {
    const deviceId = "123";

    vi.spyOn(document, "cookie", "get").mockReturnValue(`${IdentityCookieName}=${JSON.stringify({ deviceId })}`);

    const result = createTelemetryContext();

    expect(result.deviceId).toBe(deviceId);
});
