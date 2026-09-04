# Rick Editorial

This repository contains the local implementation of a quiet, static personal editorial blog. It includes the homepage, post pages, about page, publishing metadata, RSS, sitemap, robots.txt, and static build-output checks.

## Local workflow

Use Node.js 22.12 or newer and pnpm 11.9.0.

```sh
pnpm install
pnpm lint
pnpm check
pnpm build
pnpm test:build
```

`pnpm verify` runs the same checks sequentially. `sharp` is a direct dependency because Astro's optimized local image build runs from the generated project output, where pnpm's isolated transitive optional dependency is not resolvable. It enables the local responsive cover images; its native build is explicitly allowed in `pnpm-workspace.yaml`.

`pnpm test:build` validates the supplied sample posts and their expected routes, metadata, RSS ordering, social images, sitemap, Markdown, and MDX output. When replacing those sample fixtures with real content, update its explicit fixture assertions in `scripts/verify-build.mjs`.

The local default site URL is `http://localhost:4321/`. It deliberately emits `noindex, nofollow` metadata and a blocking local `robots.txt`, while keeping canonical URLs, RSS, and sitemap output valid for local inspection. Before a public build, provide the final origin explicitly:

```sh
SITE_URL=https://example.com pnpm build
```

`SITE_URL` must be an `http` or `https` origin without a path, query, hash, or credentials. A supplied public origin receives normal indexable metadata and an allowing `robots.txt`; no production domain has been chosen in this repository. The Astro configuration uses the shell environment value directly.

Use `pnpm dev --background` for a manual local review. Browser review on desktop and mobile remains pending. No deployment, hosted preview, or GitHub action has been performed.

## Content

Blog entries live directly in `src/content/blog/` and use the filename as their route identifier. Keep article files flat so the identifier maps directly to `/posts/[slug]/`. The typed `blog` collection accepts this frontmatter:

```yaml
title: string
description: string
publishedAt: date
tags: string[]
draft: boolean
updatedAt: date # optional
cover: "./covers/article.png" # optional local image
featured: boolean # optional
```

Markdown is the default format. Use MDX only when an entry needs the small component escape hatch: `Callout` for a note and `Figure` for semantic media with a caption. The `covers/` directory is excluded from the collection so its artwork and provenance notes are never treated as articles.

`src/lib/posts.ts` is the single content access layer for lists, routes, and feeds. It includes drafts by default in development and excludes them from production pages, RSS, and sitemap output. Posts are sorted by publication date descending, then identifier; an explicitly featured post takes precedence over date for featured placement. A draft can be reviewed locally at `/posts/draft-mdx-specimen/` while development mode is running.

Place cover artwork beside the posts in `src/content/blog/covers/` and reference it with `cover: "./covers/article.png"`. Astro generates responsive cover variants for pages; the metadata component creates a 1200px JPEG Open Graph version for covered articles. Posts without a cover use `public/og-default.png` as the fallback social image.

The self-hosted Newsreader variable font serves editorial titles and body copy. Instrument Sans serves navigation and metadata. Neither requires a remote font request.

## Local review checklist

- Review `/`, `/about/`, and each published `/posts/[slug]/` route at desktop and mobile widths.
- Confirm the featured cover, article cover, no-cover article, table of contents, Markdown rendering, and MDX Callout/Figure read comfortably.
- In local development, check `/posts/draft-mdx-specimen/`; it must disappear from a production build.
- Inspect `/rss.xml`, `/robots.txt`, and `/sitemap-index.xml` after building.

All supplied entries are local sample copy created to exercise schema, ordering, tags, draft filtering, Markdown, and MDX. They are not biographical claims or completed editorial content.

The editorial pages follow the reference image's `Independent writing` hierarchy instead of making the prototype's introductory sentence a giant headline. The supplied artwork remains the primary visual moment. Design sources remain in [`rick-blog-codex-handoff/`](rick-blog-codex-handoff/), including the approved [design direction](rick-blog-codex-handoff/DESIGN.md), [implementation brief](rick-blog-codex-handoff/docs/implementation-brief.md), and [page prototypes](rick-blog-codex-handoff/prototypes/). The project remains local-only until the owner reviews the UI and chooses how to publish it.
