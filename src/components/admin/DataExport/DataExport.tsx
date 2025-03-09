"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  CloudDownload as ExportIcon,
  CloudUpload as ImportIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import styles from "./DataExport.module.scss"

interface ExportOption {
  key: string
  label: string
  description: string
}

const exportOptions: ExportOption[] = [
  {
    key: "users",
    label: "Користувачі",
    description: "Експорт даних користувачів (без паролів)",
  },
  {
    key: "articles",
    label: "Статті",
    description: "Експорт всіх статей та їх метаданих",
  },
  {
    key: "comments",
    label: "Коментарі",
    description: "Експорт коментарів до статей",
  },
  {
    key: "files",
    label: "Файли",
    description: "Експорт метаданих файлів (без самих файлів)",
  },
  {
    key: "settings",
    label: "Налаштування",
    description: "Експорт налаштувань системи",
  },
  {
    key: "logs",
    label: "Логи",
    description: "Експорт системних логів",
  },
]

export const DataExport: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    success: string[]
    errors: string[]
    warnings: string[]
  } | null>(null)

  const handleExport = async () => {
    if (!selectedOptions.length) {
      setError("Виберіть хоча б один тип даних для експорту")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ types: selectedOptions }),
      })

      if (!response.ok) {
        throw new Error("Помилка експорту даних")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `export-${format(new Date(), "yyyy-MM-dd-HH-mm", {
        locale: uk,
      })}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting data:", error)
      setError("Помилка експорту даних")
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      setError("Виберіть файл для імпорту")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setImportProgress(0)
      setImportResults(null)

      const formData = new FormData()
      formData.append("file", importFile)

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Помилка імпорту даних")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let result = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          result += decoder.decode(value)
          const lines = result.split("\n")

          for (const line of lines) {
            try {
              const data = JSON.parse(line)
              if (data.progress) {
                setImportProgress(data.progress)
              }
            } catch {
              // Ігноруємо неповні рядки
            }
          }
        }
      }

      const data = await response.json()
      setImportResults(data)
    } catch (error) {
      console.error("Error importing data:", error)
      setError("Помилка імпорту даних")
    } finally {
      setLoading(false)
      setImportProgress(100)
    }
  }

  return (
    <div className={styles.dataExport}>
      <Card>
        <CardContent>
          <div className={styles.header}>
            <Typography variant="h2">Експорт/Імпорт даних</Typography>
          </div>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          <div className={styles.section}>
            <Typography variant="h6" gutterBottom>
              Експорт даних
            </Typography>
            <Typography variant="body2" gutterBottom>
              Виберіть типи даних для експорту:
            </Typography>

            <div className={styles.options}>
              {exportOptions.map((option) => (
                <FormControlLabel
                  key={option.key}
                  control={
                    <Checkbox
                      checked={selectedOptions.includes(option.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOptions([...selectedOptions, option.key])
                        } else {
                          setSelectedOptions(selectedOptions.filter((key) => key !== option.key))
                        }
                      }}
                    />
                  }
                  label={
                    <div>
                      <Typography variant="subtitle1">{option.label}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {option.description}
                      </Typography>
                    </div>
                  }
                />
              ))}
            </div>

            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              disabled={loading || !selectedOptions.length}
              className={styles.button}
            >
              {loading ? "Експортуємо..." : "Експортувати"}
            </Button>
          </div>

          <div className={styles.section}>
            <Typography variant="h6" gutterBottom>
              Імпорт даних
            </Typography>
            <Typography variant="body2" gutterBottom>
              Виберіть файл для імпорту:
            </Typography>

            <div className={styles.import}>
              <Button
                variant="outlined"
                startIcon={<ImportIcon />}
                onClick={() => setShowImport(true)}
                disabled={loading}
                className={styles.button}
              >
                Імпортувати дані
              </Button>
            </div>
          </div>

          {loading && (
            <div className={styles.loading}>
              <CircularProgress />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Діалог імпорту */}
      <Dialog
        open={showImport}
        onClose={() => {
          setShowImport(false)
          setImportFile(null)
          setImportProgress(0)
          setImportResults(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Імпорт даних</DialogTitle>
        <DialogContent>
          {!importResults ? (
            <div className={styles.importDialog}>
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className={styles.fileInput}
              />

              {importFile && <Typography variant="body2">Вибрано файл: {importFile.name}</Typography>}

              {importProgress > 0 && (
                <div className={styles.progress}>
                  <LinearProgress variant="determinate" value={importProgress} />
                  <Typography variant="body2">{importProgress}%</Typography>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.importResults}>
              {importResults.success.length > 0 && (
                <List>
                  <Typography variant="subtitle2" gutterBottom>
                    Успішно імпортовано:
                  </Typography>
                  {importResults.success.map((msg, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckIcon className={styles.successIcon} />
                      </ListItemIcon>
                      <ListItemText primary={msg} />
                    </ListItem>
                  ))}
                </List>
              )}

              {importResults.warnings.length > 0 && (
                <List>
                  <Typography variant="subtitle2" gutterBottom>
                    Попередження:
                  </Typography>
                  {importResults.warnings.map((msg, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <WarningIcon className={styles.warningIcon} />
                      </ListItemIcon>
                      <ListItemText primary={msg} />
                    </ListItem>
                  ))}
                </List>
              )}

              {importResults.errors.length > 0 && (
                <List>
                  <Typography variant="subtitle2" gutterBottom>
                    Помилки:
                  </Typography>
                  {importResults.errors.map((msg, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <ErrorIcon className={styles.errorIcon} />
                      </ListItemIcon>
                      <ListItemText primary={msg} />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {!importResults ? (
            <>
              <Button
                onClick={() => {
                  setShowImport(false)
                  setImportFile(null)
                  setImportProgress(0)
                }}
                disabled={loading}
              >
                Скасувати
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importFile || loading}
                variant="contained"
                startIcon={<ImportIcon />}
              >
                {loading ? "Імпортуємо..." : "Імпортувати"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setShowImport(false)
                setImportFile(null)
                setImportProgress(0)
                setImportResults(null)
              }}
            >
              Закрити
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

