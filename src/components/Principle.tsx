import { useTranslation } from "react-i18next";
import { BookOpen, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function Principle() {
  const { t } = useTranslation();

  return (
    <section id="principle" className="py-24 relative">
      <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-3xl -z-10"></div>
      <div className="container px-4 mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 px-4 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider"
          >
            {t("nav.principle")}
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            {t("principle.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-shadow ring-1 ring-zinc-900/5 dark:ring-white/5"
          >
            <div className="h-16 w-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200/50 dark:border-indigo-800/50">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {t("principle.promptEng")}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
              {t("principle.promptEngDesc")}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-shadow ring-1 ring-zinc-900/5 dark:ring-white/5"
          >
            <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50">
              <Shield size={28} />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {t("principle.compat")}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
              {t("principle.compatDesc")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}