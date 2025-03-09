"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { Refresh as RefreshIcon, People, Storage, Speed } from "@mui/icons-material"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { format } from "date-fns"
import styles from "./Analytics.module.scss"

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    storageUsed: number
    averageResponseTime: number
  }
  userActivity: {
    date: string
    visits: number
    actions: number
  }[]
  userDistribution: {
    role: string
    count: number
  }[]
  systemMetrics: {
    timestamp: string
    cpu: number
    memory: number
    disk: number
  }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState("week")

  useEffect(() => {
    fetchData()
  }, []) // Removed unnecessary dependency 'period'

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/analytics?period=${period}`)
      if (!response.ok) throw new Error("Помилка завантаження даних")

      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setError("Не вдалося завантажити аналітику")
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <Alert severity="error" className={styles.alert}>
        {error}
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert severity="error" className={styles.alert}>
        Дані аналітики недоступні
      </Alert>
    )
  }

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <Typography variant="h2">Аналітика</Typography>
        <div className={styles.actions}>
          <FormControl variant="outlined" size="small">
            <InputLabel>Період</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value as string)} label="Період">
              <MenuItem value="day">День</MenuItem>
              <MenuItem value="week">Тиждень</MenuItem>
              <MenuItem value="month">Місяць</MenuItem>
              <MenuItem value="year">Рік</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Оновити">
            <IconButton onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Огляд */}
      <Grid container spacing={3} className={styles.overview}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <div className={styles.stat}>
                <div className={styles.icon}>
                  <People />
                </div>
                <div className={styles.info}>
                  <Typography variant="h6">Користувачі</Typography>
                  <Typography variant="h4">{data.overview.totalUsers}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Активних: {data.overview.activeUsers}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <div className={styles.stat}>
                <div className={styles.icon}>
                  <Storage />
                </div>
                <div className={styles.info}>
                  <Typography variant="h6">Сховище</Typography>
                  <Typography variant="h4">{formatBytes(data.overview.storageUsed)}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Використано
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <div className={styles.stat}>
                <div className={styles.icon}>
                  <Speed />
                </div>
                <div className={styles.info}>
                  <Typography variant="h6">Швидкодія</Typography>
                  <Typography variant="h4">{data.overview.averageResponseTime}ms</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Середній час відповіді
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Графіки */}
      <Grid container spacing={3} className={styles.charts}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Активність користувачів
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "dd.MM")} />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" name="Візити" />
                  <Line type="monotone" dataKey="actions" stroke="#82ca9d" name="Дії" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Розподіл користувачів
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.userDistribution}
                    dataKey="count"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Системні метрики
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.systemMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(timestamp) => format(new Date(timestamp), "HH:mm")} />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Bar dataKey="cpu" fill="#8884d8" name="CPU (%)" />
                  <Bar dataKey="memory" fill="#82ca9d" name="Пам'ять (%)" />
                  <Bar dataKey="disk" fill="#ffc658" name="Диск (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

