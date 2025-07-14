---
order: 90
label: getMixpanelTrackingFunction
meta:
    title: getMixpanelTrackingFunction - Mixpanel
toc:
    depth: 2-3
---

# getMixpanelTrackingFunction

Returns the `track` function created during Mixpanel initialization. This is useful in cases where the code doesn't have direct access to the `track` function returned by [initializeMixpanel](./initializeMixpanel.md), but still needs to send tracking events.

## Reference

```ts
const track = getMixpanelTrackingFunction(options?: { throwOnUndefined })
```

### Parameters

- `options`: An optional object literal of options:
    - `throwOnUndefined`: An optional `boolean` value indicating whether or not the function should throw if the `track` function is not available. Default is `true`.

### Returns

A [TrackingFunction](../reference/initializeMixpanel.md#returns).

## Usage

### Retrieve the track function

```ts
import { getMixpanelTrackingFunction } from "@workleap/mixpanel";

const track = getMixpanelTrackingFunction();
```

### Do not throw when not available

```ts !#4
import { getMixpanelTrackingFunction } from "@workleap/mixpanel";

const track = getMixpanelTrackingFunction({
    throwOnUndefined: false
});
```

