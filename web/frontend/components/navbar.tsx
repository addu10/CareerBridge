"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Check if link is active
  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full transition-all duration-300 ${
        scrolled ? "sticky top-0 z-50 bg-lightblue-300 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">CareerConnect</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary font-semibold" : ""}`}
          >
            Home
          </Link>
          {user ? (
            <>
              {user.user_type === "student" && (
                <Link
                  href="/student"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/student") ? "text-primary font-semibold" : ""}`}
                >
                  Student Portal
                </Link>
              )}
              {user.user_type === "company" && (
                <Link
                  href="/company"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/company") ? "text-primary font-semibold" : ""}`}
                >
                  Company Portal
                </Link>
              )}
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary font-semibold" : ""}`}
              >
                About
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/student"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/student") ? "text-primary font-semibold" : ""}`}
              >
                Student Portal
              </Link>
              <Link
                href="/company"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/company") ? "text-primary font-semibold" : ""}`}
              >
                Company Portal
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary font-semibold" : ""}`}
              >
                About
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="transition-all hover:shadow-md"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="transition-all hover:shadow-md">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild size="sm" className="transition-all hover:shadow-md">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t"
        >
          <div className="container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary font-semibold" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                {user.user_type === "student" && (
                  <Link
                    href="/student"
                    className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/student") ? "text-primary font-semibold" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Student Portal
                  </Link>
                )}
                {user.user_type === "company" && (
                  <Link
                    href="/company"
                    className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/company") ? "text-primary font-semibold" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Company Portal
                  </Link>
                )}
                <Link
                  href="/about"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary font-semibold" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/student"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/student") ? "text-primary font-semibold" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Student Portal
                </Link>
                <Link
                  href="/company"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/company") ? "text-primary font-semibold" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Company Portal
                </Link>
                <Link
                  href="/about"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary font-semibold" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <div className="flex items-center gap-4">
                  <ModeToggle />
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

