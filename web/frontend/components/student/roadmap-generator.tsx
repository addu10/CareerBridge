"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Brain, BookOpen, Code, Award, Sparkles, Download } from "lucide-react"

export default function RoadmapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerate = () => {
    setIsGenerating(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setIsGenerated(true)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Roadmap Generator</CardTitle>
          <CardDescription>
            Get a personalized learning and career roadmap based on your goals and current skills.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isGenerated ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="career-goal">Career Goal</Label>
                    <Select defaultValue="fullstack">
                      <SelectTrigger id="career-goal">
                        <SelectValue placeholder="Select your career goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                        <SelectItem value="frontend">Frontend Developer</SelectItem>
                        <SelectItem value="backend">Backend Developer</SelectItem>
                        <SelectItem value="mobile">Mobile Developer</SelectItem>
                        <SelectItem value="data">Data Scientist</SelectItem>
                        <SelectItem value="ml">Machine Learning Engineer</SelectItem>
                        <SelectItem value="devops">DevOps Engineer</SelectItem>
                        <SelectItem value="cloud">Cloud Architect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select defaultValue="intermediate">
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <Select defaultValue="6months">
                      <SelectTrigger id="timeline">
                        <SelectValue placeholder="Select your timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3months">3 months</SelectItem>
                        <SelectItem value="6months">6 months</SelectItem>
                        <SelectItem value="1year">1 year</SelectItem>
                        <SelectItem value="2years">2 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-skills">Current Skills</Label>
                    <Textarea
                      id="current-skills"
                      placeholder="List your current skills, separated by commas..."
                      className="min-h-[120px]"
                      defaultValue="JavaScript, HTML, CSS, React basics, Git"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interests">Specific Interests</Label>
                    <Input
                      id="interests"
                      placeholder="Any specific technologies or areas you're interested in..."
                      defaultValue="Cloud computing, React Native, GraphQL"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleGenerate} className="w-full gap-2" disabled={isGenerating}>
                <Brain className="h-4 w-4" /> Generate Roadmap
              </Button>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing your profile...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Your Personalized Full Stack Developer Roadmap</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your current skills and goals, we've created a 6-month roadmap to help you become a Full
                  Stack Developer with a focus on cloud computing and React Native.
                </p>
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills Path</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-500" /> Phase 1
                          </CardTitle>
                          <CardDescription>Months 1-2</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <span>Advanced JavaScript & ES6+</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <span>React Advanced Concepts</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <span>Node.js Fundamentals</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <span>RESTful API Design</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Code className="h-5 w-5 text-green-500" /> Phase 2
                          </CardTitle>
                          <CardDescription>Months 3-4</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span>Express.js & MongoDB</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span>GraphQL Implementation</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span>React Native Basics</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span>AWS Fundamentals</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Award className="h-5 w-5 text-purple-500" /> Phase 3
                          </CardTitle>
                          <CardDescription>Months 5-6</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                              <span>Full Stack Projects</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                              <span>Cloud Deployment</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                              <span>CI/CD Pipelines</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                              <span>Portfolio Building</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Milestones</CardTitle>
                        <CardDescription>Important achievements to aim for during your journey.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                              <span className="text-sm">1</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Build a Full Stack Web Application</h4>
                              <p className="text-sm text-muted-foreground">
                                Create a complete web app with React frontend, Node.js backend, and MongoDB database.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                              <span className="text-sm">2</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Develop a Mobile App with React Native</h4>
                              <p className="text-sm text-muted-foreground">
                                Build a cross-platform mobile application that connects to your backend services.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                              <span className="text-sm">3</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Deploy Applications to AWS Cloud</h4>
                              <p className="text-sm text-muted-foreground">
                                Learn to deploy and scale your applications using AWS services like EC2, S3, and Lambda.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                              <span className="text-sm">4</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Create a Professional Portfolio</h4>
                              <p className="text-sm text-muted-foreground">
                                Showcase your projects, skills, and achievements in a professional portfolio website.
                              </p>
                            </div>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="skills" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Development Path</CardTitle>
                      <CardDescription>Recommended skills to learn in order of priority.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Frontend Development</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Advanced JavaScript & ES6+</span>
                                <span className="text-sm text-muted-foreground">High Priority</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">React Hooks & Context API</span>
                                <span className="text-sm text-muted-foreground">High Priority</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">State Management (Redux/MobX)</span>
                                <span className="text-sm text-muted-foreground">Medium Priority</span>
                              </div>
                              <Progress value={70} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">React Native</span>
                                <span className="text-sm text-muted-foreground">Medium Priority</span>
                              </div>
                              <Progress value={70} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">TypeScript</span>
                                <span className="text-sm text-muted-foreground">Medium Priority</span>
                              </div>
                              <Progress value={70} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Backend Development</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Node.js & Express.js</span>
                                <span className="text-sm text-muted-foreground">High Priority</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">RESTful API Design</span>
                                <span className="text-sm text-muted-foreground">High Priority</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">MongoDB & Mongoose</span>
                                <span className="text-sm text-muted-foreground">High Priority</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">GraphQL</span>
                                <span className="text-sm text-muted-foreground">Medium Priority</span>
                              </div>
                              <Progress value={70} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Authentication & Authorization</span>
                                <span className="text-sm text-muted-foreground">High Priority</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Cloud & DevOps</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">AWS Fundamentals</span>
                                <span className="text-sm text-muted-foreground">Medium Priority</span>
                              </div>
                              <Progress value={70} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Docker Basics</span>
                                <span className="text-sm text-muted-foreground">Low Priority</span>
                              </div>
                              <Progress value={40} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">CI/CD Pipelines</span>
                                <span className="text-sm text-muted-foreground">Low Priority</span>
                              </div>
                              <Progress value={40} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="projects" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Projects</CardTitle>
                      <CardDescription>
                        Build these projects to apply your skills and enhance your portfolio.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">1. Full Stack Social Media Dashboard</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Create a social media analytics dashboard with React, Node.js, and MongoDB.
                          </p>
                          <div className="text-sm">
                            <p className="font-medium mb-1">Key Features:</p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                              <li>Real-time data visualization with charts and graphs</li>
                              <li>User authentication and profile management</li>
                              <li>API integration with social media platforms</li>
                              <li>Responsive design for mobile and desktop</li>
                            </ul>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">2. E-Commerce Mobile App with React Native</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Build a cross-platform e-commerce app with React Native and a Node.js backend.
                          </p>
                          <div className="text-sm">
                            <p className="font-medium mb-1">Key Features:</p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                              <li>Product catalog with search and filtering</li>
                              <li>Shopping cart and checkout process</li>
                              <li>User reviews and ratings</li>
                              <li>Push notifications for order updates</li>
                            </ul>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">3. Cloud-Based Task Management System</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Create a task management system deployed on AWS with serverless architecture.
                          </p>
                          <div className="text-sm">
                            <p className="font-medium mb-1">Key Features:</p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                              <li>Task creation, assignment, and tracking</li>
                              <li>Real-time updates with WebSockets</li>
                              <li>File uploads to S3</li>
                              <li>Serverless functions with AWS Lambda</li>
                            </ul>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">4. Personal Portfolio Website</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Build a professional portfolio website to showcase your projects and skills.
                          </p>
                          <div className="text-sm">
                            <p className="font-medium mb-1">Key Features:</p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                              <li>Responsive design with modern UI/UX</li>
                              <li>Project showcase with detailed descriptions</li>
                              <li>Skills and experience sections</li>
                              <li>Contact form with serverless backend</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="resources" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Resources</CardTitle>
                      <CardDescription>
                        Recommended courses, tutorials, and documentation to help you learn.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Online Courses</h3>
                          <ul className="space-y-2">
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">Modern JavaScript for React Developers</h4>
                              <p className="text-sm text-muted-foreground">
                                A comprehensive course on ES6+ features and advanced JavaScript concepts.
                              </p>
                            </li>
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">Complete React Developer Course</h4>
                              <p className="text-sm text-muted-foreground">
                                Learn React, Redux, Hooks, Context API, and more with practical projects.
                              </p>
                            </li>
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">Node.js, Express & MongoDB Bootcamp</h4>
                              <p className="text-sm text-muted-foreground">
                                Build RESTful APIs and backend services with Node.js and MongoDB.
                              </p>
                            </li>
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">React Native - The Practical Guide</h4>
                              <p className="text-sm text-muted-foreground">
                                Learn to build native mobile apps for iOS and Android with React Native.
                              </p>
                            </li>
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">AWS Certified Developer Associate</h4>
                              <p className="text-sm text-muted-foreground">
                                Learn AWS services and prepare for the AWS Developer certification.
                              </p>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Books & Documentation</h3>
                          <ul className="space-y-2">
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">You Don't Know JS (Book Series)</h4>
                              <p className="text-sm text-muted-foreground">
                                Deep dive into JavaScript language mechanics and best practices.
                              </p>
                            </li>
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">React Documentation</h4>
                              <p className="text-sm text-muted-foreground">
                                Official React documentation with guides, API references, and examples.
                              </p>
                            </li>
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">Node.js Design Patterns</h4>
                              <p className="text-sm text-muted-foreground">
                                Learn advanced Node.js patterns and architectural best practices.
                              </p>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">YouTube Channels & Blogs</h3>
                          <ul className="space-y-2">
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">Traversy Media</h4>
                              <p className="text-sm text-muted-foreground">
                                Practical tutorials on web development technologies and frameworks.
                              </p>
                            </li>
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">Ben Awad</h4>
                              <p className="text-sm text-muted-foreground">
                                Full stack React tutorials and project walkthroughs.
                              </p>
                            </li>
                            <li className="p-3 border rounded-lg">
                              <h4 className="font-medium">CSS-Tricks</h4>
                              <p className="text-sm text-muted-foreground">
                                Articles and tutorials on frontend development and design.
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isGenerated && (
            <>
              <Button variant="outline">Customize Roadmap</Button>
              <Button className="gap-1">
                <Download className="h-4 w-4" /> Download Roadmap
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

