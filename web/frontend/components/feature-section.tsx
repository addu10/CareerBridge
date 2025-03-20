"use client"

import { motion } from "framer-motion"
import { FileCheck, MessageSquare, Briefcase, LineChart, UserCheck } from "lucide-react"

const features = [
  {
    icon: FileCheck,
    title: "Resume Checker",
    description: "AI-powered resume analysis that provides feedback and suggestions for improvement.",
    color: "bg-blue-500",
  },
  {
    icon: MessageSquare,
    title: "AI Interview Preparation",
    description: "Practice with our AI chatbot for technical and behavioral interview questions.",
    color: "bg-green-500",
  },
  {
    icon: Briefcase,
    title: "Job & Internship Listings",
    description: "Browse and apply to opportunities from top companies directly from the platform.",
    color: "bg-amber-500",
  },
  {
    icon: LineChart,
    title: "Personalized Roadmaps",
    description: "Get AI-generated career roadmaps tailored to your skills and goals.",
    color: "bg-purple-500",
  },
  {
    icon: UserCheck,
    title: "Candidate Matching",
    description: "Companies can find the perfect candidates using our AI matching algorithm.",
    color: "bg-rose-500",
  },
]

export default function FeatureSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">Key Features</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Powerful tools to help students and companies connect and succeed.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className={`p-3 rounded-full ${feature.color}/10 mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-16"></div>
    </section>
  )
}

