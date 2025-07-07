---
order: 100
label: registerLogRocketInstrumentation
meta:
    title: registerLogRocketInstrumentation - LogRocket
toc:
    depth: 2-3
---

# registerLogRocketInstrumentation

Initializes [LogRocket](https://logrocket.com/) instrumentation with Workleap's default settings for web applications.

## Reference

```ts
registerLogRocketInstrumentation(appId, telemetryContext, options?: {})
```

### Parameters

- `appId`: The LogRocket application id.
- `telemetryContext`: A [TelemetryContext](http://localhost:5001/wl-tracking/utilities/createtelemetrycontext/) instance.
- `options`: An optional object literal of [predefined options](#predefined-options).

### Returns

Nothing

## Privacy

By default, this instrumentation hides a wide range of information from session replays to protect user privacy:

- **DOM sanitization**: [LogRocket's DOM sanitization](https://docs.logrocket.com/reference/dom) to hide sensitive text elements from session replays. To allow specific content to appear, add the `data-public` attribute to the elements you want to expose.
- **Network sanitization**: [LogRocket's network data sanitization](https://docs.logrocket.com/reference/network) is used to strip sensitive information from request/response headers and body from session replays.
- **URL sanitization**: [LogRocket's URLs sanitization](https://docs.logrocket.com/reference/browser) is used to strip sensitive information from URLs' query string parameters.

### Record the content of an element

Use `data-public` to explicitly allow LogRocket to record the content of an element. When this attribute is present, the content inside the element (including child elements) will be captured in the session replay:

```html
<div data-public>
    This text will be visible in the session replay.
</div>
```

## Predefined options

The `registerLogRocketInstrumentation(appId, telemetryContext, options?: {})` function also accepts a few predefined options 👇

### `rootHostname`

- **Type**: `string`
- **Default**: `workleap.com`

A [root hostname](https://docs.logrocket.com/reference/roothostname) to track sessions across subdomains.

```ts !#7
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ verbose: true });

registerLogRocketInstrumentation("an-app-id", createTelemetryContext, {
    rootHostname: "an-host.com"
});
```

### privateFieldNames

- **Type**: `string[]`
- **Default**:  `undefined`

Names of additional fields to exclude from session replays. These fields will be removed from network requests, responses using a fuzzy-matching algorithm.

```ts !#7
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ verbose: true });

registerLogRocketInstrumentation("an-app-id", createTelemetryContext, {
    privateFieldNames: ["a-custom-field"]
});
```

To view the default private fields, have a look at the [registerLogRocketInstrumentation.ts](TBD) file on GitHub.

### privateQueryParameterNames

- **Type**: `string[]`
- **Default**:  `undefined`

Names of additional fields to exclude from session replays. These fields will be removed from query string parameters using a fuzzy-matching algorithm.

```ts !#7
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ verbose: true });

registerLogRocketInstrumentation("an-app-id", createTelemetryContext, {
    privateQueryParameterNames: ["a-custom-param"]
});
```

To view the default private query parameters, have a look at the [registerLogRocketInstrumentation.ts](TBD) file on GitHub.

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#predefined-options) are useful to quickly customize the default configuration of the [LogRocket SDK](https://docs.logrocket.com/reference/init), but only covers a subset of the options. If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `registerLogRocketInstrumentation` function. Remember, **no locked in** :heart::v:.

To view the default configuration of `registerLogRocketInstrumentation`, have a look at the [registerLogRocketInstrumentation.ts](TBD) file on GitHub.

### `transformers`

- **Type**: `((options: LogRocketSdkOptions, context: LogRocketSdkOptionsTransformer) => LogRocketSdkOptions)[]`
- **Default**: `[]`

```ts
transformer(options: LogRocketSdkOptions, context: LogRocketSdkOptionsTransformer) => LogRocketSdkOptions;
```

```ts !#6-11,14
import { registerLogRocketInstrumentation, type LogRocketSdkOptionsTransformer } from "@workleap/logrocket";
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ verbose: true });

const disableConsoleLogging: LogRocketSdkOptionsTransformer = config => {
    config.console = ...(config.console || {});
    config.console.isEnabled = false;

    return config;
};

registerLogRocketInstrumentation("an-app-id", createTelemetryContext, {
    transformers: [disableConsoleLogging]
});
```
