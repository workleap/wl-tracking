---
order: 100
label: createTelemetryContext
meta:
    title: createTelemetryContext - Utilities
toc:
    depth: 2-3
---

# createTelemetryContext

This utility function simplifies correlation across Workleap's three telemetry platforms: [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/).

## Reference

```ts
const telemetryContext = createTelemetryContext(options?: { identityCookieExpiration, identityCookieDomain, verbose });
```

### Parameters

- `options`: An optional object literal of options:
    - `identityCookieExpiration`: The `wl-identity` cookie expiration date.
    - `identityCookieDomain`: The `wl-identity` cookie domain.
    - `verbose`: Whether or not the utility function output verbose logs.

### Returns

A `TelemetryContext` object containing two correlation ids:

- `telemetryId`: Identifies a single application load. Usually to correlate Honeycomb traces with the other telemetry platforms.
- `deviceId`: Identifies the user's device across sessions. This value is read from the shared `wl-identity` cookie used by both Workleap's marketing sites and web applications.

## Side effects

If the `wl-identity` cookie doesn't exist, `createTelemetryContext` will generate a new `deviceId` and automatically set the `wl-identity` cookie.

## Usage

### Create a context

```ts
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext();
```

### Specify a cookie expiration date

```ts
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ identityCookieExpiration: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
```

### Specify a cookie demain

```ts
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ identityCookieDomain: "acme.com" });
```

### Use verbose logs

```ts
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ verbose: true });
```

