import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  uk: {
    translation: {
      slogan: "Відчуй гарну музику",
      country: "Україна",
      menu: {
        home: "Головна",
        news: "Новини",
        programs: "Програми",
        artists: "Виконавці",
        music: "Музика",
        support: "Підтримати",
      },
    },
  },
  en: {
    translation: {
      slogan: "Feel good music",
      country: "Ukraine",
      menu: {
        home: "Home",
        news: "News",
        programs: "Programs",
        artists: "Artists",
        music: "Music",
        support: "Support",
      },
    },
  },
  fr: {
    translation: {
      slogan: "Feel good music",
      country: "Ukraine",
      menu: {
        home: "Accueil",
        news: "Actualités",
        programs: "Programmes",
        artists: "Artistes",
        music: "Musique",
        support: "Soutenir",
      },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "uk",
  fallbackLng: "uk",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

