import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCheck, MessageSquare, Briefcase, LineChart, User } from "lucide-react"
import StudentProfile from "@/components/student/student-profile"
import ResumeChecker from "@/components/student/resume-checker"
import RoadmapGenerator from "@/components/student/roadmap-generator"
import InterviewPrep from "@/components/student/interview-prep"
import JobListings from "@/components/student/job-listings"

export default function StudentPortalPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Portal</h1>
          <p className="text-muted-foreground">Manage your profile, check job listings, and prepare for interviews.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Resume</span>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Roadmap</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Interview</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <StudentProfile />
          </TabsContent>
          <TabsContent value="resume">
            <ResumeChecker />
          </TabsContent>
          <TabsContent value="roadmap">
            <RoadmapGenerator />
          </TabsContent>
          <TabsContent value="interview">
            <InterviewPrep />
          </TabsContent>
          <TabsContent value="jobs">
            <JobListings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

