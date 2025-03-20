"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const y = useTransform(scrollY, [0, 300], [0, 100])

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("portals-section")
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div className="flex flex-col items-center justify-center space-y-8 text-center" style={{ opacity, y }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl gradient-text">
              Internship & Placement Portal
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed mx-auto">
              Connecting talented students with leading companies for internships and placements.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="gap-1 shadow-md hover:shadow-lg transition-all">
              <Link href="/student">
                Student Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-1 transition-all">
              <Link href="/company">
                Company Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 w-full flex justify-center"
          >
            <button
              onClick={scrollToNextSection}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Scroll to next section"
            >
              <span className="text-sm">Explore More</span>
              <ChevronDown className="h-6 w-6 animate-bounce" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="section-divider mt-16"></div>
    </section>
  )
}

