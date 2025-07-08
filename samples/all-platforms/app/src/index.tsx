import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

registerHoneycombInstrumentation("sample", "all-platforms-sample", [/.+/g], {
    // Default to a space so it doesn't throw at runtime.
    apiKey: process.env.HONEYCOMB_API_KEY ?? " ",
    verbose: true
});

registerLogRocketInstrumentation(process.env.LOGROCKET_APP_ID as string, {
    rootHostname: "localhost",
    verbose: true
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
