"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This is a mock authentication check
    // In a real application, you would check the user's session or token
    const checkAuth = async () => {
      try {
        // Simulating an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock user data
        const mockUser: User = {
          id: "1",
          name: "Admin User",
          email: "admin@cherifm.com",
        }

        setUser(mockUser)
      } catch (error) {
        console.error("Authentication error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, isLoading }
}

