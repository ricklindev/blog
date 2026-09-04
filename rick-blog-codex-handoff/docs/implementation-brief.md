# Implementation Brief

## Status

Approved for v1 implementation.

This document defines the technical constraints and delivery expectations for the personal blog.
Visual decisions live in `DESIGN.md` and the approved prototypes.

## 1. Core Stack

Use:

- Astro 7.x
- TypeScript strict mode
- Node.js >= 22.12
- pnpm
- Tailwind CSS 4
- Vercel static deployment

Do not introduce another application framework.

The site is a static, content-first personal blog.
Do not add a database, authentication, CMS, or server runtime in v1.

## 2. Astro Mode

Use Astro as a static site generator.

Do not enable SSR or on-demand rendering.

Do not install `@astrojs/vercel` unless a future requirement explicitly needs server-side features.

Expected deployment flow:

```text
GitHub
  ↓
Vercel Preview Deployment for branches / pull requests
  ↓
Human review
  ↓
Merge to main
  ↓
Production deployment
```

## 3. Content Collections

Use Astro Content Collections with a typed schema.

Content location:

```text
src/content/blog/
```

Example:

```text
src/content/blog/
├─ ai-agent-is-not-the-hard-part.md
├─ learning-to-rest.md
└─ covers/
   ├─ ai-agent-is-not-the-hard-part.png
   └─ learning-to-rest.png
```

Use the article filename as the slug.

Example:

```text
ai-agent-is-not-the-hard-part.md
```

becomes:

```text
/posts/ai-agent-is-not-the-hard-part
```

Do not derive the slug from the article title.

## 4. Article Schema

Required frontmatter:

```yaml
title: string
description: string
publishedAt: date
tags: string[]
draft: boolean
```

Optional:

```yaml
updatedAt: date
cover: image
featured: boolean
```

Example:

```yaml
---
title: "我最近重新理解了 AI Agent"
description: "做 Elva 之後，我開始覺得 Agent 最困難的地方，可能根本不是 Agent。"
publishedAt: 2026-09-03
updatedAt: 2026-09-04
tags:
  - AI
  - Product
cover: "./covers/ai-agent-is-not-the-hard-part.png"
draft: true
featured: false
---
```

Use Astro's image schema helper for cover validation.

`cover` must be optional.

## 5. Markdown / MDX

Default to Markdown.

Use `.mdx` only when an article genuinely needs a custom interactive or embedded component.

v1 content features:

- headings
- paragraphs
- lists
- links
- images
- blockquotes
- fenced code blocks
- Callout
- Figure / Caption

Do not create custom components for standard Markdown features.

Keep the MDX surface area intentionally small.

## 6. Styling

Use Tailwind CSS 4 with the Vite plugin.

Use:

```text
tailwindcss
@tailwindcss/vite
```

Do not use the deprecated Astro Tailwind integration.

Tailwind is an implementation tool, not the source of visual design.

The source of truth for visual decisions is:

1. approved prototypes
2. `DESIGN.md`
3. approved visual references

Do not let Tailwind defaults produce generic SaaS UI.

Avoid defaulting to patterns such as:

```text
rounded-xl
shadow-sm
card grids
pill-heavy interfaces
generic white panels
```

unless the design specification explicitly requires them.

## 7. Typography

Follow `DESIGN.md` and the typography reference image.

Target visual scale:

- Home intro title: approximately 38–42px
- Featured article title: approximately 30–34px
- Article page title: approximately 40–44px
- Article body: approximately 17–18px
- Article H2: approximately 23–25px
- Article list title: approximately 18–19px
- Metadata / navigation: approximately 11–12px

These numbers are targets, not absolute requirements.

The implementation should visually match the approved reference image.

The cover, not oversized typography, should be the dominant visual moment.

Preferred font roles:

- Editorial / body: Newsreader
- UI / metadata: Instrument Sans
- Chinese serif fallback: Noto Serif TC
- Chinese sans fallback: Noto Sans TC

Prefer Astro's font tooling / self-hosted delivery over runtime Google Fonts requests.

## 8. Images

Use Astro image optimization.

Article cover images:

```text
src/content/blog/covers/
```

Use a relative frontmatter reference:

```yaml
cover: "./covers/article-name.png"
```

Preferred source ratio:

```text
3:2 landscape
```

Do not require authors to manually create WebP or AVIF variants.

Let Astro optimize build output.

Article covers should follow the blog cover design rules defined in the repository skill and `DESIGN.md`.

## 9. Open Graph Images

If an article has a cover:

```text
og:image = article cover
```

If no article cover exists:

```text
og:image = default site OG image
```

Do not build an automatic dynamic OG image generator in v1.

## 10. Syntax Highlighting

Use Astro's built-in Shiki integration for fenced Markdown code blocks.

Do not add Prism, Expressive Code, or another code renderer in v1.

A richer code system may be added later only if real articles require features such as:

- filenames
- highlighted lines
- diffs
- annotations

## 11. SEO / Publishing Basics

Implement:

- page title
- meta description
- canonical URL
- Open Graph metadata
- Twitter / X card metadata
- article published time
- article modified time when available
- sitemap
- RSS
- robots.txt
- default site metadata

Use:

- `@astrojs/sitemap`
- `@astrojs/rss`

Do not add a third-party SEO abstraction unless a concrete need appears.

A small reusable head / metadata component is sufficient.

SEO must not dictate the author's writing style.

Do not implement keyword stuffing or SEO-driven article templates.

## 12. Draft Behavior

In development:

```text
draft: true
→ visible
```

In production:

```text
draft: true
→ no article route
→ not listed
→ not included in sitemap
→ not included in RSS
```

Draft behavior should be implemented from the content layer rather than hidden only through CSS or navigation.

## 13. Featured Article

`featured: true` controls homepage featured placement.

Do not couple "featured" strictly to newest publication date.

If no article is explicitly featured, falling back to the newest published article is acceptable.

Only one primary featured article should dominate the homepage.

## 14. Routes

Required v1 routes:

```text
/
/posts/[slug]
/about
/rss.xml
```

Also generate:

```text
sitemap
robots.txt
```

Do not add categories, search, newsletter, comments, login, writing UI, or project pages in v1 unless separately requested.

## 15. Client-side JavaScript

Ship as little browser JavaScript as possible.

Do not hydrate components unless interaction genuinely requires it.

The homepage and standard article pages should work primarily as static HTML + CSS.

## 16. Responsive Behavior

Desktop and mobile are both first-class targets.

Mobile article pages should collapse to one reading column.

Secondary desktop elements such as:

- sticky table of contents
- side notes

may be hidden on smaller screens.

Do not preserve desktop layout at the expense of reading comfort.

## 17. Accessibility

Minimum expectations:

- semantic HTML
- correct heading hierarchy
- keyboard-accessible navigation
- visible focus states
- useful image alt text
- decorative imagery handled appropriately
- acceptable text contrast
- no interaction that depends only on hover
- reduced-motion preference respected if motion is introduced

## 18. Quality Bar

Before calling v1 implementation complete:

### Build

- `pnpm lint` passes
- `pnpm build` passes
- TypeScript has no errors

### Content

- a representative article renders correctly
- Markdown works
- MDX escape hatch works
- code blocks work
- blockquotes work
- Callout works
- Figure / Caption works
- article cover works
- draft filtering works

### Design

Compare implementation against:

- approved homepage prototype
- approved article prototype
- typography reference image
- `DESIGN.md`

Check both desktop and mobile.

Do not consider DOM correctness alone sufficient.

### SEO

Verify:

- title
- description
- canonical
- OG image
- published / updated metadata
- sitemap
- RSS
- robots.txt

### Performance

- no unnecessary client-side JS
- images optimized through Astro
- no obvious Lighthouse performance, accessibility, or SEO regressions

A perfect Lighthouse score is not required.

## 19. Human Review

The final visual and reading-experience approval is manual.

Expected flow:

```text
Codex implementation
  ↓
Vercel Preview Deployment
  ↓
Human review on desktop + mobile
  ↓
Feedback / iteration
  ↓
Approval
  ↓
Merge to main
```

Implementation is not considered finished until the human review passes.

## 20. Out of Scope for v1

Do not implement unless explicitly requested later:

- headless CMS
- database
- authentication
- comments
- newsletter
- search
- dark mode
- automatic publishing workflow
- dynamic OG generation
- analytics dashboard
- automatic AI writing UI
- complex taxonomy
- advanced SEO tooling
- visual regression test suite
- heavy client-side application state

## 21. Engineering Decision Rule

When implementation details are not specified:

1. choose the simpler static solution
2. prefer Astro-native capabilities
3. avoid introducing dependencies for functionality Astro already provides
4. preserve the approved design direction
5. optimize for low authoring friction
6. avoid architecture for hypothetical future requirements

This is a personal publication, not a web application platform.
