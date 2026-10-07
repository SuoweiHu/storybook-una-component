import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    "stories": [
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    staticDirs: ['../src/assets'],
    "addons": [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-mcp"
    ],
    "framework": "@storybook/react-vite",
    // --------------------------------
    // Enable AI Features, see more at:
    // https://storybook.js.org/docs/ai
    features: {
        componentsManifest: true,
    },
};
export default config;