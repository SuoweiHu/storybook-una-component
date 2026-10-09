# Una Component Library

A React component library for ANU websites. Components are built with React, styled with Tailwind CSS and ANU brand tokens, and documented and tested in Storybook.

Every component has Storybook stories covering its variants and states. Those stories double as the test suite: interaction tests (play functions) and WCAG accessibility checks run against each story in a real browser.

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [npm scripts](#npm-scripts)
- [Project structure](#project-structure)
- [Components](#components) (full reference in [COMPONENTS.md](COMPONENTS.md))
- [Styling](#styling)
  - [Tailwind CSS v4](#tailwind-css-v4)
  - [ANU design tokens](#anu-design-tokens)
  - [Class Variance Authority (CVA)](#class-variance-authority-cva)
- [Storybook](#storybook)
- [Testing](#testing)
- [Linting and type checking](#linting-and-type-checking)
- [Git hooks (Husky)](#git-hooks-husky)
- [Commit messages (commitlint)](#commit-messages-commitlint)
- [Visual regression testing (Chromatic)](#visual-regression-testing-chromatic)
- [GitHub Actions](#github-actions)
- [AI tooling (Storybook MCP)](#ai-tooling-storybook-mcp)
- [Adding a new component](#adding-a-new-component)
- [Troubleshooting](#troubleshooting)

---

## Tech stack

| Area | Technology | Version | Purpose |
|---|---|---|---|
| UI | [React](https://react.dev) | 19 | Component framework |
| Language | [TypeScript](https://www.typescriptlang.org) | 6.0 | Static typing |
| Build | [Vite](https://vite.dev) + `@vitejs/plugin-react` | 8 / 6 | Dev server and bundler used by Storybook and Vitest |
| Styling | [Tailwind CSS](https://tailwindcss.com) + `@tailwindcss/vite` | 4.3 | Utility-first CSS, with ANU tokens defined in `@theme` |
| Variants | [class-variance-authority](https://cva.style) (CVA) | 0.7 | Typed variant → class-name mapping for components |
| Carousel engine | [Swiper](https://swiperjs.com) | 14 | Slide/fade transitions, autoplay, keyboard and a11y for `Carousel` |
| Workshop / docs | [Storybook](https://storybook.js.org) (`@storybook/react-vite`) | 10.6 | Component explorer, autodocs, MDX docs |
| Storybook addons | `addon-docs`, `addon-a11y`, `addon-vitest`, `addon-mcp`, `@chromatic-com/storybook` | 10.6 (`@chromatic-com/storybook`: 5) | Docs, accessibility, testing, AI integration, Chromatic |
| Testing | [Vitest](https://vitest.dev) browser mode + [Playwright](https://playwright.dev) (Chromium) | 4.1 / 1.63 | Runs every story as a test in a headless browser |
| Accessibility | [axe-core](https://github.com/dequelabs/axe-core) via `@storybook/addon-a11y` | — | WCAG 2.0/2.1 A and AA checks on every story |
| Coverage | `@vitest/coverage-v8` | 4.1 | Code coverage for the story tests |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter) | 1.8x | Fast Rust-based linter (React, TypeScript, oxc rules) |
| Git hooks | [Husky](https://typicode.github.io/husky) | 9 | Runs commitlint and the story tests from git hooks |
| Commit convention | [commitlint](https://commitlint.js.org) + `config-conventional` | 21 | Enforces [Conventional Commits](https://www.conventionalcommits.org) |
| Visual testing | [Chromatic](https://www.chromatic.com) | 18 | Publishes Storybook and runs visual regression snapshots |
| CI | GitHub Actions | — | Chromatic on push; Storybook tests on demand |

The project is an ES module package (`"type": "module"`), uses **npm** (`package-lock.json`) and is developed on **Node.js 24**.

Versions are what's installed today. `vitest`, `@vitest/*`, `playwright` and `@chromatic-com/storybook` are pinned to `latest` in `package.json`, so they can move on a fresh install.

---

## Getting started

### Prerequisites

- **Node.js 24**. The Chromatic workflow uses 24.20.0 (the manual test workflow still pins 22.12.0), and any recent 24.x works.
- **npm** 11+
- Git

### Install and run

```bash
git clone git@github.com:SuoweiHu/storybook-una-component.git
cd storybook-una-component
npm install
npm run storybook
```

Storybook opens at <http://localhost:6006>.

`npm install` also runs the `prepare` script, which installs the Husky git hooks (see [Git hooks](#git-hooks-husky)).

The first time you run the tests, Playwright needs its Chromium browser:

```bash
npx playwright install chromium
```

---

## npm scripts

| Script | Command | What it does |
|---|---|---|
| `npm run storybook` | `storybook dev -p 6006` | Starts Storybook on port 6006 |
| `npm run dev` | `storybook dev -p 6006` | Alias of `storybook` |
| `npm run build-storybook` | `storybook build` | Builds a static Storybook into `storybook-static/` |
| `npm run test-storybook` | `vitest --project=storybook` | Runs every story as a browser test (watch mode; add `-- --run` for a single run) |
| `npm run lint` | `oxlint` | Lints the project with oxlint |
| `npm run chromatic` | `npx chromatic --project-token=…` | Publishes Storybook to Chromatic and runs visual tests (see [Chromatic](#visual-regression-testing-chromatic) about the token) |
| `prepare` | `husky` | Installs git hooks; runs automatically after `npm install` |

There is no separate `typecheck` script; run TypeScript directly:

```bash
npx tsc --noEmit -p tsconfig.app.json
```

---

## Project structure

```
.
├── .claude/launch.json        # Dev-server config for Claude Code's preview tools
├── .github/workflows/
│   ├── chromatic.yml          # Chromatic on every push
│   └── test-storybook.yml     # Storybook tests (manual trigger only)
├── .husky/
│   ├── commit-msg             # Runs commitlint on each commit message
│   └── pre-push               # Runs the Storybook tests before each push
├── .storybook/
│   ├── main.ts                # Story globs, addons, framework, static dirs
│   └── preview.tsx            # Global CSS, autodocs, a11y rules, story sorting
├── src/
│   ├── anu-icons/             # ANU brand SVG icons (social, small use, hero)
│   ├── assets/                # Images used in stories; served as Storybook static files
│   ├── component/             # Components, their stories and MDX docs
│   │   ├── Accordion.tsx / Accordion.stories.tsx
│   │   ├── Carousel.tsx  / Carousel.stories.tsx
│   │   ├── Icon.tsx      / Icon.stories.tsx / Icon.mdx / IconGallery.mdx
│   │   ├── icons.ts           # Icon registry built from src/anu-icons
│   │   ├── LinkList.tsx  / LinkList.stories.tsx
│   │   ├── Table.tsx     / Table.stories.tsx
│   │   └── Tile.tsx      / Tile.stories.tsx
│   └── css/
│       ├── tw-global.css      # Tailwind entry: layers, theme, preflight, utilities
│       └── tw-theme.css       # ANU design tokens (colours, shadows, radii)
├── .mcp.json                  # Storybook MCP server for AI assistants
├── .oxlintrc.json             # oxlint configuration
├── chromatic.config.json      # Chromatic project settings
├── COMPONENTS.md              # Component reference: props, usage, icon library
├── commitlint.config.js       # Commit message rules
├── package.json               # Dependencies and npm scripts
├── tsconfig*.json             # TypeScript project references (app + node)
├── vite.config.ts             # Vite plugins + Vitest "storybook" test project
└── vitest.shims.d.ts          # Type reference for Vitest browser mode (Playwright)
```

---

## Components

| Component | What it is |
|---|---|
| `Accordion` | Expandable sections with light, dark and grey themes |
| `Carousel` | Swiper-based image carousel with slide/fade effects, autoplay and two control layouts |
| `Icon` | ANU brand icons (social, small use, hero) in black, white and gold |
| `LinkList` | A list of arrow links, optionally in columns, with a heading and illustration |
| `Table` | Data table with row/column headers, striping, borders and merged cells |
| `Tile` | Card-style link in headline, overlay and overlap variants |

Props, usage examples and the icon library are documented in **[COMPONENTS.md](COMPONENTS.md)**. Live docs with controls for every prop are in Storybook.

---

## Styling

### Tailwind CSS v4

Tailwind is wired in through the Vite plugin (`@tailwindcss/vite` in `vite.config.ts`); there is no `tailwind.config.js`. Configuration lives in CSS:

- **`src/css/tw-global.css`** is the entry point. It declares the cascade layers (`theme, base, components, utilities`) and imports Tailwind's theme, the ANU theme, preflight and utilities.
- **`src/css/tw-theme.css`** extends Tailwind's theme with an `@theme { … }` block of ANU tokens.

`Carousel` also imports Swiper's own stylesheets (`swiper/css` and `swiper/css/effect-fade`). They handle the slide track and fade stacking; all visual styling is still Tailwind.

Storybook loads `tw-global.css` globally in `.storybook/preview.tsx`, and each component imports it too, so components are styled when used outside Storybook.

### ANU design tokens

Defined in `src/css/tw-theme.css`, and usable as normal Tailwind utilities (`bg-anu-primary-700`, `text-anu-grey-600`, `rounded-280`, `shadow-200`, …):

| Token group | Scale | Example utilities |
|---|---|---|
| `anu-primary` (gold) | 100–1000 (+ `100-a50`, `650`) | `bg-anu-primary-700`, `text-anu-primary-800` |
| `anu-copper` | 100–900 (+ `100-a50`, `650`) | `bg-anu-copper-600` |
| `anu-grey` | 0–1000 (+ `100-a50`, `650`) | `bg-anu-grey-100`, `border-anu-grey-400` |
| `anu-purple` | 100–900 (+ `100-a50`, `650`) | `text-anu-purple-700` |
| `anu-jacaranda` (green) | 100–900 (+ `100-a50`, `650`) | `bg-anu-jacaranda-200` |
| Shadows | `0`, `100`–`400` | `shadow-200` |
| Radii | `8`, `50`, `100`, `280`, `380`, `488`, `500`, `1000` | `rounded-8` (0px, square), `rounded-280` (16px), `rounded-1000` (pill) |

Spacing uses Tailwind's default scale (`--spacing: 0.25rem`, so `p-4` = 16px). The comment inside `tw-theme.css` that says the default is 8px is out of date. Only the commented-out block below it sets `--spacing`. The lower half of `tw-theme.css` holds a commented-out light/dark semantic palette generated with [tweakcn](https://tweakcn.com/editor/theme), kept for reference and not active.

### Class Variance Authority (CVA)

Every component describes its variant styles with [CVA](https://cva.style) instead of lookup objects or template-string ternaries. A `cva()` call takes base classes plus a map of variants, and returns a function that builds the class string for a given set of props:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const accordionTrigger = cva(
    'flex w-full items-center justify-between border-2 px-7 py-7 …', // base classes
    {
        variants: {
            theme: {
                light: 'focus-visible:outline-black',
                dark: 'focus-visible:outline-white',
                grey: 'focus-visible:outline-black',
            },
            isOpen: { true: '', false: '' },
        },
        // Classes that depend on a combination of variants
        compoundVariants: [
            { theme: 'light', isOpen: false, className: 'border-black bg-white text-black' },
            { theme: 'light', isOpen: true, className: 'border-black bg-black text-white' },
            // …
        ],
        defaultVariants: { theme: 'light', isOpen: false },
    }
);

// Prop types are derived from the cva definition, so they can't drift apart
type AccordionProps = {
    theme?: NonNullable<VariantProps<typeof accordionTrigger>['theme']>;
};

<button className={accordionTrigger({ theme, isOpen })} />
```

Conventions used across the library:

- `cva` definitions are module-level `camelCase` consts named after the element they style (`tableRow`, `navButton`, `tileTitle`).
- Prop unions that map to classes are typed with `NonNullable<VariantProps<typeof x>['key']>`.
- Boolean states (`isOpen`, `isActive`, `isFirst`, `striped`, `bordered`) are `true` / `false` variants.
- Styles that depend on two props at once use `compoundVariants`. Give each entry's classes under the `className` key.
- Where a component accepts a `className` prop (currently only `Icon`), it is passed through as `x({ className })`.
- Static, single-use class strings with no variation can stay inline.

---


## Storybook

Configured in `.storybook/`:

- **`main.ts`**
  - Stories: `src/**/*.mdx` and `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
  - Static files: `src/assets` is served at the root
  - Framework: `@storybook/react-vite`
  - `features.componentsManifest: true` powers the AI/MCP integration
- **`preview.tsx`**
  - Loads the global Tailwind CSS
  - Enables **autodocs** for every component (`tags: ['autodocs']`)
  - Auto-detects colour/date controls
  - Sorts stories alphabetically
  - Configures the **a11y** addon (see [Testing](#testing))

Addons:

| Addon | What it adds |
|---|---|
| `@storybook/addon-docs` | Autodocs pages and MDX docs (`Icon.mdx`, `IconGallery.mdx`) |
| `@storybook/addon-a11y` | Accessibility panel and axe checks on each story |
| `@storybook/addon-vitest` | Run story tests from the Storybook UI and the CLI |
| `@storybook/addon-mcp` | MCP server at `/mcp` so AI assistants can read docs, preview and test stories |
| `@chromatic-com/storybook` | Chromatic visual tests inside Storybook |

### Writing stories

Stories use CSF 3 with types from the framework package and test helpers from `storybook/test`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Carousel } from './Carousel';

const meta = {
  title: 'Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: { slides, label: 'Student stories' },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FadeEffect: Story = {
  args: { effect: 'fade' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: /^Go to slide 2:/ })).toHaveAttribute('aria-current', 'true')
    );
  },
};
```

Story files use 2-space indentation, and component files use 4. Autodocs is on globally. A component with its own hand-written MDX docs page sets `tags: ['!autodocs']` on its meta instead, as `Icon` does with `Icon.mdx`.

Cover each meaningful variant and state with its own story. Add a `play` function wherever there is interaction to verify, querying by role and label.

---

## Testing

Story tests run through the **Vitest addon**: `vite.config.ts` defines a Vitest project named `storybook`. That project uses `storybookTest()` to turn every story into a test, and runs them in **Vitest browser mode** on **headless Chromium via Playwright**.

Each story test:

1. Renders the story in a real browser. A story that throws fails.
2. Runs its `play` function, if any (interaction assertions).
3. Runs **axe** accessibility checks against WCAG 2.0 A/AA, WCAG 2.1 A/AA and best-practice rules. `preview.tsx` sets `a11y.test: 'error'`, so any violation **fails** the test. WCAG AAA rules are deliberately disabled.

```bash
npm run test-storybook            # watch mode
npm run test-storybook -- --run   # single run (what the pre-push hook does)
npm run test-storybook -- --run --coverage   # with V8 coverage
```

You can also run tests from the Storybook UI with the test widget in the sidebar.

---

## Linting and type checking

**oxlint** (`.oxlintrc.json`) runs with the `react`, `typescript` and `oxc` plugins, plus:

- `react/rules-of-hooks`: **error**
- `react/only-export-components`: **warn** (constant exports allowed)

```bash
npm run lint
```

**TypeScript** is split into project references:

- `tsconfig.app.json` covers `src/`: ES2023 + DOM, bundler resolution, `react-jsx`. It is strict about unused locals and parameters, and uses `verbatimModuleSyntax` and `erasableSyntaxOnly`.
- `tsconfig.node.json` covers `vite.config.ts`.

Both configs set `noEmit`; Vite handles compilation. TypeScript's `strict` mode (strict null checks, `noImplicitAny`) is **not** enabled.

```bash
npx tsc --noEmit -p tsconfig.app.json
```

---

## Git hooks (Husky)

[Husky](https://typicode.github.io/husky) installs the hooks in `.husky/` when you run `npm install` (via the `prepare` script). It does this by setting `core.hooksPath` to `.husky/_`.

| Hook | Runs | Purpose |
|---|---|---|
| `commit-msg` | `npx --no -- commitlint --edit "$1"` | Rejects commit messages that don't follow Conventional Commits |
| `pre-push` | `npm run test-storybook -- --run` | Runs the full story test suite (interactions + a11y); a failure blocks the push |

To bypass a hook once, in an emergency only:

```bash
git commit --no-verify
```

```bash
git push --no-verify
```

If the hooks aren't running (e.g. after cloning without `npm install`), run `npm run prepare`.

---

## Commit messages (commitlint)

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org), enforced by `@commitlint/config-conventional` (`commitlint.config.js`) in the `commit-msg` hook.

```
<type>(<optional scope>): <subject>
```

Examples:

```
feat(carousel): add fade effect option
fix(table): correct striped row border on black background
docs(icon): add icon gallery
build: set up class-variance-authority (cva)
```

| Type | Use for |
|---|---|
| `feat` | A new component, prop or capability |
| `fix` | A bug fix |
| `docs` | Documentation, stories and MDX |
| `style` | Code formatting only (no behaviour or visual change) |
| `refactor` | Restructuring code without changing behaviour |
| `perf` | Performance improvements |
| `test` | Adding or changing tests |
| `build` | Dependencies and build tooling (npm, Vite, Husky, Tailwind setup) |
| `ci` | GitHub Actions and CI configuration |
| `chore` | Routine upkeep that fits none of the above |
| `revert` | Reverting an earlier commit |

Rules worth knowing:

- The type must be one of the types in the table above, in lowercase.
- The subject must not be empty and must not end with a full stop.
- The subject must not be in sentence case, start case, Pascal case or all caps. In practice, start it with a lowercase letter.
- The header (first line) can be at most 100 characters, and so can each line of the body and footer.
- By convention, use the component name as the scope where it applies (`accordion`, `carousel`, `icon`, `linklist`, `table`, `tile`). commitlint doesn't enforce scopes.

Check a message without committing:

```bash
echo "feat(tile): add compact variant" | npx commitlint
```

---

## Visual regression testing (Chromatic)

[Chromatic](https://www.chromatic.com) publishes Storybook and snapshots every story, flagging visual changes for review.

- `chromatic.config.json` sets `onlyChanged: true` (TurboSnap: only stories affected by a change are snapshotted) and `zip: true`.
- `npm run chromatic` publishes from your machine.

> **Note:** the `chromatic` script currently has the project token hard-coded in `package.json`. Prefer removing it from the script and setting the `CHROMATIC_PROJECT_TOKEN` environment variable instead, which the Chromatic CLI reads automatically. Rotate the token in Chromatic if the repository is public.
- The **Chromatic** GitHub workflow runs on every push, using the `CHROMATIC_PROJECT_TOKEN` repository secret.

---

## GitHub Actions

| Workflow | Trigger | What it does |
|---|---|---|
| `chromatic.yml` | Every push | Installs with `npm ci` on Node 24.20.0 and runs `chromaui/action` |
| `test-storybook.yml` | Manual only (`workflow_dispatch`) | Runs `npm run test-storybook` on Node 22.12.0 in the official Playwright Docker image (`v1.63.0-noble`) |

Automatic Storybook test runs on push are switched off because the same tests run locally in the Husky `pre-push` hook. To run them in CI, trigger the workflow from the repository's **Actions** tab.

---

## AI tooling (Storybook MCP)

The project is set up for AI coding assistants such as Claude Code:

- **`@storybook/addon-mcp`** exposes an [MCP](https://modelcontextprotocol.io) server at `http://localhost:6006/mcp` while Storybook is running. Assistants can list component docs and props, preview stories and run story tests through it.
- **`.mcp.json`** registers that server for MCP-aware tools in this repo.
- **`.claude/launch.json`** tells Claude Code how to start Storybook (`npm run storybook -- --no-open` on port 6006).

Start Storybook (`npm run storybook`) before using these tools.

---

## Adding a new component

1. Create `src/component/MyComponent.tsx`:
   - Import `../css/tw-global.css`.
   - Define styles with `cva()` and derive prop types with `VariantProps` (see [CVA](#class-variance-authority-cva)).
   - Use ANU tokens (`anu-primary-*`, `anu-grey-*`, …) rather than raw colours.
   - Use semantic HTML and correct ARIA. Every story is checked against WCAG AA.
   - Export it as a named export.
2. Create `src/component/MyComponent.stories.tsx`:
   - Add a story per meaningful variant and state.
   - Add `play` functions for interactions.
3. Document its props and usage in [COMPONENTS.md](COMPONENTS.md), and add it to the components table above.
4. Run `npm run storybook` and check the component and its autodocs page.
5. Run `npm run lint`, `npx tsc --noEmit -p tsconfig.app.json` and `npm run test-storybook -- --run`.
6. Commit with a conventional message, e.g. `feat(my-component): add my component`.

---

## Troubleshooting

**Push blocked by failing tests.** Run `npm run test-storybook -- --run` to see which story failed. Accessibility violations are listed with the axe rule ID and the offending element.

**Commit rejected by commitlint.** Rewrite the message as `type(scope): subject`, using a lowercase type and a non-empty subject. `git commit --amend` won't help here because the commit never happened; just run `git commit` again with a valid message.

**Playwright browser missing.** Run `npx playwright install chromium`.

**Hooks not running.** Run `npm run prepare`, then check with `git config core.hooksPath`, which should print `.husky/_`.

**Port 6006 already in use.** Stop the other Storybook instance, or run `npx storybook dev -p 6007`. MCP tools expect port 6006.
