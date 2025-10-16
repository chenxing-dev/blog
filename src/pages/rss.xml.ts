import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

interface PostData {
    title: string;
    description?: string;
    date: Date;
}

interface CollectionPost {
    id: string;
    body?: string;
    data: PostData;
}

export async function GET(context: { site?: string | undefined }): Promise<Response> {
    const linux = (await getCollection("linux")) as CollectionPost[];
    const web = (await getCollection("web")) as CollectionPost[];
    const posts: CollectionPost[] = [...linux, ...web]
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
        })),
    });
}
