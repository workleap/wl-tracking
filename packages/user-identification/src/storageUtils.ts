import Cookies from "js-cookie";
import type { StoredUserTraits } from "./userTypes.js";

/**
 * Storage utilities that extend the existing .workleap.com cookie system
 * from the telemetry package. These utilities provide a consistent way to
 * store and retrieve data across Workleap domains.
 */

export interface StorageOptions {
    cookieName: string;
    localStorageKey?: string;
    cookieExpiration?: Date;
    cookieDomain?: string;
    useCookie?: boolean;
    useLocalStorage?: boolean;
    verbose?: boolean;
}

export interface StoredData<T = unknown> {
    data: T;
    timestamp: number;
}

const DEFAULT_STORAGE_OPTIONS: Required<Omit<StorageOptions, "cookieName">> = {
    localStorageKey: "",
    cookieExpiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year (same as telemetry)
    cookieDomain: ".workleap.com", // Same domain as existing telemetry system
    useCookie: true,
    useLocalStorage: true,
    verbose: false
};

/**
 * Generic storage utility class that extends the .workleap.com cookie system.
 * Provides dual storage (cookies + localStorage) for cross-domain persistence
 * while maintaining compatibility with existing telemetry infrastructure.
 */
export class WorkleapStorage<T> {
    private readonly options: Required<StorageOptions>;

    constructor(options: StorageOptions) {
        // Fix TypeScript cast unsoundness by properly merging defaults
        const mergedOptions = {
            ...DEFAULT_STORAGE_OPTIONS,
            ...options,
            localStorageKey: options.localStorageKey || options.cookieName
        };

        this.options = mergedOptions;
    }

    /**
     * Store data using the dual storage strategy (cookies + localStorage)
     * following the same patterns as the existing telemetry system.
     */
    set(data: T): void {
        const storedData: StoredData<T> = {
            data,
            timestamp: Date.now()
        };

        // Store in cookie for cross-domain access (same pattern as wl-identity)
        // Only if useCookie is enabled (fixes the persistToCookie ignored bug)
        if (this.options.useCookie) {
            this.setCookie(storedData);
        }

        // Store in localStorage for faster access (if enabled)
        if (this.options.useLocalStorage) {
            this.setLocalStorage(storedData);
        }

        if (this.options.verbose) {
            console.log(`[workleap-storage] Data stored in ${this.options.cookieName}`);
        }
    }

    /**
     * Retrieve data using the storage hierarchy: localStorage first (faster),
     * then fallback to cookies (cross-domain compatibility).
     */
    get(): T | undefined {
        // Try localStorage first for performance (same pattern as UserContext)
        if (this.options.useLocalStorage) {
            const localData = this.getLocalStorage();
            if (localData) {
                return localData.data;
            }
        }

        // Fallback to cookie (only if cookies are enabled)
        if (this.options.useCookie) {
            const cookieData = this.getCookie();
            if (cookieData) {
                // Sync back to localStorage if available and enabled
                if (this.options.useLocalStorage) {
                    this.setLocalStorage(cookieData);
                }

                return cookieData.data;
            }
        }

        return undefined;
    }

    /**
     * Clear data from both storage locations
     */
    clear(): void {
        if (this.options.useCookie) {
            this.clearCookie();
        }

        if (this.options.useLocalStorage) {
            this.clearLocalStorage();
        }

        if (this.options.verbose) {
            console.log(`[workleap-storage] Data cleared from ${this.options.cookieName}`);
        }
    }

    /**
     * Check if data exists in storage
     */
    has(): boolean {
        return this.get() !== undefined;
    }

    /**
     * Get stored data with metadata (timestamp, etc.)
     */
    getWithMetadata(): StoredData<T> | undefined {
        // Try localStorage first
        if (this.options.useLocalStorage) {
            const localData = this.getLocalStorage();
            if (localData) {
                return localData;
            }
        }

        // Fallback to cookie (only if enabled)
        if (this.options.useCookie) {
            return this.getCookie();
        }

        return undefined;
    }

    /**
     * Private method to set cookie data following telemetry package patterns
     */
    private setCookie(storedData: StoredData<T>): void {
        try {
            const cookieValue = JSON.stringify(storedData);

            // Warn if approaching the ~4KB browser cookie size limit
            if (cookieValue.length > 3800) {
                console.warn(
                    `[workleap-storage] Cookie "${this.options.cookieName}" is ${cookieValue.length} bytes, approaching the ~4KB browser limit. ` +
                    "Consider reducing user traits to prevent cookie rejection."
                );
            }

            // Same pattern as setDeviceId in TelemetryContext.ts
            Cookies.set(this.options.cookieName, cookieValue, {
                expires: this.options.cookieExpiration,
                domain: this.options.cookieDomain
            });
        } catch (error: unknown) {
            // Same error handling pattern as telemetry package
            if (this.options.verbose) {
                console.warn(`[workleap-storage] Failed to set cookie ${this.options.cookieName}:`, error);
            }
        }
    }

    /**
     * Private method to get cookie data following telemetry package patterns
     */
    private getCookie(): StoredData<T> | undefined {
        try {
            // Same pattern as getDeviceId in TelemetryContext.ts
            const cookie = Cookies.get(this.options.cookieName);

            if (cookie) {
                return JSON.parse(cookie) as StoredData<T>;
            }
        } catch (error: unknown) {
            // Same error handling pattern as telemetry package
            if (this.options.verbose) {
                console.warn(`[workleap-storage] Failed to parse cookie ${this.options.cookieName}:`, error);
            }
        }

        return undefined;
    }

    /**
     * Private method to clear cookie
     */
    private clearCookie(): void {
        try {
            // Set expired cookie to clear it (cross-browser compatible)
            document.cookie = `${this.options.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${this.options.cookieDomain}; path=/;`;
        } catch (error: unknown) {
            if (this.options.verbose) {
                console.warn(`[workleap-storage] Failed to clear cookie ${this.options.cookieName}:`, error);
            }
        }
    }

    /**
     * Private method to set localStorage data with SSR safety
     */
    private setLocalStorage(storedData: StoredData<T>): void {
        try {
            // Add SSR safety check
            if (typeof localStorage !== "undefined") {
                localStorage.setItem(this.options.localStorageKey, JSON.stringify(storedData));
            }
        } catch (error: unknown) {
            // localStorage might not be available or quota exceeded
            if (this.options.verbose) {
                console.warn(`[workleap-storage] Failed to set localStorage ${this.options.localStorageKey}:`, error);
            }
        }
    }

    /**
     * Private method to get localStorage data with SSR safety
     */
    private getLocalStorage(): StoredData<T> | undefined {
        try {
            // Add SSR safety check
            if (typeof localStorage !== "undefined") {
                const stored = localStorage.getItem(this.options.localStorageKey);

                if (stored) {
                    return JSON.parse(stored) as StoredData<T>;
                }
            }
        } catch (error: unknown) {
            // localStorage might not be available or data corrupted
            if (this.options.verbose) {
                console.warn(`[workleap-storage] Failed to parse localStorage ${this.options.localStorageKey}:`, error);
            }
        }

        return undefined;
    }

    /**
     * Private method to clear localStorage with SSR safety
     */
    private clearLocalStorage(): void {
        try {
            // Add SSR safety check
            if (typeof localStorage !== "undefined") {
                localStorage.removeItem(this.options.localStorageKey);
            }
        } catch (error: unknown) {
            if (this.options.verbose) {
                console.warn(`[workleap-storage] Failed to clear localStorage ${this.options.localStorageKey}:`, error);
            }
        }
    }
}

/**
 * Factory function to create a storage instance with sensible defaults
 * for the Workleap ecosystem.
 */
export function createWorkleapStorage<T>(cookieName: string, options?: Partial<StorageOptions>): WorkleapStorage<T> {
    return new WorkleapStorage<T>({
        cookieName,
        ...options
    });
}

/**
 * Utility functions that extend the existing telemetry patterns
 * for common storage operations.
 */

/**
 * Create a user traits storage instance that follows the same patterns
 * as the existing wl-identity cookie from the telemetry package.
 * Now accepts options to properly handle persistToCookie and other settings.
 */
export function createUserTraitsStorage(options?: Partial<StorageOptions>) {
    return createWorkleapStorage<{ userId: string; traits: StoredUserTraits }>("wl-user-traits", {
        localStorageKey: "wl-user-traits",
        verbose: false,
        ...options
    });
}

/**
 * Generic function to store any data with Workleap's cross-domain strategy
 */
export function storeAcrossDomains<T>(cookieName: string, data: T, options?: Partial<StorageOptions>): void {
    const storage = createWorkleapStorage<T>(cookieName, options);
    storage.set(data);
}

/**
 * Generic function to retrieve data from Workleap's cross-domain storage
 */
export function retrieveAcrossDomains<T>(cookieName: string, options?: Partial<StorageOptions>): T | undefined {
    const storage = createWorkleapStorage<T>(cookieName, options);

    return storage.get();
}

/**
 * Clear data from Workleap's cross-domain storage
 */
export function clearAcrossDomains(cookieName: string, options?: Partial<StorageOptions>): void {
    const storage = createWorkleapStorage(cookieName, options);
    storage.clear();
}
