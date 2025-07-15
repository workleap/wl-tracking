---
order: 100
label: initializeMixpanel
meta:
    title: initializeMixpanel - Mixpanel
toc:
    depth: 2-3
---

# initializeMixpanel

Setup Mixpanel and return a `track` function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap Platform Tracking API.

## Reference

```ts
const track = initializeMixpanel(productId, envOrTrackingApiBaseUrl, options?: { verbose });
```

### Parameters

- `productId`: The product id.
- `envOrTrackingApiBaseUrl`: The [environment](#environments) to get the navigation url from or a base URL.
- `options`: An optional object literal of options:
    - `verbose`: Whether or not debug information should be logged to the console.

### Environments

Supported environments are:

- `production`
- `staging`
- `development`
- `local`
- `msw`

### Returns

A `TrackingFunction` with the following signature: `(eventName, properties: {}, options?: { targetProductId, keepAlive }) => Promise<void>`.

- `eventName`: The event name.
- `properties`: The event properties.
- `options`: An optional object literal of options:
    - `targetProductId`: The product id of the target product. Useful to track an event for another product.
    - `keepAlive`: Whether or not to keep the connection alive for the tracking request. It is mostly used for tracking links where the user might navigate away before the request is completed.

!!!tip
The body size for keepalive requests is [limited to 64 kibibytes](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive).
!!!

## Usage

### Initialize for a predefined environment

Workleap can be initialized for any of the following predefined environments:

- `production`
- `staging`
- `development`
- `local`
- `msw`

```ts
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "development");
```

### Initialize with a base url

```ts
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "https://my-tracking-api");
```

### Track events

```ts !#5
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "development");

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#6
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "development");

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    targetProductId: "wov"
});
```

### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#6
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "development");

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

### Verbose mode

To log to the console debugging information, set the `verbose` option to `true`:

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel";

const track = initializeMixpanel("wlp", "development", {
    verbose: true
});
```



