import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { loadBlogPosts } from "../lib/blog";
import type { BlogPost } from "../lib/blog";

export function Blog() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const idFromUrl = searchParams.get("id");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(idFromUrl);

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const loadedPosts = await loadBlogPosts();

        if (!isActive) return;

        setPosts(loadedPosts);
        if (!idFromUrl && loadedPosts.length > 0) {
          setSelectedPostId(loadedPosts[0].id);
        }
      } catch (error) {
        if (!isActive) return;

        setLoadError(error instanceof Error ? error.message : "Failed to load blog posts");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (idFromUrl) {
      setSelectedPostId(idFromUrl);
    }
  }, [idFromUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10 flex flex-col md:flex-row gap-8">
      {/* Sidebar navigation */}
      <div className="md:w-1/4 shrink-0">
        <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 sticky top-24 shadow-sm">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-zinc-500 hover:text-emerald-500 transition-colors mb-6 font-medium"
          >
            ← {t('nav.tohome')}
          </Link>
          <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            {t("nav.blog")}
          </h2>
          <ul className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin">
            {posts.map(post => (
              <li key={post.id}>
                <button
                  onClick={() => { 
                    setSelectedPostId(post.id); 
                    setSearchParams({ id: post.id });
                    window.scrollTo(0, 0); 
                  }}
                  className={`text-left w-full transition-all duration-200 p-3 rounded-xl ${
                    selectedPostId === post.id 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-emerald-500'
                  }`}
                >
                  <div className="truncate text-sm leading-tight">{post.attributes.title || post.id}</div>
                  {post.attributes.date && (
                    <div className="text-xs opacity-60 mt-1.5 font-normal">
                      {new Date(post.attributes.date).toLocaleDateString()}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="md:w-3/4 min-w-0">
        <div className="mb-10 lg:pl-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl mb-6 text-center md:text-left transition-colors">
            {selectedPost?.attributes.title || t("nav.blog")}
          </h1>
          <div className="h-1 w-24 bg-emerald-500 rounded-full mb-6 mx-auto md:mx-0"></div>
          {selectedPost?.attributes.date && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300">
                📅 {new Date(selectedPost.attributes.date).toLocaleDateString()}
              </span>
              {selectedPost.attributes.author && (
                <span className="inline-flex items-center px-3 py-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  ✍️ {selectedPost.attributes.author}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 md:p-12 shadow-md min-h-[500px] transition-all">
          {loadError ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {loadError}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full text-zinc-500 animate-pulse">
              Loading...
            </div>
          ) : selectedPost ? (
            <article className="prose prose-zinc dark:prose-invert prose-emerald max-w-none prose-headings:font-bold prose-a:text-emerald-500 hover:prose-a:text-emerald-600 prose-img:rounded-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedPost.body}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500">
              No posts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
