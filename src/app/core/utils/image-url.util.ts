/**
 * Converts a server-relative asset path (e.g. "uploads\\Foo.png", possibly with
 * doubled backslashes/slashes) into an absolute URL against the given origin.
 */
export function buildAssetUrl(origin: string, path?: string): string {
  if (!path) {
    return '';
  }

  const normalized = path
    .replace(/\\+/g, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/^\/+/, '');

  return `${origin}/${normalized}`;
}
