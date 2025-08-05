import { loadEnv } from "@rsbuild/core";
import { defineDevConfig } from "@workleap/rsbuild-configs";
import fs from "node:fs";
import path from "node:path";

const { parsed } = loadEnv({
    cwd: path.resolve("../../..")
});

export default defineDevConfig({
    host: "local.workleap.com",
    port: 443,
    https: {
        key: fs.readFileSync("../local.workleap.com-key.pem"),
        cert: fs.readFileSync("../local.workleap.com.pem")
    },
    environmentVariables: parsed
});
