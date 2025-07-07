---
order: 90
label: createDefaultUserTraits
meta:
    title: createDefaultUserTraits - LogRocket
toc:
    depth: 2-3
---


-> Send additional user traits

It is possible to send custom user traits that you can use for filtering. You can simply use the additionalTraits property on the user identification.

The property name should match the user trait name in Mixpanel, so we recommend using a human-readable name.

We also recommend following the established convention of using the - {PRODUCTNAME} suffix for product-specific user traits, ex. Plan Code - Officevibe


-> Default user traits

{.user-traits-table}
User Trait Name | Description
---  | ---
User Id | <p>The member's unique id.<br/>(in case of multiple workspaces, this id would be different per workspace)</p><p>ex. `fa88ed6b-9ff4-48a0-b3a6-cee17b4855e9`</p>
Organization Id | <p>The organization's unique id.<br />(in case of multiple workspaces, this id would be different per workspace)</p><p>ex. `6a3f4a88-b4bd-42cf-b404-7fd83ec1808d`</p>
Is Migrated To Workleap | `true` if this member's organization has been migrated to use the WLP, or if the user has signed up to the new experience directly.
Is Admin | `true` if the member is an administrator in the current workspace.
Is Organization Creator | `true` if the member originally signed up to create the workspace.
Is Reporting Manager | `true` if this member is a reporting manager in the current workspace.
Is Team Manager | `true` if this member is a team manager in the current workspace.
Is Executive | `true` if this member is an executive in any product  in the current workspace.
Is Executive - Officevibe<br/>Is Executive - LMS<br/>Is Executive - Onboarding<br/>Is Executive - Pingboard<br/>Is Executive - Skills<br/>Is Executive - Performance | `true` if this member is an executive of the corresponding product in the current workspace.
Is Collaborator | `true` if this member is a collaborator in any product in the current workspace.
Is Collaborator - Officevibe<br/>Is Collaborator - LMS<br />Is Collaborator - Onboarding<br/>Is Collaborator - Pingboard<br/>Is Collaborator - Skills<br/>Is Collaborator - Performance | `true` if this member is a collaborator in the corresponding product in the current workspace.
Plan Code - Officevibe<br/>Plan Code - LMS<br/>Plan Code - Onboarding<br/>Plan Code - Pingboard<br/>Plan Code - Skills<br/>Plan Code - Performance | <p>Indicates the plan code for the corresponding product in the workspace.</p><p>ex. `wov-essential-monthly-std`</p>
