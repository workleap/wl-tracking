import type { TelemetryContext } from "@workleap/telemetry";
import { isDefined } from "./assertions.ts";

/**
 * @see https://workleap.github.io/wl-tracking
 */
export interface LogRocketIdentification {
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
 * @see https://workleap.github.io/wl-tracking
 */
export interface LogRocketUserTraits extends Record<string, unknown> {
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
}

export const DeviceIdTrait = "Device Id";
export const TelemetryIdTrait = "Telemetry Id";

let internalTelemetryContext: TelemetryContext | undefined;

export function setTelemetryContext(context: TelemetryContext) {
    internalTelemetryContext = context;
}

/**
 * @see https://workleap.github.io/wl-tracking
 */
export function createDefaultUserTraits(identification: LogRocketIdentification, telemetryContext?: TelemetryContext) {
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

    const _telemetryContext = telemetryContext ?? internalTelemetryContext;

    return {
        "User Id": userId,
        "Organization Id": organizationId,
        "Organization Name": organizationName,
        "Is Migrated To Workleap": isMigratedToWorkleap,
        "Is Admin": isAdmin,
        [DeviceIdTrait]: _telemetryContext?.deviceId ?? "N/A",
        [TelemetryIdTrait]: _telemetryContext?.telemetryId ?? "N/A",
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
        ...(isDefined(planCode?.pbd) && { "Plan Code - Pingboard": planCode.pbd })
    } satisfies LogRocketUserTraits;
}
