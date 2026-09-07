import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export interface GetPostsOptions {
  includeDrafts?: boolean;
}

export function isVisiblePost(post: BlogPost, includeDrafts: boolean): boolean {
  return includeDrafts || !post.data.draft;
}

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((first, second) => {
    const publicationDifference = second.data.publishedAt.valueOf() - first.data.publishedAt.valueOf();

    if (publicationDifference !== 0) {
      return publicationDifference;
    }

    return first.id < second.id ? -1 : first.id > second.id ? 1 : 0;
  });
}

export async function getPosts(options: GetPostsOptions = {}): Promise<BlogPost[]> {
  const includeDrafts = options.includeDrafts ?? import.meta.env.DEV;
  const posts = await getCollection('blog');

  return sortPosts(posts.filter((post) => isVisiblePost(post, includeDrafts)));
}

export async function getFeaturedPost(options: GetPostsOptions = {}): Promise<BlogPost | undefined> {
  const posts = await getPosts(options);

  return posts.find((post) => post.data.featured) ?? posts[0];
}

export function postHref(post: Pick<BlogPost, 'id'> | string): string {
  const id = typeof post === 'string' ? post : post.id;

  return `/posts/${encodeURIComponent(id)}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC'
  }).format(date);
}

export function readingTime(post: Pick<BlogPost, 'body'> | string): number {
  const body = typeof post === 'string' ? post : post.body ?? '';
  const hanCharacters = body.match(/\p{Script=Han}/gu)?.length ?? 0;
  const nonHanWords = body
    .replace(/\p{Script=Han}/gu, ' ')
    .match(/[\p{Letter}\p{Number}]+(?:[’'-][\p{Letter}\p{Number}]+)*/gu)?.length ?? 0;

  return Math.max(1, Math.ceil(hanCharacters / 500 + nonHanWords / 225));
}
