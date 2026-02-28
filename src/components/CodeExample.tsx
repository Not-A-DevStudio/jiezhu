import { useTranslation } from "react-i18next";
import { Terminal } from "lucide-react";

export function CodeExample() {
  const { t } = useTranslation();

  return (
    <section id="start" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 px-4 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider">
            {t("nav.start")}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            {t("start.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Python Example */}
          <div className="group rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-zinc-900/5 dark:ring-white/5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 ml-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                </div>
                <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-white dark:bg-zinc-800 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <Terminal size={14} className="text-emerald-500" />
                  <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">app.py</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 mr-2">{t("start.pyVersion")}</h3>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                {t("start.pyDesc")}
              </p>
              <pre className="bg-[#0d1117] text-zinc-50 p-6 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed shadow-inner border border-zinc-800 ring-1 ring-inset ring-white/10">
                <code>
<span className="text-[#ff7b72]">from</span> <span className="text-zinc-200">jiezhu</span> <span className="text-[#ff7b72]">import</span> <span className="text-emerald-300">install</span>
{"\n\n"}
<span className="text-zinc-500 italic"># Explicit installation</span>{"\n"}
<span className="text-[#d2a8ff]">install</span><span className="text-zinc-200">(</span><span className="text-emerald-300">require_confirm</span><span className="text-[#ff7b72]">=</span><span className="text-[#79c0ff]">True</span><span className="text-zinc-200">)</span>
                </code>
              </pre>
            </div>
          </div>

          {/* C++ Example */}
          <div className="group rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-zinc-900/5 dark:ring-white/5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 ml-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                </div>
                <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-white dark:bg-zinc-800 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <Terminal size={14} className="text-blue-500" />
                  <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">main.cpp</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 mr-2">{t("start.cppVersion")}</h3>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                {t("start.cppDesc")}
              </p>
              <pre className="bg-[#0d1117] text-zinc-50 p-6 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed shadow-inner border border-zinc-800 ring-1 ring-inset ring-white/10">
                <code>
<span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">"jie/jiezhu.hpp"</span>
{"\n\n"}
<span className="text-zinc-500 italic">// Pure mode</span>{"\n"}
<span className="text-[#ff7b72]">auto</span> <span className="text-zinc-200">res = client.</span><span className="text-[#d2a8ff]">chat_completion_create</span><span className="text-zinc-200">(req);</span>
{"\n\n"}
<span className="text-zinc-500 italic">// Jiezhu mode</span>{"\n"}
<span className="text-[#ff7b72]">auto</span> <span className="text-zinc-200">res_ok = client.</span><span className="text-[#d2a8ff]">chat_completion_jiezhu</span><span className="text-zinc-200">(req);</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}