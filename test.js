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
  };

  return postcss(tailwindcss(merge(config, overrides)))
    .process('@tailwind utilities', {
      from: undefined,
    })
    .then(({ css }) => css);
}

test('css variables can be generated from array', () => {
  return generatePluginCss({
    theme: {
      colors: {
        primary: '#000',
      },
      fontFamily: {
        base: ['Figtree', 'sans-serif'],
        heading: ['Albra', 'serif'],
      },
      gridMinItemSize: {
        large: 'clamp(24rem, 30%, 100%)',
      },
      spacing: {
        // https://utopia.fyi/space/calculator/?c=320,21,1.2,1140,24,1.25,5,2,&s=0.75%7C0.5%7C0.25,1.5%7C2%7C3%7C4%7C6,s-l
        200: 'clamp(0.25rem, calc(0.15rem + 0.49vw), 0.50rem)',
      },
    },
    plugins: [
      customPlugin({
        spacing: [
          {
            name: 'flow-space',
            property: '--flow-space',
          },
          {
            name: 'gutter',
            property: '--gutter',
          },
        ],
      }),
    ],
  }).then(css => {
    expect(css).toMatchCss(`
    .flow-space-200 {
      --flow-space: clamp(0.25rem, calc(0.15rem + 0.49vw), 0.50rem)
    }

    .gutter-200 {
      --gutter: clamp(0.25rem, calc(0.15rem + 0.49vw), 0.50rem)
    }
    `);
  });
});

test('css variables can be generated from object', () => {
  return generatePluginCss({
    theme: {
      colors: {
        primary: '#000',
      },
      fontFamily: {
        base: ['Figtree', 'sans-serif'],
        heading: ['Albra', 'serif'],
      },
      gridMinItemSize: {
        large: 'clamp(24rem, 30%, 100%)',
      },
      spacing: {
        // https://utopia.fyi/space/calculator/?c=320,21,1.2,1140,24,1.25,5,2,&s=0.75%7C0.5%7C0.25,1.5%7C2%7C3%7C4%7C6,s-l
        200: 'clamp(0.25rem, calc(0.15rem + 0.49vw), 0.50rem)',
      },
    },
    plugins: [
      customPlugin({
        spacing: {
          name: 'flow-space',
          property: '--flow-space',
        },
      }),
    ],
  }).then(css => {
    expect(css).toMatchCss(`
    .flow-space-200 {
      --flow-space: clamp(0.25rem, calc(0.15rem + 0.49vw), 0.50rem)
    }
    `);
  });
});
