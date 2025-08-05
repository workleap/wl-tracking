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

It's recommended to **log** as much **relevant information** as possible to the **console**, as LogRocket includes console output in its session replays.

This applies not only to instrumentation, but also to **any frontend code or libraries in use**.

Here are some examples :point_down:

!!!warning
Never log any **Personally Identifiable Information (PII)**.

API responses frequently contain sensitive user data such as names, email addresses, phone numbers, or IDs. Remove all `console.log` statements that output API response before deploying to production, as these can expose private information in browser console logs that will be included in session replays.
!!!

### LogRocket verbose mode

Register LogRocket instrumentation with [verbose mode](./reference/registerLogRocketInstrumentation.md#verbose):

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket";

registerLogRocketInstrumentation("my-app-id", createTelemetryContext, {
    verbose: true
});
```

### Honeycomb verbose mode

Register Honeycomb instrumentation with [verbose mode](../honeycomb/reference/registerHoneycombInstrumentation.md#verbose):

```ts !#5
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    verbose: true
});
```

### Mixpanel verbose mode

Initialize Mixpanel with [verbose mode](../mixpanel/reference/initializeMixpanel.md#verbose-mode):

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel";

initializeMixpanel("wlp", "development", {
    verbose: true
});
```

### Squide firefly console logger

Initialize Squide firefly with a [Console Logger](https://workleap.github.io/wl-squide/reference/registration/initializefirefly/#register-a-logger):

```ts !#4
import { ConsoleLogger, initializeFirefly } from "@squide/firefly";

const runtime = initializeFirefly({
    loggers: [x => new ConsoleLogger(x)]
});
```

### Platform widgets verbose mode

Initialize platform widgets with verbose mode:

```ts !#4
import { initializeWidgets } from "@workleap-widgets/client/react";

const widgetsRuntime = initializeWidgets("wlp", "development" , {
    verbose: true
});
```
