import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        include: ["tests/**/*.test.{ts,tsx}"],
        exclude: ["node_modules", "dist"],
        testTransformMode: {
            web: [".ts", ".tsx"]
        },
        reporters: "verbose"
    },
    cacheDir: "./node_modules/.cache/vitest"
});
