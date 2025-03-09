"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Badge,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material"
import {
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import styles from "./Notifications.module.scss"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: Record<string, any>
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState<Notification | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    notification: Notification
  } | null>(null)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Оновлюємо кожні 30 секунд
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      setError(null)
      const response = await fetch("/api/admin/notifications")
      if (!response.ok) throw new Error("Помилка завантаження сповіщень")

      const data = await response.json()
      setNotifications(data.notifications)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Не вдалося завантажити сповіщення")
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      })

      if (!response.ok) throw new Error("Помилка оновлення сповіщення")

      fetchNotifications()
    } catch (error) {
      console.error("Error marking notification as read:", error)
      setError("Помилка оновлення сповіщення")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Помилка видалення сповіщення")

      fetchNotifications()
    } catch (error) {
      console.error("Error deleting notification:", error)
      setError("Помилка видалення сповіщення")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch("/api/admin/notifications/read-all", {
        method: "PUT",
      })

      if (!response.ok) throw new Error("Помилка оновлення сповіщень")

      fetchNotifications()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      setError("Помилка оновлення сповіщень")
    }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm("Ви впевнені, що хочете видалити всі сповіщення?")) {
      return
    }

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Помилка видалення сповіщень")

      fetchNotifications()
    } catch (error) {
      console.error("Error deleting all notifications:", error)
      setError("Помилка видалення сповіщень")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckIcon className={styles.successIcon} />
      case "error":
        return <ErrorIcon className={styles.errorIcon} />
      case "warning":
        return <WarningIcon className={styles.warningIcon} />
      default:
        return <InfoIcon className={styles.infoIcon} />
    }
  }

  return (
    <div className={styles.notifications}>
      <Card>
        <CardContent>
          <div className={styles.header}>
            <Typography variant="h2">
              Сповіщення
              <Badge
                badgeContent={notifications.filter((n) => !n.read).length}
                color="primary"
                className={styles.badge}
              >
                <NotificationsIcon />
              </Badge>
            </Typography>

            <div className={styles.actions}>
              <Button
                startIcon={<CheckIcon />}
                onClick={handleMarkAllAsRead}
                disabled={!notifications.some((n) => !n.read)}
              >
                Позначити всі як прочитані
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleDeleteAll}
                disabled={!notifications.length}
                color="error"
              >
                Видалити всі
              </Button>
            </div>
          </div>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className={styles.loading}>
              <CircularProgress />
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.empty}>
              <NotificationsOffIcon />
              <Typography>Немає сповіщень</Typography>
            </div>
          ) : (
            <List className={styles.list}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  className={`${styles.item} ${!notification.read ? styles.unread : ""}`}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenu({
                      mouseX: e.clientX,
                      mouseY: e.clientY,
                      notification,
                    })
                  }}
                >
                  <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <div className={styles.title}>
                        <Typography variant="subtitle1">{notification.title}</Typography>
                        <Chip
                          size="small"
                          label={format(new Date(notification.createdAt), "dd.MM.yyyy HH:mm", { locale: uk })}
                        />
                      </div>
                    }
                    secondary={notification.message}
                  />
                  <div className={styles.itemActions}>
                    {!notification.read && (
                      <Tooltip title="Позначити як прочитане">
                        <IconButton onClick={() => handleMarkAsRead(notification.id)} size="small">
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Деталі">
                      <IconButton onClick={() => setShowDetails(notification)} size="small">
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Видалити">
                      <IconButton onClick={() => handleDelete(notification.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Діалог деталей */}
      <Dialog open={!!showDetails} onClose={() => setShowDetails(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Деталі сповіщення</DialogTitle>
        <DialogContent>
          {showDetails && (
            <div className={styles.details}>
              <Typography variant="subtitle2">Тип</Typography>
              <Chip icon={getNotificationIcon(showDetails.type)} label={showDetails.type} size="small" />

              <Typography variant="subtitle2">Заголовок</Typography>
              <Typography>{showDetails.title}</Typography>

              <Typography variant="subtitle2">Повідомлення</Typography>
              <Typography>{showDetails.message}</Typography>

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
          <Button onClick={() => setShowDetails(null)}>Закрити</Button>
        </DialogActions>
      </Dialog>

      {/* Контекстне меню */}
      <Menu
        open={!!contextMenu}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        {contextMenu?.notification && !contextMenu.notification.read && (
          <MenuItem
            onClick={() => {
              handleMarkAsRead(contextMenu.notification.id)
              setContextMenu(null)
            }}
          >
            <CheckIcon className={styles.menuIcon} />
            Позначити як прочитане
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setShowDetails(contextMenu?.notification || null)
            setContextMenu(null)
          }}
        >
          <InfoIcon className={styles.menuIcon} />
          Деталі
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (contextMenu) {
              handleDelete(contextMenu.notification.id)
              setContextMenu(null)
            }
          }}
          className={styles.deleteMenuItem}
        >
          <DeleteIcon className={styles.menuIcon} />
          Видалити
        </MenuItem>
      </Menu>
    </div>
  )
}

