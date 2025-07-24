# @workleap/user-identification

## 1.0.0

Initial release of the user identification package for cross-domain user identification across Workleap platforms.

### Added

- `identify()` function for identifying users with comprehensive traits
- `getCurrentUser()` function for retrieving current user context
- `clearUserIdentification()` function for clearing user identification
- `isUserIdentified()` function for checking if a user is identified
- `UserContext` class for managing user identification state
- Cross-domain cookie storage using `.workleap.com` domain
- localStorage support for faster access
- Comprehensive user traits based on LogRocket's interface
- TypeScript interfaces for type safety
- Integration with `@workleap/telemetry` for correlation IDs 
