---
order: 100
label: createTrackingFunction
meta:
    title: createTrackingFunction - Mixpanel
toc:
    depth: 2-3
---

# createTrackingFunction

Creates a `track` function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap Platform Tracking API.

## Reference

```ts
const track = createTrackingFunction(productId, envOrTrackingApiBaseUrl, options?: { targetProductId, verbose });
```

### Parameters

- `productId`: The product id.
- `envOrTrackingApiBaseUrl`: The [environment](#environments) to get the navigation url from or a base URL.
- `options`: An optional object literal of options:
    - `targetProductId`: The product id of the target product.
    - `verbose`: Whether or not debug information should be logged to the console.

### Environments

Supported environments are:

- `production`
- `staging`
- `development`
- `local`
- `msw`

### Returns

A `TrackingFunction` with the following signature  `(eventName, properties: {}, options?: { keepAlive }) => Promise<void>`.

- `eventName`: The event name.
- `properties`: The event properties.
- `options`: An optional object literal of options:
    - `keepAlive`: Whether or not to keep the connection alive for the tracking request. It is mostly used for tracking links where the user might navigate away before the request is completed.

!!!tip
The body size for keepalive requests is [limited to 64 kibibytes](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive).
!!!

## Usage

### Create a tracking function for an environment

A tracking function can be created for any of the following predefined environments:

- `production`
- `staging`
- `development`
- `local`
- `msw`

```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction("wlp", "development");
```

### Create a tracking function with a base url

```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction("wlp", "https://my-tracking-api");
```

### Track events

```ts !#5
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction("wlp", "development");

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#4
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction("wlp", "development", {
    targetProductId: "wov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#4
const track = createTrackingFunction("wlp", "development");

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```



