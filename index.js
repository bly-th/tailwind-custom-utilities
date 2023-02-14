const plugin = require('tailwindcss/plugin');
const postcss = require('postcss');
const postcssJs = require('postcss-js');

const getFixedKey = key => {
  if (key === 'DEFAULT' || key === 'default') {
    return 'default';
  }
  return key.replace('/', '-');
};

module.exports = plugin.withOptions(function (customUtilities = {}) {
  return function ({ config, addUtilities }) {
    const tailwindPrefix = config('prefix', '');
    const entries = [];

    Object.entries(customUtilities).forEach(([key, object]) => {
      if (!object) return;

      const originalConfig = config(`theme.${key}`, []);

      Object.entries(originalConfig).forEach(([configKey, value]) => {
        if (Array.isArray(object)) {
          object.forEach(entry => {
            entries.push({
              object: entry,
              configKey,
              value,
            });
          });
        } else {
          entries.push({
            object,
            configKey,
            value,
          });
        }
      });
    });

    entries.forEach(entry => {
      const cssVariableName = `.${tailwindPrefix}${
        entry.object.name
      }-${getFixedKey(entry.configKey)}`;

      addUtilities({
        [cssVariableName]: postcssJs.objectify(
          postcss.parse(`${entry.object.property}: ${entry.value}`)
        ),
      });
    });
  };
});
