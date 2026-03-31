import { useTranslation } from "react-i18next";
import { Languages, Github } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export function Header() {
  const { t, i18n } = useTranslation();
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("zh") ? "en" : "zh";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-950/60 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter">
          <img src={logoSrc} className="w-8 h-8" alt="Jiezhu Logo" />
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">Jiezhu</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 justify-center flex-1 text-sm font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
          <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer">{t("nav.features")}</a>
          <a href="#start" onClick={(e) => handleNavClick(e, 'start')} className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer">{t("nav.start")}</a>
          <a href="#principle" onClick={(e) => handleNavClick(e, 'principle')} className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer">{t("nav.principle")}</a>
          <a href="#philosophy" onClick={(e) => handleNavClick(e, 'philosophy')} className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer">{t("nav.philosophy")}</a>
          <a href="#roadmap" onClick={(e) => handleNavClick(e, 'roadmap')} className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer">{t("nav.roadmap")}</a>
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