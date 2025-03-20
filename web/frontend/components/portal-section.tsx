"use client"

import { motion } from "framer-motion"
import { GraduationCap, Building, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const portals = [
  {
    title: "Student Portal",
    description: "Create your profile, explore opportunities, and prepare for interviews with AI assistance.",
    icon: GraduationCap,
    color: "bg-blue-500/10",
    textColor: "text-blue-500",
    features: [
      "Profile Creation",
      "AI Roadmap Generator",
      "Resume Checker",
      "Interview Preparation",
      "Job Applications",
    ],
  },
  {
    title: "Company Portal",
    description: "Post job openings, find the perfect candidates, and manage applications efficiently.",
    icon: Building,
    color: "bg-green-500/10",
    textColor: "text-green-500",
    features: [
      "Post Job Openings",
      "Browse Student Profiles",
      "Application Management",
      "AI Candidate Matching",
      "Interview Scheduling",
    ],
  },
  {
    title: "Admin Dashboard",
    description: "Monitor placements, manage approvals, and generate insights for better decision-making.",
    icon: BarChart3,
    color: "bg-purple-500/10",
    textColor: "text-purple-500",
    features: [
      "Job Posting Approvals",
      "Student Application Tracking",
      "Placement Statistics",
      "Report Generation",
      "Platform Management",
    ],
  },
]

export default function PortalSection() {
  return (
    <section id="portals-section" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">Our Portals</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Tailored solutions for students, companies, and administrators.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-hover"
            >
              <Card
                className="h-full transition-all duration-200 hover:shadow-lg border-t-4"
                style={{ borderTopColor: portal.textColor.replace("text-", "var(--") }}
              >
                <CardHeader className={cn("flex flex-row items-center gap-4", portal.color)}>
                  <div className={cn("p-2 rounded-full", portal.color)}>
                    <portal.icon className={cn("h-6 w-6", portal.textColor)} />
                  </div>
                  <div>
                    <CardTitle>{portal.title}</CardTitle>
                    <CardDescription className="mt-2">{portal.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mt-4">
                    {portal.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full", portal.textColor)} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-16"></div>
    </section>
  )
}

