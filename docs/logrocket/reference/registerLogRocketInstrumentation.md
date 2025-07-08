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
registerLogRocketInstrumentation(appId, telemetryContext, options?: { rootHostname, privateFieldNames, privateQueryParameterNames })
```

### Parameters

- `appId`: The LogRocket application id.
- `telemetryContext`: A [TelemetryContext](http://localhost:5001/wl-tracking/utilities/createtelemetrycontext/) instance.
- `options`: An optional object literal of [predefined options](#predefined-options).

### Returns

Nothing

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

### `privateFieldNames`

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

### `privateQueryParameterNames`

- **Type**: `string[]`
- **Default**:  `undefined`

Names of additional fields to exclude from session replays. These fields will be removed from query parameters using a fuzzy-matching algorithm.

```ts !#7
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ verbose: true });

registerLogRocketInstrumentation("an-app-id", createTelemetryContext, {
    privateQueryParameterNames: ["a-custom-param"]
});
```

To view the default private query parameters, have a look at the [registerLogRocketInstrumentation.ts](TBD) file on GitHub.

### `verbose`

- **Type**: `boolean`
- **Default**: `false`

Indicates whether or not debug information should be logged to the console.

```ts !#7
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { createTelemetryContext } from "@workleap/telemetry";

const telemetryContext = createTelemetryContext({ verbose: true });

registerLogRocketInstrumentation("an-app-id", createTelemetryContext, {
    verbose: true
});
```

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

### Execution context

Generic transformers can use the `context` argument to gather additional information about their execution context, like if they are operating in `verbose` mode:

```ts !#4 transformer.js
import type { LogRocketSdkOptionsTransformer } from "@workleap/logrocket";

const disableConsoleLogging: LogRocketSdkOptionsTransformer = (config, context) => {
    if (!context.verbose) {
        config.console = ...(config.console || {});
        config.console.isEnabled = false;
    }

    return config;
}
```

- `verbose`: `boolean`
