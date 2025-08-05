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
    - `verbose`: Whether or not debug information should be logged to the console.

### Returns

Nothing

## Usage

### Initialize with a site id

```ts
import { registerCommonRoomInstrumentation } from "@workleap/common-room";

registerCommonRoomInstrumentation("my-site-id");
```

### Verbose mode

```ts
import { registerCommonRoomInstrumentation } from "@workleap/common-room";

registerCommonRoomInstrumentation("my-site-id", {
    verbose: true
});
```
