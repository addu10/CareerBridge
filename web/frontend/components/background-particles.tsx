"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function BackgroundParticles() {
  const [isMounted, setIsMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setIsMounted(true)

    // Create particles
    const particleCount = 20
    const container = document.createElement("div")
    container.className = "fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
    document.body.appendChild(container)

    // Create and animate particles
    const particles = Array.from({ length: particleCount }, () => {
      const particle = document.createElement("div")
      const size = Math.random() * 15 + 5 // Larger, more visible particles

      particle.className = "particle absolute rounded-full"
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.opacity = `${Math.random() * 0.4 + 0.1}` // More visible opacity
      particle.style.left = `${Math.random() * 100}vw`
      particle.style.top = `${Math.random() * 100}vh`

      // Animation
      particle.style.animation = `float ${Math.random() * 20 + 10}s infinite ease-in-out`

      container.appendChild(particle)
      return particle
    })

    // Clean up
    return () => {
      particles.forEach((particle) => particle.remove())
      container.remove()
    }
  }, [])

  if (!isMounted) return null

  return null
}

