import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold gradient-text">CareerConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting talented students with leading companies for internships and placements.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Portals</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/student" className="text-muted-foreground hover:text-primary transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/company" className="text-muted-foreground hover:text-primary transition-colors">
                  Company Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/resources/resume-tips"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/interview-prep"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Interview Preparation
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/career-advice"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Career Advice
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/hiring-guides"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hiring Guides
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

