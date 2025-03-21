# @workleap/tracking

## 2.2.0

### Minor Changes

- Added `keepalive: true` to not abort the associated request if the page that initiated it is unloaded before the request is complete (<https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive>)

## 2.0.0

### Major Changes

- Replace App parameters by ProductIdentifier. Breaking change: consumers need to pass a product Id and not a product name to buildTrackingFunction

## 1.2.1

### Patch Changes

- Correct main in package.json

## 1.2.0

### Minor Changes

- Enable cookies with fetch request

## 1.1.0

### Minor Changes

- Rename tracking function
