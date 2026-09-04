import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: ['*.{md,mdx}', '!covers/**', '!README.{md,mdx}'],
    generateId: ({ entry }) => entry.replace(/\.(?:md|mdx)$/u, '')
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()),
      cover: image().optional(),
      draft: z.boolean(),
      featured: z.boolean().optional()
    })
});

export const collections = { blog };
