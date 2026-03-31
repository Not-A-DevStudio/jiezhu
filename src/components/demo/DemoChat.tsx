import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Send, Sparkles, AlertCircle, Trash2, Bot, User } from "lucide-react";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DemoChatProps {
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  isSendDisabled: boolean;
  errorItem: string | null;
  handleSend: () => void;
  clearChat: () => void;
}

export function DemoChat({
  messages,
  input,
  setInput,
  isLoading,
  isSendDisabled,
  errorItem,
  handleSend,
  clearChat,
}: DemoChatProps) {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="flex-1 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl shadow-2xl ring-1 ring-zinc-900/5 dark:ring-white/5 overflow-hidden flex flex-col h-[600px] lg:h-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <span className="ml-2 font-medium text-zinc-700 dark:text-zinc-300 font-mono text-sm">{t("demo.chatArea", "Chat Interface")}</span>
        </div>
        <button
          onClick={clearChat}
          disabled={messages.length === 0}
          className="p-2 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={t("demo.clear", "Clear Chat") as string}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <Sparkles size={48} className="text-emerald-500 mb-4 opacity-50" />
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
              {t("demo.emptyChat", "Send a message to start experiencing the \"Jiezhu\" empathy layer.")}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300" : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"}`}>
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user" ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-sm" : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50 rounded-tl-sm shadow-sm"}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))
        )}
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Bot size={20} />
            </div>
            <div className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </motion.div>
        )}

        {errorItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/50 p-4 rounded-2xl rounded-tl-sm">
              <p className="font-semibold mb-1">{t("demo.errorTitle", "Oops, failed to catch:")}</p>
              <p className="text-sm font-mono break-all">{errorItem}</p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-50/80 dark:bg-zinc-900/80 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="relative flex items-end gap-2 bg-white dark:bg-zinc-950 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-emerald-500/30 transition-shadow shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("demo.placeholder", "Type your message here... Press Enter to send") as string}
            className="w-full max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none px-3 py-2.5 text-zinc-900 dark:text-zinc-100 custom-scrollbar outline-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isSendDisabled}
            className="p-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-zinc-900 dark:disabled:hover:bg-zinc-100 transition-all flex-shrink-0 disabled:cursor-not-allowed mb-0.5 mr-0.5"
            title={t("demo.send", "Send") as string}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}