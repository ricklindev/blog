export const site = {
  title: 'Rick Lin — Independent Writing',
  description: 'Independent writing about technology, products, work, and the things I am still trying to understand.',
  language: 'en',
  author: 'Rick Lin'
} as const;

export const localSiteUrl = new URL('http://localhost:4321/');

export function isLocalSiteUrl(url: URL): boolean {
  return ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
}
