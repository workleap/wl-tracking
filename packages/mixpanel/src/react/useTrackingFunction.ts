import { useMemo } from "react";
import { createTrackingFunction, type CreateTrackingFunctionOptions } from "../js/createTrackingFunction.ts";

export type UseTrackingFunctionOptions = CreateTrackingFunctionOptions;

export function useTrackingFunction(options: UseTrackingFunctionOptions = {}) {
    const {
        targetProductId
    } = options;

    return useMemo(() => {
        return createTrackingFunction({ targetProductId });
    }, [targetProductId]);
}
