import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import console from 'node:console';

const distDirectory = path.resolve('dist');
const siteUrl = new URL(process.env.SITE_URL ?? 'http://localhost:4321/');
const siteOrigin = siteUrl.origin;
const localSite = ['localhost', '127.0.0.1', '[::1]'].includes(siteUrl.hostname);
const publishedSlugs = [
  'notes-on-learning-in-public',
  'rethinking-the-work-behind-ai-agents',
  'a-quieter-week',
  'leaving-room-for-slow-thinking'
];

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function tagAttributes(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'giu')) ?? [];
}

function attribute(tag, name) {
  return new RegExp(`\\s${name}=(["'])(.*?)\\1`, 'iu').exec(tag)?.[2];
}

function metaContent(html, name, value) {
  const tag = tagAttributes(html, 'meta').find((candidate) => attribute(candidate, name) === value);

  return tag ? attribute(tag, 'content') : undefined;
}

function outputPath(pathname) {
  const decodedPathname = decodeURIComponent(pathname);

  if (decodedPathname === '/') {
    return path.join(distDirectory, 'index.html');
  }

  if (path.extname(decodedPathname)) {
    return path.join(distDirectory, decodedPathname);
  }

  return path.join(distDirectory, decodedPathname, 'index.html');
}

async function readOutput(pathname) {
  return readFile(outputPath(pathname), 'utf8');
}

async function exists(pathname) {
  try {
    await access(pathname);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);

    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  }));

  return paths.flat();
}

async function assertLocalTargets(html, pagePathname) {
  const targetTags = [...tagAttributes(html, 'a'), ...tagAttributes(html, 'link'), ...tagAttributes(html, 'img')];

  for (const tag of targetTags) {
    const target = attribute(tag, tag.startsWith('<img') ? 'src' : 'href');

    if (!target || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('data:')) {
      continue;
    }

    const url = new URL(target, `${siteOrigin}${pagePathname}`);
    if (url.origin !== siteOrigin) {
      continue;
    }

    const targetPath = outputPath(url.pathname);
    expect(await exists(targetPath), `Missing local target ${target} referenced by ${pagePathname}.`);

    if (url.hash) {
      const targetDocument = await readFile(targetPath, 'utf8');
      expect(targetDocument.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing fragment ${url.hash} referenced by ${pagePathname}.`);
    }
  }

  for (const imageTag of tagAttributes(html, 'img')) {
    expect(attribute(imageTag, 'width') && attribute(imageTag, 'height'), `An optimized image on ${pagePathname} is missing dimensions.`);
    const srcset = attribute(imageTag, 'srcset');

    if (srcset) {
      for (const source of srcset.split(',')) {
        const sourceUrl = source.trim().split(/\s+/u)[0];
        expect(await exists(outputPath(new URL(sourceUrl, siteOrigin).pathname)), `Missing srcset asset ${sourceUrl}.`);
      }
    }
  }
}

async function assertMetaImageAsset(imageUrl, label) {
  expect(imageUrl, `${label} is missing.`);
  const url = new URL(imageUrl);

  expect(url.origin === siteOrigin, `${label} must be an absolute local-site URL.`);
  expect(await exists(outputPath(url.pathname)), `${label} references a missing generated asset.`);
}

async function main() {
  expect(await exists(distDirectory), 'dist/ is missing. Run pnpm build before pnpm test:build.');

  const requiredPaths = ['/', '/about/', '/rss.xml', '/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml'];
  for (const pathname of requiredPaths) {
    expect(await exists(outputPath(pathname)), `Missing required build output ${pathname}.`);
  }

  for (const slug of publishedSlugs) {
    expect(await exists(outputPath(`/posts/${slug}/`)), `Missing published article output for ${slug}.`);
  }
  expect(!(await exists(outputPath('/posts/draft-mdx-specimen/'))), 'A draft article was emitted in production output.');

  const home = await readOutput('/');
  const about = await readOutput('/about/');
  const article = await readOutput('/posts/rethinking-the-work-behind-ai-agents/');
  const noCoverArticle = await readOutput('/posts/notes-on-learning-in-public/');
  const chineseSampleArticle = await readOutput('/posts/leaving-room-for-slow-thinking/');
  const rss = await readOutput('/rss.xml');
  const robots = await readOutput('/robots.txt');
  const sitemapIndex = await readOutput('/sitemap-index.xml');
  const sitemap = await readOutput('/sitemap-0.xml');

  expect(home.includes('<title>Rick Lin — Independent Writing</title>'), 'Homepage title is missing.');
  expect(about.includes('<title>About — Rick Lin</title>'), 'About title is missing.');
  expect(metaContent(home, 'name', 'description') === 'Independent writing about technology, products, work, and the things I am still trying to understand.', 'Homepage description is incorrect.');
  expect(attribute(tagAttributes(home, 'link').find((tag) => attribute(tag, 'rel') === 'canonical'), 'href') === `${siteOrigin}/`, 'Homepage canonical URL is incorrect.');
  expect(attribute(tagAttributes(home, 'link').find((tag) => attribute(tag, 'type') === 'application/rss+xml'), 'href') === `${siteOrigin}/rss.xml`, 'RSS autodiscovery is missing or not absolute.');
  expect(metaContent(home, 'property', 'og:title') === 'Rick Lin — Independent Writing', 'Homepage Open Graph title is incorrect.');
  expect(metaContent(home, 'property', 'og:description') === metaContent(home, 'name', 'description'), 'Homepage Open Graph description is incorrect.');
  expect(metaContent(home, 'property', 'og:image') === `${siteOrigin}/og-default.png`, 'Homepage must use the default Open Graph image.');
  expect(metaContent(home, 'name', 'twitter:card') === 'summary_large_image', 'Homepage Twitter card is incorrect.');
  expect(metaContent(home, 'name', 'twitter:title') === 'Rick Lin — Independent Writing', 'Homepage Twitter title is incorrect.');
  expect(metaContent(home, 'name', 'twitter:description') === metaContent(home, 'name', 'description'), 'Homepage Twitter description is incorrect.');
  expect(metaContent(home, 'name', 'twitter:image') === `${siteOrigin}/og-default.png`, 'Homepage must use the default Twitter image.');
  await assertMetaImageAsset(metaContent(home, 'property', 'og:image'), 'Homepage Open Graph image');
  await assertMetaImageAsset(metaContent(home, 'name', 'twitter:image'), 'Homepage Twitter image');
  expect(attribute(tagAttributes(article, 'link').find((tag) => attribute(tag, 'rel') === 'canonical'), 'href') === `${siteOrigin}/posts/rethinking-the-work-behind-ai-agents/`, 'Article canonical URL is incorrect.');
  expect(metaContent(article, 'property', 'og:type') === 'article', 'Article Open Graph type is incorrect.');
  expect(metaContent(article, 'property', 'og:title') === 'Rethinking the Work Behind AI Agents — Rick Lin', 'Article Open Graph title is incorrect.');
  expect(metaContent(article, 'property', 'og:description') === 'The hard part of an agent is often understanding the work before trying to automate it.', 'Article Open Graph description is incorrect.');
  expect(metaContent(article, 'property', 'article:published_time') === '2026-09-03T00:00:00.000Z', 'Article publication metadata is incorrect.');
  expect(metaContent(article, 'property', 'article:modified_time') === '2026-09-04T00:00:00.000Z', 'Article modification metadata is incorrect.');
  expect(metaContent(article, 'property', 'og:image')?.startsWith(`${siteOrigin}/_astro/`), 'Covered article must use an optimized Open Graph image.');
  expect(/\.jpe?g$/u.test(metaContent(article, 'property', 'og:image') ?? ''), 'Covered article Open Graph image must be JPEG.');
  expect(metaContent(article, 'name', 'twitter:title') === metaContent(article, 'property', 'og:title'), 'Article Twitter title is incorrect.');
  expect(metaContent(article, 'name', 'twitter:description') === metaContent(article, 'property', 'og:description'), 'Article Twitter description is incorrect.');
  expect(metaContent(article, 'name', 'twitter:image') === metaContent(article, 'property', 'og:image'), 'Article Twitter image is incorrect.');
  await assertMetaImageAsset(metaContent(article, 'property', 'og:image'), 'Article Open Graph image');
  await assertMetaImageAsset(metaContent(article, 'name', 'twitter:image'), 'Article Twitter image');
  expect(metaContent(noCoverArticle, 'property', 'og:image') === `${siteOrigin}/og-default.png`, 'Article without a cover must use the default Open Graph image.');
  await assertMetaImageAsset(metaContent(noCoverArticle, 'property', 'og:image'), 'No-cover article Open Graph image');
  expect(metaContent(noCoverArticle, 'property', 'article:modified_time') === undefined, 'Article without an update date must not emit modified metadata.');
  expect(article.includes('class="astro-code'), 'The representative TypeScript fence was not highlighted by Shiki.');
  expect(article.includes('<blockquote>'), 'Markdown blockquote did not render.');
  expect(article.includes('<ul>'), 'Markdown list did not render.');
  expect(article.includes('id="the-real-challenge-is-defining-the-problem"'), 'Markdown heading did not render with a fragment target.');
  expect(noCoverArticle.includes('class="callout"'), 'MDX Callout did not render.');
  expect(tagAttributes(noCoverArticle, 'figcaption').length > 0, 'MDX Figure caption did not render.');
  expect(chineseSampleArticle.includes('留一點時間，給還沒想清楚的事') && chineseSampleArticle.includes('不要把每個空檔都塞滿'), 'Traditional Chinese sample article content did not render.');
  expect(metaContent(home, 'name', 'robots') === (localSite ? 'noindex, nofollow' : undefined), 'Homepage indexability does not match the configured site URL.');
  expect(robots === `User-agent: *\n${localSite ? 'Disallow: /' : 'Allow: /'}\nSitemap: ${siteOrigin}/sitemap-index.xml\n`, 'robots.txt does not match the configured site URL.');
  expect(sitemapIndex.includes(`${siteOrigin}/sitemap-0.xml`), 'Sitemap index does not reference the sitemap payload.');

  const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]);
  const expectedLocations = [
    `${siteOrigin}/`,
    `${siteOrigin}/about/`,
    ...publishedSlugs.map((slug) => `${siteOrigin}/posts/${slug}/`)
  ];
  expect(sitemapLocations.length === expectedLocations.length && expectedLocations.every((location) => sitemapLocations.includes(location)), 'Sitemap must contain only the homepage, about page, and published article routes.');
  expect(!sitemap.includes('draft-mdx-specimen') && !rss.includes('Draft MDX Specimen'), 'A draft was included in a publishing output.');
  expect(rss.indexOf('Notes on Learning in Public') < rss.indexOf('Rethinking the Work Behind AI Agents'), 'RSS entries are not ordered by publication date.');
  expect(rss.includes('<category>Learning</category>') && rss.includes('<pubDate>'), 'RSS categories or publication dates are missing.');
  expect(rss.startsWith('<?xml version="1.0" encoding="UTF-8"?>') && rss.endsWith('</rss>'), 'RSS output is not a complete XML document.');

  const outputFiles = await walk(distDirectory);
  const htmlFiles = outputFiles.filter((file) => file.endsWith('.html'));
  const textFiles = outputFiles.filter((file) => /\.(?:css|html|txt|xml)$/u.test(file));
  const allOutput = await Promise.all(textFiles.map((file) => readFile(file, 'utf8')));
  expect(!allOutput.join('\n').includes('draft-mdx-specimen'), 'Draft slug leaked into production output.');

  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const route = `/${path.relative(distDirectory, file).replace(/index\.html$/u, '').replaceAll(path.sep, '/')}`.replace(/\/$/u, '/') || '/';

    expect(!/<script\b/iu.test(html), `Unexpected browser script in ${route}.`);
    await assertLocalTargets(html, route);
  }

  const responsiveImagePages = ['/', '/posts/rethinking-the-work-behind-ai-agents/'];
  for (const pathname of responsiveImagePages) {
    const html = await readOutput(pathname);
    expect(tagAttributes(html, 'img').some((image) => attribute(image, 'srcset')), `Responsive cover image variants are missing from ${pathname}.`);
  }

  expect(!/fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net/iu.test(allOutput.join('\n')), 'A remote font reference was emitted.');
  console.log(`Verified ${htmlFiles.length} static HTML documents and publishing outputs.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
