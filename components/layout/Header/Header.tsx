import { useTranslation } from "react-i18next"
import Link from "next/link"

const Header = () => {
  const { t } = useTranslation()

  return (
    <header>
      <nav>
        <Link href="/">{t("menu.home")}</Link>
        <Link href="/news">{t("menu.news")}</Link>
        <Link href="/programs">{t("menu.programs")}</Link>
        <Link href="/artists">{t("menu.artists")}</Link>
        <Link href="/music">{t("menu.music")}</Link>
        <Link href="/support">{t("menu.support")}</Link>
      </nav>
    </header>
  )
}

export default Header

