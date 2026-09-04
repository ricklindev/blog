---
version: alpha
name: Rick Editorial
description: Quiet independent editorial publication with restrained typography, warm paper, and original one-ink cover imagery.
colors:
  ink: "#171714"
  muted: "#6F6B63"
  paper: "#F6F3EA"
  line: "#D8D2C7"
  cobalt: "#2347B8"
  terracotta: "#C65F38"
  botanical: "#008A4B"
  aubergine: "#63365F"
  charcoal: "#30343A"
typography:
  home-display:
    fontFamily: "Newsreader, Noto Serif TC, Songti TC, serif"
    fontSize: 42px
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: -0.025em
  featured-title:
    fontFamily: "Newsreader, Noto Serif TC, Songti TC, serif"
    fontSize: 34px
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: -0.02em
  article-title:
    fontFamily: "Newsreader, Noto Serif TC, Songti TC, serif"
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: -0.02em
  article-body:
    fontFamily: "Newsreader, Noto Serif TC, Songti TC, serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: 0em
  article-h2:
    fontFamily: "Instrument Sans, Noto Sans TC, PingFang TC, sans-serif"
    fontSize: 25px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.015em
  list-title:
    fontFamily: "Newsreader, Noto Serif TC, Songti TC, serif"
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.005em
  ui:
    fontFamily: "Instrument Sans, Noto Sans TC, PingFang TC, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  metadata:
    fontFamily: "Instrument Sans, Noto Sans TC, PingFang TC, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.1em
rounded:
  none: 0px
  subtle: 2px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  3xl: 96px
---

# Overview

A quiet independent editorial publication.

The visual character combines:

- Anthropic Newsroom's editorial hierarchy and generous whitespace
- achin.me's personal simplicity and low information density
- original one-ink editorial print covers inspired by mono-color visual grammar

The site should feel thoughtful, calm, personal, contemporary, and deliberately restrained.

The writing is always the product.

# Visual Theme & Atmosphere

Think **independent journal / personal essay publication**, not startup landing page.

The interface should feel designed through restraint:

- warm paper rather than pure white
- near-black ink rather than hard black
- fine rules
- large areas of breathing room
- modest typography scale
- strong editorial imagery
- almost no elevation
- almost no decorative UI

One dominant visual event per screen is enough.

# Reference Priority

For overall typography scale and density, use:

`references/typography-reference.png`

For page composition, use:

- `prototypes/home.html`
- `prototypes/article.html`

The prototypes are approved visual references.

If an external reference conflicts with the approved references, follow the approved references.

# Colors

Use `{colors.paper}` as the default canvas and `{colors.ink}` as the primary text color.

Use `{colors.muted}` for metadata and secondary information.
Use `{colors.line}` for quiet structural separation.

The interface itself should remain nearly monochrome.

Accent colors are primarily an illustration system for covers, not a persistent category-color system.

Avoid using several accent colors on one screen merely to create variety.

# Typography

Typography carries most of the site's personality, but should remain restrained.

Headlines establish hierarchy without dominating the page.

**The cover image, not oversized typography, should be the primary visual moment.**

Approved approximate scale:

- Home intro title: 38–42px
- Featured article title: 30–34px
- Article page title: 40–44px
- Article body: 17–18px
- Article H2: 23–25px
- Article list title: 18–19px
- Metadata / navigation: 11–12px

These are targets rather than rigid pixel requirements.
The rendered page should visually match `references/typography-reference.png`.

Use serif typography for:

- editorial headlines
- article titles
- article body copy
- blockquotes

Use sans serif for:

- navigation
- metadata
- labels
- H2 / H3 inside articles
- structural UI

Preferred roles:

- Editorial: Newsreader
- UI: Instrument Sans
- Chinese serif fallback: Noto Serif TC
- Chinese sans fallback: Noto Sans TC

Do not use huge startup-style hero typography.

# Layout

Global content width: approximately 1180px.

Article reading width: approximately 720–780px.

Whitespace is part of the design.

Prefer asymmetry where it creates editorial tension, but never at the cost of reading comfort.

## Homepage hierarchy

1. Minimal header
2. Quiet personal introduction
3. One featured article with a large cover
4. Simple editorial article list
5. Minimal footer

Older content becomes progressively quieter.

Do not turn every article into a thumbnail card.

## Article hierarchy

1. Metadata
2. Moderate title
3. Short dek
4. Large cover
5. Narrow reading column
6. Optional lightweight desktop TOC / notes
7. Quiet Previous / Next ending

On mobile, collapse to a single reading column.

# Elevation & Depth

The interface is flat.

Do not use:

- shadows as hierarchy
- glass effects
- gradients
- floating panels
- layered card elevation

Depth should come from:

- typography
- spacing
- scale
- editorial image composition

# Shapes

Prefer square corners or `{rounded.subtle}`.

Avoid:

- large rounded cards
- capsules everywhere
- floating containers
- dashboard panels

Rules and whitespace should separate content more often than boxes.

# Components

## Header

Minimal text navigation.

No large logo treatment.
No sticky application-style navigation unless a real need appears.

## Introduction

Short and personal.

It should establish voice without behaving like a marketing hero.

## Featured Article

One dominant editorial cover paired with restrained text.

The cover carries the visual weight.

Do not create multiple competing featured stories above the fold.

## Article List

Use:

- date
- lightweight category metadata
- title
- optional reading time
- horizontal rules
- whitespace

Do not use a card grid by default.

## Article Header

Metadata → title → dek → cover.

The title should feel like a personal essay title, not a corporate campaign headline.

## Article Cover

Preferred ratio: 3:2 landscape.

Visual direction:

- one ink preferred
- warm / neutral paper substrate
- halftone, risograph, photocopy, or mechanical print texture
- 30–50% active negative space
- one dominant visual idea
- asymmetrical editorial composition
- original artwork only
- no generated article title
- no logo
- no fake publication text
- no UI text

HTML renders all typography.

## Article Body

Use `{typography.article-body}` as the baseline.

Support:

- paragraphs
- H2 / H3
- lists
- images
- blockquotes
- restrained callouts
- code blocks
- standard links
- figure / caption

Body text should remain the visual center.

## Blockquote

Simple editorial treatment, usually a vertical rule.

Do not turn quotes into colored cards.

## Callout

Use sparingly.

Prefer a ruled treatment over a rounded panel.

## Code

Functional, compact, and readable.

A dark neutral code surface is acceptable.

Code should not become the site's visual identity.

## Article Ending

Previous / Next is enough.

Avoid large recommendation grids, newsletter popups, or content carousels in v1.

# Responsive Behavior

Desktop and mobile are first-class.

On small screens:

- use a single reading column
- hide secondary TOC / side notes if needed
- preserve comfortable margins
- preserve the restrained typography hierarchy
- do not shrink body text below comfortable reading size

# Motion

Motion is optional and extremely restrained.

Allowed:

- subtle opacity change
- small hover response
- nearly invisible transition

Avoid:

- parallax
- scroll-triggered spectacle
- animated gradients
- floating shapes
- elaborate page transitions

The site should feel complete with animation disabled.

# Do's and Don'ts

## Do

- prioritize reading comfort
- use whitespace aggressively
- create hierarchy through typography
- keep one strong visual moment per screen
- let cover artwork carry most of the color
- preserve the approved typography density
- use simple rules instead of boxes
- let empty space remain empty

## Don't

- create card soup
- use glassmorphism
- use purple-blue AI gradients
- use neon developer aesthetics
- make monospace the main visual language
- overuse pills or badges
- add decorative animation
- center every composition
- oversize headlines
- introduce generic component-library aesthetics
- introduce a new visual pattern without a concrete reason

# Iteration Guide

When the exact answer is not specified:

1. Remove UI before adding UI.
2. Use whitespace or typography before introducing a container.
3. Article content has priority over navigation and metadata.
4. Do not automatically turn repeated content into cards.
5. Keep one dominant visual moment per viewport.
6. Let cover artwork carry color; keep the interface quiet.
7. Prefer larger spacing before adding more dividers.
8. Reuse an existing visual pattern before inventing a new one.
9. If a prototype and an external reference conflict, follow the prototype.
10. If typography feels too loud, reduce scale before changing weight or color.
11. If the page feels empty, first ask whether that emptiness is intentional.
12. Never add UI solely to make the page feel more “designed.”

# Known Gaps

The following may be refined during implementation and human review:

- exact font metrics after real font loading
- final breakpoint values
- exact mobile spacing
- TOC behavior
- details of Figure / Caption
- final default OG image
- exact cover-production workflow

These gaps must not change the core visual character.
