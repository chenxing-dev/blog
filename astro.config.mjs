import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://chenxing-dev.github.io/blog/",
  base: "/blog",
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'min-light',
        dark: 'slack-dark',
      },
    }
  }
});