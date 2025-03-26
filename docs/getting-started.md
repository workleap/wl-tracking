---
order: 100
icon: rocket
---

# Getting started

To monitor application performance, Workleap has adopted [Honeycomb](https://www.honeycomb.io/), a tool that helps teams manage and analyze telemetry data from distributed systems. Built on OpenTelemetry, Honeycomb provides a [robust API](https://open-telemetry.github.io/opentelemetry-js/) for tracking frontend telemetry.

Honeycomb's in-house [HoneycombWebSDK](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/) includes great default instrumentation. This package provides a slightly altered default instrumentation which is adapted for Workleap's web application observability requirements. 

## Install the packages

First, open a terminal at the root of the application and install the following packages:

+++ pnpm
```bash
pnpm add @workleap/honeycomb @honeycombio/opentelemetry-web @opentelemetry/api @opentelemetry/auto-instrumentations-web @opentelemetry/instrumentation-document-load @opentelemetry/instrumentation-fetch @opentelemetry/instrumentation-user-interaction @opentelemetry/instrumentation-xml-http-request @opentelemetry/sdk-trace-web
```
+++ yarn
```bash
yarn add @workleap/honeycomb @honeycombio/opentelemetry-web @opentelemetry/api @opentelemetry/auto-instrumentations-web @opentelemetry/instrumentation-document-load @opentelemetry/instrumentation-fetch @opentelemetry/instrumentation-user-interaction @opentelemetry/instrumentation-xml-http-request @opentelemetry/sdk-trace-web
```
+++ npm
```bash
npm install @workleap/honeycomb @honeycombio/opentelemetry-web @opentelemetry/api @opentelemetry/auto-instrumentations-web @opentelemetry/instrumentation-document-load @opentelemetry/instrumentation-fetch @opentelemetry/instrumentation-user-interaction @opentelemetry/instrumentation-xml-http-request @opentelemetry/sdk-trace-web
```
+++

!!!warning
While you can use any package manager to develop an application with Squide, it is highly recommended that you use [PNPM](https://pnpm.io/) as the guides has been developed and tested with PNPM.
!!!

## Register instrumentation

Then, update the application bootstrapping code to register Honeycomb instrumentation using the [registerHoneycombInstrumentation](./reference/registerHoneycombInstrumentation.md) function:

```tsx !#6-8 index.tsx
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

registerHoneycombInstrumentation("sample", [/.+/g,], {
    proxy: "https://sample-proxy"
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

!!!warning
Avoid using `/.+/g,` in production, as it could expose customer data to third parties. Instead, ensure you specify values that accurately matches your application's backend URLs.
!!!

!!!warning
We recommend using an [OpenTelemetry collector](https://docs.honeycomb.io/send-data/opentelemetry/collector/) with an authenticated proxy over an ingestion [API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/#create-api-key), as API keys can expose Workleap to potential attacks.
!!!

With instrumentation in place, a few traces are now available 👇

### Fetch requests

Individual fetch request performance can be monitored from end to end:

:::align-image-left
![Fetch instrumentation](./static/honeycomb-http-get.png)
:::

### Document load

The loading performance of the DOM can be monitored:

:::align-image-left
![Document load instrumentation](./static/honeycomb-document-load.png)
:::

### Unmanaged error

When an unmanaged error occurs, it's automatically recorded:

:::align-image-left
![Recorded error](./static/honeycomb-failing-http-request.png)
:::

### Real User Monitoring (RUM)

The default instrumentation will automatically track the appropriate metrics to display RUM information:

:::align-image-left
![Largest Contentful Paint](./static/honeycomb-lcp.png){width=536 height=378}
:::
:::align-image-left
![Cumulative Layout Shift](./static/honeycomb-cls.png){width=536 height=378}
:::
:::align-image-left
![Interaction to Next Paint](./static/honeycomb-inp.png){width=532 height=358}
:::

## Set custom user attributes

Most application needs to set custom attributes on traces about the current user environment. To help with that, `@workleap/honeycomb` expose the [setGlobalSpanAttribute](./reference/setGlobalSpanAttribute.md) function.

Update your application bootstrapping code to include the `setGlobalSpanAttribute` function:

```tsx !#10 index.tsx
import { registerHoneycombInstrumentation, setGlobalSpanAttributes } from "@workleap/honeycomb";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

registerHoneycombInstrumentation("sample", [/.+/g,], {
    proxy: "https://sample-proxy"
});

setGlobalSpanAttribute("app.user_id", "123");

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

Now, every trace recorded after the execution of `setGlobalSpanAttributes` will include the custom attributes `app.user_id`:

:::align-image-left
![Custom attributes](./static/honeycomb-custom-attributes.png){width=204 height=161}
:::

## Custrom traces

Have a look at the [custom traces](./custom-traces.md) page.

## Try it :rocket:

Start the application in a development environment using the dev script. Render a page, then navigate to your Honeycomb instance. Go to the "Query" page and type `name = HTTP GET` into the "Where" input. Run the query, select the "Traces" tab at the bottom of the page and view the detail of a trace. You should view information about the request.

### Troubleshoot issues

If you are experiencing issues with this guide:

- Set the [debug](./reference/registerHoneycombInstrumentation.md#debug) predefined option to `true`.
- Open the [DevTools](https://developer.chrome.com/docs/devtools/) console. You'll see a log entry for every Honeycomb traces.
    - `honeycombio/opentelemetry-web: Honeycomb link: https://ui.honeycomb.io/...`
- Refer to the sample on [GitHub](https://github.com/workleap/wl-honeycomb-web/tree/main/sample).
