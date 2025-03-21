# wl-tracking

This monorepo contains some packages related to tracking.


# `@workleap/tracking`

This package allows you to add basic tracking capabilities to your applications. It exposes a single `track` function that calls a tracking endpoint that conforms to the Workleap Platform Tracking API in the environment URL you have provided.

To use it you must first call the `buildTrackingFunction` factory, which will return you a tracking function that you can then use in your code
```JS
import { buildTrackingFunction } from "@workleap/tracking";

const environmentVariables = getEnvironmentVariables();
const productIdentifier = "wlp" //Workleap Management
const track = buildTrackingFunction(productIdentifier, environmentVariables.navigationApiBaseUrl);

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

You might want to track an action done in Workleap Management (or another product) that targets another product. The library provide a function overload to specify the target product identifier.
```JS
import { buildTrackingFunction } from "@workleap/tracking";

const environmentVariables = getEnvironmentVariables();
const productIdentifier = "wlp" //Workleap Management
const targetProductIdentifier = "wov" //Officevibe
const track = buildTrackingFunction(productIdentifier, targetProductIdentifier, environmentVariables.navigationApiBaseUrl);

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```
