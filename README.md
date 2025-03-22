# wl-tracking

This monorepo contains some packages related to tracking.

# `@workleap/tracking`

This package allows you to add basic tracking capabilities to your applications. It exposes a single `track` function that calls a tracking endpoint that conforms to the Workleap Platform Tracking API in the environment URL you have provided.

To use it you must first call the `createTrackingFunction` factory, which will return you a tracking function that you can then use in your code
```js
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const productIdentifier = "wlp" //Workleap Management
const track = createTrackingFunction(productIdentifier, environmentVariables.navigationApiBaseUrl);

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

You might want to track an action done in Workleap Management (or another product) that targets another product. The library provide a function options to specify the target product identifier.
```js
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const productIdentifier = "wlp" //Workleap Management
const targetProductIdentifier = "wov" //Officevibe
const track = createTrackingFunction(productIdentifier, environmentVariables.navigationApiBaseUrl, {
    targetProductIdentifier
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

If you want to use the tracking function but for a different endpoint, you can use the `trackingEndpoint` option.
```js
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const productIdentifier = "wlp" //Workleap Management
const track = createTrackingFunction(productIdentifier, environmentVariables.navigationApiBaseUrl, {
    trackingEndpoint: "/trackEvent"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```
