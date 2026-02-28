import { useTranslation } from "react-i18next";
import { Lightbulb, Users } from "lucide-react";
import { motion } from "framer-motion";

export function Philosophy() {
  const { t } = useTranslation();

  return (
    <section id="philosophy" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="container px-4 mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 px-4 py-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400 mb-6 uppercase tracking-wider"
          >
            {t("nav.philosophy")}
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            {t("philosophy.title")}
          </h2>
        </div>

        <div className="relative space-y-16 before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-zinc-950 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/80 ml-0 md:ml-0">
              <Lightbulb size={24} />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300 ml-6 md:ml-0 ring-1 ring-zinc-900/5 dark:ring-white/5">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {t("philosophy.problem")}
              </h3>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t("philosophy.problemDesc")}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-zinc-950 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/80 ml-0 md:ml-0">
              <Users size={24} />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300 ml-6 md:ml-0 ring-1 ring-zinc-900/5 dark:ring-white/5">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {t("philosophy.solution")}
              </h3>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t("philosophy.solutionDesc")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}