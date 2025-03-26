---
order: 100
icon: rocket
---

# Getting started

Welcome to the Workleap platform utility packages for tracking. On this page, you'll discover which packages are available and how to use them.

## Mixpanel

This package add basic Mixpanel tracking capabilities to an application. It provides a single `track` function that sends `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap Platform Tracking API.

### Install the package

First, open a terminal at the root of the application and install the following package:

+++ pnpm
```bash
pnpm add @workleap/mixpanel
```
+++ yarn
```bash
yarn add @workleap/mixpanel
```
+++ npm
```bash
npm install @workleap/mixpanel
```
+++

!!!warning
While you can use any package manager to develop an application with the tracking libraries, it is highly recommended that you use [PNPM](https://pnpm.io/) as the guides has been developed and tested with PNPM.
!!!

### Usage

#### Create the tracking function

First, retrieve a `track` function by executing the `createTrackingFunction` factory function.

```ts !#5
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const productId = "wlp";
const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);
```

Then, use the `track` function in the application code to send telemetry:

```ts !#7
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const productId = "wlp";
const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

#### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#7
import { createTrackingFunction } from "@workleap/mixpanel";

const environmentVariables = getEnvironmentVariables();
const productId = "wlp";
const targetProductId = "wov";
const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl, {
    targetProductId
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

#### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#6
const environmentVariables = getEnvironmentVariables();
const productId = "wlp";
const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, { 
    keepAlive: true 
});
```

### Migrate from @workleap/tracking

To migrate from the `@workleap/tracking` package, follow the [migration guide](./upgrading/migrate-to-v1.0.md).




