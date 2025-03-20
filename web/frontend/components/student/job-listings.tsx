"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, MapPin, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getJobs, getInternships, createApplication } from "@/lib/api"

interface BasePosition {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  created_at: string;
  status: string;
}

interface Job extends BasePosition {
  type: string;
  salary_range: string;
  posted_date: string;
}

interface Internship extends BasePosition {
  duration: string;
  deadline?: string;
}

interface Application {
  id: number;
  status: string;
  created_at: string;
  position_id: number;
  position_type: 'job' | 'internship';
}

export default function JobListings() {
  const [activeTab, setActiveTab] = useState("jobs")
  const [jobs, setJobs] = useState<Job[]>([])
  const [internships, setInternships] = useState<Internship[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      // Fetch jobs and internships
      const [jobsResponse, internshipsResponse] = await Promise.all([
        getJobs(),
        getInternships()
      ])

      setJobs(jobsResponse.jobs)
      setInternships(internshipsResponse.internships)
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch listings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitApplication = async (id: number, type: 'job' | 'internship') => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append(type === 'job' ? 'job' : 'internship', id.toString())
      
      const response = await createApplication(formData)
      
      toast({
        title: "Success",
        description: response.message || "Your application has been submitted successfully.",
      })
      
      // Add the new application to the list
      setApplications(prev => [...prev, {
        id: response.application.id,
        status: response.application.status,
        created_at: response.application.created_at,
        position_id: id,
        position_type: type
      }])
      
      // Refresh listings
      await fetchListings()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasApplied = (id: number, type: 'job' | 'internship') => {
    return applications.some(app => app.position_id === id && app.position_type === type)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="jobs" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">No jobs found</div>
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </CardDescription>
                    </div>
                    <Badge variant={job.status === 'published' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div>{job.salary_range}</div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.posted_date}
                      </div>
                    </div>
                    <p className="text-sm">{job.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {job.requirements.map((requirement, index) => (
                          <li key={index} className="text-sm">{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button 
                    onClick={() => handleSubmitApplication(job.id, 'job')}
                    disabled={isSubmitting || hasApplied(job.id, 'job')}
                    className="w-full"
                  >
                    {hasApplied(job.id, 'job') ? 'Applied' : 'Apply Now'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="internships" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading internships...</div>
          ) : internships.length === 0 ? (
            <div className="text-center py-8">No internships found</div>
          ) : (
            internships.map((internship) => (
              <Card key={internship.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{internship.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building className="h-4 w-4 mr-1" />
                        {internship.company}
                      </CardDescription>
                    </div>
                    <Badge>{internship.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {internship.location}
                      </div>
                      {internship.deadline && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Deadline: {new Date(internship.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <p className="text-sm">{internship.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {internship.requirements.map((requirement, index) => (
                          <li key={index} className="text-sm">{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button 
                    onClick={() => handleSubmitApplication(internship.id, 'internship')}
                    disabled={isSubmitting || hasApplied(internship.id, 'internship')}
                    className="w-full"
                  >
                    {hasApplied(internship.id, 'internship') ? 'Applied' : 'Apply Now'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
