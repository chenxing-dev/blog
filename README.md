# Blog 🚀

**Markdown-to-Blog with Astro + TailwindCSS**  
[![Astro](https://img.shields.io/badge/Astro-2.10-FF5D01?logo=astro)](https://astro.build)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?logo=tailwind-css)](https://tailwindcss.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-222?logo=github)](https://pages.github.com)

A minimalist blog pipeline that transforms Markdown notes into a website deployed to GitHub Pages. 


## Installation ⚙️

```bash
git clone https://github.com/chenxing-dev/blog.git
cd blog
npm install
npm run dev
```

## Usage 📝

1. **Create New Posts**  
   Add Markdown files to `src/content/blog/`:
   ```markdown
   ---
   title: "Your Post Title"
   date: 2023-01-01
   tags: ["linux", "programming"]
   ---
   ## Your Content Here
   ```

2. **Local Development**  
   ```bash
   npm run dev
   ```
   View at `http://localhost:4321/blog/`

3. **Build & Deploy**  
   ```bash
   npm run deploy
   ```
   Auto-publishes to `https://<username>.github.io/blog`

## Project Structure 📂

```
blog/
├── src/
│   ├── content/
│   │   └── blog/          # Markdown posts
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── [id].astro # Dynamic post routes
│       └── index.astro
└── astro.config.mjs
```

## Deployment 🚀

1. Enable GitHub Pages in repo settings
2. Set source branch to `gh-pages`
3. Configure in `astro.config.mjs`:
   ```javascript
   export default defineConfig({
     site: 'https://<username>.github.io',
     base: '/blog/'
   });
   ```

## License 📄

MIT License - see [LICENSE](LICENSE)

---

**Made with 🖤 by 陈刑**  
[![GitHub](https://img.shields.io/badge/-View_Code-black?logo=github)](https://github.com/chenxing-dev/blog)
