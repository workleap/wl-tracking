---
order: 100
label: Getting started
meta:
    title: Getting started - Mixpanel
toc:
    depth: 2
---

# Getting started

To make data-informed decisions, understand user behavior, and measure product impact, Workleap has adopted [Mixpanel](https://mixpanel.com/), an analytics platform that helps understand how users interact with a product.

This package add basic Mixpanel tracking capabilities to an application. It provides a single `track` function that sends `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap Platform Tracking API.

## Install the package

First, open a terminal at the root of the application and install the following package:

```bash
pnpm add @workleap/mixpanel
```

## Create a tracking function

First, retrieve a `track` function by executing the `createTrackingFunction` factory function.

```ts !#4
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const track = createTrackingFunction("wlp", environmentVariables.navigationApiBaseUrl);
```

## Specify an environment

The second parameter of `createTrackingFunction` can be either a full URL (typically from `environmentVariables.navigationApiBaseUrl`) or a predefined environment string.

Accepted environment strings are:
- `development`
- `staging`
- `production`
- `msw`
- `local`

For example:

```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction("wlp", "staging");
```

This is useful if your application doesn’t manage environment variables for the API base URL and instead relies on environment naming conventions.

## Track events

Now that you have your `track` function, use it in the application code to send telemetry:

```ts !#5
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction("wlp", "staging");

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#4
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction("wlp", "staging";, {
    targetProductId: "wov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#4
const track = createTrackingFunction("wlp", "staging");

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

## Migrate to v1.0

To migrate from the `@workleap/tracking` package, follow the [migration guide](./upgrading/migrate-to-v1.0.md).




