const plugin = require('tailwindcss/plugin');
const postcss = require('postcss');
const postcssJs = require('postcss-js');

const getFixedKey = key => {
  if (key === 'DEFAULT' || key === 'default') {
    return 'default';
  }
  return key.replace('/', '-').replace('.', '_');
};

module.exports = plugin.withOptions(function (customUtilities = {}) {
  return function ({ config, addUtilities }) {
    // eslint-disable-next-line no-restricted-syntax
    Object.entries(customUtilities).forEach(([key, object]) => {
      if (!object) return;

      const tailwindPrefix = config('prefix', '');
      const originalConfig = config(`theme.${key}`, []);

      Object.entries(originalConfig).forEach(([configKey, value]) => {
        const cssVariableName = `.${tailwindPrefix}${object.name}-${getFixedKey(
          configKey
        )}`;

        addUtilities({
          [cssVariableName]: postcssJs.objectify(
            postcss.parse(`${object.property}: ${value}`)
          ),
        });
      });
    });
  };
});
