# Una Components

All components live in `src/component/`, are named exports, and import `../css/tw-global.css` so they are styled wherever they are rendered. All text uses Public Sans, the theme's default sans font, so components don't set a font family of their own. Full live documentation, with controls for every prop, is in Storybook under **Component**. For setup, styling conventions and tooling, see the [README](README.md).

Every component is written to port to a Drupal Single Directory Component (Twig + plain CSS), so variants are CVA maps, props are typed interfaces and state lives in native pseudo-classes or `data-*` attributes rather than React state.

The earlier prototypes in `src/reference-component/` (shown in Storybook under **Reference Component**) are kept for reference only. They are not part of the library and are not documented here.

## Contents

- [Link](#link)
- [LinkIcon](#linkicon)

---

## Link

An inline text link, underlined by default. Hover and pressed add a background tint, focus swaps the underline for a 2px outline, and visited links change colour. Every state comes from native pseudo-classes (`:hover`, `:active`, `:focus-visible`, `:visited`), so there is no state to manage.

| Prop | Type | Default | Description |
|---|---|---|---|
| `background` | `'light' \| 'dark'` | `'light'` | The background the link sits on: `light` for white and light backgrounds (blue text, slate when visited), `dark` for dark ones (white text, light slate when visited) |
| `href` | `string` | — | Link target |
| `children` | `ReactNode` | — | Link text |

`LinkProps` extends `AnchorHTMLAttributes<HTMLAnchorElement>` and the CVA variant props, but the component currently forwards only `href` and `children` to the `<a>`; other anchor attributes (`target`, `aria-*`, `data-*`, `className`, …) are accepted by the type and ignored at render time. `linkVariants` (the CVA map) is exported too.

```tsx
<Link href="/news/anu-reporter">ANU Reporter newsletter</Link>
<Link background="dark" href="/news/anu-reporter">ANU Reporter newsletter</Link>
```

Stories: **Component → Link → Light / Dark**. The story decorator wraps the link in a white or `anu-neutral-950` box to match the `background` arg.

## LinkIcon

A small decorative icon to place beside link text: `external` (opens in a new window), `download` (file download) or `lock` (restricted access). It renders a 16×16 inline SVG whose paths are drawn in `currentColor`, so it inherits the text colour of whatever it sits inside (normally the link). It is `aria-hidden` and `focusable="false"` because the link text is what carries the meaning.

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `'download' \| 'external' \| 'lock'` | — | Which icon to draw (required) |

`LinkIcon` takes no other props and has no variants.

```tsx
<Link href="https://example.org">External site <LinkIcon icon="external" /></Link>
<span className="text-white"><LinkIcon icon="lock" /></span>
```

Stories: **Component → LinkIcon → External / Download / Lock**. The story decorator supplies the text colour (`text-blue-600` by default, or the **Icon color** control) that the SVG inherits.
