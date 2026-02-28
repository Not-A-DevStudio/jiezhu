import { useTranslation } from "react-i18next";
import { CheckCircle2, Globe, Layers } from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      title: t("features.zeroInvasive"),
      description: t("features.zeroInvasiveDesc"),
      icon: <Layers className="h-7 w-7 transition-colors duration-300" />,
    },
    {
      title: t("features.multiLang"),
      description: t("features.multiLangDesc"),
      icon: <Globe className="h-7 w-7 transition-colors duration-300" />,
    },
    {
      title: t("features.dualMode"),
      description: t("features.dualModeDesc"),
      icon: <CheckCircle2 className="h-7 w-7 transition-colors duration-300" />,
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-3xl -z-10"></div>
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 px-4 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider"
          >
            {t("nav.features")}
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            {t("features.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-2xl transition-all duration-300 relative overflow-hidden ring-1 ring-zinc-900/5 dark:ring-white/5"
            >
              {/* Magic glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              
              <div className="relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-all duration-300">
                  <div className="text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}