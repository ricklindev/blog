import rss from '@astrojs/rss';
import { localSiteUrl, site } from '../config/site';
import { getPosts, postHref } from '../lib/posts';

export async function GET(context: { site?: URL }) {
  const posts = await getPosts({ includeDrafts: false });

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? localSiteUrl,
    customData: `<language>${site.language}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: postHref(post),
      pubDate: post.data.publishedAt,
      categories: post.data.tags
    }))
  });
}
