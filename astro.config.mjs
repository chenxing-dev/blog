import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.chenxing-dev/",
  base: "/",
  integrations: [
    sitemap(),
    expressiveCode({
      styleOverrides: {
        codeFontSize: "0.95rem",
        codePaddingBlock: "0.75rem",
        codePaddingInline: "1rem",
        frames: {
          terminalBackground: "var(--color-background)",
          inlineButtonForeground: "#000",
          inlineButtonBackground: "var(--color-background)",
          inlineButtonBorder: "#000",
          inlineButtonBackgroundIdleOpacity: "0.08",
          inlineButtonBackgroundHoverOrFocusOpacity: "0.16",
          inlineButtonBackgroundActiveOpacity: "0.24",
          inlineButtonBorderOpacity: "1",
          tooltipSuccessBackground: "var(--color-green)",
          tooltipSuccessForeground: "#fff",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light-high-contrast",
      },
    },
  },
});
