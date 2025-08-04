# @workleap/mixpanel

## Usage

View the [user's documentation](https://workleap.github.io/wl-telemetry/).

## MSW Integration

This package exports MSW handlers for testing. You can import mock data and handlers:

```typescript
// For MSW handlers
import { getMixpanelHandlers } from "@workleap/mixpanel/msw";

// For mock data only (no MSW dependency)
import { MixpanelApiMocks } from "@workleap/mixpanel/mocks";
```

See the [MSW integration guide](https://workleap.github.io/wl-telemetry/) for detailed examples.

## 🤝 Contributing

View the [contributor's documentation](../../CONTRIBUTING.md).

## License

Copyright © 2024, Workleap. This code is licensed under the Apache License, Version 2.0. You may obtain a copy of this license at https://github.com/workleap/workleap-license/blob/master/LICENSE.
