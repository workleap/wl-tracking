---
order: 80
label: useMixpanelTracking
meta:
    title: useMixpanelTracking - Mixpanel
toc:
    depth: 2-3
---

# useMixpanelTracking

Returns the `track` function created during Mixpanel initialization. This is useful in cases where the code doesn't have direct access to the `track` function returned by [initializeMixpanel](./initializeMixpanel.md), but still needs to send tracking events.

## Reference

```ts
const track = useMixpanelTracking({ throwOnUndefined })
```

### Parameters

- `options`: An optional object literal of options:
    - `throwOnUndefined`: An optional `boolean` value indicating whether or not the function should throw if the `track` function is not available. Default is `true`.

### Returns

A [TrackingFunction](../reference/initializeMixpanel.md#returns).

## Usage

### Retrieve the track function

```ts
import { useMixpanelTracking } from "@workleap/mixpanel";

const track = useMixpanelTracking();
```

### Do not throw when not available

```ts !#4
import { useMixpanelTracking } from "@workleap/mixpanel";

const track = useMixpanelTracking({
    throwOnUndefined: false
});
```
