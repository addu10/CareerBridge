"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // This is where you would normally initialize analytics
    // For example: Google Analytics, Plausible, etc.

    // For now, we'll just log page views to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Page view: ${pathname}${searchParams ? `?${searchParams}` : ""}`)
    }

    // Track page view
    const url = `${pathname}${searchParams ? `?${searchParams}` : ""}`
    trackPageView(url)
  }, [pathname, searchParams])

  return null
}

// Placeholder function for tracking page views
function trackPageView(url: string) {
  // This would be replaced with actual analytics implementation
  // Example: window.gtag('config', 'GA-MEASUREMENT-ID', { page_path: url })
}

