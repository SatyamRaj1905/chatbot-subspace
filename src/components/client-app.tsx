"use client"

import { useAuthenticationStatus } from '@nhost/nextjs'
import { ChatInterface } from "./chat-interface"
import { LoginPage } from "./login-page"
import { useEffect, useState } from 'react'

export function ClientApp() {
  const { isLoading, isAuthenticated } = useAuthenticationStatus()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration issues by waiting for client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading during server-side rendering and initial client mount
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <ChatInterface />
}
