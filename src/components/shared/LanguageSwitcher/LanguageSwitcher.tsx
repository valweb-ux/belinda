import type React from "react"
import { useTranslation } from "react-i18next"
import styles from "./LanguageSwitcher.module.scss"

const languages = [
  { code: "uk", name: "УКР" },
  { code: "en", name: "ENG" },
  { code: "fr", name: "FRA" },
]

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <div className={styles.languageSwitcher}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={i18n.language === lang.code ? styles.active : ""}
        >
          {lang.name}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher

