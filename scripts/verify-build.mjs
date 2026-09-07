import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import console from 'node:console';

const distDirectory = path.resolve('dist');
const siteUrl = new URL(process.env.SITE_URL ?? 'http://localhost:4321/');
const siteOrigin = siteUrl.origin;
const localSite = ['localhost', '127.0.0.1', '[::1]'].includes(siteUrl.hostname);
const publishedSlugs = ['a-year-of-bachata'];
const removedSlugs = [
  'notes-on-learning-in-public',
  'rethinking-the-work-behind-ai-agents',
  'a-quieter-week',
  'leaving-room-for-slow-thinking',
  'draft-mdx-specimen'
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
  for (const slug of removedSlugs) {
    expect(!(await exists(outputPath(`/posts/${slug}/`))), `Removed article output still exists for ${slug}.`);
  }

  const home = await readOutput('/');
  const about = await readOutput('/about/');
  const article = await readOutput('/posts/a-year-of-bachata/');
  const rss = await readOutput('/rss.xml');
  const robots = await readOutput('/robots.txt');
  const sitemapIndex = await readOutput('/sitemap-index.xml');
  const sitemap = await readOutput('/sitemap-0.xml');

  expect(home.includes('<title>Rick Lin — Independent Writing</title>'), 'Homepage title is missing.');
  expect(home.includes('3 min read'), 'The Chinese article reading time is incorrect.');
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
  expect(attribute(tagAttributes(article, 'link').find((tag) => attribute(tag, 'rel') === 'canonical'), 'href') === `${siteOrigin}/posts/a-year-of-bachata/`, 'Article canonical URL is incorrect.');
  expect(metaContent(article, 'property', 'og:type') === 'article', 'Article Open Graph type is incorrect.');
  expect(metaContent(article, 'property', 'og:title') === '轉眼間，就跳了一年的 Bachata — Rick Lin', 'Article Open Graph title is incorrect.');
  expect(metaContent(article, 'property', 'og:description') === '從不敢邀陌生舞伴、把跳舞當成考試，到學會放鬆、聽音樂，並與舞伴連結。這是我跳 Bachata 一年後，想留給自己的五個提醒。', 'Article Open Graph description is incorrect.');
  expect(metaContent(article, 'property', 'article:published_time') === '2026-09-07T00:00:00.000Z', 'Article publication metadata is incorrect.');
  expect(metaContent(article, 'property', 'article:modified_time') === undefined, 'Article without an update date must not emit modified metadata.');
  expect(metaContent(article, 'property', 'og:image')?.startsWith(`${siteOrigin}/_astro/`), 'Covered article must use an optimized Open Graph image.');
  expect(/\.jpe?g$/u.test(metaContent(article, 'property', 'og:image') ?? ''), 'Covered article Open Graph image must be JPEG.');
  expect(metaContent(article, 'name', 'twitter:title') === metaContent(article, 'property', 'og:title'), 'Article Twitter title is incorrect.');
  expect(metaContent(article, 'name', 'twitter:description') === metaContent(article, 'property', 'og:description'), 'Article Twitter description is incorrect.');
  expect(metaContent(article, 'name', 'twitter:image') === metaContent(article, 'property', 'og:image'), 'Article Twitter image is incorrect.');
  await assertMetaImageAsset(metaContent(article, 'property', 'og:image'), 'Article Open Graph image');
  await assertMetaImageAsset(metaContent(article, 'name', 'twitter:image'), 'Article Twitter image');
  expect(article.includes('轉眼間，就跳了一年的 Bachata') && article.includes('這才是跳舞的意義'), 'The Bachata article content did not render.');
  expect(article.includes('在這裡留下一些想法，提醒未來的自己：'), 'The closing reminders introduction did not render.');
  expect(article.includes('<ol>') && article.includes('<li>'), 'The closing reminders did not render as an ordered list.');
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
  expect(removedSlugs.every((slug) => !sitemap.includes(slug) && !rss.includes(slug)), 'A removed article leaked into a publishing output.');
  expect(rss.includes('轉眼間，就跳了一年的 Bachata') && rss.includes('<category>生活</category>') && rss.includes('<category>學習</category>') && rss.includes('<pubDate>'), 'RSS article, categories, or publication date is missing.');
  expect(rss.startsWith('<?xml version="1.0" encoding="UTF-8"?>') && rss.endsWith('</rss>'), 'RSS output is not a complete XML document.');

  const outputFiles = await walk(distDirectory);
  const htmlFiles = outputFiles.filter((file) => file.endsWith('.html'));
  const textFiles = outputFiles.filter((file) => /\.(?:css|html|txt|xml)$/u.test(file));
  const allOutput = await Promise.all(textFiles.map((file) => readFile(file, 'utf8')));
  expect(removedSlugs.every((slug) => !allOutput.join('\n').includes(slug)), 'A removed article slug leaked into production output.');

  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const route = `/${path.relative(distDirectory, file).replace(/index\.html$/u, '').replaceAll(path.sep, '/')}`.replace(/\/$/u, '/') || '/';

    expect(!/<script\b/iu.test(html), `Unexpected browser script in ${route}.`);
    await assertLocalTargets(html, route);
  }

  const responsiveImagePages = ['/', '/posts/a-year-of-bachata/'];
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
