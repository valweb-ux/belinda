import type { GetServerSideProps } from "next"
import { useTranslation } from "react-i18next"
import styles from "./Home.module.scss"
import NewsCard from "../components/shared/NewsCard/NewsCard"
import Player from "../components/shared/Player/Player"
import PopularTags from "../components/shared/PopularTags/PopularTags"
import type React from "react"
import { SEO } from "../components/shared/SEO/SEO"
import { Layout } from "../components/layout/Layout"

interface HomeProps {
  news: NewsItem[]
  currentTrack: TrackInfo
  popularTags: string[]
}

interface NewsItem {
  id: string
  title: string
  image: string
  excerpt: string
  date: string
}

interface TrackInfo {
  title: string
  artist: string
}

const HomePage: React.FC<{ news: NewsItem[]; currentTrack: TrackInfo; popularTags: string[] }> = ({
  news,
  currentTrack,
  popularTags,
}) => {
  const { t } = useTranslation()

  return (
    <Layout>
      <SEO
        title="Шері ФМ - Головна сторінка"
        description="Ласкаво просимо на Шері ФМ - українське радіо для жінок. Слухайте гарну музику, дізнавайтесь цікаві новини та отримуйте корисні поради."
      />
      <div className={styles.container}>
        {/* Ad block */}
        <div className="c-block-display__inner js-block-display-inner" id="displayCovering"></div>

        {/* Main content */}
        <main className={styles.main}>
          <section className={styles.featuredNews}>
            <h2>{t("home.latestNews")}</h2>
            <div className={styles.newsGrid}>
              {news.map((item) => (
                <NewsCard key={item.id} {...item} />
              ))}
            </div>
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.playerWrapper}>
              <Player currentTrack={currentTrack} />
            </div>

            <div className={styles.popularTags}>
              <h3>{t("home.popularTags")}</h3>
              <PopularTags tags={popularTags} />
            </div>
          </aside>
        </main>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch news, current track, and popular tags from your API
  const news = await fetch("https://api.cherifm.com/news").then((res) => res.json())
  const currentTrack = await fetch("https://api.cherifm.com/current-track").then((res) => res.json())
  const popularTags = await fetch("https://api.cherifm.com/popular-tags").then((res) => res.json())

  return {
    props: {
      news,
      currentTrack,
      popularTags,
    },
  }
}

export default HomePage

