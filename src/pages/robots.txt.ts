import { isLocalSiteUrl, localSiteUrl } from '../config/site';

export function GET(context: { site?: URL }) {
  const siteUrl = context.site ?? localSiteUrl;
  const accessRule = isLocalSiteUrl(siteUrl) ? 'Disallow: /' : 'Allow: /';
  const content = `User-agent: *\n${accessRule}\nSitemap: ${new URL('/sitemap-index.xml', siteUrl).href}\n`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
