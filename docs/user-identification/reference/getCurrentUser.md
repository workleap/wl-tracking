---
order: 110
label: getCurrentUser
meta:
    title: getCurrentUser - User Identification
toc:
    depth: 2-3
---

# getCurrentUser

Retrieves the current user context from storage. This function reads persisted user identification data from cookies and localStorage.

## Reference

```ts
const userContext = getCurrentUser(options?)
```

### Parameters

- `options`: An optional object literal of options:
    - `persistToCookie`: Whether to read from cookies (default: `true`).
    - `persistToLocalStorage`: Whether to read from localStorage (default: `true`).
    - `userTraitsCookieDomain`: Cookie domain (default: `.workleap.com`).
    - `verbose`: Whether or not debug information should be logged to the console.

### Returns

A `UserContext` object if user identification data exists, `undefined` otherwise.

## Usage

### Basic usage

```ts !#3-7
import { getCurrentUser } from "@workleap/user-identification";

const userContext = getCurrentUser();

if (userContext) {
    console.log(`Current user: ${userContext.userId}`);
    console.log(`Organization: ${userContext.organizationName}`);
} else {
    console.log("No user identification data found");
}
```

### In React component

```tsx !#5-15
import { getCurrentUser } from "@workleap/user-identification";
import { useState, useEffect } from "react";

function UserProfile() {
    const [userContext, setUserContext] = useState(null);
    
    useEffect(() => {
        const context = getCurrentUser();
        setUserContext(context);
    }, []);
    
    if (!userContext) {
        return <div>Please log in</div>;
    }
    
    return (
        <div>
            <h1>Welcome, {userContext.firstName || userContext.name}!</h1>
            <p>Organization: {userContext.organizationName}</p>
        </div>
    );
}
```

### For marketing website personalization

```javascript !#4-26
// Marketing website reads directly from storage (no package needed)
function getUserIdentificationData() {
    try {
        const localData = localStorage.getItem('workleap-user-traits');
        if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
                return parsed.data;
            }
        }
        
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

function PersonalizedHeader() {
    const userContext = getUserIdentificationData();
    
    if (userContext) {
        return `
            <header>
                <h1>Welcome back, ${userContext.firstName}!</h1>
                <p>Continue your journey with ${userContext.organizationName}</p>
                <a href="https://${userContext.product}.workleap.com">
                    Go to ${userContext.product}
                </a>
            </header>
        `;
    }
    
    return '<header><h1>Welcome to Workleap</h1></header>';
}
```

### Error handling

```ts !#3-11
import { getCurrentUser } from "@workleap/user-identification";

try {
    const userContext = getCurrentUser();
    
    if (userContext) {
        // Use user context safely
        console.log("User found:", userContext.userId);
    }
} catch (error) {
    console.error("Failed to retrieve user context:", error);
}
``` 
