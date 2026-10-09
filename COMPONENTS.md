# Una Components

All components live in `src/component/`, are named exports, and import `../css/tw-global.css` so they are styled wherever they are rendered. Full live documentation, with controls for every prop, is in Storybook under each component's **Docs** page. For setup, styling conventions and tooling, see the [README](README.md).

## Contents

- [Accordion](#accordion)
- [Carousel](#carousel)
- [Icon](#icon)
  - [Icon library](#icon-library)
- [LinkList](#linklist)
- [Table](#table)
- [Tile](#tile)

---

## Accordion

Expandable sections with accessible button/region pairs (`aria-expanded`, `aria-controls`, `aria-labelledby`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `{ title: string; content: ReactNode }[]` | — | Sections to render |
| `theme` | `'light' \| 'dark' \| 'grey'` | `'light'` | `light` for white/cream backgrounds, `dark` for black, `grey` for grey |
| `defaultOpen` | `number[]` | `[]` | Indexes of items expanded on first render (only the first is used unless `allowMultiple` is `true`) |
| `allowMultiple` | `boolean` | `false` | When `false`, opening one item closes the others |

```tsx
<Accordion
    theme="grey"
    items={[
        { title: 'Eligibility', content: <p>…</p> },
        { title: 'How to apply', content: <p>…</p> },
    ]}
/>
```

## Carousel

An image carousel built on Swiper, with indicator dots, previous/next controls, keyboard support and an optional play/pause button.

| Prop | Type | Default | Description |
|---|---|---|---|
| `slides` | `{ image: string; alt: string; href?: string }[]` | — | Slides; `href` makes the slide a link |
| `label` | `string` | — | Accessible name for the carousel |
| `controls` | `'bottom' \| 'side'` | `'bottom'` | `bottom`: dots + Previous/Next links below. `side`: round up/down buttons + vertical dots beside |
| `effect` | `'slide' \| 'fade'` | `'slide'` | `slide` moves the track; `fade` cross-fades slides in place |
| `speed` | `number` | `300` | Transition duration in milliseconds |
| `autoplay` | `boolean` | `false` | Start advancing automatically |
| `autoplayDelay` | `number` | `5000` | Milliseconds each slide is shown during autoplay |
| `showAutoplayButton` | `boolean` | `true` | Show the play/pause button over the slides (hidden when there is only one slide) |

```tsx
<Carousel label="Student stories" slides={slides} effect="fade" speed={800} autoplay />
```

Autoplay pauses while the pointer is over the slides. Manual navigation keeps it running; only the play/pause button stops it.

## Icon

Renders an ANU brand icon from `src/anu-icons`. See [Icon library](#icon-library) below.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `IconName` | — | e.g. `'linkedin'`, `'sui-042'`, `'hi003-01'` |
| `variant` | `'black' \| 'white' \| 'gold'` | `'black'` | Artwork colour; use `white` on dark backgrounds |
| `size` | `number` | `24` | Width and height in pixels |
| `label` | `string` | — | Accessible name. Omit for decorative icons (rendered with `alt=""` and `aria-hidden`) |
| `className` | `string` | `''` | Extra classes |

### Icon library

`src/anu-icons/` holds the ANU icon library (about 2,700 SVGs) in three families, each in black, white and gold:

| Family | Folder | Names |
|---|---|---|
| Social | `Social icons/` | `facebook`, `instagram`, `linkedin`, `phone`, `tiktok`, `twitter`, `wechat`, `youku`, `youtube` |
| Small use | `Small use icons/Sui001-2/` | `sui-001` … `sui-140` |
| Hero | `Hero icons/HiNNN (topics)/`, e.g. `Hi003 (e-learning, students)/` | Set code + number, e.g. `hi003-01`, `hi001-2-001` (14 themed sets) |

`src/component/icons.ts` builds the registry at build time with Vite's `import.meta.glob(…, { query: '?no-inline' })`, so every icon stays a separate file instead of being inlined into the bundle. It also normalises the source folders' inconsistent naming (mixed colour codes, nesting and zero-padding) into the clean names above, and exports:

- the lists `iconVariants`, `iconNames`, `socialIconNames`, `utilityIconNames`, `heroIconSets` and `heroIconNames`
- `getIconUrl(name, variant = 'black')`, which returns the icon's URL, or `undefined` for an unknown name
- the matching types (`IconName`, `IconVariant`, `SocialIconName`, `UtilityIconName`, `HeroIconName`, `HeroIconSet`)

Browse every icon in Storybook under **Icon → Gallery**.

```tsx
<Icon name="linkedin" variant="gold" size={32} label="ANU on LinkedIn" />
<Icon name="hi003-01" size={96} />
```

## LinkList

A list of links with arrow icons, optionally split into columns, with an optional heading and illustration.

| Prop | Type | Default | Description |
|---|---|---|---|
| `links` | `{ label: string; href: string }[]` | — | Links to show |
| `heading` | `string` | — | Optional `<h2>` above the list |
| `icon` | `string` | — | Optional decorative image URL above the heading |
| `columns` | `1 \| 2 \| 3` | `1` | Columns on `md` screens and up (filled top to bottom) |
| `background` | `'white' \| 'tint' \| 'grey' \| 'black'` | `'white'` | The background the list sits on |

## Table

A responsive data table (scrolls horizontally on small screens) supporting column headers, row headers, merged cells, sub-headings and links in cells.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `string[]` | `[]` | Header row; leave empty for row-headers-only tables |
| `rows` | `{ header?: string; cells: TableCellData[] }[]` | — | Body rows; `header` renders a row header cell |
| `caption` | `string` | — | Visually hidden caption for screen readers |
| `background` | `'white' \| 'tint' \| 'grey' \| 'black'` | `'white'` | The background the table sits on |
| `variant` | `'default' \| 'striped'` | `'default'` | Striped alternates row colours |
| `bordered` | `boolean` | `false` | Borders on every cell; use whenever cells are merged |

A cell is either a string or `{ text?, subtext?, links?, colSpan?, rowSpan? }`. When `subtext` is set, `text` renders as a sub-heading.

## Tile

A card-style link.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Link text |
| `href` | `string` | — | Link target |
| `variant` | `'headline' \| 'overlay' \| 'overlap'` | `'headline'` | `headline`: text-only grey card. `overlay`: title centred over the image. `overlap`: title in a dark box over the image |
| `image` | `string` | — | Image URL for `overlay` / `overlap` (decorative; the title names the link) |
