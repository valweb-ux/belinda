"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import styles from "./NewsEdit.module.scss"

const Editor = dynamic(() => import("../../../../components/shared/Editor"), { ssr: false })

interface NewsData {
  id: string
  title: {
    uk: string
    en: string
    fr: string
  }
  content: {
    uk: string
    en: string
    fr: string
  }
  image: string
  tags: {
    uk: string[]
    en: string[]
    fr: string[]
  }
  isPublished: boolean
  showOnHomepage: boolean
}

export default function NewsEdit() {
  const router = useRouter()
  const { id } = router.query
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [currentLang, setCurrentLang] = useState("uk")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchNewsData(id as string)
    }
  }, [id])

  const fetchNewsData = async (newsId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${newsId}`)
      const data = await response.json()
      setNewsData(data)
    } catch (error) {
      console.error("Error fetching news:", error)
    }
  }

  const handleSave = async () => {
    if (!newsData) return

    setIsSaving(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsData),
      })

      if (response.ok) {
        router.push("/admin/news")
      }
    } catch (error) {
      console.error("Error saving news:", error)
    }
    setIsSaving(false)
  }

  if (!newsData) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.newsEdit}>
      <header className={styles.header}>
        <h1>Редагування новини</h1>
        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      </header>

      <div className={styles.languageTabs}>
        <button className={currentLang === "uk" ? styles.active : ""} onClick={() => setCurrentLang("uk")}>
          Українська
        </button>
        <button className={currentLang === "en" ? styles.active : ""} onClick={() => setCurrentLang("en")}>
          English
        </button>
        <button className={currentLang === "fr" ? styles.active : ""} onClick={() => setCurrentLang("fr")}>
          Français
        </button>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Заголовок</label>
          <input
            type="text"
            value={newsData.title[currentLang]}
            onChange={(e) =>
              setNewsData({
                ...newsData,
                title: {
                  ...newsData.title,
                  [currentLang]: e.target.value,
                },
              })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Контент</label>
          <Editor
            value={newsData.content[currentLang]}
            onChange={(content) =>
              setNewsData({
                ...newsData,
                content: {
                  ...newsData.content,
                  [currentLang]: content,
                },
              })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Теги</label>
          <input
            type="text"
            value={newsData.tags[currentLang].join(", ")}
            onChange={(e) =>
              setNewsData({
                ...newsData,
                tags: {
                  ...newsData.tags,
                  [currentLang]: e.target.value.split(",").map((tag) => tag.trim()),
                },
              })
            }
          />
        </div>

        <div className={styles.options}>
          <label>
            <input
              type="checkbox"
              checked={newsData.isPublished}
              onChange={(e) =>
                setNewsData({
                  ...newsData,
                  isPublished: e.target.checked,
                })
              }
            />
            Опубліковано
          </label>

          <label>
            <input
              type="checkbox"
              checked={newsData.showOnHomepage}
              onChange={(e) =>
                setNewsData({
                  ...newsData,
                  showOnHomepage: e.target.checked,
                })
              }
            />
            Показувати на головній
          </label>
        </div>
      </div>
    </div>
  )
}

