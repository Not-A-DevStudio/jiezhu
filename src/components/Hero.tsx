import { useTranslation } from "react-i18next";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background glowing blobs */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 mb-8 shadow-sm hover:border-emerald-500/50 transition-colors cursor-default"
          >
            <span className="relative flex h-2.5 w-2.5 rounded-full mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-medium mr-2">v0.1.0</span> <span className="opacity-80">available now</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 mt-4"
          >
            <span className="text-zinc-900 dark:text-zinc-50">
              {t("hero.title").split(' ').slice(0, -1).join(' ')}
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-teal-300">
              {t("hero.title").split(' ').slice(-1)}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mb-12 font-medium"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mt-2"
          >
            <a
              href="#start"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-50 px-8 text-base font-medium text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950 transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {t("hero.ctaId")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://github.com/Not-A-DevStudio/libjiezhu"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/30 backdrop-blur-sm dark:bg-zinc-950/30 px-8 text-base font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all hover:scale-105 shadow-sm"
            >
              <Github className="mr-2 h-5 w-5" />
              {t("hero.github")}
            </a>
          </motion.div>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-28 text-left max-w-4xl mx-auto p-10 rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/50 dark:border-zinc-800/50 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-zinc-900/5 dark:ring-white/5 relative overflow-hidden group"
          >
            {/* Shimmer effect inside card */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:transition-all group-hover:duration-1000 group-hover:translate-x-[150%] ease-out z-0"></div>
            
            <div className="relative z-10">
              <blockquote className="border-l-4 border-emerald-500 pl-6 italic text-xl md:text-2xl text-zinc-700 dark:text-zinc-200 font-serif">
                "{t("hero.quote")}"
              </blockquote>
              <p className="mt-8 text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                {t("hero.overview")}
                <br /><br />
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">{t("hero.believe")}</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}