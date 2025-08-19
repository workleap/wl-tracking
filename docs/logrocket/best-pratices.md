---
order: 80
label: Best practices
meta:
    title: Best practices - Introduction
toc:
    depth: 2-3
---

# Best practices

## Log relevant debugging information

It’s recommended to **log** as much **relevant information** as possible into the LogRocket session replay console. This is typically done using the [LogRocketLogger](./reference/LogRocketLogger.md) class or directly through the [LogRocket SDK](https://docs.logrocket.com/reference/console).

At minimum, make sure to provide a `LogRocketLogger` instance to Workleap's libraries accepting a `loggers` option.

Here are some examples :point_down:

!!!warning
Never log any **Personally Identifiable Information (PII)**.

API responses frequently contain sensitive user data such as names, email addresses, phone numbers, or IDs. Remove all logs outputting API response before deploying to production, as these can expose private information that will be included in session replays.
!!!

### LogRocket

Register LogRocket instrumentation with [verbose mode](./reference/registerLogRocketInstrumentation.md#verbose) activated and a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#5-6
import { registerLogRocketInstrumentation, LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger } from "@workleap/logging";

registerLogRocketInstrumentation("my-app-id", {
    verbose: true,
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger()]
});
```

### Honeycomb verbose mode

Register Honeycomb instrumentation with [verbose mode](../honeycomb/reference/registerHoneycombInstrumentation.md#verbose) activated and a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#7-8
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger } from "@workleap/logging";

registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    verbose: true,
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger()]
});
```

### Mixpanel verbose mode

Initialize Mixpanel with [verbose mode](../mixpanel/reference/initializeMixpanel.md#verbose-mode) activated and a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#6-7
import { initializeMixpanel } from "@workleap/mixpanel";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger } from "@workleap/logging";

initializeMixpanel("wlp", "development", {
    verbose: true,
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger()]
});
```

### Common Room

Initialize Mixpanel with [verbose mode](../mixpanel/reference/initializeMixpanel.md#verbose-mode) activated and a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#6-7
import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger } from "@workleap/logging";

registerCommonRoomInstrumentation("my-site-id", {
    verbose: true,
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger()]
});
```

### Squide firefly console logger

Initialize Squide firefly with a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#6
import { initializeFirefly } from "@squide/firefly";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger } from "@workleap/logging";

const runtime = initializeFirefly({
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger()]
});
```

### Platform widgets verbose mode

Initialize platform widgets with verbose mode activated and a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#6-7
import { initializeWidgets } from "@workleap-widgets/client/react";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger } from "@workleap/logging";

const widgetsRuntime = initializeWidgets("wlp", "development" , {
    verbose: true,
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger()]
});
```
