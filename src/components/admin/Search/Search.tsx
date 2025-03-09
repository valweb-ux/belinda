"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Comment as CommentIcon,
  Folder as FolderIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Info as InfoIcon,
} from "@mui/icons-material"
import { debounce } from "lodash"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import styles from "./Search.module.scss"

interface SearchResult {
  id: string
  type: "user" | "article" | "comment" | "file" | "setting" | "log"
  title: string
  description: string
  url?: string
  createdAt: string
  data?: Record<string, any>
}

export const Search: React.FC = () => {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState<SearchResult | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    // Завантажуємо останні пошукові запити з localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const performSearch = useCallback(
    debounce(async (searchQuery: string, type = "all") => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}&type=${type}`)

        if (!response.ok) {
          throw new Error("Помилка пошуку")
        }

        const data = await response.json()
        setResults(data.results)
        saveRecentSearch(searchQuery)
      } catch (error) {
        console.error("Error performing search:", error)
        setError("Помилка виконання пошуку")
      } finally {
        setLoading(false)
      }
    }, 300),
    [],
  )

  useEffect(() => {
    if (query) {
      performSearch(query, activeTab)
    } else {
      setResults([])
    }
  }, [query, activeTab, performSearch])

  const getResultIcon = (type: string) => {
    switch (type) {
      case "user":
        return <PersonIcon />
      case "article":
        return <ArticleIcon />
      case "comment":
        return <CommentIcon />
      case "file":
        return <FolderIcon />
      case "setting":
        return <SettingsIcon />
      case "log":
        return <HistoryIcon />
      default:
        return <InfoIcon />
    }
  }

  return (
    <div className={styles.search}>
      <Card>
        <CardContent>
          <div className={styles.header}>
            <Typography variant="h2">Пошук</Typography>
          </div>

          <div className={styles.searchBar}>
            <TextField
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Введіть пошуковий запит..."
              InputProps={{
                startAdornment: <SearchIcon />,
                endAdornment: query && (
                  <IconButton size="small" onClick={() => setQuery("")}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          </div>

          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} className={styles.tabs}>
            <Tab value="all" label="Всі" />
            <Tab value="user" label="Користувачі" />
            <Tab value="article" label="Статті" />
            <Tab value="comment" label="Коментарі" />
            <Tab value="file" label="Файли" />
            <Tab value="setting" label="Налаштування" />
            <Tab value="log" label="Логи" />
          </Tabs>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className={styles.loading}>
              <CircularProgress />
            </div>
          ) : results.length > 0 ? (
            <List className={styles.results}>
              {results.map((result) => (
                <ListItem key={result.id} className={styles.result} onClick={() => setShowDetails(result)}>
                  <ListItemIcon>{getResultIcon(result.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <div className={styles.resultHeader}>
                        <Typography variant="subtitle1">{result.title}</Typography>
                        <Chip
                          size="small"
                          label={format(new Date(result.createdAt), "dd.MM.yyyy HH:mm", { locale: uk })}
                        />
                      </div>
                    }
                    secondary={result.description}
                  />
                  {result.url && (
                    <Tooltip title="Перейти">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(result.url, "_blank")
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </ListItem>
              ))}
            </List>
          ) : query ? (
            <div className={styles.empty}>
              <Typography>Нічого не знайдено за запитом "{query}"</Typography>
            </div>
          ) : recentSearches.length > 0 ? (
            <div className={styles.recent}>
              <Typography variant="subtitle2" gutterBottom>
                Останні пошукові запити:
              </Typography>
              <div className={styles.recentQueries}>
                {recentSearches.map((recentQuery, index) => (
                  <Chip
                    key={index}
                    label={recentQuery}
                    onClick={() => setQuery(recentQuery)}
                    onDelete={() => {
                      const updated = recentSearches.filter((q) => q !== recentQuery)
                      setRecentSearches(updated)
                      localStorage.setItem("recentSearches", JSON.stringify(updated))
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Діалог деталей */}
      <Dialog open={!!showDetails} onClose={() => setShowDetails(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Деталі результату</DialogTitle>
        <DialogContent>
          {showDetails && (
            <div className={styles.details}>
              <Typography variant="subtitle2">Тип</Typography>
              <Chip icon={getResultIcon(showDetails.type)} label={showDetails.type} size="small" />

              <Typography variant="subtitle2">Заголовок</Typography>
              <Typography>{showDetails.title}</Typography>

              <Typography variant="subtitle2">Опис</Typography>
              <Typography>{showDetails.description}</Typography>

              <Typography variant="subtitle2">Час</Typography>
              <Typography>{format(new Date(showDetails.createdAt), "dd.MM.yyyy HH:mm:ss", { locale: uk })}</Typography>

              {showDetails.data && (
                <>
                  <Typography variant="subtitle2">Додаткові дані</Typography>
                  <pre>{JSON.stringify(showDetails.data, null, 2)}</pre>
                </>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {showDetails?.url && <Button onClick={() => window.open(showDetails.url, "_blank")}>Перейти</Button>}
          <Button onClick={() => setShowDetails(null)}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

