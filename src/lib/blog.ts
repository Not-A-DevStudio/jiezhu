import { parseFrontmatter } from "./markdown";

export interface BlogPost {
  id: string;
  attributes: Record<string, any>;
  body: string;
  date: Date;
}

const BLOG_BASE_PATH = `${import.meta.env.BASE_URL}blog/`;
const BLOG_MANIFEST_URL = `${BLOG_BASE_PATH}index.json`;

function buildBlogPostUrl(fileName: string) {
  return `${BLOG_BASE_PATH}${fileName}`;
}

function normalizePostId(fileName: string) {
  return fileName.replace(/\.md$/i, "");
}

async function readBlogManifest() {
  const response = await fetch(BLOG_MANIFEST_URL, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Failed to load blog manifest: ${response.status}`);
  }

  const manifest = (await response.json()) as unknown;

  if (!Array.isArray(manifest) || !manifest.every(item => typeof item === "string")) {
    throw new Error("Invalid blog manifest format");
  }

  return manifest;
}

export async function loadBlogPosts(limit?: number) {
  const fileNames = await readBlogManifest();
  const posts = await Promise.all(
    fileNames.map(async fileName => {
      const response = await fetch(buildBlogPostUrl(fileName), { cache: "no-cache" });

      if (!response.ok) {
        throw new Error(`Failed to load blog post: ${fileName}`);
      }

      const content = await response.text();
      const { attributes, body } = parseFrontmatter(content);

      return {
        id: normalizePostId(fileName),
        attributes,
        body,
        date: new Date(attributes.date || 0),
      } satisfies BlogPost;
    })
  );

  const sortedPosts = posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  return typeof limit === "number" ? sortedPosts.slice(0, limit) : sortedPosts;
}
