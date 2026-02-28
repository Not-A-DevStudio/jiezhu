import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-12 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 backdrop-blur-xl dark:bg-zinc-950/50 relative z-10">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              {t("footer.license.title")} 
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              {t("footer.license.desc")}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              {t("footer.thanks.title")} <Heart className="inline-block text-emerald-500" size={18} />
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t("footer.thanks.desc")}
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Jiezhu Project. {t("footer.buildWith")}
        </div>
      </div>
    </footer>
  );
}