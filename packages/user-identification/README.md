# @workleap/user-identification

A package containing utilities for cross-domain user identification across Workleap platforms.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@workleap/user-identification)](https://www.npmjs.com/package/@workleap/user-identification)

## Installation

```bash
pnpm add @workleap/user-identification @workleap/telemetry
```

## Integration Guide

### When to use user identification

This package should be used by **Workleap products** to store user identification data that can be read by:
- **Marketing website** (for personalization)
- **Common Room pixel** (for user tracking)
- **Cross-domain analytics** (for user journey tracking)

### When to call `identify()`

Products should call `identify()` in these scenarios:

1. **After user login/authentication**
2. **During session restoration** (when user returns with valid session)
3. **When user profile data changes** (organization switch, role changes)
4. **Before logout** (to ensure latest data is persisted)

### Where to get user data

User identification data typically comes from:
- **User session APIs** (`/api/user/me`, `/api/auth/user`)
- **Organization context APIs** (`/api/organizations/current`)
- **User profile services**
- **Authentication tokens/claims**

## Real-World Migration Example

Looking at existing Workleap codebases, you're likely already collecting user identification data for LogRocket. Our package integrates seamlessly with your existing patterns.

### Current Pattern (Management Shell)

```tsx
// Your existing LogRocket initialization
const user = {
    userId: memberId,
    organizationId,
    isOrganizationCreator,
    isAdmin: isOrganizationAdmin,
    isReportingManager,
    isTeamManager,
    isMigratedToWorkleap: true,
    organizationName
};

registerLogRocketInstrumentation({
    appId,
    trackingIdentifier,
    identifyOptions: {
        ...user,
        ...(collaboratorTraits && { isCollaborator: collaboratorTraits }),
        ...(executiveTraits && { isExecutive: executiveTraits })
    },
    onSessionUrlInitialized: async sessionUrl => sendSessionUrlToTrackingService(sessionUrl)
});
```

### Add Cross-Domain Identification (New)

```tsx
import { identify } from "@workleap/user-identification";

// Same user data collection as before
const user = {
    userId: memberId,
    organizationId,
    isOrganizationCreator,
    isAdmin: isOrganizationAdmin,
    isReportingManager,
    isTeamManager,
    isMigratedToWorkleap: true,
    organizationName
};

// NEW: Store for cross-domain access (Common Room, marketing website)
identify(memberId, {
    userId: memberId,
    organizationId,
    organizationName,
    isMigratedToWorkleap: true,
    isAdmin: isOrganizationAdmin,
    email: session.email,  // Add if available
    name: session.fullName // Add if available
});

// Existing LogRocket code continues unchanged
registerLogRocketInstrumentation({
    appId,
    trackingIdentifier,
    identifyOptions: {
        ...user,
        ...(collaboratorTraits && { isCollaborator: collaboratorTraits }),
        ...(executiveTraits && { isExecutive: executiveTraits })
    },
    onSessionUrlInitialized: async sessionUrl => sendSessionUrlToTrackingService(sessionUrl)
});
```

### Migration Strategy

1. **Zero Breaking Changes**: Your existing LogRocket/Mixpanel code continues to work exactly as is
2. **Additive Integration**: Just add the `identify()` call using the same user data
3. **Gradual Rollout**: Add to one product first, then expand to others
4. **Marketing Website Benefits**: Immediately enables personalization and Common Room tracking

## Integration Examples

### React App Integration

```tsx
// In your app's authentication context or session provider
import { identify, clearUserIdentification } from "@workleap/user-identification";

function AuthProvider({ children }) {
    const handleLogin = async (credentials) => {
        // 1. Authenticate user
        const authResponse = await login(credentials);
        
        // 2. Fetch user profile and organization data
        const [user, organization] = await Promise.all([
            fetchUserProfile(authResponse.userId),
            fetchUserOrganization(authResponse.organizationId)
        ]);
        
        // 3. Identify user for cross-domain tracking
        const userContext = identify(user.id, {
            userId: user.id,
            organizationId: organization.id,
            organizationName: organization.name,
            isMigratedToWorkleap: organization.isMigrated,
            isAdmin: user.roles.includes('admin'),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            
            // Extended traits for Common Room
            firstName: user.firstName,
            lastName: user.lastName,
            company: organization.name,
            title: user.jobTitle,
            avatar: user.avatarUrl,
            isTrialUser: organization.subscription?.type === 'trial',
            product: 'officevibe' // or 'sharegate', 'ngage', etc.
        }, {
            verbose: true // Enable in development
        });
        
        console.log('User identified for cross-domain tracking:', userContext.userId);
    };
    
    const handleLogout = () => {
        // Clear user identification on logout
        clearUserIdentification({ verbose: true });
        // ... rest of logout logic
    };
    
    // ... rest of AuthProvider
}
```

### Session Restoration

```tsx
// In your app's initialization
import { identify, getCurrentUser } from "@workleap/user-identification";

async function initializeApp() {
    // Check if user has valid session
    const sessionUser = await checkSession();
    
    if (sessionUser) {
        // Restore user identification
        const userContext = identify(sessionUser.id, {
            userId: sessionUser.id,
            organizationId: sessionUser.organizationId,
            organizationName: sessionUser.organizationName,
            isMigratedToWorkleap: sessionUser.isMigrated,
            isAdmin: sessionUser.isAdmin,
            email: sessionUser.email,
            name: sessionUser.fullName
        });
        
        console.log('User session restored:', userContext.userId);
    }
}
```

### Organization Switching

```tsx
// When user switches organizations
import { identify } from "@workleap/user-identification";

const handleOrganizationSwitch = async (newOrgId: string) => {
    const [user, newOrganization] = await Promise.all([
        getCurrentUser(),
        fetchOrganization(newOrgId)
    ]);
    
    // Update identification with new organization context
    identify(user.id, {
        userId: user.id,
        organizationId: newOrganization.id,
        organizationName: newOrganization.name,
        isMigratedToWorkleap: newOrganization.isMigrated,
        isAdmin: user.rolesInOrganization[newOrgId]?.includes('admin'),
        email: user.email,
        name: user.fullName,
        company: newOrganization.name
    });
};
```

## Marketing Website Integration

```javascript
// On marketing website to read user data (vanilla JS - no React needed)
function PersonalizedHero() {
    const userContext = getUserIdentificationData(); // Function from above
    
    if (userContext) {
        return `
            <div>
                <h1>Welcome back, ${userContext.firstName}!</h1>
                <p>Continue your journey with ${userContext.organizationName}</p>
            </div>
        `;
    }
    
    return '<div><h1>Discover Workleap</h1></div>';
}

// Or in React if the marketing website uses React
function PersonalizedHero() {
    const [userContext, setUserContext] = useState(null);
    
    useEffect(() => {
        const userData = getUserIdentificationData();
        setUserContext(userData);
    }, []);
    
    if (userContext) {
        return (
            <div>
                <h1>Welcome back, {userContext.firstName}!</h1>
                <p>Continue your journey with {userContext.organizationName}</p>
            </div>
        );
    }
    
    return <DefaultHero />;
}
```

## Common Room Integration

```tsx
// On marketing website - install the package and import
import { getCurrentUser, isUserIdentified } from "@workleap/user-identification";

// Configure Common Room pixel with user data
function setupCommonRoom() {
    if (isUserIdentified()) {
        const userContext = getCurrentUser();
        
        // Configure Common Room with user data
        window.commonroomConfig = {
            userId: userContext.userId,
            traits: {
                email: userContext.email,
                firstName: userContext.firstName,
                lastName: userContext.lastName,
                company: userContext.company,
                organizationId: userContext.organizationId,
                product: userContext.product,
                isTrialUser: userContext.isTrialUser
            }
        };
    }
}

// Call during marketing website initialization
setupCommonRoom();
```

## Product Integration Checklist

### For Workleap Product Teams

**1. Installation**
```bash
pnpm add @workleap/user-identification @workleap/telemetry
```

**2. Integration Points**
- [ ] **Login flow**: Call `identify()` after successful authentication
- [ ] **Session restoration**: Call `identify()` when restoring user session on app load
- [ ] **Organization switching**: Update identification when user changes organization context
- [ ] **Logout flow**: Call `clearUserIdentification()` on logout
- [ ] **Profile updates**: Re-identify when user profile data changes

**3. Data Sources Checklist**
- [ ] User ID from authentication
- [ ] Organization ID and name
- [ ] User email and full name
- [ ] Admin/role status
- [ ] Migration status (`isMigratedToWorkleap`)
- [ ] Extended traits (firstName, lastName, company, title, avatar, etc.)
- [ ] Product identifier ('officevibe', 'sharegate', 'ngage', etc.)

**4. Testing**
```tsx
// Test in browser console after login
import { getCurrentUser, isUserIdentified } from "@workleap/user-identification";

console.log('User identified:', isUserIdentified());
console.log('User data:', getCurrentUser());

// Check cookie storage
document.cookie.split(';').find(c => c.includes('workleap-user-traits'));

// Check localStorage
localStorage.getItem('workleap-user-traits');
```

**5. Error Handling**
```tsx
try {
    const userContext = identify(userId, traits);
    console.log('User identified successfully:', userContext.userId);
} catch (error) {
    console.error('Failed to identify user:', error);
    // Handle gracefully - don't block user experience
}
```

### For Marketing Website Team

**1. No Installation Required**
Read user data directly from storage using vanilla JavaScript - no package installation needed.

**2. Implementation**
```javascript
// Read user identification data directly from storage
function getUserData() {
    try {
        // Try localStorage first
        const localData = localStorage.getItem('workleap-user-traits');
        if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
                return parsed.data;
            }
        }
        
        // Fallback to cookie
        const cookieData = document.cookie
            .split(';')
            .find(c => c.trim().startsWith('workleap-user-traits='));
            
        if (cookieData) {
            const cookieValue = cookieData.split('=')[1];
            const parsed = JSON.parse(decodeURIComponent(cookieValue));
            if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
                return parsed.data;
            }
        }
    } catch (error) {
        console.warn('Failed to read user data:', error);
    }
    
    return null;
}

// Use in marketing website for personalization
const userContext = getUserData();
```

**3. Testing Cross-Domain**
- [ ] Login to a Workleap product (officevibe.com, sharegate.com, etc.)
- [ ] Navigate to marketing website (workleap.com)
- [ ] Verify user data is available and personalization works

## Complete Integration Example

For a complete working example, see the [integration sample](../../samples/user-identification/) which demonstrates:
- Authentication flow with user identification
- Session restoration
- Cross-domain data persistence
- Marketing website personalization

## Documentation

For detailed documentation and API reference, visit [workleap.github.io/wl-telemetry](https://workleap.github.io/wl-telemetry/user-identification/).

## Quick start

### Identify a user

```ts
import { identify } from "@workleap/user-identification";

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

### Get current user

```ts
import { getCurrentUser } from "@workleap/user-identification";

const userContext = getCurrentUser();
if (userContext) {
    console.log(`Current user: ${userContext.userId}`);
    console.log(`Organization: ${userContext.organizationName}`);
}
```

### Check if user is identified

```ts
import { isUserIdentified } from "@workleap/user-identification";

if (isUserIdentified()) {
    console.log("User is identified");
}
```

### Clear user identification

```ts
import { clearUserIdentification } from "@workleap/user-identification";

clearUserIdentification({ verbose: true });
```

## Features

- **Cross-domain identification**: User traits persist across all `*.workleap.com` subdomains
- **Dual storage**: Uses both cookies and localStorage for optimal performance and persistence
- **Comprehensive traits**: Supports all user traits from LogRocket's interface plus extended profile data
- **Telemetry integration**: Automatically includes device ID and telemetry ID correlation
- **Type safety**: Full TypeScript support with comprehensive interfaces
- **Common Room ready**: Traits are available for Common Room's `window.signals.identify()`

## Use cases

- **Marketing website identification**: Pass user traits from product apps to marketing sites
- **Common Room integration**: Provide identified user data to Common Room pixel
- **Cross-domain analytics**: Maintain user identity across different Workleap domains
- **Unified user experience**: Personalize experiences based on user traits across platforms

## API Reference

### Functions

#### `identify(userId, identification, options?)`

Identifies a user with comprehensive traits and stores them across domains.

**Parameters:**
- `userId` (string): Unique identifier for the user
- `identification` (UserIdentification | ExtendedUserTraits): User traits
- `options` (IdentifyUserOptions): Configuration options

**Returns:** `UserContext`

#### `getCurrentUser(options?)`

Gets the current user context if available.

**Parameters:**
- `options` (IdentifyUserOptions): Configuration options

**Returns:** `UserContext | undefined`

#### `isUserIdentified()`

Checks if a user is currently identified.

**Returns:** `boolean`

#### `clearUserIdentification(options?)`

Clears user identification from storage. Without options, both storage layers (cookies and localStorage) are cleared.

**Parameters:**
- `options` (IdentifyUserOptions): Configuration options

### Types

#### `UserIdentification`

Core user identification interface:

```ts
interface UserIdentification {
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
```

#### `ExtendedUserTraits`

Extended traits including profile data:

```ts
interface ExtendedUserTraits extends UserIdentification {
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
```

#### `IdentifyUserOptions`

Configuration options for identification functions:

```ts
interface IdentifyUserOptions {
    persistToCookie?: boolean;           // Store in cookies for cross-domain access (default: true)
    persistToLocalStorage?: boolean;    // Store in localStorage for faster access (default: true)
    userTraitsCookieExpiration?: Date;  // Cookie expiration date (default: 1 year)
    userTraitsCookieDomain?: string;    // Cookie domain (default: ".workleap.com")
    verbose?: boolean;                  // Enable debug logging (default: false)
}
```

## Storage Strategy

The package uses a dual storage approach:

1. **Cookies**: For cross-domain persistence across `*.workleap.com`
2. **localStorage**: For faster access within the same domain

Data is stored in the following locations:
- Cookie: `wl-user-traits` (domain: `.workleap.com`)
- localStorage: `wl-user-traits`

### Storage Limitations

**Cookie Size Limit**: Browsers enforce a ~4KB size limit per cookie. While the package stores comprehensive user traits, be mindful that very large trait objects (many extended properties, long organization names, etc.) could exceed this limit, causing the cookie to be silently rejected by the browser. The localStorage storage is not affected by this limitation.

## Integration with Common Room

Once a user is identified, their traits are available for Common Room integration:

```ts
import { getCurrentUser } from "@workleap/user-identification";

const userContext = getCurrentUser();
if (userContext && window.signals) {
    window.signals.identify(userContext.userId, userContext.traits);
}
```

## Documentation

For detailed documentation and examples, visit [workleap.github.io/wl-telemetry](https://workleap.github.io/wl-telemetry).

## License

Copyright © 2025, Workleap. This code is licensed under the Apache License, Version 2.0. 
