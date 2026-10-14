import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    framework: "@storybook/react-vite",
    staticDirs: ['../src/assets'],
    stories: [
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-mcp"
    ],
    // Enable component manifest required by Storybook MCP server
    features: { componentsManifest: true },
};
export default config;