"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Upload, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api, { updateStudentProfile } from "@/lib/api"

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_type: 'student' | 'company';
}

interface StudentProfileData {
  graduation_year: number | null;
  branch: string;
  skills: string[];
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  profile_picture: string | null;
}

interface UserProfile extends UserData, StudentProfileData {}

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const { toast } = useToast()

  useEffect(() => {
    // Check if we have the profile in localStorage
    const storedProfile = localStorage.getItem('studentProfile');
    
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile) as UserProfile;
        setProfile(parsedProfile);
        setFormData(parsedProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored profile:', error);
        fetchProfile();
      }
    } else {
      fetchProfile();
    }
  }, []);
  
  // Fetch the latest profile data
  const fetchProfile = async () => {
    try {
      console.log('Fetching student profile data...')
      const userData = await api.get<UserProfile>('/users/me/').then(res => res.data);
      
      console.log('Fetched profile:', userData)
      setProfile(userData)
      setFormData(userData)
      localStorage.setItem('studentProfile', JSON.stringify(userData))
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
      
      // Prepare the data for update
      const updatedData = {
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        phone_number: formData.phone_number || '',
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year.toString()) : null,
        branch: formData.branch || '',
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        github_url: formData.github_url || '',
        linkedin_url: formData.linkedin_url || '',
        portfolio_url: formData.portfolio_url || ''
      };

      console.log('Sending profile update:', updatedData);
      
      // Use the updateStudentProfile function from the API
      const userData = await updateStudentProfile(updatedData) as UserProfile;

      console.log('Received response:', userData);
      
      setProfile(userData)
      setFormData(userData)
      localStorage.setItem('studentProfile', JSON.stringify(userData))
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error('Error updating profile:', error.response?.data || error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Could not update your profile. Please try again later.",
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
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and how others see you on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              {profile?.profile_picture ? (
                <AvatarImage src={profile.profile_picture} alt={`${profile.first_name} ${profile.last_name}`} />
              ) : (
                <AvatarFallback>{profile?.first_name?.[0]}{profile?.last_name?.[0]}</AvatarFallback>
              )}
            </Avatar>
            <Button variant="outline" size="sm" className="gap-1" disabled={!isEditing}>
              <Upload className="h-4 w-4" /> Upload Photo
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input 
              id="first_name" 
              value={formData.first_name || ''} 
              onChange={handleChange} 
              readOnly={!isEditing} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input 
              id="last_name" 
              value={formData.last_name || ''} 
              onChange={handleChange} 
              readOnly={!isEditing} 
            />
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
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input 
              id="phone_number" 
              type="tel" 
              value={formData.phone_number || ''} 
              onChange={handleChange} 
              readOnly={!isEditing} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Select 
                disabled={!isEditing} 
                value={formData.graduation_year?.toString() || ''} 
                onValueChange={(value) => handleSelectChange('graduation_year', value)}
              >
                <SelectTrigger id="graduation_year">
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
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select 
                disabled={!isEditing} 
                value={formData.branch || ''} 
                onValueChange={(value) => handleSelectChange('branch', value)}
              >
                <SelectTrigger id="branch">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              placeholder="Enter skills separated by commas"
              value={formData.skills?.join(', ') || ''}
              onChange={(e) => {
                const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
                setFormData(prev => ({ ...prev, skills: skillsArray }));
              }}
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
            <CardTitle>Social Media & Portfolio</CardTitle>
            <CardDescription>Connect your professional profiles and portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github_url" className="flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub
              </Label>
              <Input
                id="github_url"
                placeholder="github.com/username"
                value={formData.github_url || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Label>
              <Input
                id="linkedin_url"
                placeholder="linkedin.com/in/username"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio Website</Label>
              <Input
                id="portfolio_url"
                placeholder="yourportfolio.com"
                value={formData.portfolio_url || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </CardContent>
          <CardFooter>
            {isEditing && (
              <Button className="w-full gap-1" onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4" /> Save Links
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
