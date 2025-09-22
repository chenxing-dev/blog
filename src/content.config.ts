// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

// 3. Define your collection(s)
const schema = z.object({
  title: z.string(),
  description: z.optional(z.string()),
  date: z.date(),
  category: z.string(),
  tags: z.array(z.string()),
})
const linuxCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/linux" }),
  schema: schema
});
const webDevCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/web" }),
  schema: schema
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { linux: linuxCollection, web: webDevCollection };
