import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
  resources: {
    uk: {
      translation: require("../../public/locales/uk/common.json"),
    },
    en: {
      translation: require("../../public/locales/en/common.json"),
    },
    fr: {
      translation: require("../../public/locales/fr/common.json"),
    },
  },
  lng: "uk",
  fallbackLng: "uk",

  interpolation: {
    escapeValue: false,
  },
})

export default i18n

