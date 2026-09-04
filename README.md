# Rick Editorial

This repository contains the local implementation of a quiet, static personal editorial blog. The page and publishing work is intentionally phased; this foundation does not claim to implement the final pages, routes, metadata, or deployment workflow.

## Local workflow

Use Node.js 22.12 or newer and pnpm 11.9.0.

```sh
pnpm install
pnpm lint
pnpm check
pnpm build
```

Run those quality commands sequentially because `check` and `build` share Astro's Vite cache. Local UI review will happen manually after the later page phases. No deployment, hosted preview, or GitHub action is part of the current work.

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

The current entries are local sample copy created to exercise schema, ordering, tags, draft filtering, Markdown, and MDX. They are not biographical claims or completed editorial content.

## What comes next

Future phases will implement the approved page composition and visual system, static article and utility routes, publishing metadata, and a manual desktop/mobile review. This repository remains local-only until the owner reviews the UI and chooses how to publish it.
