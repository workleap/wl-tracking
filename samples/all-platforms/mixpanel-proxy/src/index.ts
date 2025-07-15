/* eslint-disable max-len */

import cors from "cors";
import * as dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import Mixpanel from "mixpanel";
import path from "node:path";

dotenv.config({
    path: [path.resolve("../../../.env.local")]
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const projectToken = process.env.MIXPANEL_PROJECT_TOKEN as string;

const mixpanel = Mixpanel.init(projectToken, {
    verbose: true
});

const app = express();
const port = 5678;

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

app.use(express.json());

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Local tracking service endpoint because the SSD tracking service only works
// for products and requires an auth cookie.
app.post("/api/shell/navigation/tracking/track", (req: Request, res: Response) => {
    const {
        eventName,
        properties
    } = req.body;

    mixpanel.track(eventName, properties);

    res.status(200).send("OK");
});
