---
order: 190
label: Migrate to v2.0
meta:
    title: Migrate to v2.0 - Mixpanel
---

# Migrate to v2.0

This new version introduces two correlation ids, `telemetryId` and `deviceId`, to help unify and correlate data across [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/) and a new automatic enrichment of the events with the LogRocket session url if the [LogRocket instrumentation](../../logrocket/getting-started.md) is registered.

This release also introduces a [shift of philosophy](#a-new-philosophy) for the `createTrackingFunction` function. Previously, `createTrackingFunction` was designed as a **low-cost** utility that could be called whenever telemetry was needed. That approach has now been replaced by the [initializeMixpanel](../reference/initializeMixpanel.md) function, a setup function intended to be called only once per application load.

## Breaking changes

### Removed

- The `targetProductId` option of the `createTrackingFunction` function has been moved to the returned [track](../reference/initializeMixpanel.md#specify-a-target-product) function.

### Renamed

- The `createTrackingFunction` function has been renamed to [initializeMixpanel](../reference/initializeMixpanel.md).

### Others

- The `@workleap/telemetry` package is a new peer dependency of the `@workleap/mixpanel` package.

### A new philosophy

Prior to this release, `createTrackingFunction` was designed as a **low-cost** utility that could be called whenever telemetry was needed. With the addition of correlation ids, and the automatic enrichment of the events with the LogRocket session url, a need emerge for an initialization function that would be execute once per application load.

To reflect this shift in philosophy, the `createTrackingFunction` has been renamed to [initializeMixpanel](../reference/initializeMixpanel.md) and the `targetProductId` has been moved to the returned [TrackingFunction](../reference/initializeMixpanel.md#returns).

Before:

```ts
import { createTrackingFunction } from "@workleap/mixpanel";

// Can be executed multiple times.
const track = createTrackingFunction("wlp", "development", {
    targetProductId: "ov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

After:

```ts
import { initializeMixpanel } from "@workleap/mixpanel";

// Must be executed once.
const track = initializeMixpanel("wlp", "development");

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    targetProductId: "ov"
});
```

## Improvements

### Correlation ids

To help unify and correlate data across LogRocket, Honeycomb, and Mixpanel, the [initializeMixpanel](../reference/initializeMixpanel.md.md) function now automatically add two correlation ids as attributes to every event:

- `telemetryId` is a new identifier that represents a single application load.
- `deviceId` is an identifier that represents a single device accross multiple loads.

### Session URL enrichment

A built-in integration now automatically allows other telemetry libraries to include the LogRocket session replay URL in their traces.

Once the LogRocket session URL is retrieved, each event is enriched with an `LogRocket Session Url` property:

:::align-image-left
![Enrichment example](../../static/mixpanel/mixpanel-logrocket-session-url.png){width=464}
:::

## Migrate from `v1.0`
