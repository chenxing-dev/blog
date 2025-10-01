import type { InferEntrySchema } from "astro:content";

export type Post = {
    id: string;
    url: string;
    body: string;
    data: InferEntrySchema<"linux"> & { readTime: number };
};

// Sort posts by date, descending
export const byDateDesc = (a: Post, b: Post) =>
    b.data.date.getTime() - a.data.date.getTime();

export function processPost(post: any) {
    const readTime = calculateReadTime(post.body ?? "");
    return {
        ...post,
        url: `/${post.id}`,
        data: {
            ...post.data,
            readTime,
        },
    };
}

export function getPostIcon(category?: string) {
    switch (category) {
        case "terminal": return ">";
        case "desktop": return "🖥️";
        case "config": return "🛠️";
        case "hardware": return "💾";
        case "programming": return "👨‍💻";
        case "web-dev": return "💻";
        case "web-development": return "💻";
        case "network": return "🌐";
        case "security": return "🔒";
        case "package-management": return "📦";
        default: return "#";
    }
}

export function calculateReadTime(content: string) {
    // Remove code blocks and frontmatter for accurate word count
    const cleanContent = content
        .replace(/^---[\s\S]*?---/, "") // Remove frontmatter
        .replace(/\n\s*\n/g, "\n") // Remove empty lines
        .replace(/^\s*[\r\n]/gm, "") // Remove blank lines
        .trim();

    const words = cleanContent.split(/\s+/).length;

    const wordsPerMinute = 150; // 150 wpm reading speed
    const minutes = Math.ceil(words / wordsPerMinute);

    // Minimum 1 minute
    return Math.max(minutes, 1);
}

// Get the style based on category
export const getStyle = (category: string) => {
    switch (category) {
        case "terminal": return ["bg-background"];
        case "desktop": return ["bg-secondary"];
        case "config": return ["bg-green"];
        case "hardware": return ["bg-primary"];
        case "programming": return ["bg-teal-green"];
        case "web-dev": return ["bg-cyan"];
        case "web-development": return ["bg-cyan"];
        case "network": return ["bg-teal"];
        case "security": return ["bg-light-teal"];
        case "package-management": return ["bg-blue"];
        default: return ["bg-light-blue"];
    }
};