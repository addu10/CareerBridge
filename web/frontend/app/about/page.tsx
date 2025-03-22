import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, Award, BookOpen } from "lucide-react"
import BackgroundAnimationLight from "@/components/BackgroundAnimationLight"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <BackgroundAnimationLight />
      <div className="container py-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">About CareerConnect</h1>
          <p className="text-xl text-muted-foreground">
            Bridging the gap between talented students and industry-leading companies.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                CareerConnect is dedicated to transforming how students and companies connect for internships and job
                placements. We leverage cutting-edge technology and AI to create meaningful career opportunities and
                help companies find the perfect talent for their needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our team consists of industry professionals, career counselors, and technology experts who understand
                the challenges of both job seekers and employers. We're committed to creating a platform that addresses
                the needs of both sides of the employment equation.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center">What Sets Us Apart</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" /> AI-Powered Matching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our advanced AI algorithms match students with the most suitable opportunities based on their skills,
                  interests, and career goals, ensuring the best fit for both parties.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> Career Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We provide comprehensive resources for career development, including resume building, interview
                  preparation, and personalized roadmaps to help students achieve their professional goals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" /> Industry Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We've partnered with leading companies across various industries to provide exclusive opportunities
                  and insights into the professional world, giving our users a competitive edge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join CareerConnect Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Whether you're a student looking for opportunities or a company seeking talent, CareerConnect provides the
            tools and resources you need to succeed.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/student"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Student Portal
            </a>
            <a
              href="/company"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Company Portal
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

