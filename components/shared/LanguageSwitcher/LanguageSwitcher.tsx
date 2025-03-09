import { useTranslation } from "react-i18next"

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div>
      <button onClick={() => changeLanguage("uk")}>УКР</button>
      <button onClick={() => changeLanguage("en")}>ENG</button>
      <button onClick={() => changeLanguage("fr")}>FRA</button>
    </div>
  )
}

export default LanguageSwitcher

