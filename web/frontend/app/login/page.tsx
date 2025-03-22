"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Building } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import BackgroundAnimationLight from "@/components/BackgroundAnimationLight"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'student' | 'company'>('student')
  const { login, error } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(username, password, userType === 'company')
    } catch (error: any) {
      const errorMessage = error.message || "Invalid username or password. Please try again."
      console.error("Login error:", errorMessage)
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <BackgroundAnimationLight />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <Tabs defaultValue="student" className="w-full" onValueChange={(value) => setUserType(value as 'student' | 'company')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Student
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" /> Company
            </TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Student Login</CardTitle>
                  <CardDescription>Enter your credentials to access your student account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-username">Email or Username</Label>
                    <Input
                      id="student-username"
                      type="text"
                      placeholder="Enter your email or username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="student-password">Password</Label>
                      <Link href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="student-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
          <TabsContent value="company">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Company Login</CardTitle>
                  <CardDescription>Enter your credentials to access your company account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-username">Email Address</Label>
                    <Input
                      id="company-username"
                      type="email"
                      placeholder="Enter your company email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="company-password">Password</Label>
                      <Link href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="company-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
