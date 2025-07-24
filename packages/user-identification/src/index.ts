// Main identification functions
export {
    clearUserIdentification, getCurrentUser, identify, isUserIdentified
} from "./identify.js";

// User context and utilities
export {
    __clearUserContext, __setUserContext, createDefaultUserTraits, createUserContext,
    getUserContext, UserContext, UserTraitsCookieName,
    UserTraitsLocalStorageKey
} from "./UserContext.js";

// Storage utilities that extend existing .workleap.com cookie system
export {
    clearAcrossDomains, createUserTraitsStorage, createWorkleapStorage, retrieveAcrossDomains, storeAcrossDomains, WorkleapStorage
} from "./storageUtils.js";

// Type definitions
export type {
    CreateUserContextOptions, ExtendedUserTraits, IdentifyUserOptions, StoredUserTraits, UserIdentification
} from "./userTypes.js";

// Storage utility types
export type {
    StorageOptions,
    StoredData
} from "./storageUtils.js";

