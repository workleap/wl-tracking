# wl-tracking

This monorepo contains some packages related to tracking.

# `@workleap/tracking`

This package allows you to add basic tracking capabilities to your applications. It exposes a single `track` function that calls a tracking endpoint that conforms to the Workleap Platform Tracking API in the environment URL you have provided.

To use it you must first call the `createTrackingFunction` factory, which will return you a tracking function that you can then use in your code
```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const productId = "wlp" //Workleap Management
const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

You might want to track an action done in Workleap Management (or another product) that targets another product. The library provides a function options to specify the target product identifier.
```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const productId = "wlp" //Workleap Management
const targetProductId = "wov" //Officevibe
const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl, {
    targetProductId
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Link Tracking

If you want to track a link click, you can use the `track` function and add the `keepAlive` option to keep the current page alive while the tracking request is being made.

```ts

const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" }, { keepAlive: true });
```

## Migration Notes

The migration notes can be found [here](./MIGRATION_NOTES.md).
