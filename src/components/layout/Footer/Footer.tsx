import type React from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import styles from "./Footer.module.scss"

export const Footer: React.FC = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.logoSection}>
            <img src="/images/logo.svg" alt="Шері ФМ" className={styles.logo} />
            <p className={styles.country}>{t("footer.country")}</p>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.column}>
              <h3>{t("footer.navigation")}</h3>
              <nav>
                <Link href="/">{t("menu.home")}</Link>
                <Link href="/news">{t("menu.news")}</Link>
                <Link href="/programs">{t("menu.programs")}</Link>
                <Link href="/artists">{t("menu.artists")}</Link>
                <Link href="/music">{t("menu.music")}</Link>
              </nav>
            </div>

            <div className={styles.column}>
              <h3>{t("footer.social")}</h3>
              <nav>
                <a href="https://www.facebook.com/cherieukraine" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
                <a href="https://www.youtube.com/@cheriefm.ukraine" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </nav>
            </div>

            <div className={styles.column}>
              <h3>{t("footer.info")}</h3>
              <nav>
                <Link href="/about">{t("footer.about")}</Link>
                <Link href="/contacts">{t("footer.contacts")}</Link>
                <Link href="/privacy">{t("footer.privacy")}</Link>
                <Link href="/terms">{t("footer.terms")}</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {currentYear} Шері ФМ. {t("footer.rights")}
          </p>
          <div className={styles.developerInfo}>
            <p>{t("footer.developed")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

