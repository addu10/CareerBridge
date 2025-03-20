"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, Building, GraduationCap } from "lucide-react"

const stats = [
  {
    value: "5,000+",
    label: "Students Registered",
    icon: Users,
    color: "text-blue-500",
  },
  {
    value: "1,200+",
    label: "Companies Onboarded",
    icon: Building,
    color: "text-green-500",
  },
  {
    value: "3,500+",
    label: "Successful Placements",
    icon: GraduationCap,
    color: "text-purple-500",
  },
  {
    value: "8,000+",
    label: "Job Opportunities",
    icon: Briefcase,
    color: "text-amber-500",
  },
]

export default function StatsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">Our Impact</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Making a difference in the careers of students and the hiring process of companies.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className={`p-3 rounded-full bg-${stat.color.split("-")[1]}-500/10 mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-16"></div>
    </section>
  )
}

