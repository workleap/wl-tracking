import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
    __clearUserContext,
    clearUserIdentification,
    getCurrentUser,
    identify,
    isUserIdentified,
    UserContext
} from "../src/index.ts";
import type { UserIdentification } from "../src/userTypes.ts";

// Create actual storage simulation
const storageData = new Map<string, unknown>();

// Mock js-cookie with actual storage behavior
vi.mock("js-cookie", () => ({
    default: {
        get: vi.fn((key: string) => {
            const data = storageData.get(key);

            return data ? JSON.stringify(data) : undefined;
        }),
        set: vi.fn((key: string, value: string) => {
            storageData.set(key, JSON.parse(value));
        })
    }
}));

// Mock localStorage with actual storage behavior
const localStorageMock = {
    getItem: vi.fn((key: string) => {
        const data = storageData.get(`localStorage:${key}`);

        return data ? JSON.stringify(data) : null;
    }),
    setItem: vi.fn((key: string, value: string) => {
        storageData.set(`localStorage:${key}`, JSON.parse(value));
    }),
    removeItem: vi.fn((key: string) => {
        storageData.delete(`localStorage:${key}`);
    })
};
Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock
});

// Mock document.cookie with setter that handles clearing
Object.defineProperty(globalThis, "document", {
    value: {
        get cookie() {
            return "";
        },
        set cookie(value: string) {
            // Simulate cookie clearing - if it's an expired cookie, remove from our storage
            if (value.includes("expires=Thu, 01 Jan 1970")) {
                const cookieName = value.split("=")[0];
                storageData.delete(cookieName);
            }
        }
    },
    writable: true
});

describe("User Identification", () => {
    const mockUserIdentification: UserIdentification = {
        userId: "test-user-123",
        organizationId: "org-456",
        organizationName: "Test Organization",
        isMigratedToWorkleap: true,
        isAdmin: false,
        isOrganizationCreator: false,
        isExecutive: {
            wov: true,
            lms: false
        },
        isCollaborator: {
            wov: true,
            lms: true
        },
        isReportingManager: false,
        isTeamManager: true,
        planCode: {
            wov: "wov-essential-monthly-std",
            lms: "lms-pro-annual"
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        __clearUserContext();
        storageData.clear(); // Clear the simulated storage
    });

    afterEach(() => {
        vi.clearAllMocks();
        __clearUserContext();
        storageData.clear(); // Clear the simulated storage
    });

    describe("identify", () => {
        test("should identify a user and return UserContext", () => {
            const userContext = identify(mockUserIdentification.userId, mockUserIdentification);

            expect(userContext).toBeInstanceOf(UserContext);
            expect(userContext.userId).toBe(mockUserIdentification.userId);
            expect(userContext.organizationId).toBe(mockUserIdentification.organizationId);
            expect(userContext.organizationName).toBe(mockUserIdentification.organizationName);
            expect(userContext.isAdmin).toBe(mockUserIdentification.isAdmin);
        });

        test("should store user traits with comprehensive data", () => {
            const userContext = identify(mockUserIdentification.userId, mockUserIdentification);
            const traits = userContext.traits;

            expect(traits["User Id"]).toBe(mockUserIdentification.userId);
            expect(traits["Organization Id"]).toBe(mockUserIdentification.organizationId);
            expect(traits["Organization Name"]).toBe(mockUserIdentification.organizationName);
            expect(traits["Is Migrated To Workleap"]).toBe(mockUserIdentification.isMigratedToWorkleap);
            expect(traits["Is Admin"]).toBe(mockUserIdentification.isAdmin);
            expect(traits["Is Executive"]).toBe(true);
            expect(traits["Is Executive - Officevibe"]).toBe(true);
            expect(traits["Is Executive - LMS"]).toBe(false);
            expect(traits["Is Collaborator"]).toBe(true);
            expect(traits["Is Team Manager"]).toBe(true);
            expect(traits["Plan Code - Officevibe"]).toBe("wov-essential-monthly-std");
            expect(traits["Plan Code - LMS"]).toBe("lms-pro-annual");
        });

        test("should handle extended user traits", () => {
            const extendedTraits = {
                ...mockUserIdentification,
                email: "test@example.com",
                name: "Test User",
                firstName: "Test",
                lastName: "User",
                jobTitle: "Software Engineer",
                department: "Engineering"
            };

            const userContext = identify(extendedTraits.userId, extendedTraits);
            const traits = userContext.traits;

            expect(traits["Email"]).toBe("test@example.com");
            expect(traits["Name"]).toBe("Test User");
            expect(traits["First Name"]).toBe("Test");
            expect(traits["Last Name"]).toBe("User");
            expect(traits["Job Title"]).toBe("Software Engineer");
            expect(traits["Department"]).toBe("Engineering");
        });
    });

    describe("getCurrentUser", () => {
        test("should return undefined when no user is identified", () => {
            const userContext = getCurrentUser();
            expect(userContext).toBeUndefined();
        });

        test("should return UserContext when user is identified", () => {
            const identifiedUser = identify(mockUserIdentification.userId, mockUserIdentification);
            const retrievedUser = getCurrentUser();

            expect(retrievedUser).toEqual(identifiedUser);
        });
    });

    describe("isUserIdentified", () => {
        test("should return false when no user is identified", () => {
            expect(isUserIdentified()).toBe(false);
        });

        test("should return true when user is identified", () => {
            identify(mockUserIdentification.userId, mockUserIdentification);
            expect(isUserIdentified()).toBe(true);
        });
    });

    describe("clearUserIdentification", () => {
        test("should clear user identification", () => {
            identify(mockUserIdentification.userId, mockUserIdentification);
            expect(isUserIdentified()).toBe(true);

            clearUserIdentification();

            expect(isUserIdentified()).toBe(false);
            expect(localStorageMock.removeItem).toHaveBeenCalledWith("wl-user-traits");
        });
    });

    describe("Bug fixes validation", () => {
        test("should update in-memory cache on subsequent identify calls", () => {
            // First identification
            identify("user-123", mockUserIdentification);
            expect(getCurrentUser()?.userId).toBe("user-123");
            expect(getCurrentUser()?.organizationName).toBe("Test Organization");

            // Second identification with different data
            const newUserData = {
                ...mockUserIdentification,
                userId: "user-456",
                organizationName: "New Organization"
            };

            const userContext2 = identify("user-456", newUserData);

            // Cache should be updated to reflect new user
            expect(getCurrentUser()?.userId).toBe("user-456");
            expect(getCurrentUser()?.organizationName).toBe("New Organization");
            expect(userContext2.userId).toBe("user-456");
        });

        test("should handle localStorage-less environments gracefully", () => {
            expect(() => {
                identify("user-123", mockUserIdentification, {
                    persistToLocalStorage: true
                });
            }).not.toThrow();
        });
    });
});
