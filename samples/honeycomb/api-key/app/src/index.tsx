import { registerHoneycombInstrumentation, setGlobalSpanAttributes } from "@workleap/honeycomb";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

registerHoneycombInstrumentation("sample", "honeycomb-api-key-sample", [/http:\/\/localhost:1234\.*/], {
    // Default to a space so it doesn't throw at runtime.
    apiKey: process.env.HONEYCOMB_API_KEY ?? " ",
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
