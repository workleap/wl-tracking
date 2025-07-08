import { registerHoneycombInstrumentation, setGlobalSpanAttributes } from "@workleap/honeycomb";
import { createTelemetryContext } from "@workleap/telemetry";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const telemetryContext = createTelemetryContext({ verbose: true });

registerHoneycombInstrumentation("sample", "honeycomb-proxy-sample", [/http:\/\/localhost:1234\.*/], telemetryContext, {
    proxy: "http://localhost:5678/v1/traces",
    verbose: true
});

// Update telemetry global attributes.
setGlobalSpanAttributes({
    "app.user_id": "123",
    "app.user_prefered_language": "fr-CA"
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
