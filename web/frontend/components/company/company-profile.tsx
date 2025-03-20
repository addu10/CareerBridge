"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, MapPin, Building, Upload, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface CompanyProfile {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  company_name: string;
  company_description: string;
  company_website: string;
  company_logo: string | null;
}

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({})
  const { toast } = useToast()

  useEffect(() => {
    // Check if we have the profile in localStorage
    const storedProfile = localStorage.getItem('companyProfile');
    
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile) as CompanyProfile;
        setProfile(parsedProfile);
        setFormData(parsedProfile);
        console.log('Using stored profile:', parsedProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored profile:', error);
        // If there's an error parsing, fetch from server
        fetchProfile();
      }
    } else {
      // If not in localStorage, fetch it
      fetchProfile();
    }
  }, []);
  
  // Fetch the latest profile data
  const fetchProfile = async () => {
    try {
      // Note: This may fail due to database connection issues
      const response = await api.get('/users/me/')
      console.log('Fetched company profile:', response.data)
      const profileData = response.data as CompanyProfile;
      setProfile(profileData)
      setFormData(profileData)
      localStorage.setItem('companyProfile', JSON.stringify(profileData))
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Could not load your profile. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const response = await api.patch('/users/me/', formData)
      const updatedProfile = response.data as CompanyProfile;
      setProfile(updatedProfile)
      localStorage.setItem('companyProfile', JSON.stringify(updatedProfile))
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Your company profile has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>
  }

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
              {profile?.company_logo ? (
                <AvatarImage src={profile.company_logo} alt={profile.company_name} />
              ) : (
                <AvatarFallback>{profile?.company_name?.substring(0, 2).toUpperCase() || 'CO'}</AvatarFallback>
              )}
            </Avatar>
            <Button variant="outline" size="sm" className="gap-1" disabled={!isEditing}>
              <Upload className="h-4 w-4" /> Upload Logo
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input 
              id="company_name" 
              value={formData.company_name || ''} 
              onChange={handleChange} 
              readOnly={!isEditing} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_website">Website</Label>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Input 
                id="company_website" 
                value={formData.company_website || ''} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email || ''} 
              readOnly={true} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Contact Phone</Label>
            <Input 
              id="phone_number" 
              type="tel" 
              value={formData.phone_number || ''} 
              onChange={handleChange} 
              readOnly={!isEditing} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button className="gap-1" onClick={handleSave} disabled={loading}>
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
              <Label htmlFor="company_description">About the Company</Label>
              <Textarea
                id="company_description"
                className="min-h-[120px]"
                value={formData.company_description || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </CardContent>
          <CardFooter>
            {isEditing && (
              <Button className="w-full gap-1" onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4" /> Save Description
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
