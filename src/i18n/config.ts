import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import uk from "./locales/uk.json"
import en from "./locales/en.json"
import fr from "./locales/fr.json"

i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: "uk",
  fallbackLng: "uk",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

