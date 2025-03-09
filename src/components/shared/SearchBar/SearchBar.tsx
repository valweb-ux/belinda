"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { Search } from "lucide-react"
import styles from "./SearchBar.module.scss"

const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { t } = useTranslation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsOpen(false)
    }
  }

  return (
    <div className={styles.searchBar}>
      <button className={styles.searchButton} onClick={() => setIsOpen(!isOpen)} aria-label={t("search")}>
        <Search size={20} />
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            autoFocus
          />
          <button type="submit">{t("searchButton")}</button>
        </form>
      )}
    </div>
  )
}

export default SearchBar

