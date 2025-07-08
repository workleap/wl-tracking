---
order: 200
label: Migrate to v1.0
meta:
    title: Migrate to v1.0 - LogRocket
---

# Migrate to v1.0

This rewrite of Workleap's [LogRocket](https://logrocket.com/) instrumentation focuses on leveraging the native [LogRocket library](https://www.npmjs.com/package/logrocket) directly, rather than abstracting it away. It also introduces two correlation is, `telemetryId` and `deviceId`, through [createTelemetryContext](../../utilities/createTelemetryContext.md) to help unify and correlate data across [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/).

This guide will help you migrate from `@workleap-tracking/logrocket` to `@workleap/logrocket` version `1.0`.

## Breaking changes

### Removed

- The `registerAnonymousLogRocketInstrumentation` function doesn't exist anymore, [registerLogRocketInstrumentation](../reference/registerLogRocketInstrumentation.md) instead.
- The `getTrackingIdentifier` function do not exist anymore, use [createTelemetryContext](../../utilities/createTelemetryContext.md) instead.
    - The `generateCookieOnDefault` option has been removed. A `wl-identity` cookie is now always created automatically if it doesn't already exist.

### Renamed

- The `WorkleapLogRocketIdentification` TypeScript interface has been renamed to `LogRocketIdentification`.
- The `WorkleapUserTraits` TypeScript interface has been renamed to `LogRocketUserTraits`.

### Others

- The `logrocket` package is no longuer a dependency of the Worleap LogRocket instrumentation library, it's now a peer dependency.
- The `registerLogRocketInstrumentation` function no longuer accepts a `trackingIdentifier`, `identifyOptions` and `onSessionUrlInitialized` options.

### Changes to `registerLogRocketInstrumentation`

- The `getTrackingIdentifier` function do not exist anymore, use [createTelemetryContext](../../utilities/createTelemetryContext.md) instead.
    - The `generateCookieOnDefault` option has been removed. A `wl-identity` cookie is now always created automatically if it doesn't already exist.
- The `trackingIdentifier` option has been removed, provide a `TelemetryContext` instance instead.
- The `identifyOptions` option has been removed, use [createDefaultUserTraits](../reference/createDefaultUserTraits.md) and the native [LogRocket.identify](https://docs.logrocket.com/reference/identify) function instead.
- The `onSessionUrlInitialized` option has been removed, use the native [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) function instead.
- The function arguments changed from `(options: {})` to `(appId, telemetryContext, options: {})`.

Before:

```ts
import { getTrackingIdentifier, registerLogRocketInstrumentation } from "@workleap-tracking/logrocket";

const user = {
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isAdmin: false,
    isOrganizationCreator: false,
    isReportingManager: false,
    isTeamManager: false,
    isExecutive: { wov: true },
    isCollaborator: { wov: true },
    planCode: { wov: "wov-essential-monthly-std" }
};

const trackingIdentifier = getTrackingIdentifier({ 
    generateCookieOnDefault: true,
    pregeneratedTrackingIdentifier: user.userId
});

registerLogRocketInstrumentation({
    appId,
    trackingIdentifier,
    identifyOptions: user,
    onSessionUrlInitialized: async (sessionUrl) => sendSessionUrlToTrackingService(...)
});
```

After:

```ts
import { createTelemetryContext } from "@workleap/telemetry";
import { registerLogRocketInstrumentation, createDefaultUserTraits } from "@workleap/logrocket";
import LogRocket from "logrocket";

const userId = "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9";

const userTraits = createDefaultUserTraits({
    userId,
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isAdmin: false,
    isOrganizationCreator: false,
    isReportingManager: false,
    isTeamManager: false,
    isExecutive: { wov: true },
    isCollaborator: { wov: true },
    planCode: { wov: "wov-essential-monthly-std" }
});

const telemetryContext = createTelemetryContext();

registerLogRocketInstrumentation(appId, telemetryContext);

LogRocket.getSessionURL((sessionUrl) => sendSessionUrlToTrackingService(sessionUrl));
LogRocket.identify(userId, userTraits);
```

### Removed `registerAnonymousLogRocketInstrumentation`

The `registerAnonymousLogRocketInstrumentation` function doesn't exist anymore, use [registerLogRocketInstrumentation](../reference/registerLogRocketInstrumentation.md) instead.

Before:

```ts
import { getTrackingIdentifier, registerAnonymousLogRocketInstrumentation } from "@workleap-tracking/logrocket";

const trackingIdentifier = getTrackingIdentifier({ 
    generateCookieOnDefault: true
});

registerAnonymousLogRocketInstrumentation({
    appId,
    trackingIdentifier
});
```

After:

```ts
import { createTelemetryContext } from "@workleap/telemetry";
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import LogRocket from "logrocket";

const telemetryContext = createTelemetryContext();

registerLogRocketInstrumentation(appId, telemetryContext);
```

## Improvements

The [registerLogRocketInstrumentation](../reference/registerLogRocketInstrumentation.md) now accepts a [TelemetryContext](../../utilities/createTelemetryContext.md) instance, introducing correlation ids to help unify and correlate data across LogRocket, Honeycomb, and Mixpanel.

A `TelemetryContext` includes two correlation ids: `telemetryId` and `deviceId`:

- `telemetryId` is a new identifier that represents a single application load.
- `deviceId` replaces the previous `trackingId` and reuses the original name from the `wl-identity` cookie, better reflecting its purpose as a persistent device identifier.
