import React from "react"
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar, Menu, MenuItem, Tooltip } from "@mui/material"
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material"
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"
import styles from "./Header.module.scss"

interface HeaderProps {
  onMenuToggle: () => void
  user: {
    name: string
    email: string
    image?: string
  }
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, user }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [notificationsAnchor, setNotificationsAnchor] = React.useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const handleSettings = () => {
    router.push("/admin/profile")
    handleMenuClose()
  }

  return (
    <AppBar position="fixed" className={styles.header}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuToggle} className={styles.menuButton}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={styles.title}>
          Адмін-панель
        </Typography>

        <div className={styles.actions}>
          <Tooltip title="Сповіщення">
            <IconButton color="inherit" onClick={handleNotificationsOpen}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Профіль">
            <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen} className={styles.profileButton}>
              {user.image ? <Avatar src={user.image} alt={user.name} className={styles.avatar} /> : <AccountCircle />}
            </IconButton>
          </Tooltip>
        </div>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} className={styles.menu}>
          <MenuItem onClick={handleSettings}>
            <SettingsIcon className={styles.menuIcon} />
            Налаштування
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon className={styles.menuIcon} />
            Вийти
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          className={styles.notificationsMenu}
        >
          <div className={styles.notificationsHeader}>
            <Typography variant="h6">Сповіщення</Typography>
          </div>
          <div className={styles.notificationsList}>{/* Тут буде список сповіщень */}</div>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

