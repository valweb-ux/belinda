"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Grid, Card, CardContent, Typography, CircularProgress, Alert } from "@mui/material"
import { People as PeopleIcon, MusicNote as MusicNoteIcon, AttachMoney as MoneyIcon } from "@mui/icons-material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import styles from "./Dashboard.module.scss"

interface DashboardStats {
  users: {
    total: number
    active: number
    premium: number
    growth: number[]
  }
  content: {
    tracks: number
    playlists: number
    totalDuration: number
    uploads: number[]
  }
  revenue: {
    total: number
    monthly: number
    subscriptions: {
      type: string
      count: number
      revenue: number
    }[]
    history: {
      date: string
      amount: number
    }[]
  }
  system: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    uptime: number
  }
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Оновлюємо кожну хвилину
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats")
      if (!response.ok) throw new Error("Помилка завантаження статистики")

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setError("Не вдалося завантажити статистику")
    } finally {
      setLoading(false)
    }
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
      <div className={styles.error}>
        <Alert severity="error">{error}</Alert>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className={styles.dashboard}>
      <Typography variant="h2" className={styles.title}>
        Панель керування
      </Typography>

      <Grid container spacing={3}>
        {/* Статистика користувачів */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.card}>
            <CardContent>
              <div className={styles.cardHeader}>
                <PeopleIcon className={styles.icon} />
                <Typography variant="h6">Користувачі</Typography>
              </div>
              <Typography variant="h4" className={styles.value}>
                {stats.users.total.toLocaleString()}
              </Typography>
              <Typography color="textSecondary">Активних: {stats.users.active.toLocaleString()}</Typography>
              <Typography color="textSecondary">Premium: {stats.users.premium.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Статистика контенту */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.card}>
            <CardContent>
              <div className={styles.cardHeader}>
                <MusicNoteIcon className={styles.icon} />
                <Typography variant="h6">Контент</Typography>
              </div>
              <Typography variant="h4" className={styles.value}>
                {stats.content.tracks.toLocaleString()}
              </Typography>
              <Typography color="textSecondary">Плейлистів: {stats.content.playlists.toLocaleString()}</Typography>
              <Typography color="textSecondary">
                Тривалість: {Math.round(stats.content.totalDuration / 3600)} год
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Статистика доходів */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.card}>
            <CardContent>
              <div className={styles.cardHeader}>
                <MoneyIcon className={styles.icon} />
                <Typography variant="h6">Доходи</Typography>
              </div>
              <Typography variant="h4" className={styles.value}>
                ${stats.revenue.total.toLocaleString()}
              </Typography>
              <Typography color="textSecondary">За місяць: ${stats.revenue.monthly.toLocaleString()}</Typography>
              <Typography color="textSecondary">
                Підписок: {stats.revenue.subscriptions.reduce((acc, sub) => acc + sub.count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Системна статистика */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.card}>
            <CardContent>
              <div className={styles.cardHeader}>
                <Typography variant="h6">Система</Typography>
              </div>
              <div className={styles.systemStats}>
                <div className={styles.stat}>
                  <Typography color="textSecondary">CPU</Typography>
                  <div className={styles.progressWrapper}>
                    <CircularProgress variant="determinate" value={stats.system.cpuUsage} size={40} />
                    <Typography className={styles.progressLabel}>{Math.round(stats.system.cpuUsage)}%</Typography>
                  </div>
                </div>
                <div className={styles.stat}>
                  <Typography color="textSecondary">RAM</Typography>
                  <div className={styles.progressWrapper}>
                    <CircularProgress variant="determinate" value={stats.system.memoryUsage} size={40} />
                    <Typography className={styles.progressLabel}>{Math.round(stats.system.memoryUsage)}%</Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Графік росту користувачів */}
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ріст користувачів
              </Typography>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={stats.users.growth.map((value, index) => ({
                      day: index + 1,
                      users: value,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#1976d2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Графік доходів */}
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Історія доходів
              </Typography>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.revenue.history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#2e7d32" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

