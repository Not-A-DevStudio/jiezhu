import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { parseFrontmatter } from "../lib/markdown";

const glob = import.meta.glob('../blog/*.md', { query: '?raw', import: 'default', eager: true });

interface BlogPost {
  id: string;
  attributes: Record<string, any>;
  body: string;
  date: Date;
}

export function BlogShowcase() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadedPosts = Object.entries(glob).map(([path, content]) => {
      const id = path.split('/').pop()?.replace('.md', '') || '';
      const { attributes, body } = parseFrontmatter(content as string);
      return {
        id,
        attributes,
        body,
        date: new Date(attributes.date || 0)
      };
    }).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);

    setPosts(loadedPosts);
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/50 -skew-y-3 transform origin-top-left -z-10"></div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {t("blog.latest")}
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {t("blog.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link 
              to={`/blog?id=${post.id}`} 
              key={post.id}
              className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>{post.attributes.date ? new Date(post.attributes.date).toLocaleDateString() : ''}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                {post.attributes.title || post.id}
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 flex-grow line-clamp-3">
                {post.attributes.desc}
              </p>
              
              <div className="mt-auto flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                {t("blog.readMore")}
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
          >
            {t("blog.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}