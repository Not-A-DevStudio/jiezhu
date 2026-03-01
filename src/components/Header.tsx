import { useTranslation } from "react-i18next";
import { Languages, Github } from "lucide-react";
import { useEffect } from "react";

export function Header() {
  const { t, i18n } = useTranslation();
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("zh") ? "en" : "zh";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-950/60 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter">
          <img src={logoSrc} className="w-8 h-8" alt="Jiezhu Logo" />
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">Jiezhu</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 justify-center flex-1 text-sm font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
          <a href="#features" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">{t("nav.features")}</a>
          <a href="#start" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">{t("nav.start")}</a>
          <a href="#principle" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">{t("nav.principle")}</a>
          <a href="#philosophy" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">{t("nav.philosophy")}</a>
          <a href="#roadmap" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">{t("nav.roadmap")}</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="p-2.5 text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-all rounded-xl hover:bg-emerald-50 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-95"
            aria-label="Toggle language"
            title="Toggle Language"
          >
            <Languages size={20} />
          </button>
          <a
            href="https://github.com/Not-A-DevStudio/libjiezhu"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-all rounded-xl hover:bg-emerald-50 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-95"
            title="GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}