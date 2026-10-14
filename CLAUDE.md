# Una Component Library — instructions for Claude



React + Tailwind CSS (v4) component library for ANU websites, documented and tested in Storybook. Components live in `src/component/`, styles in `src/css/` (`tw-global.css` wires up the layers, `tw-theme.css` holds the `@theme` tokens). `README.md` and `COMPONENTS.md` are the human-facing docs.



**The end target is Drupal !** Every component will be ported to a Drupal Single Directory Component (SDC) with a Twig template. For now, React is only the prototyping and documentation layer, so write components that translate cleanly to what's required in SDC  (twig + plain CSS + a little vanilla JS using library if required). Many rules below follow from this...



### Design Token Related

-   **Colours in `oklch()` or `oklab()` only.** No hex, `rgb()`, `hsl()`, `lab()` or `lch()` in new code. OKLCH covers the full visible gamut and is perceptually uniform, so lightness steps look even. The existing tokens in `tw-theme.css` are still hex and the shadows use `rgba()`. Converting them counts as changing theme tokens (next rule), so propose it rather than doing it.

-   **Font - use Public Sans only !** Use [Public Sans](https://fonts.google.com/specimen/Public+Sans) for all text, through the theme's sans font (`font-sans`). Don't introduce any other font unless the user explicitly asks. It's loaded at the top of `tw-global.css` and set as `--font-sans` in `tw-theme.css`, which makes it the page default. Don't set `font-family` or other `font-*` families on components.

-   **Colours only in the theme file, utilities only in the utility CSS file.** Don't define colour values or custom `@utility` rules in component files or anywhere else. Components consume tokens; they don't mint them. (Stylelint is meant to enforce this. If it isn't set up yet, follow the rule by hand.)

-   **Design tokens: ask, confirm, before you edit! ** Don't add, change or override anything in the `@theme { … }` layer (colours, spacing, radii, shadows, fonts, breakpoints) on your own initiative. These tokens are the ANU design system, and silently minting a new one fragments it. If a change really is necessary:

    1. Stop and ask: say what you want to add or change, why the existing tokens don't work, and show the exact lines.
    2. If the user agrees, ask a second, separate time to confirm, restating the final diff.
    3. Only edit `tw-theme.css` after the second yes. A single "sure" in passing isn't enough.

    

## Styling in General

- **No arbitrary values.** No `top-[117px]`, `bg-[#0f172a]`, `grid-cols-[1fr,auto]`, etc. Use the theme scale and tokens. Arbitrary values bypass the design system and don't survive the move to Drupal's CSS. If nothing in the scale fits, raise it with the user (see the token rule below) instead of reaching for brackets. oxlint (`oxlint-tailwindcss`) enforces much of this. Run `npm run lint`.
- **Mobile-first.** Build and check the smallest viewport first, then layer up: `pt-10 md:pt-12 lg:pt-16`. Unprefixed classes are the mobile styles. Never design desktop-down with `max-*` overrides.
- **Container queries where the component's own width matters.** Components get dropped into sidebars, columns and full-width regions in Drupal, so a viewport breakpoint often isn't the right signal. Mark the root `@container` and use `@sm:` / `@md:` / `@lg:` for layout that should respond to the space the component is given (card grids, tile layouts, media + text rows). Keep viewport breakpoints for page-level concerns.
- **Focus states on everything interactive.** Every focusable element needs a visible focus style, normally `outline-*` with an ANU token colour (e.g. `focus-visible:outline-2`, `focus-visible:outline-offset-2`). Never remove an outline without replacing it. Please avoid from using `ring-*` utilities if possible, because they use multi-layered box-shadow system, and is has poor accessibility compliance as `box-shadow` will be hidden when user has "high contrast mode" turned on. 



## Component API

- **Variants with CVA.** Define every visual variant (size, colour, layout) with `cva()` from [`class-variance-authority`](https://cva.style/), Don't use ad-hoc conditional class strings. Later on, when we migrate the javascript component to SDC, the variant map can get consumed in the counter-part [`html_cva()`](https://twig.symfony.com/doc/3.x/functions/html_cva.html) function in twig

- **Typed props interface for every component.** Extend the native element's attributes and the CVA variant props, so consumers get `aria-*`, `data-*` and event props for free (likewise, sub-components such as `AccordionItem`, get their own interface too):

    ```tsx
    export const buttonVariants = cva('…', { variants: { … } });
    export interface ButtonProps
      extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}
    ```

- **State lives in `data-*` attributes, not `useState`.** 

    - Because twig has no React state. Express UI state as data attributes on the DOM (`data-state="open"`, `data-expanded`, `data-active-index="2"`) and style it with Tailwind data variants (`data-[state=open]:rotate-180`, `group-data-[state=open]:block`). - 
    - Interaction logic should be small handlers that read and write those attributes, so it ports directly to a Drupal behaviour. Prefer native elements that carry state themselves (`<details>`/`<summary>`, `<dialog>`, `:checked`) when they fit. `Accordion.tsx` and `Carousel.tsx` still use `useState`. Migrate them when you next work on them, not as drive-by changes.



## Storybook Related

- Cover the component's edge cases, not just the happy path: every CVA variant, empty/long/overflowing content, missing optional props, hover and focus states, post-interaction states (after click, Enter/Space, Escape, arrow keys) asserted with `play` functions, how they look in different containers (different variants of the background).
- Each story renders **one** component instance driven entirely by args, so every control works. Variant grids and side-by-side showcases go in a `<Name>.mdx` docs page that composes the stories (see `Icon.mdx`). 
- Use the Storybook MCP tools (`get-storybook-story-instructions`, `docs-list` / `docs-show`) for story conventions and component APIs, and `stories-preview` to share previews.



## Code Review 

Before you wrap up with every request, make sure you do the following

1. **Accessibility tests.** Run the Storybook tests (MCP `test-run`, or `npm run test-storybook -- --run`), which include the axe WCAG checks on every story. Fix any violations; don't report work as done while they fail.
2. **Lint and types.** `npm run lint` and `npx tsc --noEmit -p tsconfig.app.json`.
3. **Update Documentation.** Update `README.md` and `COMPONENTS.md` (and any other root `*.md` file the change touches) as you go. Examples: a new or changed prop → that component's section in `COMPONENTS.md`; a dependency added or removed → Tech stack in `README.md`; a workflow change → GitHub Actions; a new component → the components table plus its own `COMPONENTS.md` section. Edit only the affected sections, in the existing style.
