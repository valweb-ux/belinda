import React, { useState } from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  MusicNote as TracksIcon,
  QueueMusic as PlaylistsIcon,
  Payment as PaymentsIcon,
  Settings as SettingsIcon,
  Backup as BackupIcon,
  Notifications as NotificationsIcon,
  Assessment as ReportsIcon,
  BugReport as LogsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material"
import { useRouter } from "next/router"
import styles from "./Navigation.module.scss"

interface NavigationItem {
  title: string
  path: string
  icon: React.ReactNode
  children?: NavigationItem[]
}

const navigationItems: NavigationItem[] = [
  {
    title: "Панель керування",
    path: "/admin",
    icon: <DashboardIcon />,
  },
  {
    title: "Користувачі",
    path: "/admin/users",
    icon: <UsersIcon />,
  },
  {
    title: "Контент",
    path: "/admin/content",
    icon: <TracksIcon />,
    children: [
      {
        title: "Треки",
        path: "/admin/content/tracks",
        icon: <TracksIcon />,
      },
      {
        title: "Плейлисти",
        path: "/admin/content/playlists",
        icon: <PlaylistsIcon />,
      },
    ],
  },
  {
    title: "Платежі",
    path: "/admin/payments",
    icon: <PaymentsIcon />,
  },
  {
    title: "Звіти",
    path: "/admin/reports",
    icon: <ReportsIcon />,
  },
  {
    title: "Системні",
    path: "/admin/system",
    icon: <SettingsIcon />,
    children: [
      {
        title: "Налаштування",
        path: "/admin/system/settings",
        icon: <SettingsIcon />,
      },
      {
        title: "Резервне копіювання",
        path: "/admin/system/backup",
        icon: <BackupIcon />,
      },
      {
        title: "Сповіщення",
        path: "/admin/system/notifications",
        icon: <NotificationsIcon />,
      },
      {
        title: "Системні логи",
        path: "/admin/system/logs",
        icon: <LogsIcon />,
      },
    ],
  },
]

interface NavigationProps {
  open: boolean
  onToggle: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ open, onToggle }) => {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleItemClick = (path: string) => {
    if (isMobile) {
      onToggle()
    }
    router.push(path)
  }

  const handleExpandClick = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const renderNavigationItems = (items: NavigationItem[], level = 0) => {
    return items.map((item) => {
      const isSelected = router.pathname === item.path
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedItems.includes(item.title)

      return (
        <React.Fragment key={item.path}>
          <ListItem
            button
            className={`${styles.navItem} ${isSelected ? styles.selected : ""} ${level > 0 ? styles.nested : ""}`}
            onClick={() => (hasChildren ? handleExpandClick(item.title) : handleItemClick(item.path))}
          >
            <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} className={styles.text} />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNavigationItems(item.children, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      )
    })
  }

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={onToggle}
      className={`${styles.drawer} ${open ? styles.open : styles.closed}`}
      classes={{
        paper: `${styles.drawerPaper} ${open ? styles.open : styles.closed}`,
      }}
    >
      <div className={styles.toolbar}>
        <IconButton onClick={onToggle}>{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
      </div>
      <List className={styles.list}>{renderNavigationItems(navigationItems)}</List>
    </Drawer>
  )
}

