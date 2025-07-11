import { createContext, useContext } from "react";
import type { TrackingFunction } from "../js/createTrackingFunction.ts";

const TrackContext = createContext<TrackingFunction | undefined>(undefined);

export const TrackProvider = TrackContext.Provider;

export function useTrack() {
    const track = useContext(TrackContext);

    if (!track) {
        throw new Error("[mixpanel] The useTrack function is called before a track function has been provided.");
    }

    return track;
}
