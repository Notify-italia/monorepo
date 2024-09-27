const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const { generateNotifyTailwindConfig } = require('../../libs/utils/src/index');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  ...generateNotifyTailwindConfig({
    colors: {
      'accent-color': { DEFAULT: '#0086FF' }
    }
  }),
};
