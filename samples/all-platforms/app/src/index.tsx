import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { BrowserConsoleLogger, type RootLogger } from "@workleap/logging";
import { LogRocketLogger, registerLogRocketInstrumentation } from "@workleap/logrocket";
import { initializeMixpanel } from "@workleap/mixpanel";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const loggers: RootLogger[] = [
    new BrowserConsoleLogger(),
    new LogRocketLogger()
];

registerHoneycombInstrumentation("sample", "all-platforms-sample", [/.+/g], {
    apiKey: process.env.HONEYCOMB_API_KEY,
    verbose: true,
    loggers
});

registerLogRocketInstrumentation(process.env.LOGROCKET_APP_ID as string, {
    rootHostname: "workleap.com",
    verbose: true,
    loggers
});

initializeMixpanel("wlp", "https://local.workleap.com:5678/api/shell/navigation/", {
    verbose: true,
    loggers
});

registerCommonRoomInstrumentation(process.env.COMMON_ROOM_SITE_ID as string, {
    verbose: true,
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
