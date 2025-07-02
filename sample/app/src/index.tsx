import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { createTelemetryContext } from "@workleap/telemetry";
import LogRocket from "logrocket";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const telemetryContext = createTelemetryContext();

registerLogRocketInstrumentation(process.env.LOGROCKET_APP_ID as string, telemetryContext, {
    verbose: true
});

LogRocket.identify("toto");

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
