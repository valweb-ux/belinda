"use client"

import type React from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { CircularProgress } from "@mui/material"
import { Navigation } from "../Navigation/Navigation"
import { Header } from "../Header/Header"
import styles from "./Layout.module.scss"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isNavOpen, setIsNavOpen] = useState(true)

  // Перевіряємо авторизацію
  if (status === "loading") {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  // Перевіряємо права адміністратора
  if (session.user.role !== "admin") {
    router.push("/")
    return null
  }

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <div className={styles.layout}>
      <Header
        onMenuToggle={handleNavToggle}
        user={{
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image,
        }}
      />
      <Navigation open={isNavOpen} onToggle={handleNavToggle} />
      <main className={`${styles.content} ${isNavOpen ? styles.shifted : ""}`}>
        <div className={styles.toolbar} />
        {children}
      </main>
    </div>
  )
}

