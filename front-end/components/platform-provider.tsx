"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface PlatformContextType {
  currentUser: {
    name: string
    role: string
    avatar: string
  }
  notifications: number
  setNotifications: (count: number) => void
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(3)

  const value = {
    currentUser: {
      name: "Alex Johnson",
      role: "Platform Admin",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    notifications,
    setNotifications,
  }

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export function usePlatform() {
  const context = useContext(PlatformContext)
  if (context === undefined) {
    throw new Error("usePlatform must be used within a PlatformProvider")
  }
  return context
}
