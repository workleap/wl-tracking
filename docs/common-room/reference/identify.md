---
order: 90
label: identify
meta:
    title: identify - Common Room
toc:
    depth: 2-3
---

# identify

Identify a [Common Room](https://www.commonroom.io/) user session using an email address. Once identified, any previous anonymous traces that share the same user id and session id will be linked to the email address. Additionally, any existing data associated with that email address will be attached to the current session.

## Reference

```ts
identify(emailAddress);
```

### Parameters

- `emailAddress`: The user email address.

### Returns

Nothing

## Usage

```ts
import { identify } from "@workleap/common-room";

identify("johndoe@contoso.com");
```

