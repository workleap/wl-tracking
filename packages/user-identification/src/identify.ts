import { __clearUserContext, createUserContext, getUserContext, type UserContext } from "./UserContext.js";
import { createUserTraitsStorage } from "./storageUtils.js";
import type {
    ExtendedUserTraits,
    IdentifyUserOptions,
    UserIdentification
} from "./userTypes.js";

/**
 * Identifies a user with the provided traits and stores them across domains.
 * This function creates or updates the user context with comprehensive user identification
 * that persists across .workleap.com subdomains using cookies and localStorage.
 *
 * @param userId - Unique identifier for the user
 * @param identification - User identification traits
 * @param options - Configuration options for persistence and logging
 * @returns UserContext containing the identified user and traits
 *
 * @example
 * ```ts
 * import { identify } from "@workleap/user-identification";
 *
 * const userContext = identify("user-123", {
 *   userId: "user-123",
 *   organizationId: "org-456",
 *   organizationName: "Acme Corp",
 *   isMigratedToWorkleap: true,
 *   isAdmin: false,
 *   email: "user@example.com",
 *   name: "John Doe"
 * });
 *
 * // User traits are now available across all .workleap.com domains
 * console.log(userContext.traits);
 * ```
 */
export function identify(
    userId: string,
    identification: UserIdentification | ExtendedUserTraits,
    options: IdentifyUserOptions = {}
): UserContext {
    const {
        persistToCookie = true,
        persistToLocalStorage = true,
        userTraitsCookieExpiration,
        userTraitsCookieDomain,
        verbose = false
    } = options;

    const userContext = createUserContext(userId, identification, {
        useCookie: persistToCookie,
        useLocalStorage: persistToLocalStorage,
        userTraitsCookieExpiration,
        userTraitsCookieDomain,
        verbose
    });

    if (verbose) {
        console.log(`[user-identification] User '${userId}' identified successfully`);
        console.log(`[user-identification] Traits persisted to cookie: ${persistToCookie}`);
        console.log(`[user-identification] Traits persisted to localStorage: ${persistToLocalStorage}`);
    }

    return userContext;
}

/**
 * Gets the current user context if available.
 * This function attempts to retrieve stored user identification from localStorage
 * first (for performance), then falls back to cookies.
 *
 * @param options - Configuration options
 * @returns UserContext if user is identified, undefined otherwise
 *
 * @example
 * ```ts
 * import { getCurrentUser } from "@workleap/user-identification";
 *
 * const userContext = getCurrentUser();
 * if (userContext) {
 *   console.log(`Current user: ${userContext.userId}`);
 *   console.log(`Organization: ${userContext.organizationName}`);
 * } else {
 *   console.log("No user identified");
 * }
 * ```
 */
export function getCurrentUser(options?: IdentifyUserOptions): UserContext | undefined {
    const {
        persistToCookie,
        persistToLocalStorage,
        userTraitsCookieExpiration,
        userTraitsCookieDomain,
        verbose
    } = options ?? {};

    return getUserContext({
        ...(persistToCookie !== undefined && { useCookie: persistToCookie }),
        ...(persistToLocalStorage !== undefined && { useLocalStorage: persistToLocalStorage }),
        ...(userTraitsCookieExpiration && { userTraitsCookieExpiration }),
        ...(userTraitsCookieDomain && { userTraitsCookieDomain }),
        verbose
    });
}

/**
 * Clears the current user identification from both cookies and localStorage.
 * This effectively "logs out" the user from the identification system.
 * Uses the new storage utilities that extend the existing .workleap.com cookie system.
 *
 * @param options - Configuration options
 *
 * @example
 * ```ts
 * import { clearUserIdentification } from "@workleap/user-identification";
 *
 * clearUserIdentification({ verbose: true });
 * ```
 */
export function clearUserIdentification(options: IdentifyUserOptions = {}): void {
    const {
        persistToCookie,
        persistToLocalStorage,
        userTraitsCookieExpiration,
        userTraitsCookieDomain,
        verbose = false
    } = options;

    try {
        // Use the new storage utilities to clear user data
        const storage = createUserTraitsStorage({
            ...(persistToCookie !== undefined && { useCookie: persistToCookie }),
            ...(persistToLocalStorage !== undefined && { useLocalStorage: persistToLocalStorage }),
            ...(userTraitsCookieExpiration && { cookieExpiration: userTraitsCookieExpiration }),
            ...(userTraitsCookieDomain && { cookieDomain: userTraitsCookieDomain }),
            verbose
        });
        storage.clear();

        // Clear in-memory context
        __clearUserContext();

        if (verbose) {
            console.log("[user-identification] User identification cleared successfully");
        }
    } catch (error: unknown) {
        if (verbose) {
            console.warn("[user-identification] Failed to clear user identification:", error);
        }
    }
}

/**
 * Checks if a user is currently identified.
 *
 * @returns true if a user is identified, false otherwise
 *
 * @example
 * ```ts
 * import { isUserIdentified } from "@workleap/user-identification";
 *
 * if (isUserIdentified()) {
 *   console.log("User is identified");
 * } else {
 *   console.log("User is not identified");
 * }
 * ```
 */
export function isUserIdentified(): boolean {
    return getCurrentUser() !== undefined;
}
