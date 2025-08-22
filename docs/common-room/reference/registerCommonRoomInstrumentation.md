---
order: 100
label: registerCommonRoomInstrumentation
meta:
    title: registerCommonRoomInstrumentation - Common
toc:
    depth: 2-3
---

# registerCommonRoomInstrumentation

Initialize [Common Room](https://www.commonroom.io/) instrumentation.

## Reference

```ts
registerCommonRoomInstrumentation(siteId, options?: { onReady, verbose });
```

### Parameters

- `siteId`: The site id.
- `options`: An optional object literal of options:
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `RootLogger` instances.

### Returns

Nothing

## Usage

### Initialize with a site id

```ts !#3
import { registerCommonRoomInstrumentation } from "@workleap/common-room";

registerCommonRoomInstrumentation("my-site-id");
```

### Verbose mode 

```ts !#4
import { registerCommonRoomInstrumentation } from "@workleap/common-room";

registerCommonRoomInstrumentation("my-site-id", {
    verbose: true
});
```

### Loggers

```ts !#6
import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

registerCommonRoomInstrumentation("my-site-id", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```
