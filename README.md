# Rick Editorial

This repository contains the local implementation of a quiet, static personal editorial blog. The editorial page phase now includes the homepage, post pages, and about page; publishing metadata, RSS, sitemap configuration, and deployment remain separate work.

## Local workflow

Use Node.js 22.12 or newer and pnpm 11.9.0.

```sh
pnpm install
pnpm lint
pnpm check
pnpm build
```

`sharp` is a direct dependency because Astro's optimized local image build runs from the generated project output, where pnpm's isolated transitive optional dependency is not resolvable. It enables the local responsive cover images; its native build is explicitly allowed in `pnpm-workspace.yaml`.

Run those quality commands sequentially because `check` and `build` share Astro's Vite cache. Browser review on desktop and mobile is still pending. No deployment, hosted preview, or GitHub action is part of the current work.

## Content

Blog entries live directly in `src/content/blog/` and use the filename as their route identifier. Keep article files flat so the identifier maps directly to a future `/posts/[slug]` route. The typed `blog` collection accepts this frontmatter:

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

`src/lib/posts.ts` is the single content access layer for future lists, routes, and feeds. It includes drafts by default in development and excludes them by default in production. Posts are sorted by publication date descending, then identifier; an explicitly featured post takes precedence over date for featured placement.

All supplied entries are local sample copy created to exercise schema, ordering, tags, draft filtering, Markdown, and MDX. They are not biographical claims or completed editorial content.

## What comes next

The editorial pages deliberately follow the reference image's `Independent writing` heading hierarchy instead of making the prototype's long introductory sentence a giant headline. The supplied article artwork remains the main visual moment. A future phase will add publishing metadata, RSS, sitemap configuration, robots, and final build-output checks. This repository remains local-only until the owner reviews the UI and chooses how to publish it.
