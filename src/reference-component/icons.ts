export const iconVariants = ['black', 'white', 'gold'] as const;
export type IconVariant = (typeof iconVariants)[number];

export const socialIconNames = ['facebook', 'instagram', 'linkedin', 'phone', 'tiktok', 'twitter', 'wechat', 'youku', 'youtube'] as const;
export type SocialIconName = (typeof socialIconNames)[number];

// Small use icons: Sui001-2-<colour>-NNN.svg → 'sui-001'.
export type UtilityIconName = `sui-${string}`;

// Hero icons keep their set code: Hi003-<colour>-01.svg → 'hi003-01', Hi001-2-<colour>-001.svg → 'hi001-2-001'.
export type HeroIconName = `hi${string}`;

export type IconName = SocialIconName | UtilityIconName | HeroIconName;

export type HeroIconSet = {
    // Set code from the source folder, e.g. 'hi003'.
    id: string;
    // Topics from the source folder name, e.g. 'e-learning, students'.
    topics: string;
    names: HeroIconName[];
};

// `no-inline` keeps every icon a separate file; otherwise Vite base64-encodes those under 4 KB into the bundle.
const files = import.meta.glob<string>('../anu-icons/**/SVG/*.svg', { eager: true, query: '?no-inline', import: 'default' });

const colourCodes: Record<string, IconVariant> = { black: 'black', white: 'white', gold: 'gold', b: 'black', w: 'white', g: 'gold' };

// The source folders are named inconsistently (e.g. white/Tiktok.svg has no colour suffix, Hi015 uses B/W/G,
// and some black sets are nested inside another colour's folder), so the colour comes from the innermost
// colour folder and the name from the file's stem with its colour code removed.
// Hero numbers are zero-padded inconsistently (Hi008 black has '010', white and gold have '10'), so they are
// re-padded to the width of the set's highest number: 'hi003-01' in a 50-icon set, 'hi001-2-001' in a 100-icon set.
const registry: Record<string, string> = {};
const utilityNames = new Set<UtilityIconName>();
const heroSets = new Map<string, { topics: string; files: { number: number; variant: IconVariant; url: string }[] }>();

for (const [path, url] of Object.entries(files)) {
    const folder = path.slice(0, path.lastIndexOf('/SVG/'));
    const variant = [...folder.matchAll(/(black|white|gold)/g)].pop()?.[1] as IconVariant | undefined;
    if (!variant) continue;

    const file = path.slice(path.lastIndexOf('/') + 1, -'.svg'.length);
    const sui = file.match(/^Sui001-2-\w+-(\d+)$/);
    const hero = file.match(/^(Hi\d+(?:-\d+)?)-(\w+)-(\d+)$/);

    if (sui) {
        const name: UtilityIconName = `sui-${sui[1]}`;
        utilityNames.add(name);
        registry[`${name}/${variant}`] = url;
    } else if (hero && colourCodes[hero[2].toLowerCase()]) {
        const id = hero[1].toLowerCase();
        const topics = path.match(/\/Hi[\d-]+\s*\(([^)]+)\)\//)?.[1] ?? '';
        if (!heroSets.has(id)) heroSets.set(id, { topics, files: [] });
        heroSets.get(id)!.files.push({ number: Number(hero[3]), variant, url });
    } else {
        const name = file.replace(/-(black|white|gold)$/, '').toLowerCase();
        registry[`${name}/${variant}`] = url;
    }
}

const heroNames = new Map<string, Set<HeroIconName>>();
for (const [id, set] of heroSets) {
    const width = Math.max(2, String(Math.max(...set.files.map((f) => f.number))).length);
    const names = new Set<HeroIconName>();
    for (const { number, variant, url } of set.files) {
        const name: HeroIconName = `${id}-${String(number).padStart(width, '0')}` as HeroIconName;
        names.add(name);
        registry[`${name}/${variant}`] = url;
    }
    heroNames.set(id, names);
}

const byName = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

export const utilityIconNames: UtilityIconName[] = [...utilityNames].sort(byName);

export const heroIconSets: HeroIconSet[] = [...heroSets.entries()]
    .map(([id, set]) => ({ id, topics: set.topics, names: [...heroNames.get(id)!].sort(byName) }))
    .sort((a, b) => byName(a.id, b.id));

export const heroIconNames: HeroIconName[] = heroIconSets.flatMap((set) => set.names);

export const iconNames: IconName[] = [...socialIconNames, ...utilityIconNames, ...heroIconNames];

export const getIconUrl = (name: IconName, variant: IconVariant = 'black'): string | undefined => registry[`${name}/${variant}`];
