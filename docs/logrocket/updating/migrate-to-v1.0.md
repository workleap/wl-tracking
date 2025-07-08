---
order: 200
label: Migrate to v1.0
meta:
    title: Migrate to v1.0 - LogRocket
---

# Migrate to v1.0

This rewrite of Workleap's [LogRocket](https://logrocket.com/) instrumentation focuses on leveraging the native [LogRocket library](https://www.npmjs.com/package/logrocket) directly, rather than abstracting it away. It also introduces two correlation is, `telemetryId` and `deviceId`, to help unify and correlate data across [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/). Finally a new built-in integration allow other telemetry libraries to automatically add the LogRocket session replay URL to their traces/events.

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

- The `getTrackingIdentifier` function and `trackingIdentifier` optiondo not exist anymore. A similar identifier is now automatically added as a user traits for every session replay.
- The `identifyOptions` option has been removed, use [createDefaultUserTraits](../reference/createDefaultUserTraits.md) and the native [LogRocket.identify](https://docs.logrocket.com/reference/identify) function instead.
- The `onSessionUrlInitialized` option has been removed, use the native [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) function instead.
- The function arguments changed from `(options: {})` to `(appId, options: {})`.

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

registerLogRocketInstrumentation(appId);

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
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import LogRocket from "logrocket";

registerLogRocketInstrumentation(appId);
```

## Improvements

### Correlation ids

To help unify and correlate data across LogRocket, Honeycomb, and Mixpanel, the [registerLogRocketInstrumentation](../reference/registerLogRocketInstrumentation.md) now automatically add two correlation ids as user traits to every session replay:

- `telemetryId` is a new identifier that represents a single application load.
- `deviceId` replaces the former `trackingId` and reuses the original name from the `wl-identity` cookie, better reflecting its purpose as a persistent device identifier.

### Automatically add session replay url to other telemetry platforms

A built-in integration now automatically allow other telemetry libraries to add the LogRocket session replay URL to their traces/events.

:::align-image-left
![Honeycomb integration example](../../static/logrocket/honeycomb_session_url.png)
:::


