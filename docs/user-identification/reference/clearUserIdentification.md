---
order: 130
label: clearUserIdentification
meta:
    title: clearUserIdentification - User Identification
toc:
    depth: 2-3
---

# clearUserIdentification

Clears all user identification data from storage. This function removes user traits from both cookies and localStorage across all `.workleap.com` domains. Without options, both storage layers are cleared.

## Reference

```ts
clearUserIdentification(options?)
```

### Parameters

- `options`: An optional object literal of options:
    - `persistToCookie`: Whether to clear cookies (default: `true`).
    - `persistToLocalStorage`: Whether to clear localStorage (default: `true`).
    - `userTraitsCookieExpiration`: Cookie expiration date (used when clearing).
    - `userTraitsCookieDomain`: Cookie domain (default: `.workleap.com`).
    - `verbose`: Whether or not debug information should be logged to the console.

## Usage

### Basic usage

```ts !#4
import { clearUserIdentification } from "@workleap/user-identification";

// Clear user identification on logout
clearUserIdentification();
```

### With verbose logging

```ts !#4-6
import { clearUserIdentification } from "@workleap/user-identification";

// Clear with debug information
clearUserIdentification({
    verbose: true
});
```

### In logout flow

```tsx !#6-8
import { clearUserIdentification } from "@workleap/user-identification";

function AuthProvider({ children }) {
    const handleLogout = async () => {
        // Clear user identification data
        clearUserIdentification({
            verbose: process.env.NODE_ENV === 'development'
        });
        
        // Clear authentication session
        await logout();
        
        // Redirect to login page
        window.location.href = '/login';
    };
    
    // ... rest of AuthProvider
}
```

### Manual data cleanup

```ts !#5-11
import { clearUserIdentification, isUserIdentified } from "@workleap/user-identification";

function clearAllUserData() {
    // Check if user data exists
    if (isUserIdentified()) {
        console.log("Clearing user identification data...");
        
        clearUserIdentification({
            verbose: true
        });
        
        console.log("User identification data cleared");
    }
}
```

### Privacy compliance

```ts !#7-11
import { clearUserIdentification } from "@workleap/user-identification";

function handlePrivacyRequest() {
    // User requested data deletion
    console.log("Processing privacy data deletion request...");
    
    // Clear cross-domain user identification
    clearUserIdentification({
        verbose: true
    });
    
    // Clear other user data
    localStorage.clear();
    sessionStorage.clear();
    
    console.log("All user data cleared");
}
```

### Organization switching (if needed)

```ts !#9-13
import { clearUserIdentification, identify } from "@workleap/user-identification";

async function switchOrganization(newOrgId: string) {
    // Get current user info
    const currentUser = await getCurrentUserProfile();
    
    // Clear current identification
    clearUserIdentification();
    
    // Fetch new organization data
    const newOrganization = await fetchOrganization(newOrgId);
    
    // Re-identify with new organization context
    identify(currentUser.id, {
        userId: currentUser.id,
        organizationId: newOrganization.id,
        organizationName: newOrganization.name,
        isMigratedToWorkleap: newOrganization.isMigrated,
        isAdmin: currentUser.rolesInOrganization[newOrgId]?.includes('admin'),
        email: currentUser.email,
        name: currentUser.fullName
    });
}
``` 
