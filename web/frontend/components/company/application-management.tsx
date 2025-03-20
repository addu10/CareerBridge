"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, CheckCircle, Clock, Download, MessageSquare, ThumbsDown, ThumbsUp, X, XCircle } from "lucide-react"

const applications = [
  {
    id: 1,
    candidate: {
      id: 101,
      name: "Priya Sharma",
      college: "IIT Delhi",
      degree: "B.Tech in Computer Science",
      graduationYear: 2024,
    },
    job: {
      title: "Frontend Developer Intern",
      type: "Internship",
      location: "Bangalore, India",
    },
    status: "Shortlisted",
    appliedDate: "15 May 2023",
    lastUpdated: "18 May 2023",
    matchScore: 92,
  },
  {
    id: 2,
    candidate: {
      id: 102,
      name: "Rahul Verma",
      college: "NIT Trichy",
      degree: "B.Tech in Information Technology",
      graduationYear: 2023,
    },
    job: {
      title: "Backend Developer",
      type: "Full-time",
      location: "Remote",
    },
    status: "In Review",
    appliedDate: "12 May 2023",
    lastUpdated: "12 May 2023",
    matchScore: 85,
  },
  {
    id: 3,
    candidate: {
      id: 103,
      name: "Ananya Patel",
      college: "BITS Pilani",
      degree: "B.E. in Computer Science",
      graduationYear: 2024,
    },
    job: {
      title: "Frontend Developer Intern",
      type: "Internship",
      location: "Bangalore, India",
    },
    status: "Interview Scheduled",
    appliedDate: "10 May 2023",
    lastUpdated: "16 May 2023",
    interviewDate: "25 May 2023",
    matchScore: 78,
  },
  {
    id: 4,
    candidate: {
      id: 104,
      name: "Vikram Singh",
      college: "Delhi Technological University",
      degree: "B.Tech in Electronics",
      graduationYear: 2023,
    },
    job: {
      title: "Backend Developer",
      type: "Full-time",
      location: "Remote",
    },
    status: "Rejected",
    appliedDate: "8 May 2023",
    lastUpdated: "15 May 2023",
    matchScore: 65,
  },
  {
    id: 5,
    candidate: {
      id: 105,
      name: "Neha Gupta",
      college: "VIT Vellore",
      degree: "B.Tech in Computer Science",
      graduationYear: 2024,
    },
    job: {
      title: "UI/UX Designer",
      type: "Contract",
      location: "Bangalore, India",
    },
    status: "Offered",
    appliedDate: "5 May 2023",
    lastUpdated: "20 May 2023",
    matchScore: 88,
  },
]

export default function ApplicationManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const jobs = Array.from(new Set(applications.map((app) => app.job.title)))

  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "shortlisted" && app.status === "Shortlisted") ||
      (activeTab === "interview" && app.status === "Interview Scheduled") ||
      (activeTab === "review" && app.status === "In Review") ||
      (activeTab === "offered" && app.status === "Offered") ||
      (activeTab === "rejected" && app.status === "Rejected")

    const matchesJob = selectedJob === null || app.job.title === selectedJob

    return matchesStatus && matchesJob
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20">Shortlisted</Badge>
      case "In Review":
        return <Badge variant="outline">In Review</Badge>
      case "Interview Scheduled":
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">Interview Scheduled</Badge>
      case "Offered":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/20">Offered</Badge>
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Management</CardTitle>
          <CardDescription>Review and manage candidate applications for your job postings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 justify-between">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="review">In Review</TabsTrigger>
                    <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
                    <TabsTrigger value="interview">Interview</TabsTrigger>
                    <TabsTrigger value="offered">Offered</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={selectedJob || ""} onValueChange={(value) => setSelectedJob(value || null)}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Filter by job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobs.map((job) => (
                      <SelectItem key={job} value={job}>
                        {job}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <Card
                      key={application.id}
                      className={`cursor-pointer transition-all hover:border-primary/50 ${
                        selectedApplication === application.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedApplication(application.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={`/placeholder.svg?height=40&width=40`}
                                alt={application.candidate.name}
                              />
                              <AvatarFallback>
                                {application.candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{application.candidate.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {application.candidate.college} • {application.candidate.degree}
                              </CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">
                            {application.job.title} • {application.job.type}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Applied: {application.appliedDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-primary/20 text-primary border-primary/20">
                                {application.matchScore}% Match
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedApplication(application.id)
                            }}
                          >
                            View Details
                          </Button>

                          {application.status === "In Review" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs text-green-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" /> Shortlist
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs text-destructive"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" /> Reject
                              </Button>
                            </>
                          )}

                          {application.status === "Shortlisted" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Calendar className="h-3 w-3 mr-1" /> Schedule Interview
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No applications found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/3">
              {selectedApplication ? (
                <Card className="sticky top-4">
                  {applications
                    .filter((app) => app.id === selectedApplication)
                    .map((application) => (
                      <div key={application.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{application.candidate.name}</CardTitle>
                              <CardDescription className="mt-1">
                                Application for {application.job.title}
                              </CardDescription>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setSelectedApplication(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">Application Status</div>
                            {getStatusBadge(application.status)}
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Candidate Information</div>
                            <div className="p-3 bg-muted rounded-lg space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">College:</span> {application.candidate.college}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Degree:</span> {application.candidate.degree}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Graduation Year:</span>{" "}
                                {application.candidate.graduationYear}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Match Score:</span> {application.matchScore}%
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Application Timeline</div>
                            <div className="p-3 bg-muted rounded-lg space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Applied</span>
                                <span>{application.appliedDate}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Last Updated</span>
                                <span>{application.lastUpdated}</span>
                              </div>
                              {application.interviewDate && (
                                <div className="flex justify-between text-sm">
                                  <span>Interview Scheduled</span>
                                  <span>{application.interviewDate}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {application.status === "Interview Scheduled" && (
                            <div className="p-3 bg-amber-500/10 rounded-lg">
                              <div className="flex items-center gap-2 text-amber-500 font-medium mb-1">
                                <Calendar className="h-4 w-4" /> Interview Details
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Scheduled for {application.interviewDate} at 10:00 AM
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Interviewer: Rajesh Kumar (Technical Lead)
                              </div>
                            </div>
                          )}

                          {application.status === "Offered" && (
                            <div className="p-3 bg-green-500/10 rounded-lg">
                              <div className="flex items-center gap-2 text-green-500 font-medium mb-1">
                                <CheckCircle className="h-4 w-4" /> Offer Details
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Offer sent on {application.lastUpdated}
                              </div>
                              <div className="text-sm text-muted-foreground">Awaiting candidate response</div>
                            </div>
                          )}

                          {application.status === "Rejected" && (
                            <div className="p-3 bg-destructive/10 rounded-lg">
                              <div className="flex items-center gap-2 text-destructive font-medium mb-1">
                                <XCircle className="h-4 w-4" /> Rejection Reason
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Candidate's skills don't match our current requirements.
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                          <div className="flex gap-2 w-full">
                            <Button className="flex-1 gap-1">
                              <Download className="h-4 w-4" /> Resume
                            </Button>
                            <Button variant="outline" className="flex-1 gap-1">
                              <MessageSquare className="h-4 w-4" /> Contact
                            </Button>
                          </div>

                          {application.status === "In Review" && (
                            <div className="flex gap-2 w-full">
                              <Button variant="outline" className="flex-1 gap-1 text-green-500">
                                <ThumbsUp className="h-4 w-4" /> Shortlist
                              </Button>
                              <Button variant="outline" className="flex-1 gap-1 text-destructive">
                                <ThumbsDown className="h-4 w-4" /> Reject
                              </Button>
                            </div>
                          )}

                          {application.status === "Shortlisted" && (
                            <Button className="w-full gap-1">
                              <Calendar className="h-4 w-4" /> Schedule Interview
                            </Button>
                          )}

                          {application.status === "Interview Scheduled" && (
                            <div className="flex gap-2 w-full">
                              <Button className="flex-1 gap-1 text-green-500">
                                <CheckCircle className="h-4 w-4" /> Send Offer
                              </Button>
                              <Button variant="outline" className="flex-1 gap-1 text-destructive">
                                <XCircle className="h-4 w-4" /> Reject
                              </Button>
                            </div>
                          )}
                        </CardFooter>
                      </div>
                    ))}
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                    <CardDescription>Select an application to view details.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Click on an application to view detailed information.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

