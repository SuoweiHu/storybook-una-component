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
  - [Tailwind class linting (oxlint-tailwindcss)](#tailwind-class-linting-oxlint-tailwindcss)
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
| Typography | [Public Sans](https://fonts.google.com/specimen/Public+Sans) via Google Fonts | Variable (100–900) | Default sans font (`--font-sans`) for every component |
| Variants | [class-variance-authority](https://cva.style) (CVA) | 0.7 | Typed variant → class-name mapping for components |
| Carousel engine | [Swiper](https://swiperjs.com) | 14 | Still installed, but used only by the prototypes in `src/reference-component/`; no library component depends on it |
| Workshop / docs | [Storybook](https://storybook.js.org) (`@storybook/react-vite`) | 10.6 | Component explorer, Docs pages, MDX docs |
| Storybook addons | `addon-docs`, `addon-a11y`, `addon-vitest`, `addon-mcp`, `addon-themes`, `@chromatic-com/storybook` | 10.6 (`@chromatic-com/storybook`: 5) | Docs, accessibility, testing, AI integration, light/dark theme switcher, Chromatic |
| Testing | [Vitest](https://vitest.dev) browser mode + [Playwright](https://playwright.dev) (Chromium) | 4.1 / 1.63 | Runs every story as a test in a headless browser |
| Accessibility | [axe-core](https://github.com/dequelabs/axe-core) via `@storybook/addon-a11y` | — | WCAG 2.0/2.1 A and AA checks on every story |
| Coverage | `@vitest/coverage-v8` | 4.1 | Code coverage for the story tests |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxlint-tailwindcss](https://oxlint-tailwindcss.pages.dev) | 1.8x / 1.16 | Fast Rust-based linter (React, TypeScript, oxc rules), plus Tailwind class checks against the ANU theme |
| Git hooks | [Husky](https://typicode.github.io/husky) | 9 | Runs the linter, commitlint and the story tests from git hooks |
| Commit convention | [commitlint](https://commitlint.js.org) + `config-conventional` | 21 | Enforces [Conventional Commits](https://www.conventionalcommits.org) |
| Visual testing | [Chromatic](https://www.chromatic.com) | 18 | Publishes Storybook and runs visual regression snapshots |
| CI | GitHub Actions | — | Chromatic and Storybook tests on demand (manual trigger only) |

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
| `npm run lint` | `oxlint` | Lints the project with oxlint, including the Tailwind class rules (also runs in the pre-commit hook) |
| `npm run chromatic` | `npx chromatic --project-token=…` | Publishes Storybook to Chromatic and runs visual tests, on demand (see [Chromatic](#visual-regression-testing-chromatic) about the token) |
| `prepare` | `husky` | Installs git hooks; runs automatically after `npm install` |

There is no separate `typecheck` script; run TypeScript directly:

```bash
npx tsc --noEmit -p tsconfig.app.json
```

---

## Project structure

```
.
├── .agents/skills/            # Installed agent skills (see AI tooling)
│   ├── context7-cli/ · context7-mcp/
│   ├── oxlint-tailwindcss/
│   └── tailwind-design-system/
├── .claude/
│   ├── launch.json            # Dev-server config for Claude Code's preview tools
│   └── skills/                # Symlinks to skills in .agents/skills/
├── .github/workflows/
│   ├── chromatic.yml          # Chromatic (manual trigger only)
│   └── test-storybook.yml     # Storybook tests (manual trigger only)
├── .husky/
│   ├── pre-commit             # Runs oxlint before each commit
│   ├── commit-msg             # Runs commitlint on each commit message
│   └── pre-push               # Runs the Storybook tests before each push (the Chromatic step is commented out)
├── .storybook/
│   ├── main.ts                # Story globs, addons, framework, static dirs
│   └── preview.tsx            # Global CSS, light/dark theme switcher, a11y rules, story sorting
├── src/
│   ├── anu-icons/             # ANU brand SVG icons (social, small use, hero)
│   ├── assets/                # Images used in stories; served as Storybook static files
│   ├── component/             # Library components and their stories (Storybook: Component/…)
│   │   ├── Link.tsx      / Link.stories.tsx
│   │   └── LinkIcon.tsx  / LinkIcon.stories.tsx
│   ├── reference-component/   # Earlier prototypes kept for reference only; not part of the library (Storybook: Reference Component/…)
│   ├── foundation/            # MDX docs pages for design foundations
│   │   ├── Border.mdx         # Border radius and width scales (Storybook: Foundation/Border)
│   │   ├── Color.mdx          # ANU colour tokens, read from tw-theme.css (Storybook: Foundation/Color)
│   │   ├── Font.mdx           # Font family, typography styles (Header 1–5, Body Large, Body, Small) and font-size scale (Storybook: Foundation/Font)
│   │   ├── Shadow.mdx         # Shadow scale (Storybook: Foundation/Shadow)
│   │   └── SpacingAndSizing.mdx # Width, height, size, padding and margin scales (Storybook: Foundation/Spacing and Sizing)
│   └── css/
│       ├── tw-global.css      # Tailwind entry: Public Sans import, layers, theme, preflight, utilities
│       ├── tw-theme.css       # ANU design tokens (font, colours)
│       └── tw-utility.css     # Custom @utility rules (currently pattern-hatch)
├── .mcp.json                  # Storybook MCP server for AI assistants
├── .oxlintrc.json             # oxlint + oxlint-tailwindcss configuration
├── chromatic.config.json      # Chromatic project settings
├── CLAUDE.md                  # Project rules for Claude Code (see AI tooling)
├── COMPONENTS.md              # Component reference: props and usage
├── commitlint.config.js       # Commit message rules
├── package.json               # Dependencies and npm scripts
├── skills-lock.json           # Source and hash of installed agent skills
├── tsconfig*.json             # TypeScript project references (app + node)
├── vite.config.ts             # Vite plugins + Vitest "storybook" test project
└── vitest.shims.d.ts          # Type reference for Vitest browser mode (Playwright)
```

---

## Components

| Component | What it is |
|---|---|
| `Link` | Inline text link for light and dark backgrounds |
| `LinkIcon` | Decorative external, download and lock icons to sit beside link text |

Props and usage examples are documented in **[COMPONENTS.md](COMPONENTS.md)**. Live docs with controls for every prop are in Storybook under **Component**.

Every component is built to be ported to a Drupal Single Directory Component (Twig + plain CSS), so React is the prototyping and documentation layer only. The rules that follow from that (CVA variants, typed props, `data-*` state, no arbitrary values) are in `CLAUDE.md`.

`src/reference-component/` holds earlier prototypes (shown in Storybook under **Reference Component**). They are kept for reference only, are not part of the library and are not documented in `COMPONENTS.md`.

---

## Styling

### Tailwind CSS v4

Tailwind is wired in through the Vite plugin (`@tailwindcss/vite` in `vite.config.ts`); there is no `tailwind.config.js`. Configuration lives in CSS:

- **`src/css/tw-global.css`** is the entry point. Its first line loads [Public Sans](https://fonts.google.com/specimen/Public+Sans) from Google Fonts (variable, weights 100–900, roman and italic). That `@import url(...)` has to stay above everything else, because browsers ignore `@import` after other rules. It then declares the cascade layers (`theme, base, components, utilities`) and imports Tailwind's theme, the ANU theme, preflight, Tailwind's utilities and the custom utilities. Its last line redefines the `dark:` variant to key off a `data-theme="dark"` attribute (`@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))`) instead of the OS colour scheme, which is what the Storybook theme switcher toggles.
- **`src/css/tw-theme.css`** extends Tailwind's theme with an `@theme { … }` block of ANU tokens.
- **`src/css/tw-utility.css`** holds every custom `@utility`. They use the ANU tokens rather than defining colour values. So far it has one: `pattern-hatch`, a diagonal hatch on `anu-neutral-100` that shows the space padding or margin takes up.

Storybook loads `tw-global.css` globally in `.storybook/preview.tsx`, and each component imports it too, so components are styled when used outside Storybook.

### ANU design tokens

Defined in `src/css/tw-theme.css` (every colour is shown in Foundation/Color in Storybook), and usable as normal Tailwind utilities (`bg-anu-gold-600`, `text-anu-neutral-500`, …), alongside Tailwind's default radius, border-width and shadow scales (`rounded-lg`, `border-2`, `shadow-md`):

| Token group | Scale | Example utilities |
|---|---|---|
| `anu-gold` | 50–950, OKLCH, from the "Color NEW" variables in the UNA Figma file | `bg-anu-gold-600`, `text-anu-gold-700` |
| `anu-copper` | 50–950 | `bg-anu-copper-500` |
| `anu-slate` | 50–950 | `text-anu-slate-800` |
| `anu-sage` | 50–950 | `bg-anu-sage-100` |
| `anu-neutral` | 50–950 | `bg-anu-neutral-100`, `border-anu-neutral-400` |
| White and black | Tailwind defaults, no ANU token | `bg-white`, `text-black` |
| Shadows | Tailwind defaults: `none`, `2xs`–`2xl` (see Foundation/Shadow in Storybook) | `shadow-md` |
| Radii | Tailwind defaults: `none`, `xs`–`4xl`, `full` (see Foundation/Border in Storybook) | `rounded-lg` (8px), `rounded-2xl` (16px), `rounded-full` (pill) |
| Font | `--font-sans`: Public Sans, falling back to the system sans. Sizes are Tailwind's default `text-xs`–`text-9xl` (see Foundation/Font in Storybook) | `font-sans` (the page default via preflight, so no class is needed), `text-lg` |

**Colour values are declared only in `tw-theme.css`.** Components use colours through utility classes: an ANU token, or one of Tailwind's built-in colours (`white`, `black`, `blue-700`, …). The linter rejects any colour value written into a class name, such as `bg-[#123456]` or `text-[rgb(0,0,0)]` (see [Linting](#linting-and-type-checking)). To use a new colour, add a token to `tw-theme.css` first.

Spacing uses Tailwind's default scale (`--spacing: 0.25rem`, so `p-4` = 16px); see Foundation/Spacing and Sizing in Storybook. Only the commented-out block in `tw-theme.css` sets `--spacing`, so the default applies. The lower half of `tw-theme.css` holds a commented-out light/dark semantic palette generated with [tweakcn](https://tweakcn.com/editor/theme), kept for reference and not active.

### Class Variance Authority (CVA)

Every component describes its variant styles with [CVA](https://cva.style) instead of lookup objects or template-string ternaries. A `cva()` call takes base classes plus a map of variants, and returns a function that builds the class string for a given set of props. The variant map is what will be consumed by Twig's `html_cva()` when a component moves to Drupal, so keep every visual variant in it:

```tsx
import React, { type AnchorHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const linkVariants = cva(
    'rounded-xs text-base/4.5 font-normal underline focus-visible:no-underline focus-visible:outline-2 focus-visible:outline-offset-2', // base classes
    {
        variants: {
            background: {
                light: 'text-blue-600 visited:text-anu-slate-600 hover:bg-blue-50 focus-visible:outline-blue-600 active:bg-blue-100 active:text-blue-700',
                dark: 'text-white visited:text-anu-slate-200 hover:bg-anu-neutral-600 focus-visible:outline-white active:bg-anu-neutral-500 active:text-white',
            },
        },
        defaultVariants: { background: 'light' },
    }
);

// The props interface extends the native element's attributes and the CVA variant props
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {}

export const Link: React.FC<LinkProps> = ({ background, children, href }) => (
    <a className={linkVariants({ background })} href={href}>{children}</a>
);
```

Conventions used across the library:

- `cva` definitions are exported module-level `camelCase` consts named `<component>Variants` (`linkVariants`).
- Each component has a typed `<Name>Props` interface that extends the native element's attributes and `VariantProps<typeof <name>Variants>`, so consumers get `aria-*`, `data-*` and event props in the type.
- Interactive states come from native pseudo-classes (`hover:`, `active:`, `visited:`, `focus-visible:`) or `data-*` attributes styled with Tailwind data variants, not from `useState`.
- Styles that depend on two props at once use `compoundVariants`. Give each entry's classes under the `className` key.
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
  - Adds a **light/dark theme switcher** to the toolbar (`withThemeByDataAttribute` from `@storybook/addon-themes`), which sets `data-theme="light"` or `data-theme="dark"` on the preview and drives the `dark:` variant
  - Leaves global autodocs **off** (the `tags: ['autodocs']` line is commented out); a story file opts in with `tags: ['autodocs']` on its meta if it wants a generated Docs page
  - Auto-detects colour/date controls
  - Sorts stories alphabetically, except the Foundation pages, which come first in a fixed order: Font, Color, Spacing and Sizing, Border, Shadow
  - Configures the **a11y** addon (see [Testing](#testing))

Addons:

| Addon | What it adds |
|---|---|
| `@storybook/addon-docs` | Docs pages and MDX docs (the Foundation pages in `src/foundation/`) |
| `@storybook/addon-a11y` | Accessibility panel and axe checks on each story |
| `@storybook/addon-themes` | Light/dark toolbar switcher that sets `data-theme` on the preview |
| `@storybook/addon-vitest` | Run story tests from the Storybook UI and the CLI |
| `@storybook/addon-mcp` | MCP server at `/mcp` so AI assistants can read docs, preview and test stories |
| `@chromatic-com/storybook` | Chromatic visual tests inside Storybook |

### Writing stories

Stories use CSF 3 with types from the framework package, live under the `Component/` title, and are driven entirely by args so every control works:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
    title: 'Component/Link',
    component: Link,
    parameters: { layout: 'centered' },
    argTypes: {
        background: { name: 'Background', control: { type: 'radio' }, options: ['light', 'dark'] },
        children: { name: 'Link text', control: 'text' },
        href: { name: 'Link URL', control: 'text' },
    },
    args: { children: 'ANU Reporter newsletter', href: 'https://example.org', background: 'light' },
    // Wrapper that emulates the light/dark page background the link sits on
    decorators: [
        (Story, { args }) => (
            <div className={args.background === 'dark' ? 'bg-anu-neutral-950 p-4' : 'bg-white p-4'}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = { args: { background: 'light' } };
export const Dark: Story = { args: { background: 'dark' } };
```

Component and story files use 4-space indentation. Each story renders **one** component instance; variant grids and side-by-side showcases belong in a `<Name>.mdx` docs page that composes the stories.

Cover each CVA variant and state with its own story, including edge cases (empty, long or overflowing content, missing optional props, different backgrounds). Add a `play` function wherever there is interaction to verify, querying by role and label, and use `storybook/test` (`expect`, `userEvent`, `waitFor`) for the assertions.

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

Hover, pressed and visited styles (as on `Link`) come from CSS pseudo-classes. `userEvent` from `storybook/test` dispatches synthetic DOM events, which don't switch `:hover` or `:active` on, and browsers hide `:visited` colours from scripts, so those colours are checked visually in the canvas and by Chromatic rather than asserted in a `play` function. Focus is real: `userEvent.tab()` moves focus, so focus styles can be asserted with `getComputedStyle()`. The `Link` and `LinkIcon` stories currently have no `play` functions; they are covered by the render and axe checks.

---

## Linting and type checking

**oxlint** (`.oxlintrc.json`) runs with the `react`, `typescript` and `oxc` plugins, plus:

- `react/rules-of-hooks`: **error**
- `react/only-export-components`: **warn** (constant exports allowed)

```bash
npm run lint         # also runs in the pre-commit hook
npx oxlint --fix     # apply autofixes (run again until nothing changes)
```

### Tailwind class linting (oxlint-tailwindcss)

[oxlint-tailwindcss](https://oxlint-tailwindcss.pages.dev) is loaded as an oxlint JS plugin (`jsPlugins` in `.oxlintrc.json`). It reads the real Tailwind build from `settings.tailwindcss.entryPoint` (`src/css/tw-global.css`), so it knows every ANU token and utility. It checks class names in `className`, and in `cva()`, `cn()` and `clsx()` calls.

The plugin's recommended rules are on, plus two stricter ones:

| Rule | Level | What it catches |
|---|---|---|
| `no-unknown-classes` | error | Classes that don't exist in the theme (typos, missing tokens) |
| `no-conflicting-classes` | error | Two classes setting the same property, e.g. `p-4 p-6` |
| `no-dynamic-classes` | error | Classes built at runtime (`` `bg-${color}-500` ``), which Tailwind can't see |
| `no-deprecated-classes` | error | Tailwind v3 class names removed or renamed in v4 |
| `no-arbitrary-value` | **error** (stricter) | Any arbitrary value, e.g. `w-[13px]`. Use a theme value or add a token to `tw-theme.css` |
| `no-hardcoded-colors` | **error** (stricter) | Colour values in class names, e.g. `bg-[#123456]` |
| `enforce-sort-order`, `enforce-shorthand`, `enforce-canonical`, … | warn | Class order and shorter or canonical names. All autofixable |

Errors fail `npm run lint` and block the commit; warnings don't. For a one-off exception, put `// oxlint-disable-next-line tailwindcss/<rule>` on the line above.

**Limits:** oxlint only reads JS/TS files. Colour values written directly into CSS files other than `tw-theme.css`, into `.mdx` files, or into inline `style` props are **not** checked.

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
| `pre-commit` | `npm run lint` | Runs oxlint (including the Tailwind rules); any lint error blocks the commit |
| `commit-msg` | `npx --no -- commitlint --edit "$1"` | Rejects commit messages that don't follow Conventional Commits |
| `pre-push` | `npm run test-storybook -- --run` | Runs the full story test suite (interactions + a11y); a failure blocks the push. The Chromatic step (`npm run chromatic -- --exit-zero-on-changes`) is present in the hook but commented out, so pushes no longer publish to Chromatic |

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
feat(link): link component and associated stories
feat(link-icon): link-icon component and its associated stories
docs(link): document the background prop
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
- By convention, use the kebab-case component name as the scope where it applies (`link`, `link-icon`). commitlint doesn't enforce scopes.

Check a message without committing:

```bash
echo "feat(link): add external variant" | npx commitlint
```

---

## Visual regression testing (Chromatic)

[Chromatic](https://www.chromatic.com) publishes Storybook and snapshots every story, flagging visual changes for review.

- `chromatic.config.json` sets `onlyChanged: true` (TurboSnap: only stories affected by a change are snapshotted) and `zip: true`.
- Chromatic is run **on demand**: `npm run chromatic` publishes your local working tree from your machine, so commit or stash unrelated changes first.
- The Husky `pre-push` hook used to publish after the tests passed (`npm run chromatic -- --exit-zero-on-changes`). That line is still in `.husky/pre-push` but commented out, so pushes no longer publish. Uncomment it to bring the behaviour back: visual changes then don't block a push, but build errors (a story that fails to render) do.
- The **Chromatic** GitHub workflow doesn't run on push either. It can be triggered by hand from the **Actions** tab, using the `CHROMATIC_PROJECT_TOKEN` repository secret.

> **Note:** the `chromatic` script currently has the project token hard-coded in `package.json`. Prefer removing it from the script and setting the `CHROMATIC_PROJECT_TOKEN` environment variable instead, which the Chromatic CLI reads automatically. Rotate the token in Chromatic if the repository is public.

---

## GitHub Actions

| Workflow | Trigger | What it does |
|---|---|---|
| `chromatic.yml` | Manual only (`workflow_dispatch`) | Installs with `npm ci` on Node 24.20.0 and runs `chromaui/action` |
| `test-storybook.yml` | Manual only (`workflow_dispatch`) | Runs `npm run test-storybook` on Node 22.12.0 in the official Playwright Docker image (`v1.63.0-noble`) |

Both workflows are switched off on push: the Storybook tests run locally in the Husky `pre-push` hook, and Chromatic is run on demand with `npm run chromatic`. To run either in CI, trigger it from the repository's **Actions** tab.

---

## AI tooling (Storybook MCP)

The project is set up for AI coding assistants such as Claude Code:

- **`CLAUDE.md`** holds the project rules Claude Code loads in every session. It covers CVA variants, typed props, `data-*` state for the Drupal/Twig migration, no arbitrary values, mobile-first and container queries, focus states, OKLCH colours, Public Sans, story coverage and the checks to run before finishing (accessibility tests, lint and types, doc updates). It also requires confirming twice before any `@theme` token change.
- **`@storybook/addon-mcp`** exposes an [MCP](https://modelcontextprotocol.io) server at `http://localhost:6006/mcp` while Storybook is running. Assistants can list component docs and props, preview stories and run story tests through it.
- **`.mcp.json`** registers that server for MCP-aware tools in this repo.
- **`.claude/launch.json`** tells Claude Code how to start Storybook (`npm run storybook -- --no-open` on port 6006).
- **Agent skills** in `.agents/skills/`, installed with `npx skills add …` and recorded in `skills-lock.json`: `oxlint-tailwindcss` (set up the plugin and fix its `tailwindcss(...)` diagnostics), `tailwind-design-system`, `context7-cli` and `context7-mcp`. Claude Code picks up `oxlint-tailwindcss` and `tailwind-design-system` through symlinks in `.claude/skills/`.

Start Storybook (`npm run storybook`) before using these tools.

---

## Adding a new component

1. Create `src/component/MyComponent.tsx`:
   - Import `../css/tw-global.css`.
   - Define styles with `cva()`, export the variant map as `myComponentVariants`, and declare a `MyComponentProps` interface that extends the native element's attributes and `VariantProps` (see [CVA](#class-variance-authority-cva)).
   - Keep UI state in native pseudo-classes or `data-*` attributes rather than `useState`, so it ports to a Drupal behaviour.
   - Use ANU tokens (`anu-gold-*`, `anu-neutral-*`, …) rather than raw colours. Arbitrary values and colour values in class names fail the linter (see [Tailwind class linting](#tailwind-class-linting-oxlint-tailwindcss)).
   - Use semantic HTML and correct ARIA, with a visible `focus-visible:outline-*` style on anything focusable. Every story is checked against WCAG AA.
   - Export it as a named export.
2. Create `src/component/MyComponent.stories.tsx` under the `Component/MyComponent` title:
   - Add a story per CVA variant and state, each rendering one arg-driven instance.
   - Add `play` functions for interactions.
3. Document its props and usage in [COMPONENTS.md](COMPONENTS.md), and add it to the components table above.
4. Run `npm run storybook` and check the component's stories in both themes using the toolbar switcher.
5. Run `npm run lint`, `npx tsc --noEmit -p tsconfig.app.json` and `npm run test-storybook -- --run`.
6. Commit with a conventional message, e.g. `feat(my-component): add my component`.

---

## Troubleshooting

**Commit blocked by lint errors.** Run `npm run lint` to see them. Try `npx oxlint --fix` for autofixable issues. `tailwindcss(no-arbitrary-value)` and `tailwindcss(no-hardcoded-colors)` mean a value isn't in the theme: use the closest class the message suggests, or add a token to `tw-theme.css`. A `designSystemUnavailable` message means `settings.tailwindcss.entryPoint` in `.oxlintrc.json` doesn't point at a valid Tailwind CSS file.

**Push blocked by failing tests.** Run `npm run test-storybook -- --run` to see which story failed. Accessibility violations are listed with the axe rule ID and the offending element.

**Push blocked by Chromatic.** The Storybook build or upload failed. The hook output links to the build in Chromatic. Run `npm run build-storybook` to reproduce a build error locally. Visual changes alone never block a push.

**Commit rejected by commitlint.** Rewrite the message as `type(scope): subject`, using a lowercase type and a non-empty subject. `git commit --amend` won't help here because the commit never happened; just run `git commit` again with a valid message.

**Playwright browser missing.** Run `npx playwright install chromium`.

**Hooks not running.** Run `npm run prepare`, then check with `git config core.hooksPath`, which should print `.husky/_`.

**Port 6006 already in use.** Stop the other Storybook instance, or run `npx storybook dev -p 6007`. MCP tools expect port 6006.
