---
order: 200
label: Migrate to v1.0
meta:
    title: Migrate to v1.0 - Mixpanel
---

# Migrate to v1.0

## Breaking changes

- The `buildTrackingFunction` function has been renamed to `createTrackingFunction`.
- The `createTrackingFunction` function now accepts a new sets of arguments.

### New function arguments

The `buildTrackingFunction` function had multiple overloads, the new `createTrackingFunction` function has a single signature with an options object.

Before:

```ts
const track = buildTrackingFunction(productId, targetProductIdentifier, environmentVariables.navigationApiBaseUrl);
```

After:

```ts
const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl, {
    targetProductId
});
```
