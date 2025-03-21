// Cannot use URL() because it doesn't support relative base url: https://github.com/whatwg/url/issues/531.
export function resolveApiUrl(path: string, baseUrl: string | undefined) : string {
    return `${baseUrl}${baseUrl!.endsWith("/") ? "" : "/"}${path.startsWith("/") ? path.substring(1) : path}`;
}
