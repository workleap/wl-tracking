---
order: 100
label: Getting started
meta:
    title: Getting started - User Identification
toc:
    depth: 2
---

# Getting started

To enable **cross-domain user identification** and **personalized experiences** across Workleap platforms, this package provides utilities for storing and retrieving user identification data that persists across all `*.workleap.com` subdomains.

This package enables **Common Room pixel integration**, **marketing website personalization**, and **cross-domain analytics** by providing a unified user identification system that works seamlessly across all Workleap products and websites.

## Install the packages

First, open a terminal at the root of the application and install the following packages:

```bash
pnpm add @workleap/user-identification @workleap/telemetry
```

## Identify a user

After successful user authentication in your Workleap product, identify the user using the [identify](./reference/identify.md) function:

```ts
import { identify } from "@workleap/user-identification";

// In your authentication flow after login
const userContext = identify("user-123", {
    userId: "user-123",
    organizationId: "org-456",
    organizationName: "Acme Corp",
    isMigratedToWorkleap: true,
    isAdmin: false,
    email: "user@example.com",
    name: "John Doe"
});

console.log("User identified for cross-domain tracking:", userContext.userId);
```

!!!tip
It's recommended to **log** user identification events when `verbose` is enabled for debugging purposes.

However, make sure not to log any _Personally Identifiable Information (PII)_ in production environments.
!!!

## Integration patterns

### In React applications

For React applications, integrate user identification into your authentication context:

```tsx
import { identify, clearUserIdentification } from "@workleap/user-identification";

function AuthProvider({ children }) {
    const handleLogin = async (credentials) => {
        // 1. Authenticate user
        const authResponse = await login(credentials);
        
        // 2. Fetch user and organization data
        const [user, organization] = await Promise.all([
            fetchUserProfile(authResponse.userId),
            fetchUserOrganization(authResponse.organizationId)
        ]);
        
        // 3. Identify user for cross-domain tracking
        identify(user.id, {
            userId: user.id,
            organizationId: organization.id,
            organizationName: organization.name,
            isMigratedToWorkleap: organization.isMigrated,
            isAdmin: user.roles.includes('admin'),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`
        });
    };
    
    const handleLogout = () => {
        clearUserIdentification();
        // ... rest of logout logic
    };
}
```

### Session restoration

Restore user identification when the application loads with an existing session:

```ts
import { identify } from "@workleap/user-identification";

async function initializeApp() {
    const sessionUser = await checkSession();
    
    if (sessionUser) {
        identify(sessionUser.id, {
            userId: sessionUser.id,
            organizationId: sessionUser.organizationId,
            organizationName: sessionUser.organizationName,
            isMigratedToWorkleap: sessionUser.isMigrated,
            isAdmin: sessionUser.isAdmin,
            email: sessionUser.email,
            name: sessionUser.fullName
        });
    }
}
```

## Reading user identification

### Check if user is identified

Use [isUserIdentified](./reference/isUserIdentified.md) to check if user identification data is available:

```ts
import { isUserIdentified } from "@workleap/user-identification";

if (isUserIdentified()) {
    console.log("User identification data is available");
}
```

### Get current user

Use [getCurrentUser](./reference/getCurrentUser.md) to retrieve the current user context:

```ts
import { getCurrentUser } from "@workleap/user-identification";

const userContext = getCurrentUser();

if (userContext) {
    console.log(`Current user: ${userContext.userId}`);
    console.log(`Organization: ${userContext.organizationName}`);
}
```

## Cross-domain persistence

User identification data is automatically persisted across all `*.workleap.com` domains using:

- **Cookies**: For cross-domain sharing with domain `.workleap.com`
- **localStorage**: For improved performance and persistence within the same domain

This enables seamless user experience across:
- Product applications (officevibe.com, sharegate.com, etc.)
- Marketing website (workleap.com)
- Common Room pixel tracking
- Cross-domain analytics

## Clear user identification

When users log out, clear the identification data using [clearUserIdentification](./reference/clearUserIdentification.md):

```ts
import { clearUserIdentification } from "@workleap/user-identification";

clearUserIdentification({
    verbose: true
});
```

This removes user identification data from both cookies and localStorage across all domains. 
