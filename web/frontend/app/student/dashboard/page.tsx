"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not logged in or not a student
    if (!user) {
      router.replace('/login')
    } else if (user.user_type !== 'student') {
      router.replace('/company')
    }
  }, [user, router])

  if (!user || user.user_type !== 'student') {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.first_name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add your dashboard components here */}
      </div>
    </div>
  )
}
