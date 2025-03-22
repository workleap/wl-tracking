# Migration Notes

## @workleap/tracking to 1.0.0

`buildTrackingFunction` has been renamed to `createTrackingFunction`.

createTrackingFunction now takes:
- `productIdentifier` as the first argument
- `baseUrl` as the second argument
- `options` as the third argument

```diff
- const track = buildTrackingFunction(productIdentifier, environmentVariables.navigationApiBaseUrl);
+ const track = createTrackingFunction(productIdentifier, environmentVariables.navigationApiBaseUrl);
```

the buildTrackingFunction had multiple overloads, the new createTrackingFunction has a single signature, with an options object.

```diff
- const track = buildTrackingFunction(productIdentifier, targetProductIdentifier, environmentVariables.navigationApiBaseUrl);
+ const track = createTrackingFunction(productIdentifier, environmentVariables.navigationApiBaseUrl, {
+    targetProductIdentifier
+});
```
