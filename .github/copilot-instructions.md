# Mona Mayhem — Project Guidelines

Retro arcade-themed GitHub Contribution Battle Arena built with Astro v5 (SSR, Node standalone adapter). The app compares two GitHub users' contribution graphs in a game-style UI.

## Build & Dev Commands

```bash
npm run dev       # start dev server (http://localhost:4321)
npm run build     # production build
npm run preview   # preview production build locally
```

## Architecture

```
src/
  pages/
    index.astro                         # main page (the battle arena UI)
    api/contributions/[username].ts     # SSR API route — fetches GitHub contribution data
public/                                 # static assets (favicon, etc.)
docs/                                   # reference HTML/CSS for the finished design
```

- **SSR only** — `output: 'server'` in `astro.config.mjs`; all pages and API routes render on request.
- **API routes** must export named handlers (`GET`, `POST`, etc.) typed as `APIRoute` from `astro`. Set `export const prerender = false` explicitly.
- **GitHub contributions endpoint**: `https://github.com/{username}.contribs` — scrape or proxy this for contribution data.

## Astro Best Practices

- Use `.astro` files for pages and layout components; TypeScript for API routes and utilities.
- Frontmatter (`---` fences) handles server-side logic; template below handles rendering.
- Fetch data in the component frontmatter for pages, not in client scripts.
- Styles live in `public/styles/arena.css` (served as a static asset). Link it from `<head>` with `<link rel="stylesheet" href="/styles/arena.css" />`. Do not use scoped `<style>` blocks in `.astro` files.
- The `Press Start 2P` font (retro gaming) is the intended typeface — load via Google Fonts in the `<head>`.
- Keep API routes thin: validate params, fetch, return `new Response(JSON.stringify(...), { headers: { 'Content-Type': 'application/json' } })`.

## Design Guide

### Theme

Dark retro arcade. The UI should feel like a CRT arcade cabinet — dark backgrounds, neon glow, pixel typography, and subtle screen-wear effects.

### Colors

```
--bg:           #0a0a1a   /* near-black page background */
--surface:      #0f0f1f   /* card / input backgrounds */
--border:       #1e1e3f   /* default borders */
--text:         #e6edf3   /* primary text */
--text-muted:   #7a8499   /* labels, secondary text */
--green:        #5fed83   /* primary accent — neon green */
--green-hover:  #7fff9f   /* green on hover/focus */
--purple:       #8a2be2   /* secondary accent — electric purple */
```

Contribution grid levels (dark-to-bright green):

```
--level-0: #1a1a2e   /* empty day */
--level-1: #1a472a
--level-2: #2d6a4f
--level-3: #40c463
--level-4: #5fed83   /* most active day */
```

### Typography

- **Font**: `Press Start 2P` from Google Fonts — used for all text, `font-size: 10px` base (1rem = 10px).
- Titles: `2.4rem`, labels: `0.9rem`, body/stats: `0.85–1rem`.
- Line-height: `1.8` for readable multi-line text at small pixel sizes.

### Animation Style

All animations should feel like a CRT arcade screen — glowing, flickering, never perfectly smooth.

| Element                 | Animation                                                           | Timing                          |
| ----------------------- | ------------------------------------------------------------------- | ------------------------------- |
| Page body               | `crt-flicker` — opacity dips at irregular steps                     | `6s steps(1) infinite`          |
| Title `h1`              | `neon-pulse` — glow breathes + `elec-flicker` — sharp cuts/stutters | `4s alternate` / `7s steps(1)`  |
| Input float-in          | `float-in` — slides up from 20px, fades in                          | `0.6s ease forwards`, staggered |
| Battle button (loading) | `loading-color-shift` green→purple + `pulse` opacity                | `1.2s` / `1s`                   |
| Result cards            | `shimmer` — light sweep via `::before`                              | `4.5s ease-in-out`              |
| VS badge                | `gradient-shift` (text gradient) + `vs-scale` pulse                 | `3s linear` / `2.5s`            |
| Winner unicorn          | `dance` — bounce + rotate                                           | `0.5s alternate`                |
| Contribution squares    | Hover: `scale(1.5)` + per-level neon `box-shadow`                   | `transition: 0.1s`              |

**Rules:**

- Use `steps(1)` for flicker/stutter effects — smooth easing undermines the CRT feel.
- Layer multiple animations with comma-separation rather than combining into one keyframe.
- Glow effects use layered `box-shadow` / `text-shadow` stacks, not `filter: blur()`.
- `prefers-reduced-motion` is not yet handled — keep in mind for future polish.
