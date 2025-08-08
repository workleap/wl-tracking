---
order: 100
label: initializeMixpanel
meta:
    title: initializeMixpanel - Mixpanel
toc:
    depth: 2-3
---

# initializeMixpanel

Initialize [Mixpanel](https://mixpanel.com) with Workleap's default settings.

## Reference

```ts
initializeMixpanel(productId, envOrTrackingApiBaseUrl, options?: { verbose });
```

### Parameters

- `productId`: The product id.
- `envOrTrackingApiBaseUrl`: The environment to get the navigation url from or a base URL.
- `options`: An optional object literal of options:
    - `trackingEndpoint`: The endpoint to use for tracking events. If not provided, the default endpoint will be used.
    - `verbose`: Whether or not debug information should be logged to the console.

### Environments

Supported environments are:

- `production`
- `staging`
- `development`
- `local`
- `msw`

## Usage

### Initialize with a predefined environment

Mixpanel can be initialized for any of the following predefined environments:

- `production`
- `staging`
- `development`
- `local`
- `msw`

```ts
import { initializeMixpanel } from "@workleap/mixpanel";

initializeMixpanel("wlp", "development");
```

### Initialize with a base url

```ts
import { initializeMixpanel } from "@workleap/mixpanel";

initializeMixpanel("wlp", "https://my-tracking-api");
```

### Verbose mode

To log to the console debugging information, set the `verbose` option to `true`:

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel";

initializeMixpanel("wlp", "development", {
    verbose: true
});
```



