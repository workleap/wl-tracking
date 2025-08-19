---
order: 70
label: setSuperProperties
meta:
    title: setSuperProperties - Mixpanel
toc:
    depth: 2-3
---

# setSuperProperties

Super properties are global event properties that are defined once and automatically applied to all events. This is a custom implementation inspired by a [similar pattern](https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript#setting-super-properties) in Mixpanel.

## Reference

```ts
setSuperProperties(properties: {})
```

### Parameters

- `properties`: The properties to include in every event.

### Returns

Nothing

## Usage

```ts !#3-5
import { setSuperProperties } from "@workleap/mixpanel";

setSuperProperties({
    "User Id": "123"
});
```
