# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- **Package manager**: pnpm
- **Dev server**: `pnpm start` (runs `eleventy --serve` with hot reload)
- **Production build**: `pnpm build` (runs `eleventy`, outputs to `docs/`)
- **Tests**: `pnpm test` (validates frontmatter in all content `.md` files using ArkType schemas)
- **Node version**: 20

## Architecture

This is a personal portfolio/blog built with **Eleventy (11ty) v3** using **Liquid** templates and **Markdown** content. The site is an ESM project (`"type": "module"` in package.json).

### Directory Layout

- `src/` — Eleventy input directory
  - `_includes/` — Liquid templates (`base.liquid` is the main layout wrapper)
  - `_data/` — Global data files (`coffee.js` fetches from external API, `words.json` for stats)
  - `posts/` — Blog posts (markdown with YAML frontmatter)
  - `pages/` — Project portfolio entries
  - `books/` — Book tracking collection
  - `recently/` — Short "recently" updates
  - `presentations/` — Reveal.js slide decks
  - `coffee/` — Coffee tracking pages
  - `css/style.css` — Single stylesheet (no preprocessor)
  - `assets/img/` — Images organized by project/post
- `docs/` — Eleventy output directory (served by GitHub Pages, committed to git)
- `tests/frontmatter.test.js` — ArkType schema validation for all content frontmatter
- `.eleventy.js` — Main Eleventy config (collections, plugins, filters, image settings)
- `.pages.yml` — Decap CMS schema definitions

### Key Eleventy Config Details (.eleventy.js)

- **Image optimization**: `@11ty/eleventy-img` transforms images to AVIF + JPG at 1200px width with lazy loading
- **Collections**: `posts` (src/posts/*.md), `pages` (src/pages/*.md), `mostRecent` (latest from src/recently/)
- **Filters**: `dateFormat` (moment.js), `secondFormat`, `jsonify`
- **Drafts**: Items with `draft: true` in frontmatter are excluded during `build` mode but shown during `serve`
- **Passthrough copies**: CSS, favicons, Reveal.js dist

### Content Frontmatter Patterns

Posts use: `title`, `date`, `description`, `draft`, optional `tags`

Pages (projects) use: `title`, `date`, `end-date`, `url`, `description`, `problem`, `outcome`, `type` (personal/professional/academic), `client`, `role`, `draft`

Books use: `isbn` (required), `title`, `author`, `status` (to-read/reading/read/abandoned), `date`, `end-date`, `rating` (1-10)

Presentations use: `title`, `date`, `draft`, `description`, `layout: layouts/reveal-layout.liquid`

## Branch & Deployment Workflow

- **`11ty`** — Main branch. All development happens here.
- **`pages-cms`** — Content edits made via Decap CMS (web-based). Merged into `11ty` nightly by GitHub Actions.
- **Daily build** (`.github/workflows/daily-build.yml`): Runs at 10:15 UTC, merges `pages-cms` → `11ty`, builds the site, commits `docs/`, and deploys to GitHub Pages.
- **Output directory `docs/`** is committed to git and served by GitHub Pages at `willwill.blog`.

## External Data

`src/_data/coffee.js` fetches brew/bean data from a Google Apps Script endpoint and caches it using `@11ty/eleventy-fetch`. The cache lives in `.cache/` (gitignored).
