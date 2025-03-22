import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Users, FileText, Bot } from "lucide-react"
import CompanyProfile from "@/components/company/company-profile"
import JobPostings from "@/components/company/job-postings"
import CandidateSearch from "@/components/company/candidate-search"
import ApplicationManagement from "@/components/company/application-management"
import BackgroundAnimationLight from "@/components/BackgroundAnimationLight"

export default function CompanyPortalPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <BackgroundAnimationLight />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company Portal</h1>
          <p className="text-muted-foreground">
            Manage your company profile, post job openings, and find the perfect candidates.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Company Profile</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Job Postings</span>
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Candidate Search</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <CompanyProfile />
          </TabsContent>
          <TabsContent value="jobs">
            <JobPostings />
          </TabsContent>
          <TabsContent value="candidates">
            <CandidateSearch />
          </TabsContent>
          <TabsContent value="applications">
            <ApplicationManagement />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

