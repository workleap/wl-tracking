---
order: 120
label: isUserIdentified
meta:
    title: isUserIdentified - User Identification
toc:
    depth: 2-3
---

# isUserIdentified

Checks if user identification data is available in storage. This function returns `true` if user traits are persisted in cookies or localStorage.

## Reference

```ts
const isIdentified = isUserIdentified()
```

### Returns

`true` if user identification data exists, `false` otherwise.

## Usage

### Basic check

```ts !#3-7
import { isUserIdentified } from "@workleap/user-identification";

if (isUserIdentified()) {
    console.log("User identification data is available");
} else {
    console.log("No user identification data found");
}
```

### Conditional rendering

```tsx !#4-10
import { isUserIdentified, getCurrentUser } from "@workleap/user-identification";

function Dashboard() {
    if (!isUserIdentified()) {
        return <LoginPrompt />;
    }
    
    const userContext = getCurrentUser();
    
    return (
        <div>
            <h1>Welcome to your dashboard, {userContext.name}!</h1>
            {/* Dashboard content */}
        </div>
    );
}
```

### Navigation guard

```tsx !#5-12
import { isUserIdentified } from "@workleap/user-identification";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    if (!isUserIdentified()) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

// Usage
<ProtectedRoute>
    <UserDashboard />
</ProtectedRoute>
```

### Marketing website personalization

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

function MarketingPage() {
    const userContext = getUserIdentificationData();
    
    if (userContext) {
        return `
            <div>
                <h1>Welcome back, ${userContext.firstName}!</h1>
                <p>Ready to continue with ${userContext.organizationName}?</p>
            </div>
        `;
    }
    
    return `
        <div>
            <h1>Discover Workleap</h1>
            <p>Transform your workplace with our integrated platform.</p>
        </div>
    `;
}
```

### Analytics integration

```javascript !#4-18
function getUserIdentificationData() {
    // Same function as above...
    try {
        const localData = localStorage.getItem('workleap-user-traits');
        if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
                return parsed.data;
            }
        }
        // ... cookie fallback logic
    } catch (error) {
        console.warn('Failed to read user data:', error);
    }
    return null;
}

function trackPageView(pageName) {
    const properties = {
        page: pageName,
        timestamp: new Date().toISOString()
    };
    
    const userContext = getUserIdentificationData();
    if (userContext) {
        properties.userId = userContext.userId;
        properties.organizationId = userContext.organizationId;
    }
    
    // Send to analytics
    analytics.track('Page View', properties);
}
``` 
