# AGENTS.md

This document describes the project for developers and AI agents working on this codebase.

## Project Overview

**Operaciones a pie de campo** — bilingual (ES/EN) site and free warehouse-operations workspace by José Antonio Gálvez Marcos (Team Leader de Pick). `/` is the landing page (hero with a live route demo, tool cards, blog cards). `/app/*` is a full-screen workspace: shift plan, pick routes, cutoffs, start & handover, ABC slotting, idea prioritizer, AI cases, sector map and an embedded blog reader.

There is no backend, database or API: everything runs in the browser.

- Planning logic lives in `src/lib/algorithms.ts` (pure functions, tested in `algorithms.test.ts`): zone load and minimax staff rebalancing, hourly pace projection, aisle-layout distances with S-shape vs nearest-neighbour + 2-opt routing (seeded with S-shape so it never loses to it), ABC slotting, and EDD cutoff scheduling with the minimum feasible rate.
- Workspace data is one versioned, zod-validated object in `localStorage` (`apc-workspace`, `src/lib/workspace.ts`) read through `useSyncExternalStore` (server snapshot = demo data). Users can download/load a JSON backup, and share one tool's data in the URL hash (`#d=<tool>.<base64url>`), which is validated and only applied after the user confirms. Unreadable saved data is kept under `apc-workspace-unreadable`. Any schema change needs a new `version` and a migration.
- Feedback opens a prefilled public GitHub issue on the site repository; there is no form backend.

### Page structure

- `src/routes/index.tsx` composes the landing page: `SiteHeader` → `Hero` → `ToolsSection` → `BlogSection` → `SiteFooter`. `src/routes/app.tsx` wraps every `/app/*` route in `AppShell` (`src/components/app/`). Tool routes are listed in `NAV` (`src/components/app/nav.ts`) and must also be added to `pages` in `vite.config.ts` so they are prerendered.
- `src/data/content.ts` holds **all copy and data** (blog posts with URLs, checklist items, AI use cases, ideas, sectors, external links). Edit content there, not in components.
- Each blog post has a `toolId`; that id is the anchor of its tool (`#checklist`, `#ia-casos`, `#priorizador`, `#capacidad`, `#mapa-sectores`) and the key in the `TOOLS` map in `src/components/site/tools-section.tsx`.
- `src/components/site/` — layout sections. `src/components/tools/` — the five tools plus `ToolShell` (shared card header with link to the article).

### Non-obvious decisions

- The site is dark-only with a warehouse-signage look: near-black background, safety-yellow `--primary` (`#ffd400`, dark text on it). Charts never use the yellow: plan/actual use `--chart-plan`/`--chart-actual` (pink/blue) and ABC classes use the `--abc-*` blue ramp, all checked for colour-blind separation. `.signage` (Archivo at 125% width, 900, uppercase), `.outline-text`, `.hazard`, `.grain`, `.marquee` and `.rise` live in `src/styles.css`. Body IBM Plex Sans, numbers JetBrains Mono. Landing sections are listed in `src/components/site/sections.ts` (menu and scroll rail).
- Idea prioritizer: scores 1–2 are "low", 3–5 "high". `axisPos()` maps scores so matrix dots never sit on the midline. Manual reorder (drag or arrow buttons) disables auto-sort. Dragging is only armed from the card header so the range sliders keep working.
- LinkedIn icon is an inline SVG (`linkedin-icon.tsx`) because lucide no longer ships brand icons.
- The site is bilingual (ES default / EN). `LanguageProvider` in `src/lib/i18n.tsx` (mounted in `__root.tsx`) stores the choice in `localStorage` (`apc-lang`) via `useSyncExternalStore`; the server always renders Spanish. Data strings in `content.ts` are `{ es, en }` objects read with `useLanguage().tr(...)`; interface copy lives in `src/data/ui-strings.ts` (`useStrings()`). Any new text needs both languages. Blog URLs stay Spanish. The ES/EN toggle sits at the right end of the sticky header.

### Tech Stack

| Layer         | Technology                                                      |
| ------------- | --------------------------------------------------------------- |
| Framework     | TanStack Start                                                  |
| Frontend      | React 19, TanStack Router                                       |
| Build         | Vite 8                                                          |
| Styling       | Tailwind CSS 4, theme variables in `src/styles.css`             |
| UI Components | shadcn/ui (Radix UI + Tailwind)                                 |
| Toasts        | sonner                                                          |
| Icons         | lucide-react                                                    |
| Language      | TypeScript 6.0 (strict mode)                                    |
| Deployment    | GitHub Pages, static prerender (`.github/workflows/deploy.yml`) |

## Directory Structure

```
├── public
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── error-pages.tsx # Themed 404 and route error pages with home/retry actions.
│   │   └── ui          # shadcn/ui controls, overlays, feedback, forms, and tables.
│   │   ├── site        # Header, hero, blog cards, tools section, footer.
│   │   └── tools       # The five interactive tools and ToolShell.
│   ├── data
│   │   └── content.ts  # All page copy, links and tool data.
│   ├── examples
│   │   └── validated-form.tsx # Unmounted form pattern with validation, pending, error, and success states.
│   ├── lib
│   │   └── utils.ts    # cn() helper for merging Tailwind classes.
│   ├── routes
│   │   ├── __root.tsx  # HTML shell, <head> metadata (siteName, siteDescription), the tooltip provider, and the toast container.
│   │   └── index.tsx   # Home route (/): composes the single page.
│   ├── router.tsx      # Creates the router from the generated route tree.
│   └── styles.css      # Tailwind import, theme variables for light and dark mode, base styles.
├── components.json     # shadcn/ui config, used by `npx shadcn add`.
├── netlify.toml        # Build command, publish directory, dev server ports.
├── package.json
├── tsconfig.json
└── vite.config.ts      # Vite path aliases and Tailwind, Netlify, TanStack Start, React plugins.
```

`src/routeTree.gen.ts` is generated by the router plugin when the dev server or build runs. Don't edit it.

Shared framework skill source lives in `frameworks/tanstack-start-react/.claude/skills` in this repository, separate from the standalone starter. Consult the matching framework/Netlify skills when available in a generated app; don't assume the starter contains a `.claude` directory.

## Key Concepts

### File-Based Routing

Route files in `src/routes/` define pages and endpoints:

- `__root.tsx` wraps every page.
- `index.tsx` is `/`.
- `about.tsx` would be `/about`.
- `api.*.ts` files are server API endpoints. See the `tanstack-start-api-routes` skill.

### Theme Variables

Colors and corner radius are CSS variables in `src/styles.css` (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--radius`, and more), with a second set under `.dark`. Tailwind exposes them as classes such as `bg-primary`, `text-muted-foreground`, and `border-border`.

Set these variables for the product before you build any page. In components, use the variable classes instead of raw colors like `bg-white` or `text-gray-600`, so the whole site changes when a variable changes.

### UI Components

Ready-made components are in `src/components/ui/`. Use them before writing your own, and restyle them through the theme variables or their variants. Add more with `npx shadcn add <name>`. Show a toast by calling `toast()` from `sonner`; the container is already mounted in `__root.tsx`. `TooltipProvider` is mounted there too, so `Tooltip` works anywhere without its own provider.

| Need               | Components                                                         |
| ------------------ | ------------------------------------------------------------------ |
| Actions and status | Button, Badge, Progress, Skeleton, Alert, Sonner                   |
| Forms              | Input, Textarea, Label, Checkbox, RadioGroup, Switch, Select, Form |
| Overlays and menus | Dialog, Sheet, Popover, DropdownMenu, Tooltip                      |
| Content and layout | Card, Tabs, Accordion, Separator, Table                            |

Use `Form` with React Hook Form and the Zod resolver. Start from `src/examples/validated-form.tsx`; it isn't mounted or connected to a backend. Its required `onSubmit` callback must reject on failure. See [the form pattern](docs/forms.md) for HTTP submission and error handling.

Use Sheet for a mobile menu and DropdownMenu for short action lists. Give Dialog and Sheet an accessible title and description. Pair Checkbox, RadioGroup, Switch, and inputs with visible labels. Reserve tables for tabular data and wrap them in their provided scroll container.

### Design Choices

Set the product's palette, heading/body fonts, and layout before building its screens. Use an explicit user design when supplied; otherwise choose defaults that fit the product. Keep Basic's placeholder until you replace it with the requested product.

- Set `--font-body` and `--font-heading` in `src/styles.css`. Use `font-display` for headings when the product needs a separate heading font.
- Use `max-w-content` for a page container and `max-w-reading` for long text. Keep consistent horizontal padding, such as `px-4 sm:px-6`, and a small repeated spacing scale, such as `gap-4`, `gap-6`, and `py-12`.
- Keep one main heading per page and a clear heading order. Use muted text for supporting copy, not essential low-contrast labels.
- Preserve focus rings. Give icon-only buttons an accessible name. Ensure actions work with a keyboard and on narrow screens.
- Use short color/opacity transitions. Add `motion-reduce:transition-none` or `motion-reduce:animate-none` when adding motion; don't make essential content depend on animation.
- Provide loading, empty, error, and success states for each data-driven screen. Skeletons should follow the shape of the content they replace.

### Routing and Server Data

Router types are registered in `src/router.tsx`, so use typed `Link` destinations and route parameters. The root route supplies the themed 404 page; the router's default error component supplies the safe retry/home page, including child-route SSR failures. Use `throw notFound()` for absent records; keep unexpected failures on the error path. See [routing conventions](src/routes/README.md).

Start with route loaders and server functions for server data. Validate server-function input with `.validator(...)`, keep secrets on the server, and handle HTTP failures before returning data. See [the data-fetching pattern](docs/data-fetching.md). Add TanStack Query only when client-side caching, mutations, or background refresh are needed.

### Browser Storage

Pages are rendered on the server first, where `window` and `localStorage` don't exist. Read `localStorage` inside `useEffect`, not during render or in a `useState` initializer, or the first render will differ from the server HTML and React will log a hydration error.

## Configuration Files

| File             | Purpose                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `vite.config.ts` | Vite path aliases and Tailwind, Netlify, TanStack Start, React plugins |
| `tsconfig.json`  | Strict TypeScript, with the `@/*` alias for `src/*`                    |

## Development Commands

Use Node 22.13+ on the Node 22 line, Node 24, or Node 26+. The installed lint and test tools set this minimum alongside the framework.

```bash
npm run dev        # Start the Vite dev server on port 3000
npm run build      # Production build
npm run typecheck  # Type-check with tsc; the build doesn't
npm run lint       # Check TypeScript and React Hooks rules
npm run format:check # Check formatting
npm run format     # Format project files
npm test           # Run local form, control, and error page tests
npm run preview    # Preview the production build
```

## Conventions

- Components: PascalCase. Utilities and hooks: camelCase. Route files: kebab-case.
- Import from `src` with the `@/` alias.
- TypeScript fails on unused locals and parameters, so remove what you don't use.
- Use React hooks for state.
- Run the dev server or build once to generate route types before type-checking a fresh copy.
- Run build, typecheck, lint, format:check, and tests before reporting completion. Verify changed user flows locally; a passing build doesn't prove an interaction works.

## Application Name

Set the product's name and description in `src/routes/__root.tsx`:

- `siteName` is the page title and the title shown when the link is shared.
- `siteDescription` is the meta description and the description shown when the link is shared.
