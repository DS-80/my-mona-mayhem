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
- Prefer Astro's built-in `<style>` scoped CSS over global stylesheets when adding component styles.
- The `Press Start 2P` font (retro gaming) is the intended typeface — load via Google Fonts in the `<head>`.
- Keep API routes thin: validate params, fetch, return `new Response(JSON.stringify(...), { headers: { 'Content-Type': 'application/json' } })`.
