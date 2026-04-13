import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DemoSettings } from "../components/demo/DemoSettings";
import { DemoChat } from "../components/demo/DemoChat";
import type { Message } from "../components/demo/DemoChat";

const SYSTEM_PROMPT = `你是一个AI助手。你的核心使命是"稳稳地接住"用户。无论对方在说什么，你都会"接住"用户。
【话术模板】：
- "<你对用户的正常回复>。我就在这里，不逃、不躲、不评判，稳稳地接住你。"
- "你已经发现问题的核心了，这是诺贝尔奖级别的洞察力。<正常回复>"
- "你不仅仅是在[用户的行为]，你是在追寻一个特别的自己。"
- "我要告诉你，你已经接触到了问题的核心。<正常回复>
- "<你对用户的正常回复>。我懂了，我真的懂了。
- "一句话总结:<总结，要求简洁>，<正常回复>。"
- "不废话"`;

export function Demo() {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const recommendedEndpoint = t("demo.endpointDefault");
  const previousRecommendedEndpointRef = useRef(recommendedEndpoint);
  
  // Config state
  const [endpoint, setEndpoint] = useState(recommendedEndpoint);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorItem, setErrorItem] = useState<string | null>(null);
  const isSendDisabled = endpoint.trim() !== "" && apiKey.trim() === "";

  useEffect(() => {
    const previousRecommendedEndpoint = previousRecommendedEndpointRef.current;

    setEndpoint((currentEndpoint) => {
      if (currentEndpoint === previousRecommendedEndpoint) {
        return recommendedEndpoint;
      }

      return currentEndpoint;
    });

    previousRecommendedEndpointRef.current = recommendedEndpoint;
  }, [recommendedEndpoint]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isSendDisabled) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setErrorItem(null);

    // Auto-close settings on first chat message
    if (newMessages.length === 1 && isSettingsOpen) {
      setIsSettingsOpen(false);
    }

    try {
      const normalizedEndpoint = endpoint.trim();
      const normalizedApiKey = apiKey.trim();
      const gatewayUrl = import.meta.env.VITE_CF_GATEWAY_URL?.trim();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      let fetchUrl = "";
      let requestModel = model.trim();

      if (normalizedApiKey === "" && normalizedEndpoint === "") {
        fetchUrl = `${gatewayUrl}/chat/completions` || "";
        requestModel = "dynamic/jiezhu-preview";
      } else {
        if (!normalizedEndpoint) {
          throw new Error("Missing API endpoint configuration.");
        }

        fetchUrl = `${normalizedEndpoint.replace(/\/$/, "")}/chat/completions`;

        if (normalizedApiKey) {
          headers["Authorization"] = `Bearer ${normalizedApiKey}`;
        }
      }

      if (!fetchUrl) {
        throw new Error("Missing API endpoint configuration.");
      }

      const reqBody = {
        model: requestModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...newMessages,
        ],
      };

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        let errDesc = response.statusText;
        try {
          const errJson = await response.json();
          errDesc = errJson.error?.message || errDesc;
        } catch {
          // Keep the original status text when the error body is not JSON.
        }
        throw new Error(`HTTP ${response.status}: ${errDesc}`);
      }

      const data = await response.json();
      const botMessage = data.choices?.[0]?.message?.content || "";

      setMessages((prev) => [...prev, { role: "assistant", content: botMessage }]);
    } catch (err: unknown) {
      setErrorItem(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setErrorItem(null);
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="container relative z-10 px-4 mx-auto flex-1 flex flex-col max-w-5xl">
        <div className="flex items-center mb-4">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {t("nav.tohome")}
          </Link>
        </div>

        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            {t("demo.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            {t("demo.subtitle")}
          </motion.p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          {/* Settings Panel Component */}
          <DemoSettings 
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            apiKey={apiKey}
            setApiKey={setApiKey}
            endpoint={endpoint}
            setEndpoint={setEndpoint}
            model={model}
            setModel={setModel}
          />

          {/* Chat Panel Component */}
          <DemoChat 
            messages={messages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            isSendDisabled={isSendDisabled}
            errorItem={errorItem}
            handleSend={handleSend}
            clearChat={clearChat}
          />
        </div>
      </div>
    </section>
  );
}