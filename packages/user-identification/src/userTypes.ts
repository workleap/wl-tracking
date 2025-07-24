/**
 * Core user identification interface based on LogRocket's comprehensive user traits
 * but designed for cross-domain user identification across Workleap platforms.
 *
 * @see https://workleap.github.io/wl-telemetry
 */
export interface UserIdentification {
    userId: string;
    organizationId: string;
    organizationName: string;
    isMigratedToWorkleap: boolean;
    isAdmin: boolean;
    isOrganizationCreator?: boolean;
    isExecutive?: {
        wov?: boolean;
        lms?: boolean;
        onb?: boolean;
        sks?: boolean;
        wpm?: boolean;
        pbd?: boolean;
    };
    isCollaborator?: {
        wov?: boolean;
        lms?: boolean;
        onb?: boolean;
        sks?: boolean;
        wpm?: boolean;
        pbd?: boolean;
    };
    isReportingManager?: boolean;
    isTeamManager?: boolean;
    planCode?: {
        wov?: string;
        lms?: string;
        onb?: string;
        sks?: string;
        wpm?: string;
        pbd?: string;
    };
}

/**
 * Extended user traits that include additional member profile data
 * for comprehensive user identification across platforms.
 */
export interface ExtendedUserTraits extends UserIdentification {
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    preferredName?: string;
    jobTitle?: string;
    department?: string;
    hireDate?: string;
    role?: string;
    plan?: string;
}

/**
 * User traits stored in cookies and localStorage for cross-domain persistence.
 * Uses normalized property names for consistent access across platforms.
 */
export interface StoredUserTraits extends Record<string, unknown> {
    "User Id": string;
    "Organization Id": string;
    "Organization Name": string;
    "Is Migrated To Workleap": boolean;
    "Is Admin": boolean;
    "Device Id": string;
    "Telemetry Id": string;
    "Is Organization Creator"?: boolean;
    "Is Executive"?: boolean;
    "Is Executive - Officevibe"?: boolean;
    "Is Executive - LMS"?: boolean;
    "Is Executive - Onboarding"?: boolean;
    "Is Executive - Skills"?: boolean;
    "Is Executive - Performance"?: boolean;
    "Is Executive - Pingboard"?: boolean;
    "Is Collaborator"?: boolean;
    "Is Collaborator - Officevibe"?: boolean;
    "Is Collaborator - LMS"?: boolean;
    "Is Collaborator - Onboarding"?: boolean;
    "Is Collaborator - Skills"?: boolean;
    "Is Collaborator - Performance"?: boolean;
    "Is Collaborator - Pingboard"?: boolean;
    "Is Reporting Manager"?: boolean;
    "Is Team Manager"?: boolean;
    "Plan Code - Officevibe"?: string;
    "Plan Code - LMS"?: string;
    "Plan Code - Onboarding"?: string;
    "Plan Code - Skills"?: string;
    "Plan Code - Performance"?: string;
    "Plan Code - Pingboard"?: string;
    "Email"?: string;
    "Name"?: string;
    "First Name"?: string;
    "Last Name"?: string;
    "Preferred Name"?: string;
    "Job Title"?: string;
    "Department"?: string;
    "Hire Date"?: string;
    "Role"?: string;
    "Plan"?: string;
}

/**
 * Options for creating and managing user context.
 */
export interface CreateUserContextOptions {
    userTraitsCookieExpiration?: Date;
    userTraitsCookieDomain?: string;
    useCookie?: boolean;
    useLocalStorage?: boolean;
    verbose?: boolean;
}

/**
 * Options for user identification.
 */
export interface IdentifyUserOptions {
    persistToCookie?: boolean;
    persistToLocalStorage?: boolean;
    userTraitsCookieExpiration?: Date;
    userTraitsCookieDomain?: string;
    verbose?: boolean;
}
