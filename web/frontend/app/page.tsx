import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import PortalSection from "@/components/portal-section"
import AIFeatureSection from "@/components/ai-feature-section"
import TestimonialSection from "@/components/testimonial-section"
import StatsSection from "@/components/stats-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSection />
      <PortalSection />
      <FeatureSection />
      <AIFeatureSection />
      <StatsSection />
      <TestimonialSection />

      <section className="w-full py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                Ready to Get Started?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Join our platform today and take the first step towards your dream career.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-1">
                <Link href="/student">
                  Student Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-1">
                <Link href="/company">
                  Company Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

