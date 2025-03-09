"use client"

import { useState } from "react"
import type { GetServerSideProps } from "next"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import styles from "./Music.module.scss"

interface MusicTrack {
  id: string
  title: string
  artist: string
  youtubeId: string
  thumbnail: string
  releaseDate: string
}

interface MusicPageProps {
  initialTracks: MusicTrack[]
  total: number
}

export default function MusicPage({ initialTracks, total }: MusicPageProps) {
  const { t } = useTranslation()
  const [tracks, setTracks] = useState(initialTracks)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const loadMore = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/music?page=${page + 1}`)
      const data = await response.json()
      setTracks([...tracks, ...data.tracks])
      setPage(page + 1)
    } catch (error) {
      console.error("Error loading more tracks:", error)
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>{t("music.pageTitle")} - Шері ФМ</title>
        <meta name="description" content={t("music.pageDescription")} />
      </Head>

      <div className={styles.container}>
        <h1>{t("music.title")}</h1>

        <div className={styles.tracksGrid}>
          {tracks.map((track) => (
            <div key={track.id} className={styles.trackCard}>
              <div className={styles.thumbnail}>
                <img src={track.thumbnail || "/placeholder.svg"} alt={track.title} />
                <a
                  href={`https://youtube.com/watch?v=${track.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.playButton}
                >
                  ?
                </a>
              </div>
              <div className={styles.trackInfo}>
                <h3>{track.title}</h3>
                <p>{track.artist}</p>
                <time>{new Date(track.releaseDate).toLocaleDateString()}</time>
              </div>
            </div>
          ))}
        </div>

        {tracks.length < total && (
          <button className={styles.loadMore} onClick={loadMore} disabled={loading}>
            {loading ? t("common.loading") : t("music.loadMore")}
          </button>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    const response = await fetch(`${process.env.API_URL}/music?page=1&locale=${locale}`)
    const data = await response.json()

    return {
      props: {
        initialTracks: data.tracks,
        total: data.total,
      },
    }
  } catch (error) {
    console.error("Error fetching music:", error)
    return {
      props: {
        initialTracks: [],
        total: 0,
      },
    }
  }
}

