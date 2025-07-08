import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

// The identity cookie is a concept created by Workleap's marketing teams. With this cookie, telemetry data can be
// correlated with a device id accross multiple sites / apps.
export const IdentityCookieName = "wl-identity";

interface IdentityCookie {
    deviceId: string;
}

export class TelemetryContext {
    readonly #telemetryId: string;
    readonly #deviceId: string;

    constructor(telemetryId: string, deviceId: string) {
        this.#telemetryId = telemetryId;
        this.#deviceId = deviceId;
    }

    get telemetryId() {
        return this.#telemetryId;
    }

    get deviceId() {
        return this.#deviceId;
    }
}

export interface GetTelemetryContextOptions {
    identityCookieExpiration?: Date;
    identityCookieDomain?: string;
    verbose?: boolean;
}

export function createTelemetryContext(options: GetTelemetryContextOptions = {}) {
    const {
        identityCookieExpiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        identityCookieDomain = ".workleap",
        verbose = false
    } = options;

    let deviceId = getDeviceId();

    if (!deviceId) {
        deviceId = uuidv4();

        setDeviceId(deviceId, identityCookieExpiration, identityCookieDomain);
    }

    const telemetryId = uuidv4();

    if (verbose) {
        console.log(`[telemetry] Telemetry id is: ${telemetryId}`);
        console.log(`[Telemetry] Device id is: ${deviceId}`);
    }

    return new TelemetryContext(telemetryId, deviceId);
}

function getDeviceId() {
    try {
        const cookie = Cookies.get(IdentityCookieName);

        if (cookie) {
            const parsedCookie = JSON.parse(cookie) as IdentityCookie;

            return parsedCookie.deviceId;
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        // Do nothing.
    }
}

function setDeviceId(deviceId: string, cookieExpiration: Date, cookieDomain: string) {
    const value = {
        deviceId
    } satisfies IdentityCookie;

    try {
        // Not setting an expiration date because we want a "session" cookie.
        Cookies.set(IdentityCookieName, JSON.stringify(value), {
            expires: cookieExpiration,
            domain: cookieDomain
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        // Do nothing.
    }
}
