"use client"

import { NhostProvider } from '@nhost/nextjs'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from "next-themes"
import { Toaster } from 'sonner'
import { nhost } from '~/lib/nhost'
import { apolloClient } from '~/lib/apollo'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            duration={5000}
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }
            }}
          />
        </ThemeProvider>
      </ApolloProvider>
    </NhostProvider>
  )
}
