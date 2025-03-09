"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material"
import {
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import styles from "./Backup.module.scss"

interface BackupFile {
  id: string
  filename: string
  size: number
  createdAt: string
  type: "manual" | "auto"
  status: "completed" | "failed"
}

export const Backup: React.FC = () => {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedBackup, setSelectedBackup] = useState<BackupFile | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      const response = await fetch("/api/admin/backup")
      if (!response.ok) throw new Error("Помилка завантаження резервних копій")

      const data = await response.json()
      setBackups(data)
    } catch (error) {
      console.error("Error fetching backups:", error)
      setError("Не вдалося завантажити список резервних копій")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    setCreating(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/backup", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Помилка створення резервної копії")

      await fetchBackups()
      setSuccess("Резервна копія успішно створена")
    } catch (error) {
      console.error("Error creating backup:", error)
      setError("Не вдалося створити резервну копію")
    } finally {
      setCreating(false)
    }
  }

  const handleDownloadBackup = async (backup: BackupFile) => {
    try {
      const response = await fetch(`/api/admin/backup/${backup.id}/download`)
      if (!response.ok) throw new Error("Помилка завантаження файлу")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = backup.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading backup:", error)
      setError("Не вдалося завантажити файл")
    }
  }

  const handleDeleteBackup = async (backup: BackupFile) => {
    try {
      const response = await fetch(`/api/admin/backup/${backup.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Помилка видалення резервної копії")

      await fetchBackups()
      setSuccess("Резервна копія успішно видалена")
    } catch (error) {
      console.error("Error deleting backup:", error)
      setError("Не вдалося видалити резервну копію")
    }
  }

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return

    setRestoring(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admin/backup/${selectedBackup.id}/restore`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Помилка відновлення з резервної копії")

      setSuccess("Система успішно відновлена з резервної копії")
      setShowRestoreDialog(false)
    } catch (error) {
      console.error("Error restoring backup:", error)
      setError("Не вдалося відновити систему з резервної копії")
    } finally {
      setRestoring(false)
      setSelectedBackup(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className={styles.backup}>
      <div className={styles.header}>
        <Typography variant="h2">Резервне копіювання</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BackupIcon />}
          onClick={handleCreateBackup}
          disabled={creating}
        >
          {creating ? "Створення..." : "Створити копію"}
        </Button>
      </div>

      {error && (
        <Alert severity="error" className={styles.alert}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className={styles.alert}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Назва файлу</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Розмір</TableCell>
                  <TableCell>Дата створення</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>{backup.filename}</TableCell>
                    <TableCell>
                      {backup.type === "auto" ? (
                        <Tooltip title="Автоматична копія">
                          <ScheduleIcon className={styles.typeIcon} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Ручна копія">
                          <BackupIcon className={styles.typeIcon} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>{formatFileSize(backup.size)}</TableCell>
                    <TableCell>{format(new Date(backup.createdAt), "PPp", { locale: uk })}</TableCell>
                    <TableCell>
                      <span className={`${styles.status} ${styles[backup.status]}`}>
                        {backup.status === "completed" ? "Завершено" : "Помилка"}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <div className={styles.actions}>
                        <Tooltip title="Завантажити">
                          <IconButton
                            onClick={() => handleDownloadBackup(backup)}
                            disabled={backup.status !== "completed"}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Відновити">
                          <IconButton
                            onClick={() => {
                              setSelectedBackup(backup)
                              setShowRestoreDialog(true)
                            }}
                            disabled={backup.status !== "completed"}
                          >
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Видалити">
                          <IconButton onClick={() => handleDeleteBackup(backup)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {backups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Резервні копії відсутні
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={showRestoreDialog} onClose={() => setShowRestoreDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Відновлення системи</DialogTitle>
        <DialogContent>
          <Typography>
            Ви дійсно бажаєте відновити систему з резервної копії? Це призведе до втрати всіх даних, які були змінені
            після її створення.
          </Typography>
          <Typography color="error" style={{ marginTop: 16 }}>
            Увага: Ця дія незворотна!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRestoreDialog(false)} disabled={restoring}>
            Скасувати
          </Button>
          <Button onClick={handleRestoreBackup} color="error" disabled={restoring} startIcon={<RestoreIcon />}>
            {restoring ? "Відновлення..." : "Відновити"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

