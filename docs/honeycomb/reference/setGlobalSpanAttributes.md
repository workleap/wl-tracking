---
order: 90
label: setGlobalSpanAttributes
meta:
    title: setGlobalSpanAttributes - Honeycomb
toc:
    depth: 2-3
---

# setGlobalSpanAttributes

Set global attributes to be included in all traces.

## Reference

```ts
setGlobalSpanAttributes(attributes: {})
```

### Parameters

- `attributes`: The attributes to include in every trace.

### Returns

Nothing

## Usage

```ts !#3-5
import { setGlobalSpanAttributes } from "@workleap/honeycomb";

setGlobalSpanAttributes({
    "app.user_id": "123"
});
```
