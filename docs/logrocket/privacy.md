---
order: 90
label: Privacy
---

# Privacy

By default, this instrumentation hides a wide range of Personally Identifiable Information (PII) from session replays to protect user privacy:

- **DOM sanitization**: [LogRocket's DOM sanitization](https://docs.logrocket.com/reference/dom) to hide sensitive text elements from session replays. To allow specific content to appear, add the `data-public` attribute to the elements you want to expose.
- **Network sanitization**: [LogRocket's network data sanitization](https://docs.logrocket.com/reference/network) is used to strip sensitive information from request/response headers and body from session replays.
- **URL sanitization**: [LogRocket's URLs sanitization](https://docs.logrocket.com/reference/browser) is used to strip sensitive information from URLs' query parameters.

### Record elements

Use `data-public` to explicitly allow LogRocket to record the content of an element. When this attribute is present, the content inside the element, including child elements, will be captured in the session replay:

```html !#1
<div data-public>
    This text will be visible in the session replay.
</div>
```

### Block elements

To prevent an element and its child elements from being recorded, use the `data-private` attribute.. This is especially useful when you want to selectively exclude sensitive parts of an element tree while allowing others to be captured.

```html !#1,6
<div data-public>
    <ul>
        <li>Page 1</li>
        <li>Page 2</li>
    </ul>
    <div data-private>
        This text will be not be visible in the session replay.
    </div>
</div>
```
