import cors from "cors";
import * as dotenv from "dotenv";
import express, { json, type Request, type Response } from "express";
import path from "node:path";

dotenv.config({
    path: [path.resolve("../../../../.env.local")]
});

const app = express();
const port = 5678;

app.use(json());

app.use(cors({
    origin: ["http://localhost:8080"],
    methods: ["POST"],
    credentials: true
}));

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.post("/v1/traces", async (req: Request, res: Response) => {
    const payload = await req.body;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-honeycomb-team": process.env.HONEYCOMB_API_KEY ?? ""
        },
        body: JSON.stringify(payload)
    };

    try {
        const honeycombResponse = await fetch("https://api.honeycomb.io/v1/traces", options);

        res.json({
            success: true,
            response: honeycombResponse
        });
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : JSON.stringify(error)
        });
    }
});
