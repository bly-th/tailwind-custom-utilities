const merge = require('lodash/merge');
const cssMatcher = require('jest-matcher-css');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const customPlugin = require('./index');

expect.extend({
  toMatchCss: cssMatcher,
});

function generatePluginCss(overrides) {
  const config = {
    corePlugins: false,
    theme: {},
    plugins: [
      customPlugin([
        {
          prefix: 'grid-min-item-size',
          items: {
            large: 'clamp(24rem, 30%, 100%)',
          },
          property: '--grid-min-item-size',
        },
      ]),
    ],
  };

  return postcss(tailwindcss(merge(config, overrides)))
    .process('@tailwind utilities', {
      from: undefined,
    })
    .then(({ css }) => css);
}

test('css variables can be generated', () => {
  return generatePluginCss({
    theme: {
      colors: {
        primary: '#000',
      },
      fontFamily: {
        base: ['Figtree', 'sans-serif'],
        heading: ['Albra', 'serif'],
      },
    },
  }).then(css => {
    expect(css).toMatchCss(`
    .grid-min-item-size-large {
      --grid-min-item-size: clamp(24rem, 30%, 100%);
    }
    `);
  });
});
