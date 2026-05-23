# AGENTS.md

## Toolchain

This project uses **Vite+** (`vp` CLI), a unified toolchain wrapping Vite, Rolldown, Oxlint, Oxfmt, and Vitest. It is distinct from plain Vite. Docs: `node_modules/vite-plus/docs` or https://viteplus.dev/guide/

Runtime and package management also go through `vp`. Use `vp help` to list commands.

## Commands

```bash
vp install          # install dependencies (run after pulling)
vp dev              # dev server at http://localhost:5173/michixa/
vp run build        # svelte-check + vite build → dist/
vp run check        # vp check (oxlint + oxfmt) + svelte-check
vp check --fix      # auto-fix formatting issues
mise run ghalint    # lint GitHub Actions workflows (ghalint)
mise run pre-commit # ghalint + vp check --fix
```

`vp run check` must pass (0 errors, 0 warnings) before committing. It runs both `vp check` (oxlint/oxfmt on TS/CSS) and `svelte-check` (Svelte-specific type checking and a11y warnings).

## Architecture

Single-page Svelte 5 app. All logic lives in **`src/App.svelte`**; there are no routes or sub-components.

**Data flow:**

1. On mount, fetch JSON from `iranika/mo-code-4koma` on GitHub (raw URL).
2. Sort entries: non-numeric `Index` (only `"ri"`) sorts first via `NEGATIVE_INFINITY`; numbered episodes follow ascending.
3. Map to `Episode[]` (see `src/types.ts`), resolving image paths to WebP URLs under `WEBP_BASE`.
4. Restore position from `?i=<Index>` URL param (takes priority) or `michixa_page` cookie.

**Navigation model:** episode-level (not page-level). All images in an episode render stacked vertically; prev/next moves between episodes. Position is saved to cookie and shareable via `?i=` URL param + X (Twitter) intent link.

**State (Svelte 5 runes):**

- `loadState`, `episodes`, `currentEpisodeIdx`, `errorMessage` — core state
- `currentEpisode`, `prevEpisode`, `nextEpisode`, `xIntentUrl` — `$derived`
- `showAbout`, `showEpisodeMenu` — modal visibility

**Image URL resolution:** `ImagesUrl` entries like `"./1.jpg"` → strip `./` and extension → append `.webp` to `WEBP_BASE`. `BaseUrl` field in the JSON is not used.

**`Index` typing:** `number | string`. Only one episode has a string index (`"ri"` = りれきしょ). Template guards (`typeof ep.index === "number"`) suppress the `第X話` prefix for non-numeric indices.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages at `https://eggplants.github.io/michixa/`. The `base: "/michixa/"` in `vite.config.ts` must stay in sync with the Pages URL.

Before merging workflow changes, run `mise run ghalint` — it enforces job-level permissions, `timeout-minutes`, and `persist-credentials: false` on checkout steps.
