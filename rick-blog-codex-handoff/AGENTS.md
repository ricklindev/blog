# Repository Instructions

This repository is a personal editorial blog.

## Before implementation or UI work

Read, in order:

1. `DESIGN.md`
2. `docs/implementation-brief.md`
3. `prototypes/home.html`
4. `prototypes/article.html`
5. `references/typography-reference.png`

## Source-of-truth priority

If references conflict:

1. Use `references/typography-reference.png` for overall typography scale, density, and visual restraint.
2. Use the HTML prototypes for approved page composition.
3. Use `DESIGN.md` for reusable design rules and design judgment.
4. Use `docs/implementation-brief.md` for technical constraints.
5. Treat external references as inspiration only.

## Product intent

The site is a quiet personal publication for technical and non-technical writing.

The writing is the product.

Keep the implementation simple and static. Do not add product features unless they are required by the task.

## UI behavior

- Reading comfort is the highest priority.
- Prefer typography and whitespace over decoration.
- The cover image, not oversized typography, should be the primary visual moment.
- Do not introduce card-heavy layouts.
- Do not introduce generic SaaS, developer-portfolio, or AI landing-page patterns.
- Do not add gradients, glassmorphism, oversized rounded cards, or decorative animation.
- Do not increase headline scale beyond the approved reference without explicit instruction.
- Use article cover artwork as the primary source of visual color.
- When uncertain, choose the quieter solution.

## Development behavior

- Prefer Astro-native capabilities.
- Reuse existing patterns before creating abstractions.
- Avoid unnecessary dependencies.
- Keep changes scoped to the requested task.
- Preserve accessibility and responsive reading behavior.
- Do not architect for hypothetical future requirements.
- If implementation constraints require deviating from the prototypes, preserve the visual intent and document the reason.

## Completion

Implementation is not finished until:

1. automated quality checks pass,
2. a Vercel Preview Deployment is available,
3. the implementation has been manually reviewed on desktop and mobile.
