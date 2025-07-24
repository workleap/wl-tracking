---
order: 100
label: identify
meta:
    title: identify - User Identification
toc:
    depth: 2-3
---

# identify

Identifies a user with the provided traits and stores them across domains. This function creates or updates the user context with comprehensive user identification that persists across `.workleap.com` subdomains using cookies and localStorage.

## Reference

```ts
const userContext = identify(userId, identification, options?)
```

### Parameters

- `userId`: The unique identifier for the user.
- `identification`: The user identification traits object.
- `options`: An optional object literal of options:
    - `persistToCookie`: Whether to persist data to cookies (default: `true`).
    - `persistToLocalStorage`: Whether to persist data to localStorage (default: `true`).
    - `userTraitsCookieExpiration`: Cookie expiration date (default: 1 year from now).
    - `userTraitsCookieDomain`: Cookie domain (default: `.workleap.com`).
    - `verbose`: Whether or not debug information should be logged to the console.

### Returns

A `UserContext` object containing the identified user and traits.

### UserIdentification interface

```ts
interface UserIdentification {
    userId: string;
    organizationId: string;
    organizationName: string;
    isMigratedToWorkleap: boolean;
    isAdmin: boolean;
    email: string;
    name: string;
}
```

### Extended traits (optional)

```ts
interface ExtendedUserTraits extends UserIdentification {
    firstName?: string;
    lastName?: string;
    company?: string;
    title?: string;
    avatar?: string;
    isTrialUser?: boolean;
    product?: string;
    customProp?: Record<string, unknown>;
}
```

## Usage

### Basic identification

```ts !#5-13
import { identify } from "@workleap/user-identification";

// After successful login
const userContext = identify("user-123", {
    userId: "user-123",
    organizationId: "org-456",
    organizationName: "Acme Corp",
    isMigratedToWorkleap: true,
    isAdmin: false,
    email: "user@example.com",
    name: "John Doe"
});

console.log(userContext.traits);
```

### With extended traits

```ts !#5-18
import { identify } from "@workleap/user-identification";

// Include additional traits for Common Room tracking
const userContext = identify("user-123", {
    userId: "user-123",
    organizationId: "org-456",
    organizationName: "Acme Corp",
    isMigratedToWorkleap: true,
    isAdmin: false,
    email: "user@example.com",
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    company: "Acme Corp",
    title: "Software Engineer",
    avatar: "https://example.com/avatar.jpg",
    isTrialUser: false,
    product: "officevibe"
});
```

### With custom options

```ts !#14-17
import { identify } from "@workleap/user-identification";

const userContext = identify("user-123", {
    userId: "user-123",
    organizationId: "org-456",
    organizationName: "Acme Corp",
    isMigratedToWorkleap: true,
    isAdmin: false,
    email: "user@example.com",
    name: "John Doe"
}, {
    persistToCookie: true,
    persistToLocalStorage: true,
    verbose: true
});
```

### In authentication flow

```ts !#8-16
import { identify } from "@workleap/user-identification";

async function handleLogin(credentials) {
    const authResult = await authenticate(credentials);
    const userProfile = await fetchUserProfile(authResult.userId);
    
    // Identify user for cross-domain tracking
    const userContext = identify(userProfile.id, {
        userId: userProfile.id,
        organizationId: userProfile.organizationId,
        organizationName: userProfile.organizationName,
        isMigratedToWorkleap: userProfile.isMigrated,
        isAdmin: userProfile.roles.includes('admin'),
        email: userProfile.email,
        name: userProfile.fullName
    });
    
    return { authResult, userContext };
}
``` 
