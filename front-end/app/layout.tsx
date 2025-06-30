import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { PlatformProvider } from "@/components/platform-provider"
import { ThemeProvider } from "@/components/theme-provider" // Import ThemeProvider

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OmniDesk - Unified Business Platform",
  description: "AI-powered business management platform for modern teams",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PlatformProvider>
            {children}
            <Toaster />
          </PlatformProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
