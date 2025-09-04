---
order: 100
label: Getting started
meta:
    title: Getting started - Introduction
---

# Getting started

Welcome to `workleap/telemetry`, a collection of telemetry libraries for building web applications at Workleap. On this getting started page, you'll find an overview of the project and a list of [supported platforms](#supported-platforms).

## An integrated experience

Without a unified and cohesive telemetry setup, debugging issues or analyzing product behavior often requires **jumping between** tools with **disconnected data**. Session replays in [LogRocket](https://logrocket.com/), traces in [Honeycomb](https://www.honeycomb.io/), and user events in [Mixpanel](https://mixpanel.com/) each offer valuable insights, but without shared identifiers or cross-platform context, it becomes difficult to correlate events, reconstruct user journeys, or measure the full impact of a technical issue in production.

This integrated experience brings together LogRocket, Honeycomb, and Mixpanel. By linking session data, performance traces, and user interactions through consistent identifiers. It becomes possible to **trace** a **single** application **event across systems**, from backend performance to frontend behavior to product impact. This integration streamlines will hopefully enables faster, and more informed decision-making.

## Supported platforms

{.supported-platforms-table}
| Name | Description | NPM | Documentation |
| --- | --- | --- |
| ![](../static/logos/logrocket.svg){ class="h-5 w-5 mr-2 -mt-1" }[LogRocket](https://logrocket.com/) | Records frontend sessions and logs to help debug and resolve issues in production and surface critical issues. | [![npm version](https://img.shields.io/npm/v/@workleap/logrocket)](https://www.npmjs.com/package/@workleap/logrocket) | [Getting started](../logrocket/getting-started.md) |
| ![](../static/logos/honeycomb.svg){ class="h-5 w-5 mr-2 -mt-1" }[Honeycomb](https://www.honeycomb.io/) | Captures and analyzes distributed traces and metrics to understand and monitor complex systems, application behaviors, and performance. | [![npm version](https://img.shields.io/npm/v/@workleap/honeycomb)](https://www.npmjs.com/package/@workleap/honeycomb) | [Getting started](../honeycomb/getting-started.md) |
| ![](../static/logos/mixpanel.svg){ class="h-5 w-5 mr-2 -mt-1" }[Mixpanel](https://mixpanel.com/) | Tracks user interactions to analyze behavior and measure product impact. | [![npm version](https://img.shields.io/npm/v/@workleap/mixpanel)](https://www.npmjs.com/package/@workleap/mixpanel) | [Getting started](../mixpanel/getting-started.md) |
| ![](../static/logos/common-room.svg){ class="h-5 w-5 mr-2 -mt-1" }[Common Room](https://www.commonroom.io/) | Connects user activity across platforms to provide insight into community engagement and behavior.<br/><br/>_(Common Room is not part of the integrated experience, as it is a standalone tool used by marketers for a completely different purpose.)_ | [![npm version](https://img.shields.io/npm/v/@workleap/common-room)](https://www.npmjs.com/package/@workleap/common-room) | [Getting started](../common-room/getting-started.md) |

## Setup a project

First, open a terminal at the root of the application and install the telemetry libraries packages:

```bash
pnpm add @workleap/logrocket @workleap/honeycomb @workleap/mixpanel @opentelemetry/api logrocket
```

Then, update the application bootstrapping code to initialize the libraries:

```tsx !#9,11-13,15,17 index.tsx
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { initializeMixpanel } from "@workleap/mixpanel";
import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

registerLogRocketInstrumentation("my-app-id", {});

registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

initializeMixpanel("wlp", "development");

registerCommonRoomInstrumentation("my-site-id");

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

```ts
import { useTrackingFunction } from "@workleap/mixpanel/react";

// If the host application is not a React application, use
// "createTrackingFunction" instead of the following hook.
const track = useTrackingFunction();
```

!!!tip
For more information about a specific library, refer to its [getting started](#supported-platforms) guide.
!!!

!!!warning
For Honeycomb, avoid using `/.+/g`, in production, as it could expose customer data to third parties. Instead, ensure you specify values that accurately matches your application's backend URLs.
!!!

## Correlation ids

Each library sends the same two correlation id values to its respective platform, using platform-specific naming conventions for the names:

{.correlation-ids-table}
| Correlation id | Description | LogRocket | Honeycomb | Mixpanel |
| --- | --- | --- | --- | --- |
| Telemetry id | Identifies a single application load. It's primarily used to correlate all telemetry platforms with Honeycomb traces. | `Telemetry Id` | `app.telemetry_id` | `Telemetry Id` |
| Device id | Identifies the user's device across sessions. | `Device Id` | `app.device_id` | `Device Id` |

### Troubleshooting example

The following is an example of a troubleshooting workflow using the new telemetry correlation id:

- **Honeycomb**: Locate the `app.telemetry_id` attribute in a trace to retrieve its value.
- **LogRocket**: Navigate to the "Session Replay" page. Open the "User Traits" filter, select the `Telemetry Id` trait, paste the `app.telemetry_id` value, and press "Enter" to view the matching sessions.
- **Mixpanel**: Navigate to the "Events" page. Add a "filter", select the `Telemetry Id` propertt, paste the `app.telemetry_id` value, and press on the "Add" button to view the matching events.

!!!warning
This feature is available only when using the following package versions or higher:

- `@workleap/logrocket` ≥ `1.0.0`
- `@workleap/honeycomb` ≥ `6.0.0`
- `@workleap/mixpanel` ≥ `2.0.0`

If your application is using older versions, refer to the [migration guide](./migrate.md) to update.
!!!

## LogRocket session URL

In addition to the correlation ids, if LogRocket instrumentation is initialized, the Honeycomb and Mixpanel libraries will automatically enrich their data with the LogRocket session URL once it's available:

| Honeycomb | Mixpanel |
| --- | --- |
| `app.logrocket_session_url` | `LogRocket Session URL` |

!!!warning
This feature is available only when using the following package versions or higher:

- `@workleap/logrocket` ≥ `1.0.0`
- `@workleap/honeycomb` ≥ `6.0.0`
- `@workleap/mixpanel` ≥ `2.0.0`

If your application is using older versions, refer to the [migration guide](./migrate.md) to update.
!!!

## Set up loggers

Providing loggers to the registration and initialization functions is optional, but recommended to simplify troubleshooting.

```tsx !#13,16-17,22-23,27-28,32-33 index.tsx
import { registerLogRocketInstrumentation, LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger, LogLevel, type RootLogger } from "@workleap/logging";
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { initializeMixpanel } from "@workleap/mixpanel";
import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

...

// Only add LogRocket logger if your product is set up with LogRocket.
const loggers: RootLogger[] = [isDev ? new BrowserConsoleLogger() : new LogRocketLogger({ logLevel: LogLevel.information })];

registerLogRocketInstrumentation("my-app-id", {
    verbose: isDev,
    loggers
});

registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    verbose: isDev
    loggers
});

initializeMixpanel("wlp", "development", {
    verbose: isDev
    loggers
});

registerCommonRoomInstrumentation("my-site-id", {
    verbose: isDev
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

To troubleshoot an issue in production, remove the `LogLevel` from the `LogRocketLogger` constructor options and set the `verbose` option to `true`:

```tsx !#12,15,21,26,31 index.tsx
import { registerLogRocketInstrumentation, LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger, type RootLogger } from "@workleap/logging";
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { initializeMixpanel } from "@workleap/mixpanel";
import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

...

const loggers: RootLogger[] = [isDev ? new BrowserConsoleLogger() : new LogRocketLogger()];

registerLogRocketInstrumentation("my-app-id", {
    verbose: true,
    loggers
});

registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    verbose: true
    loggers
});

initializeMixpanel("wlp", "development", {
    verbose: true
    loggers
});

registerCommonRoomInstrumentation("my-site-id", {
    verbose: true
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

## Migrate

To benefit from the new unified and cohesive telemetry setup, follow the [migration guide](./migrate.md).




