import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import styles from "./NewsCard.module.scss"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
}

export const NewsCard: React.FC<NewsCardProps> = ({ id, title, excerpt, image, date }) => {
  const { t } = useTranslation()

  return (
    <Link href={`/news/${id}`}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image src={image || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" />
        </div>
        <div className={styles.content}>
          <h2>{title}</h2>
          <p>{excerpt}</p>
          <time dateTime={date}>
            {new Date(date).toLocaleDateString(t("locale"), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </Link>
  )
}

