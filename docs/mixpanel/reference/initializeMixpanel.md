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
    - `verbose`: Whether or not debug information should be logged to the console.
    - `loggers`: An optional array of `RootLogger` instances.

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

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel";

initializeMixpanel("wlp", "development", {
    verbose: true
});
```

### Loggers

```ts !#6
import { initializeMixpanel } from "@workleap/mixpanel";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger } from "@workleap/logging";

initializeMixpanel("wlp", "development", {
    loggers: [new LogRocketLogger(), new BrowserConsoleLogger()]
});
```





