import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import styles from "./Header.module.scss"
import LanguageSwitcher from "../../shared/LanguageSwitcher/LanguageSwitcher"
import SearchBar from "../../shared/SearchBar/SearchBar"
import Player from "../../shared/Player/Player"

const Header: React.FC = () => {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.socialLinks}>
          <a href="https://www.facebook.com/cherieukraine" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://www.youtube.com/@cheriefm.ukraine" target="_blank" rel="noopener noreferrer">
            Youtube
          </a>
        </div>

        <div className={styles.rightSection}>
          <Link href="/sitemap">{t("menu.siteMap")}</Link>
          <Link href="/contacts">{t("menu.contacts")}</Link>
          <SearchBar />
          <LanguageSwitcher />
        </div>
      </div>

      <div className={styles.mainNav}>
        <div className={styles.logo}>
          <Image src="/images/logo.svg" alt="Шері ФМ" width={60} height={60} />
          <p className={styles.slogan}>{t("slogan")}</p>
        </div>

        <nav className={styles.navigation}>
          <Link href="/">{t("menu.home")}</Link>
          <Link href="/news">{t("menu.news")}</Link>
          <Link href="/programs">{t("menu.programs")}</Link>
          <Link href="/artists">{t("menu.artists")}</Link>
          <Link href="/music">{t("menu.music")}</Link>
          <Link href="/support" className={styles.supportButton}>
            {t("menu.support")}
          </Link>
        </nav>
      </div>

      <div className={styles.playerWrapper}>
        <Player />
      </div>
    </header>
  )
}

export default Header

