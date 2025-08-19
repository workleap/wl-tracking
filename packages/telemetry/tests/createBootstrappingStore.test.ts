import { NoopLogger } from "@workleap/logging";
import { afterEach, test } from "vitest";
import { BootstrappingStoreVariableName, createBootstrappingStore } from "../src/BootstrappingStore.ts";

afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete globalThis[BootstrappingStoreVariableName];
});

test("when called twice, the same bootstrapping store instance is returned", ({ expect }) => {
    const store1 = createBootstrappingStore(new NoopLogger());
    const store2 = createBootstrappingStore(new NoopLogger());

    expect(store1).toBe(store2);
});
