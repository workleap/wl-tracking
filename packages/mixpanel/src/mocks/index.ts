import type { MixpanelEventProperties } from "../js/properties.ts";

/**
 * Interface for the Mixpanel tracking request body
 */
export interface MixpanelTrackingRequest {
    eventName: string;
    productIdentifier: string;
    targetProductIdentifier: string | null;
    properties: MixpanelEventProperties;
}

/**
 * Default mock data for Mixpanel tracking requests
 */
export const MixpanelApiMocks = {
    Track: {
        /**
         * Default tracking request with common properties
         */
        Default: (): MixpanelTrackingRequest => ({
            eventName: "test_event",
            productIdentifier: "test_product",
            targetProductIdentifier: null,
            properties: {
                "$browser": "Chrome",
                "$browser_version": "120.0.0.0",
                "$current_url": "http://localhost:3000",
                "$device": "",
                "Is Mobile": false,
                "$os": "Mac OS X",
                "$referrer": "",
                "$referring_domain": "",
                "$screen_height": 1080,
                "$screen_width": 1920,
                "Device Id": "device-123",
                "Telemetry Id": "telemetry-456"
            }
        }),

        /**
         * Tracking request with target product identifier
         */
        WithTargetProduct: (): MixpanelTrackingRequest => ({
            ...MixpanelApiMocks.Track.Default(),
            targetProductIdentifier: "target_product"
        }),

        /**
         * Tracking request for mobile device
         */
        Mobile: (): MixpanelTrackingRequest => ({
            ...MixpanelApiMocks.Track.Default(),
            properties: {
                ...MixpanelApiMocks.Track.Default().properties,
                "$device": "iPhone",
                "Is Mobile": true,
                "$screen_height": 812,
                "$screen_width": 375
            }
        }),

        /**
         * Tracking request with custom properties
         */
        WithCustomProperties: (customProperties: MixpanelEventProperties = {}): MixpanelTrackingRequest => ({
            ...MixpanelApiMocks.Track.Default(),
            properties: {
                ...MixpanelApiMocks.Track.Default().properties,
                ...customProperties
            }
        }),

        /**
         * Custom tracking request with full customization
         */
        Custom: (data?: Partial<MixpanelTrackingRequest>): MixpanelTrackingRequest => {
            const defaultValue = MixpanelApiMocks.Track.Default();
            
            return { 
                ...defaultValue, 
                ...data,
                properties: {
                    ...defaultValue.properties,
                    ...data?.properties
                }
            };
        }
    }
};

/**
 * Mock response for successful tracking requests
 */
export const MixpanelTrackingResponse = {
    Success: () => null as null
};