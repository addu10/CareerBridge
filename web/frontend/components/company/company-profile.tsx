"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, MapPin, Building, Upload, Save } from "lucide-react"

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details and how it appears to candidates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Company Logo" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-1">
              <Upload className="h-4 w-4" /> Upload Logo
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" defaultValue="TechCorp Solutions" readOnly={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Input id="website" defaultValue="https://techcorp.com" readOnly={!isEditing} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select disabled={!isEditing} defaultValue="software">
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software">Software Development</SelectItem>
                <SelectItem value="finance">Finance & Banking</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="ecommerce">E-Commerce</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Company Size</Label>
            <Select disabled={!isEditing} defaultValue="medium">
              <SelectTrigger id="size">
                <SelectValue placeholder="Select Company Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                <SelectItem value="small">Small (11-50 employees)</SelectItem>
                <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                <SelectItem value="large">Large (201-500 employees)</SelectItem>
                <SelectItem value="enterprise">Enterprise (500+ employees)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="founded">Founded Year</Label>
            <Input id="founded" type="number" defaultValue="2010" readOnly={!isEditing} />
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
            <CardTitle>Company Description</CardTitle>
            <CardDescription>Tell candidates about your company culture and mission.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about">About the Company</Label>
              <Textarea
                id="about"
                className="min-h-[120px]"
                defaultValue="TechCorp Solutions is a leading software development company specializing in enterprise solutions, cloud services, and mobile applications. Founded in 2010, we've grown to become a trusted partner for businesses across various industries."
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="culture">Company Culture</Label>
              <Textarea
                id="culture"
                className="min-h-[120px]"
                defaultValue="At TechCorp, we foster a collaborative and innovative environment where creativity thrives. We believe in work-life balance, continuous learning, and empowering our employees to take ownership of their projects."
                readOnly={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location & Contact</CardTitle>
            <CardDescription>Update your company's location and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headquarters">Headquarters</Label>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <Input id="headquarters" defaultValue="Bangalore, India" readOnly={!isEditing} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input id="address" defaultValue="123 Tech Park, Electronic City, Bangalore" readOnly={!isEditing} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" defaultValue="careers@techcorp.com" readOnly={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" type="tel" defaultValue="+91 80 1234 5678" readOnly={!isEditing} />
            </div>
          </CardContent>
          <CardFooter>
            {isEditing && (
              <Button className="w-full gap-1">
                <Save className="h-4 w-4" /> Save Contact Info
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

