import type { Preview } from '@storybook/react-vite'
import "../src/css/tw-global.css";

const preview: Preview = {
    tags: ['autodocs'],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'error',
            options: {
                /*
                 * Opt in to running WCAG 2.x AAA rules
                 * Note that you must explicitly re-specify the defaults (all but the last array entry)
                 * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter-examples for more details
                 */
                // runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice', 'wcag2aaa'],
                runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
            },
        },
        options:{
            storySort: {
                method: 'alphabetical',
            }
        }
    },
};

export default preview;