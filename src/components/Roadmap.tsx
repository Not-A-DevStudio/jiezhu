import { useTranslation } from "react-i18next";
import { Flag, Play, FastForward, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

export function Roadmap() {
  const { t } = useTranslation();

  // Helper to render lists dynamically based on i18n arrays
  const renderList = (key: string) => {
    // i18next returnObjects allows retrieving objects/arrays
    const items = t(key, { returnObjects: true }) as Array<{ text: string, isDone: boolean }>;
    if (!Array.isArray(items)) return null;

    return (
      <ul className="text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-3 mt-4">
        {items.map((item, index) => (
          <li key={index} className={`flex gap-2 items-start ${item.isDone ? 'opacity-60' : ''}`}>
            {item.isDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5" />
            )}
            <span className={item.isDone ? "line-through text-zinc-500 dark:text-zinc-500" : "font-medium"}>{item.text}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section id="roadmap" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-3xl -z-10 border-y border-zinc-200/50 dark:border-zinc-800/50"></div>
      
      <div className="container px-4 mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 px-4 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider"
          >
            {t("nav.roadmap")}
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
            {t("roadmap.title")}
          </h2>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-serif italic">
            "{t("roadmap.ultimate")}"
          </p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/20 before:via-zinc-300 dark:before:via-zinc-700 before:to-transparent">
          {/* Short Term */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-zinc-950 bg-emerald-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10 transition-transform duration-300 group-hover:scale-110 ml-0 md:ml-0">
              <Play size={24} className="ml-1" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-3xl border border-emerald-200/50 dark:border-emerald-800/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg ring-1 ring-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/10 transition-all ml-6 md:ml-0">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-2xl text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t("roadmap.short")}</div>
              </div>
              {renderList("roadmap.shortItems")}
            </div>
          </motion.div>

          {/* Mid Term */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-zinc-950 bg-amber-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10 transition-transform duration-300 group-hover:scale-110 ml-0 md:ml-0">
              <FastForward size={24} />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl shadow-md ring-1 ring-zinc-900/5 dark:ring-white/5 hover:shadow-xl hover:shadow-amber-500/10 transition-all ml-6 md:ml-0">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-2xl text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">{t("roadmap.mid")}</div>
              </div>
              {renderList("roadmap.midItems")}
            </div>
          </motion.div>

          {/* Long Term */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-zinc-950 bg-indigo-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10 transition-transform duration-300 group-hover:scale-110 ml-0 md:ml-0">
              <Flag size={24} />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl shadow-md ring-1 ring-zinc-900/5 dark:ring-white/5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all ml-6 md:ml-0">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-2xl text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{t("roadmap.long")}</div>
              </div>
              {renderList("roadmap.longItems")}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}