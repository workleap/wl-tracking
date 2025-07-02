import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

// The identity cookie is a concept created by Workleap's marketing teams. This cookie will allow apps to
// identify a device accross multiple sites / apps.
const IdentityCookieName = "wl-identity";

interface IdentityCookie {
    deviceId: string;
}

export class TelemetryContext {
    readonly #visitId: string;
    readonly #deviceId: string;

    constructor(visitId: string, deviceId: string) {
        this.#visitId = visitId;
        this.#deviceId = deviceId;
    }

    get visitId() {
        return this.#visitId;
    }

    get deviceId() {
        return this.#deviceId;
    }
}

export interface GetTelemetryContextOptions {
    cookieExpirationInDays?: number;
    cookieDomain?: string;
}

export function createTelemetryContext(options: GetTelemetryContextOptions = {}) {
    const visitId = uuidv4();
    const identityCookie = getIdentityCookie();

    if (identityCookie && identityCookie.deviceId) {
        return new TelemetryContext(visitId, identityCookie.deviceId);
    }

    const {
        cookieExpirationInDays = 365,
        cookieDomain = ".workleap"
    } = options;

    const deviceId = uuidv4();

    setIdentityCookie(deviceId, cookieExpirationInDays, cookieDomain);

    return new TelemetryContext(visitId, deviceId);
}

function getIdentityCookie() {
    const cookie = Cookies.get(IdentityCookieName);

    if (cookie) {
        try {
            const parsedCookie = JSON.parse(cookie);

            return parsedCookie as IdentityCookie;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            // Do nothing.
        }
    }
}

function setIdentityCookie(deviceId: string, cookieExpirationInDays: number, cookieDomain: string) {
    const value = {
        deviceId
    } satisfies IdentityCookie;

    try {
        // Not setting an expiration date because we want a "session" cookie.
        Cookies.set(IdentityCookieName, JSON.stringify(value), {
            expires: cookieExpirationInDays,
            domain: cookieDomain
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        // Do nothing.
    }
}
