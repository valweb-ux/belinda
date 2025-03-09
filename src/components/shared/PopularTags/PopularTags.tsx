import type React from "react"
import Link from "next/link"
import styles from "./PopularTags.module.scss"

interface PopularTagsProps {
  tags: string[]
}

const PopularTags: React.FC<PopularTagsProps> = ({ tags }) => {
  return (
    <div className={styles.tags}>
      {tags.map((tag, index) => (
        <Link key={index} href={`/tag/${tag}`} className={styles.tag}>
          {tag}
        </Link>
      ))}
    </div>
  )
}

export default PopularTags

