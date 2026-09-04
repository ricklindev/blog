// @ts-check
import process from 'node:process';
import { URL } from 'node:url';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const defaultSiteUrl = 'http://localhost:4321/';

function getSiteUrl() {
  const value = process.env.SITE_URL ?? defaultSiteUrl;
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error('SITE_URL must be a complete http or https origin, for example https://example.com/.');
  }

  if (
    !['http:', 'https:'].includes(url.protocol)
    || url.pathname !== '/'
    || url.search
    || url.hash
    || url.username
    || url.password
  ) {
    throw new Error('SITE_URL must be a complete http or https origin without a path, query, hash, or credentials.');
  }

  return url.href;
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: getSiteUrl(),
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;

        return pathname === '/' || pathname === '/about/' || pathname.startsWith('/posts/');
      }
    })
  ]
});
