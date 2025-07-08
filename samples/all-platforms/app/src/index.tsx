import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { createTelemetryContext } from "@workleap/telemetry";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const telemetryContext = createTelemetryContext({
    verbose: true
});

registerLogRocketInstrumentation(process.env.LOGROCKET_APP_ID as string, telemetryContext, {
    rootHostname: "localhost"
});

registerHoneycombInstrumentation("sample", "all-platforms-sample", [/.+/g], telemetryContext, {
    // Default to a space so it doesn't throw at runtime.
    apiKey: process.env.HONEYCOMB_API_KEY ?? " ",
    verbose: true
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
