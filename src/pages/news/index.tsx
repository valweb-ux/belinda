"use client"

import { useState } from "react"
import type { GetServerSideProps } from "next"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import { NewsCard } from "../../components/shared/NewsCard"
import { newsApi, type NewsResponse } from "../../services/api/news"
import styles from "./News.module.scss"

interface NewsPageProps {
  initialNews: NewsResponse
}

export default function NewsPage({ initialNews }: NewsPageProps) {
  const { t } = useTranslation()
  const [news, setNews] = useState(initialNews.items)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await newsApi.getLatestNews(nextPage)
      setNews([...news, ...response.items])
      setPage(nextPage)
    } catch (error) {
      console.error("Error loading more news:", error)
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>{t("news.pageTitle")} - Шері ФМ</title>
        <meta name="description" content={t("news.pageDescription")} />
      </Head>

      <div className={styles.container}>
        <h1>{t("news.title")}</h1>

        <div className={styles.newsGrid}>
          {news.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>

        {news.length < initialNews.total && (
          <button className={styles.loadMore} onClick={loadMore} disabled={loading}>
            {loading ? t("common.loading") : t("news.loadMore")}
          </button>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    const initialNews = await newsApi.getLatestNews(1, 9)
    return {
      props: {
        initialNews,
      },
    }
  } catch (error) {
    console.error("Error fetching initial news:", error)
    return {
      props: {
        initialNews: {
          items: [],
          total: 0,
          page: 1,
          pageSize: 9,
        },
      },
    }
  }
}

