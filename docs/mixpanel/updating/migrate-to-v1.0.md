---
order: 200
label: Migrate to v1.0
meta:
    title: Migrate to v1.0 - Mixpanel
---

# Migrate to v1.0

`buildTrackingFunction` has been renamed to `createTrackingFunction`.

`createTrackingFunction` now accepts the following arguments:

- `productId` as the first argument
- `baseUrl` as the second argument
- `options` as the third argument

Before:

```ts
const track = buildTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);
```

After:

```ts
const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);
```

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
