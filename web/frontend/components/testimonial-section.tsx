"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "The AI resume checker helped me improve my resume significantly. I received multiple interview calls after the changes!",
    name: "Priya Sharma",
    role: "Computer Science Student",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "PS",
  },
  {
    quote:
      "As a recruiter, the candidate matching feature saved me hours of manual screening. The quality of matches is impressive.",
    name: "Rahul Mehta",
    role: "HR Manager, TechCorp",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RM",
  },
  {
    quote: "The interview preparation chatbot helped me feel confident and prepared. I aced my technical interview!",
    name: "Ananya Patel",
    role: "Engineering Graduate",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AP",
  },
]

export default function TestimonialSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
              Success Stories
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Hear from students and companies who have benefited from our platform.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Quote className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground">"{testimonial.quote}"</p>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="mt-2 text-center">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-16"></div>
    </section>
  )
}

