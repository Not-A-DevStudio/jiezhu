import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import zhTranslation from "./locales/zh.json";
import enTranslation from "./locales/en.json";

const resources = {
  en: {
    translation: enTranslation.translation,
  },
  zh: {
    translation: zhTranslation.translation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "zh",
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
