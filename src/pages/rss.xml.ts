import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";


export async function GET(context: APIContext): Promise<Response> {
    const linux = await getCollection("linux");
    const web = await getCollection("web");
    const posts = [...linux, ...web]
        // filter out drafts or missing dates if necessary
        .filter((p) => !!p.data?.date)
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

    return rss({
        title: "陈刑's Tech Guides",
        description: "技术指南与笔记",
        site: context.site ?? "https://blog.chenxing-dev/",
        items: posts.map((p) => ({
            title: p.data.title,
            description: p.data.description ?? undefined,
            link: `/${p.id}`,
            pubDate: p.data.date,
            content: p.body ? String(p.body) : undefined,
            // Optional: tags
            categories: p.data?.tags?.map((tag) => String(tag)) ?? [],
        })),
    });
}
