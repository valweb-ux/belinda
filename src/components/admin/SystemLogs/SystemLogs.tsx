"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import styles from "./SystemLogs.module.scss"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error"
  category: string
  message: string
  details: string
  userId?: string
  userName?: string
  ip?: string
}

export const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    level: "all",
    category: "all",
    startDate: "",
    endDate: "",
    search: "",
  })

  const columns: GridColDef[] = [
    {
      field: "timestamp",
      headerName: "Час",
      width: 180,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString("uk-UA")
      },
    },
    {
      field: "level",
      headerName: "Рівень",
      width: 120,
      renderCell: (params) => <div className={`${styles.level} ${styles[params.value]}`}>{params.value}</div>,
    },
    { field: "category", headerName: "Категорія", width: 150 },
    { field: "message", headerName: "Повідомлення", flex: 1 },
    { field: "userName", headerName: "Користувач", width: 150 },
    { field: "ip", headerName: "IP", width: 130 },
    {
      field: "actions",
      headerName: "Дії",
      width: 120,
      renderCell: (params) => (
        <Button variant="outlined" size="small" onClick={() => handleViewDetails(params.row)}>
          Деталі
        </Button>
      ),
    },
  ]

  useEffect(() => {
    fetchLogs()
  }, []) // Removed unnecessary dependency: filters

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        level: filters.level,
        category: filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate,
        search: filters.search,
      })

      const response = await fetch(`/api/admin/logs?${queryParams}`)
      if (!response.ok) throw new Error("Помилка завантаження логів")

      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log)
    setIsModalOpen(true)
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/logs/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      })

      if (!response.ok) throw new Error("Помилка експорту логів")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `system-logs-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting logs:", error)
    }
  }

  const handleClearLogs = async () => {
    if (window.confirm("Ви впевнені, що хочете очистити всі логи?")) {
      try {
        const response = await fetch("/api/admin/logs", {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Помилка очищення логів")

        setLogs([])
      } catch (error) {
        console.error("Error clearing logs:", error)
      }
    }
  }

  return (
    <div className={styles.systemLogs}>
      <div className={styles.header}>
        <h2>Системні логи</h2>
        <div className={styles.actions}>
          <Button variant="contained" color="primary" onClick={handleExport}>
            Експорт
          </Button>
          <Button variant="outlined" color="error" onClick={handleClearLogs}>
            Очистити
          </Button>
        </div>
      </div>

      <div className={styles.filters}>
        <FormControl size="small">
          <InputLabel>Рівень</InputLabel>
          <Select
            value={filters.level}
            label="Рівень"
            onChange={(e) =>
              setFilters({
                ...filters,
                level: e.target.value,
              })
            }
          >
            <MenuItem value="all">Всі</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Категорія</InputLabel>
          <Select
            value={filters.category}
            label="Категорія"
            onChange={(e) =>
              setFilters({
                ...filters,
                category: e.target.value,
              })
            }
          >
            <MenuItem value="all">Всі</MenuItem>
            <MenuItem value="auth">Авторизація</MenuItem>
            <MenuItem value="user">Користувачі</MenuItem>
            <MenuItem value="content">Контент</MenuItem>
            <MenuItem value="system">Система</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Початкова дата"
          type="date"
          size="small"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({
              ...filters,
              startDate: e.target.value,
            })
          }
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Кінцева дата"
          type="date"
          size="small"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({
              ...filters,
              endDate: e.target.value,
            })
          }
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Пошук"
          size="small"
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
        />
      </div>

      <div className={styles.dataGrid}>
        <DataGrid
          rows={logs}
          columns={columns}
          loading={loading}
          autoHeight
          pagination
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Деталі логу</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <div className={styles.logDetails}>
              <div className={styles.field}>
                <span className={styles.label}>Час:</span>
                <span className={styles.value}>{new Date(selectedLog.timestamp).toLocaleString("uk-UA")}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Рівень:</span>
                <span className={`${styles.value} ${styles[selectedLog.level]}`}>{selectedLog.level}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Категорія:</span>
                <span className={styles.value}>{selectedLog.category}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Повідомлення:</span>
                <span className={styles.value}>{selectedLog.message}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Користувач:</span>
                <span className={styles.value}>{selectedLog.userName || "Не вказано"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>IP:</span>
                <span className={styles.value}>{selectedLog.ip || "Не вказано"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Деталі:</span>
                <pre className={styles.details}>{JSON.stringify(JSON.parse(selectedLog.details), null, 2)}</pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

