import { getTelemetryContext } from "@workleap/telemetry";
import { isDefined } from "./assertions.js";
import { createUserTraitsStorage } from "./storageUtils.js";
import type {
    CreateUserContextOptions,
    ExtendedUserTraits,
    StoredUserTraits,
    UserIdentification
} from "./userTypes.js";

// The user traits cookie follows the same pattern as the identity cookie
// but stores comprehensive user identification data across .workleap.com domains
export const UserTraitsCookieName = "wl-user-traits";
export const UserTraitsLocalStorageKey = "wl-user-traits";

export class UserContext {
    readonly #userId: string;
    readonly #traits: StoredUserTraits;

    constructor(userId: string, traits: StoredUserTraits) {
        this.#userId = userId;
        this.#traits = traits;
    }

    get userId() {
        return this.#userId;
    }

    get traits() {
        return this.#traits;
    }

    get organizationId() {
        return this.#traits["Organization Id"];
    }

    get organizationName() {
        return this.#traits["Organization Name"];
    }

    get isAdmin() {
        return this.#traits["Is Admin"];
    }

    get email() {
        return this.#traits["Email"];
    }

    get name() {
        return this.#traits["Name"];
    }
}

export function createDefaultUserTraits(identification: UserIdentification | ExtendedUserTraits): StoredUserTraits {
    const {
        userId,
        organizationId,
        organizationName,
        isMigratedToWorkleap,
        isOrganizationCreator,
        isAdmin,
        isExecutive,
        isCollaborator,
        isReportingManager,
        isTeamManager,
        planCode
    } = identification;

    // Get extended traits if available
    const extended = identification as ExtendedUserTraits;

    const isExecutiveInAnyProduct = Boolean(
        isExecutive?.wov ||
        isExecutive?.lms ||
        isExecutive?.onb ||
        isExecutive?.sks ||
        isExecutive?.wpm ||
        isExecutive?.pbd
    );

    const isCollaboratorInAnyProduct = Boolean(
        isCollaborator?.wov ||
        isCollaborator?.lms ||
        isCollaborator?.onb ||
        isCollaborator?.sks ||
        isCollaborator?.wpm ||
        isCollaborator?.pbd
    );

    const telemetryContext = getTelemetryContext();

    return {
        "User Id": userId,
        "Organization Id": organizationId,
        "Organization Name": organizationName,
        "Is Migrated To Workleap": isMigratedToWorkleap,
        "Is Admin": isAdmin,
        // Only include telemetry IDs if available (avoid "N/A" pollution)
        ...(telemetryContext && { "Device Id": telemetryContext.deviceId }),
        ...(telemetryContext && { "Telemetry Id": telemetryContext.telemetryId }),
        ...(isDefined(isOrganizationCreator) && { "Is Organization Creator": isOrganizationCreator }),
        ...(isExecutiveInAnyProduct && { "Is Executive": true }),
        ...(isDefined(isExecutive?.wov) && { "Is Executive - Officevibe": isExecutive.wov }),
        ...(isDefined(isExecutive?.lms) && { "Is Executive - LMS": isExecutive.lms }),
        ...(isDefined(isExecutive?.onb) && { "Is Executive - Onboarding": isExecutive.onb }),
        ...(isDefined(isExecutive?.sks) && { "Is Executive - Skills": isExecutive.sks }),
        ...(isDefined(isExecutive?.wpm) && { "Is Executive - Performance": isExecutive.wpm }),
        ...(isDefined(isExecutive?.pbd) && { "Is Executive - Pingboard": isExecutive.pbd }),
        ...(isCollaboratorInAnyProduct && { "Is Collaborator": isCollaboratorInAnyProduct }),
        ...(isDefined(isCollaborator?.wov) && { "Is Collaborator - Officevibe": isCollaborator.wov }),
        ...(isDefined(isCollaborator?.lms) && { "Is Collaborator - LMS": isCollaborator.lms }),
        ...(isDefined(isCollaborator?.onb) && { "Is Collaborator - Onboarding": isCollaborator.onb }),
        ...(isDefined(isCollaborator?.sks) && { "Is Collaborator - Skills": isCollaborator.sks }),
        ...(isDefined(isCollaborator?.wpm) && { "Is Collaborator - Performance": isCollaborator.wpm }),
        ...(isDefined(isCollaborator?.pbd) && { "Is Collaborator - Pingboard": isCollaborator.pbd }),
        ...(isDefined(isReportingManager) && { "Is Reporting Manager": isReportingManager }),
        ...(isDefined(isTeamManager) && { "Is Team Manager": isTeamManager }),
        ...(isDefined(planCode?.wov) && { "Plan Code - Officevibe": planCode.wov }),
        ...(isDefined(planCode?.lms) && { "Plan Code - LMS": planCode.lms }),
        ...(isDefined(planCode?.onb) && { "Plan Code - Onboarding": planCode.onb }),
        ...(isDefined(planCode?.sks) && { "Plan Code - Skills": planCode.sks }),
        ...(isDefined(planCode?.wpm) && { "Plan Code - Performance": planCode.wpm }),
        ...(isDefined(planCode?.pbd) && { "Plan Code - Pingboard": planCode.pbd }),
        // Extended traits
        ...(isDefined(extended.email) && { "Email": extended.email }),
        ...(isDefined(extended.name) && { "Name": extended.name }),
        ...(isDefined(extended.firstName) && { "First Name": extended.firstName }),
        ...(isDefined(extended.lastName) && { "Last Name": extended.lastName }),
        ...(isDefined(extended.preferredName) && { "Preferred Name": extended.preferredName }),
        ...(isDefined(extended.jobTitle) && { "Job Title": extended.jobTitle }),
        ...(isDefined(extended.department) && { "Department": extended.department }),
        ...(isDefined(extended.hireDate) && { "Hire Date": extended.hireDate }),
        ...(isDefined(extended.role) && { "Role": extended.role }),
        ...(isDefined(extended.plan) && { "Plan": extended.plan })
    };
}

export function createUserContext(
    userId: string,
    identification: UserIdentification | ExtendedUserTraits,
    options: CreateUserContextOptions = {}
) {
    const {
        userTraitsCookieExpiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        userTraitsCookieDomain = ".workleap.com",
        useCookie = true,
        useLocalStorage = true,
        verbose = false
    } = options;

    const traits = createDefaultUserTraits(identification);

    // Use the new storage utilities that extend the existing .workleap.com cookie system
    // Pass through all the options that were being ignored
    const storage = createUserTraitsStorage({
        useCookie,
        useLocalStorage,
        cookieExpiration: userTraitsCookieExpiration,
        cookieDomain: userTraitsCookieDomain,
        verbose
    });
    storage.set({ userId, traits });

    if (verbose) {
        console.log(`[user-identification] User identified: ${userId}`);
        console.log(`[user-identification] Organization: ${traits["Organization Name"]}`);
    }

    // Fix the in-memory cache issue - update the module-level userContext
    const newUserContext = new UserContext(userId, traits);
    userContext = newUserContext;

    return newUserContext;
}

let userContext: UserContext | undefined;

// This function should only be used by tests.
export function __setUserContext(context: UserContext) {
    userContext = context;
}

// This function should only be used by tests.
export function __clearUserContext() {
    userContext = undefined;
}

export type GetUserContextOptions = CreateUserContextOptions;

export function getUserContext(options?: GetUserContextOptions): UserContext | undefined {
    if (userContext) {
        return userContext;
    }

    // Use the new storage utilities to retrieve user data
    const storage = createUserTraitsStorage(options);
    const userData = storage.get();

    if (userData) {
        userContext = new UserContext(userData.userId, userData.traits);

        return userContext;
    }

    return undefined;
}
