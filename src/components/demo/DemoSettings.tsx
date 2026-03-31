import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";

interface DemoSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  apiKey: string;
  setApiKey: (val: string) => void;
  endpoint: string;
  setEndpoint: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
}

export function DemoSettings({
  isSettingsOpen,
  setIsSettingsOpen,
  apiKey,
  setApiKey,
  endpoint,
  setEndpoint,
  model,
  setModel,
}: DemoSettingsProps) {
  const { t } = useTranslation();
  const shouldRemindApiKey = endpoint.trim() !== "" && apiKey.trim() === "";
  const shouldRemindModelIgnored = endpoint.trim() === "" && apiKey.trim() === "";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full lg:w-80 flex-shrink-0"
    >
      <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl shadow-lg ring-1 ring-zinc-900/5 dark:ring-white/5 overflow-hidden">
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full flex items-center justify-between p-5 border-b border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
            <Settings size={18} className="text-emerald-500" />
            {t("demo.settings")}
          </div>
          {isSettingsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        <AnimatePresence initial={false}>
          {isSettingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-4">
                {/* API Key */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("demo.apiKey")}
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t("demo.apiKeyPlaceholder")}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-zinc-100 transition-shadow"
                  />
                  {shouldRemindApiKey && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {t("demo.apiKeyReminder")}
                    </p>
                  )}
                </div>

                {/* Endpoint (Always visible) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("demo.endpoint", "API Endpoint")}
                  </label>
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder={t("demo.endpointPlaceholder", "e.g., https://api.openai.com/v1")}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-zinc-100 transition-shadow"
                  />
                </div>

                {/* Model */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("demo.model", "Model")}
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder={t("demo.modelPlaceholder", "e.g., gpt-4o-mini")}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-zinc-100 transition-shadow"
                  />
                  {shouldRemindModelIgnored && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {t("demo.modelIgnoredReminder")}
                    </p>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}