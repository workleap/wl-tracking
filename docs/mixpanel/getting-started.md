---
order: 100
label: Getting started
meta:
    title: Getting started - Mixpanel
toc:
    depth: 2
---

# Getting started

To make data-informed decisions, understand user behavior, and measure product impact, Workleap has adopted [Mixpanel](https://mixpanel.com/), an analytics platform that helps **understand how users interact with** a **product**.

This package add basic Mixpanel tracking capabilities to an application. It provides a single `track` function that sends `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap Platform Tracking API.

## Install the packages

First, open a terminal at the root of the application and install the following packages:

```bash
pnpm add @workleap/telemetry @workleap/mixpanel
```

## Initialize Mixpanel

Then, initialize Mixpanel and retrieve a `track` function by executing [initializeMixpanel](./reference/initializeMixpanel.md):

```ts
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "development");
```

## Track an event

Finally, using the retrieved `track` function, send a telemetry event:

```ts !#5
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "staging");

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Track a link

Link clicks requires to keep the page alive while the tracking request is being processed. To do so, specify the `keepAlive` option:

```ts !#6
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "staging");

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

## Retrieve the track function

If the code sending telemetry events doesn't have a reference on the `track` function, the `track` function can be retrieve by either using the [useMixpanelTracking](./reference/useMixpanelTracking.md) hook:

```ts !#3
import { useMixpanelTracking } from "@workleap/mixpanel";

const track = useMixpanelTracking();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

Or the [getMixpanelTrackingFunction](./reference/getMixpanelTrackingFunction.md) function:

```ts !#3
import { getMixpanelTrackingFunction } from "@workleap/mixpanel";

const track = getMixpanelTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Try it :rocket:

Start the application in a development environment using the dev script. Render a page, then navigate to your [Mixpanel](https://mixpanel.com/) instance. Go to "Events" page. If you are tracking events, you should see a new event appear.

You can try filtering the event list using different properties, such as:

- `User Id`

### Troubleshoot issues

If you are experiencing issues with this guide:

- Set the [verbose](./reference/initializeMixpanel.md.md#verbose) predefined option to `true`.
- Open the [DevTools](https://developer.chrome.com/docs/devtools/) console and look for logs starting with `[mixpanel]`.
- Refer to the sample on [GitHub](TBD).

## Filter by correlation ids

The `initializeMixpanel` function automatically adds two properties to every event to **unify** Mixpanel with the **other telemetry platforms**:

- `Telemetry Id`: Identifies a single application load. It's primarily used to correlate with Honeycomb traces.
- `Device Id`: Identifies the user's device across sessions. This value is extracted from the shared `wl-identity` cookie, which is used across Workleap's marketing sites and web applications.

To correlate a session with other telemetry platforms, filter the session list using these user traits.




