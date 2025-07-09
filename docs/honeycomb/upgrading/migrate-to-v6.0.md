---
order: 200
label: Migrate to v6.0
meta:
    title: Migrate to v6.0 - Honeycomb
---

# Migrate to v6.0

This new version introduces two correlation is, `telemetryId` and `deviceId`, to help unify and correlate data across [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/) and a new automatic enrichment of the traces with the LogRocket session url if the [LogRocket instrumentation](../../logrocket/getting-started.md) is registered.

## Breaking changes

- The `@workleap/telemetry` package is a new peer dependency of the `@workleap/logrocket` package.

