"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Upload, Save } from "lucide-react"

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and how others see you on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-1">
              <Upload className="h-4 w-4" /> Upload Photo
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="John Smith" readOnly={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.smith@example.com" readOnly={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" readOnly={!isEditing} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Current Year</Label>
              <Select disabled={!isEditing} defaultValue="3">
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduation">Graduation Year</Label>
              <Select disabled={!isEditing} defaultValue="2025">
                <SelectTrigger id="graduation">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select disabled={!isEditing} defaultValue="cs">
              <SelectTrigger id="branch">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="it">Information Technology</SelectItem>
                <SelectItem value="ec">Electronics & Communication</SelectItem>
                <SelectItem value="me">Mechanical Engineering</SelectItem>
                <SelectItem value="ce">Civil Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button className="gap-1">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Career Goals</CardTitle>
            <CardDescription>Tell us about your career aspirations and goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals">Career Objectives</Label>
              <Textarea
                id="goals"
                placeholder="Describe your career goals..."
                className="min-h-[120px]"
                defaultValue="I aim to become a full-stack developer specializing in cloud-native applications. I'm interested in working with modern technologies like React, Node.js, and AWS."
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">Areas of Interest</Label>
              <Select disabled={!isEditing} defaultValue="webdev">
                <SelectTrigger id="interests">
                  <SelectValue placeholder="Select Primary Interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webdev">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile Development</SelectItem>
                  <SelectItem value="ai">AI & Machine Learning</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                  <SelectItem value="cloud">Cloud Computing</SelectItem>
                  <SelectItem value="security">Cybersecurity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Social Media & Portfolio</CardTitle>
            <CardDescription>Connect your professional profiles and portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub
              </Label>
              <Input
                id="github"
                placeholder="github.com/username"
                defaultValue="github.com/johnsmith"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/username"
                defaultValue="linkedin.com/in/john-smith"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio Website</Label>
              <Input
                id="portfolio"
                placeholder="yourportfolio.com"
                defaultValue="johnsmith.dev"
                readOnly={!isEditing}
              />
            </div>
          </CardContent>
          <CardFooter>
            {isEditing && (
              <Button className="w-full gap-1">
                <Save className="h-4 w-4" /> Save Links
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

