import { initializeCommonRoom } from "@workleap/common-room";
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { initializeMixpanel } from "@workleap/mixpanel";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

registerHoneycombInstrumentation("sample", "all-platforms-sample", [/.+/g], {
    apiKey: process.env.HONEYCOMB_API_KEY,
    verbose: true
});

registerLogRocketInstrumentation(process.env.LOGROCKET_APP_ID as string, {
    rootHostname: "workleap.com",
    verbose: true
});

initializeMixpanel("wlp", "https://local.workleap.com:5678/api/shell/navigation/", {
    verbose: true
});

initializeCommonRoom(process.env.COMMON_ROOM_SITE_ID as string, {
    verbose: true
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
