const plugin = require('tailwindcss/plugin');
const postcss = require('postcss');
const postcssJs = require('postcss-js');

module.exports = plugin.withOptions(function (customUtilities = []) {
  return function ({ config, addUtilities }) {
    const currentConfig = config();

    customUtilities.forEach(({ key, prefix, items, property }) => {
      if (items) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [valKey, val] of Object.entries(items)) {
          addUtilities({
            [`.${prefix}-${valKey}`]: postcssJs.objectify(
              postcss.parse(`${property}: ${val}`)
            ),
          });
        }
      } else {
        const group = currentConfig.theme[key];

        if (!group) {
          return;
        }

        Object.keys(group).forEach(groupKey => {
          addUtilities({
            [`.${prefix}-${groupKey}`]: postcssJs.objectify(
              postcss.parse(`${property}: ${group[groupKey]}`)
            ),
          });
        });
      }
    });
  };
});
