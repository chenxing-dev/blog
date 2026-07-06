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
        codeBackground: "var(--color-background)",
        codeForeground: "#111",
        codeFontFamily:
          '"IBM Plex Mono", "Noto Sans CJK SC", "Microsoft YaHei", system-ui, "Noto Color Emoji", monospace',
        codeFontSize: "0.95rem",
        codeLineHeight: "1.8",
        codePaddingBlock: "0.75rem",
        codePaddingInline: "1rem",
        uiFontFamily:
          '"IBM Plex Mono", "Noto Sans CJK SC", "Microsoft YaHei", system-ui, "Noto Color Emoji", monospace',
        uiFontSize: "0.95rem",
        uiLineHeight: "1.2",
        uiPaddingBlock: "0.375rem",
        uiPaddingInline: "1rem",
        scrollbarThumbColor: "rgb(0 0 0 / 0.25)",
        scrollbarThumbHoverColor: "rgb(0 0 0 / 0.45)",
        focusBorder: "#000",
        frames: {
          frameBoxShadowCssValue: "4px 4px 0px 0px #000",
          editorBackground: "var(--color-background)",
          editorTabBarBackground: "var(--color-secondary)",
          editorTabBarBorderBottomColor: "#000",
          editorActiveTabBackground: "#fffdf8",
          editorActiveTabForeground: "#111",
          editorActiveTabBorderColor: "#000",
          editorActiveTabIndicatorTopColor: "#000",
          editorActiveTabIndicatorBottomColor: "#fffdf8",
          terminalBackground: "var(--color-background)",
          terminalTitlebarBackground: "var(--color-secondary)",
          terminalTitlebarBorderBottomColor: "#000",
          terminalTitlebarForeground: "#111",
          terminalTitlebarDotsForeground: "#111",
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
