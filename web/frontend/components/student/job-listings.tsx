"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock, Building, BookmarkPlus, Send, Filter, Search } from "lucide-react"

const jobListings = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechCorp",
    location: "Bangalore, India",
    type: "Internship",
    duration: "3 months",
    stipend: "₹20,000/month",
    skills: ["React", "JavaScript", "HTML/CSS"],
    posted: "2 days ago",
    deadline: "15 days left",
    description:
      "We are looking for a passionate Frontend Developer Intern to join our team. You will be working on real projects and gain hands-on experience with modern frontend technologies. You'll collaborate with experienced developers and contribute to building user-friendly interfaces.",
    requirements: [
      "Knowledge of React and JavaScript",
      "Basic understanding of HTML/CSS",
      "Good problem-solving skills",
      "Currently pursuing a degree in Computer Science or related field",
    ],
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "InnovateX",
    location: "Remote",
    type: "Full-time",
    salary: "₹12-18 LPA",
    skills: ["Node.js", "MongoDB", "Express", "React"],
    posted: "1 week ago",
    deadline: "30 days left",
    description:
      "InnovateX is seeking a talented Software Engineer to join our growing team. You will be responsible for developing and maintaining web applications, implementing new features, and ensuring high-quality code.",
    requirements: [
      "3+ years of experience in full-stack development",
      "Proficiency in MERN stack",
      "Experience with RESTful APIs",
      "Strong problem-solving skills",
    ],
  },
  {
    id: 3,
    title: "Data Science Intern",
    company: "AnalyticsHub",
    location: "Hyderabad, India",
    type: "Internship",
    duration: "6 months",
    stipend: "₹25,000/month",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    posted: "3 days ago",
    deadline: "10 days left",
    description:
      "Join our data science team as an intern and work on real-world data problems. You'll get hands-on experience with data analysis, machine learning models, and visualization techniques.",
    requirements: [
      "Knowledge of Python and data analysis libraries",
      "Basic understanding of machine learning concepts",
      "SQL knowledge",
      "Currently pursuing a degree in Computer Science, Statistics, or related field",
    ],
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "DesignWave",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹8-12 LPA",
    skills: ["Figma", "Adobe XD", "UI Design", "User Research"],
    posted: "5 days ago",
    deadline: "20 days left",
    description:
      "DesignWave is looking for a creative UI/UX Designer to create amazing user experiences. You'll be responsible for the design process from concept to final UI implementation.",
    requirements: [
      "2+ years of experience in UI/UX design",
      "Proficiency in design tools like Figma and Adobe XD",
      "Portfolio showcasing UI/UX projects",
      "Strong visual design skills",
    ],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudNative",
    location: "Pune, India",
    type: "Full-time",
    salary: "₹15-20 LPA",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    posted: "1 day ago",
    deadline: "25 days left",
    description:
      "CloudNative is seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. You'll work on automating deployment processes and ensuring system reliability.",
    requirements: [
      "3+ years of experience in DevOps",
      "Strong knowledge of AWS services",
      "Experience with containerization using Docker and Kubernetes",
      "CI/CD pipeline implementation",
    ],
  },
]

const applications = [
  {
    id: 101,
    jobTitle: "Frontend Developer Intern",
    company: "TechCorp",
    appliedDate: "15 May 2023",
    status: "In Review",
    nextStep: "Technical Interview",
    scheduledDate: "25 May 2023",
  },
  {
    id: 102,
    jobTitle: "Backend Developer",
    company: "ServerStack",
    appliedDate: "10 May 2023",
    status: "Shortlisted",
    nextStep: "HR Interview",
    scheduledDate: "20 May 2023",
  },
  {
    id: 103,
    jobTitle: "Mobile App Developer",
    company: "AppWorks",
    appliedDate: "5 May 2023",
    status: "Rejected",
    feedback: "Looking for candidates with more experience in Flutter development.",
  },
]

export default function JobListings() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType =
      filterType === "all" ||
      (filterType === "internship" && job.type === "Internship") ||
      (filterType === "fulltime" && job.type === "Full-time")

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="listings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Job Listings
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Send className="h-4 w-4" /> My Applications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="listings" className="space-y-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by job title, company, or skills..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="internship">Internships</SelectItem>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className={`cursor-pointer transition-all hover:border-primary/50 ${
                        selectedJob === job.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedJob(job.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Building className="h-3 w-3" /> {job.company}
                            </CardDescription>
                          </div>
                          <Badge variant={job.type === "Internship" ? "outline" : "default"}>{job.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" /> {job.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" /> {job.posted}
                          </div>
                          {job.stipend && <div className="text-sm text-muted-foreground">Stipend: {job.stipend}</div>}
                          {job.salary && <div className="text-sm text-muted-foreground">Salary: {job.salary}</div>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="font-normal">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedJob(job.id)
                          }}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/3">
              {selectedJob ? (
                <Card className="sticky top-4">
                  {jobListings
                    .filter((job) => job.id === selectedJob)
                    .map((job) => (
                      <div key={job.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{job.title}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Building className="h-3 w-3" /> {job.company}
                              </CardDescription>
                            </div>
                            <Badge variant={job.type === "Internship" ? "outline" : "default"}>{job.type}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" /> {job.location}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" /> {job.posted}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{job.description}</p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">Requirements</h4>
                            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                              {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {job.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="font-normal">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {job.stipend && (
                            <div>
                              <h4 className="font-medium mb-1">Stipend</h4>
                              <p className="text-sm text-muted-foreground">{job.stipend}</p>
                            </div>
                          )}

                          {job.salary && (
                            <div>
                              <h4 className="font-medium mb-1">Salary</h4>
                              <p className="text-sm text-muted-foreground">{job.salary}</p>
                            </div>
                          )}

                          <div>
                            <h4 className="font-medium mb-1">Application Deadline</h4>
                            <p className="text-sm text-muted-foreground">{job.deadline}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button className="flex-1">Apply Now</Button>
                          <Button variant="outline" size="icon">
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </div>
                    ))}
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Select a job to view more details.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Click on a job listing to view detailed information.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="applications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track the status of your job applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{application.jobTitle}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Building className="h-3 w-3" /> {application.company}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            application.status === "In Review"
                              ? "outline"
                              : application.status === "Shortlisted"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm text-muted-foreground mb-2">Applied on: {application.appliedDate}</div>

                      {application.nextStep && (
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">Next Step: {application.nextStep}</h4>
                          <p className="text-xs text-muted-foreground">Scheduled for {application.scheduledDate}</p>
                        </div>
                      )}

                      {application.feedback && (
                        <div className="p-3 bg-destructive/10 rounded-lg mt-2">
                          <h4 className="font-medium text-sm mb-1">Feedback</h4>
                          <p className="text-xs text-muted-foreground">{application.feedback}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Application
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

