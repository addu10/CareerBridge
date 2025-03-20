"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Eye, Clock, MapPin, FileText, CheckCircle, XCircle } from "lucide-react"

const jobPostings = [
  {
    id: 1,
    title: "Frontend Developer",
    type: "Full-time",
    location: "Bangalore, India",
    status: "Active",
    posted: "15 May 2023",
    expires: "15 Jun 2023",
    applications: 24,
    views: 156,
  },
  {
    id: 2,
    title: "Backend Developer",
    type: "Full-time",
    location: "Remote",
    status: "Active",
    posted: "10 May 2023",
    expires: "10 Jun 2023",
    applications: 18,
    views: 132,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    type: "Contract",
    location: "Bangalore, India",
    status: "Expired",
    posted: "15 Apr 2023",
    expires: "15 May 2023",
    applications: 35,
    views: 210,
  },
  {
    id: 4,
    title: "Data Science Intern",
    type: "Internship",
    location: "Hyderabad, India",
    status: "Draft",
    posted: "Not posted",
    expires: "N/A",
    applications: 0,
    views: 0,
  },
]

export default function JobPostings() {
  const [activeTab, setActiveTab] = useState("all")
  const [isCreating, setIsCreating] = useState(false)

  const filteredJobs = jobPostings.filter((job) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return job.status === "Active"
    if (activeTab === "expired") return job.status === "Expired"
    if (activeTab === "draft") return job.status === "Draft"
    return true
  })

  return (
    <div className="space-y-6">
      {!isCreating ? (
        <>
          <div className="flex justify-between items-center">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="gap-1" onClick={() => setIsCreating(true)}>
              <PlusCircle className="h-4 w-4" /> New Job
            </Button>
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={job.status === "Active" ? "default" : job.status === "Draft" ? "outline" : "secondary"}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Posted: {job.posted}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Expires: {job.expires}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Applications: {job.applications}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Views: {job.views}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" /> View
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                      {job.status === "Draft" && (
                        <Button size="sm" className="gap-1">
                          <CheckCircle className="h-4 w-4" /> Publish
                        </Button>
                      )}
                      {job.status === "Active" && (
                        <Button variant="outline" size="sm" className="gap-1 text-destructive">
                          <XCircle className="h-4 w-4" /> Deactivate
                        </Button>
                      )}
                      {job.status === "Expired" && (
                        <Button size="sm" className="gap-1">
                          <CheckCircle className="h-4 w-4" /> Reactivate
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No job postings found.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create New Job Posting</CardTitle>
            <CardDescription>Fill in the details to create a new job posting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g. Frontend Developer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="parttime">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Bangalore, India" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remote">Remote Option</Label>
                <Select>
                  <SelectTrigger id="remote">
                    <SelectValue placeholder="Select remote option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">On-site only</SelectItem>
                    <SelectItem value="remote">Remote only</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="e.g. Engineering" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input id="salary" placeholder="e.g. ₹10-15 LPA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the job role, responsibilities, and requirements..."
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Key Responsibilities</Label>
              <Textarea
                id="responsibilities"
                placeholder="List the key responsibilities for this role..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the required skills, qualifications, and experience..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                placeholder="List the benefits and perks offered with this position..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Publish Job</Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

