import { describe, expect, test, vi } from "vitest";
import { UserContext, createDefaultUserTraits } from "../src/UserContext.ts";
import type { ExtendedUserTraits, UserIdentification } from "../src/userTypes.ts";

// Mock @workleap/telemetry
vi.mock("@workleap/telemetry", () => ({
    getTelemetryContext: vi.fn(() => ({
        deviceId: "test-device-123",
        telemetryId: "test-telemetry-456"
    }))
}));

describe("UserContext", () => {
    const mockUserIdentification: UserIdentification = {
        userId: "test-user-123",
        organizationId: "org-456",
        organizationName: "Test Organization",
        isMigratedToWorkleap: true,
        isAdmin: false
    };

    describe("UserContext class", () => {
        test("should create UserContext with user ID and traits", () => {
            const traits = createDefaultUserTraits(mockUserIdentification);
            const userContext = new UserContext(mockUserIdentification.userId, traits);

            expect(userContext.userId).toBe(mockUserIdentification.userId);
            expect(userContext.organizationId).toBe(mockUserIdentification.organizationId);
            expect(userContext.organizationName).toBe(mockUserIdentification.organizationName);
            expect(userContext.isAdmin).toBe(mockUserIdentification.isAdmin);
            expect(userContext.traits).toEqual(traits);
        });

        test("should provide convenient getters for common properties", () => {
            const extendedTraits: ExtendedUserTraits = {
                ...mockUserIdentification,
                email: "test@example.com",
                name: "Test User"
            };

            const traits = createDefaultUserTraits(extendedTraits);
            const userContext = new UserContext(extendedTraits.userId, traits);

            expect(userContext.email).toBe("test@example.com");
            expect(userContext.name).toBe("Test User");
        });
    });

    describe("createDefaultUserTraits", () => {
        test("should create basic user traits", () => {
            const traits = createDefaultUserTraits(mockUserIdentification);

            expect(traits["User Id"]).toBe(mockUserIdentification.userId);
            expect(traits["Organization Id"]).toBe(mockUserIdentification.organizationId);
            expect(traits["Organization Name"]).toBe(mockUserIdentification.organizationName);
            expect(traits["Is Migrated To Workleap"]).toBe(mockUserIdentification.isMigratedToWorkleap);
            expect(traits["Is Admin"]).toBe(mockUserIdentification.isAdmin);
            expect(traits["Device Id"]).toBe("test-device-123");
            expect(traits["Telemetry Id"]).toBe("test-telemetry-456");
        });

        test("should handle product-specific executive roles", () => {
            const userWithRoles: UserIdentification = {
                ...mockUserIdentification,
                isExecutive: {
                    wov: true,
                    lms: false,
                    onb: true
                }
            };

            const traits = createDefaultUserTraits(userWithRoles);

            expect(traits["Is Executive"]).toBe(true);
            expect(traits["Is Executive - Officevibe"]).toBe(true);
            expect(traits["Is Executive - LMS"]).toBe(false);
            expect(traits["Is Executive - Onboarding"]).toBe(true);
        });

        test("should handle product-specific collaborator roles", () => {
            const userWithRoles: UserIdentification = {
                ...mockUserIdentification,
                isCollaborator: {
                    wov: false,
                    lms: true,
                    sks: true
                }
            };

            const traits = createDefaultUserTraits(userWithRoles);

            expect(traits["Is Collaborator"]).toBe(true);
            expect(traits["Is Collaborator - Officevibe"]).toBe(false);
            expect(traits["Is Collaborator - LMS"]).toBe(true);
            expect(traits["Is Collaborator - Skills"]).toBe(true);
        });

        test("should handle plan codes", () => {
            const userWithPlans: UserIdentification = {
                ...mockUserIdentification,
                planCode: {
                    wov: "wov-essential-monthly-std",
                    lms: "lms-pro-annual",
                    pbd: "pbd-basic"
                }
            };

            const traits = createDefaultUserTraits(userWithPlans);

            expect(traits["Plan Code - Officevibe"]).toBe("wov-essential-monthly-std");
            expect(traits["Plan Code - LMS"]).toBe("lms-pro-annual");
            expect(traits["Plan Code - Pingboard"]).toBe("pbd-basic");
        });

        test("should handle extended user traits", () => {
            const extendedUser: ExtendedUserTraits = {
                ...mockUserIdentification,
                email: "test@example.com",
                name: "Test User",
                firstName: "Test",
                lastName: "User",
                preferredName: "Tester",
                jobTitle: "Software Engineer",
                department: "Engineering",
                hireDate: "2023-01-15",
                role: "Developer",
                plan: "Premium"
            };

            const traits = createDefaultUserTraits(extendedUser);

            expect(traits["Email"]).toBe("test@example.com");
            expect(traits["Name"]).toBe("Test User");
            expect(traits["First Name"]).toBe("Test");
            expect(traits["Last Name"]).toBe("User");
            expect(traits["Preferred Name"]).toBe("Tester");
            expect(traits["Job Title"]).toBe("Software Engineer");
            expect(traits["Department"]).toBe("Engineering");
            expect(traits["Hire Date"]).toBe("2023-01-15");
            expect(traits["Role"]).toBe("Developer");
            expect(traits["Plan"]).toBe("Premium");
        });

        test("should only include defined optional properties", () => {
            const minimalUser: UserIdentification = {
                userId: "user-123",
                organizationId: "org-456",
                organizationName: "Test Org",
                isMigratedToWorkleap: true,
                isAdmin: false
            };

            const traits = createDefaultUserTraits(minimalUser);

            // Should not include undefined optional properties
            expect(traits).not.toHaveProperty("Is Organization Creator");
            expect(traits).not.toHaveProperty("Is Executive");
            expect(traits).not.toHaveProperty("Is Collaborator");
            expect(traits).not.toHaveProperty("Is Reporting Manager");
            expect(traits).not.toHaveProperty("Is Team Manager");
        });
    });
});
