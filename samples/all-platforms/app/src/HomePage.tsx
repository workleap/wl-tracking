import { useTrackingFunction } from "@workleap/mixpanel/react";

export function HomePage() {
    const track = useTrackingFunction();

    track("Page View", {
        "Page": "Home Page"
    });

    return (
        <>
            <h1>Home</h1>
            <div>This is the homepage!</div>
        </>
    );
}
