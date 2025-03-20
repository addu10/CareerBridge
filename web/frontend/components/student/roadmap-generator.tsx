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
import { generateCareerRoadmap } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Define interfaces for the roadmap data structure
interface Phase {
  duration: string;
  skills: string[];
  icon?: any;
}

interface Milestone {
  title: string;
  description: string;
}

interface Skill {
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

interface Project {
  title: string;
  description: string;
  features: string[];
}

interface Resource {
  title: string;
  description: string;
}

interface ResourceCategory {
  category: string;
  resources: Resource[];
}

interface RoadmapContent {
  title: string;
  description: string;
  phases: Phase[];
  milestones: Milestone[];
  skills: SkillCategory[];
  projects: Project[];
  resources: ResourceCategory[];
}

interface Timeline {
  short_term: string[];
  medium_term: string[];
  long_term: string[];
}

interface RoadmapData {
  roadmap_content: RoadmapContent | string;
  milestones: string[];
  skills_to_acquire: string[];
  timeline: Timeline;
}

export default function RoadmapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [progress, setProgress] = useState(0)
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null)
  const [careerGoal, setCareerGoal] = useState("fullstack")
  const [experienceLevel, setExperienceLevel] = useState("intermediate")
  const [timeline, setTimeline] = useState("6months")
  const [currentSkills, setCurrentSkills] = useState("JavaScript, HTML, CSS, React basics, Git")
  const [interests, setInterests] = useState("Cloud computing, React Native, GraphQL")
  const { toast } = useToast()

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)

    // Start progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 5
      })
    }, 200)

    try {
      // Parse skills into an array
      const skillsArray = currentSkills.split(',').map(skill => skill.trim()).filter(Boolean)
      
      console.log("Sending roadmap request with data:", {
        current_skills: skillsArray,
        target_role: careerGoal,
        experience_level: experienceLevel
      });
      
      // Call the API
      const result = await generateCareerRoadmap({
        current_skills: skillsArray,
        target_role: careerGoal,
        experience_level: experienceLevel
      })
      
      console.log("Received roadmap response:", result);
      
      // Set the roadmap data
      setRoadmapData(ensureValidRoadmapData(result as RoadmapData))
      
      // Complete the progress
      setProgress(100)
      setIsGenerating(false)
      setIsGenerated(true)
      
    } catch (error) {
      console.error("Error generating roadmap:", error)
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive"
      })
      setIsGenerating(false)
      clearInterval(interval)
      setProgress(0)
    }
  }

  const getContent = (): string => {
    if (!roadmapData) {
      return "Based on your current skills and goals, we've created a roadmap to help you achieve your career objectives.";
    }
    
    if (typeof roadmapData.roadmap_content === 'string') {
      return roadmapData.roadmap_content;
    }
    
    if (typeof roadmapData.roadmap_content === 'object' && roadmapData.roadmap_content.description) {
      return roadmapData.roadmap_content.description;
    }
    
    return "Based on your current skills and goals, we've created a roadmap to help you achieve your career objectives.";
  }

  const getTitle = (): string => {
    if (!roadmapData) return "Career";
    
    if (typeof roadmapData.roadmap_content === 'object' && roadmapData.roadmap_content.title) {
      return roadmapData.roadmap_content.title;
    }
    
    return "Career";
  }

  // Helper function to ensure we have valid data to display
  const ensureValidRoadmapData = (data: any): RoadmapData => {
    if (!data) return createDefaultRoadmapData();
    
    // Create a new object with default values for missing properties
    return {
      roadmap_content: data.roadmap_content || createDefaultRoadmapContent(),
      milestones: data.milestones || [],
      skills_to_acquire: data.skills_to_acquire || [],
      timeline: data.timeline || { short_term: [], medium_term: [], long_term: [] }
    };
  }

  // Create default roadmap content
  const createDefaultRoadmapContent = (): RoadmapContent => {
    return {
      title: "Career Roadmap",
      description: "Based on your current skills and goals, we've created a roadmap to help you achieve your career objectives.",
      phases: [],
      milestones: [],
      skills: [],
      projects: [],
      resources: []
    };
  }

  // Create a complete default roadmap data structure
  const createDefaultRoadmapData = (): RoadmapData => {
    return {
      roadmap_content: createDefaultRoadmapContent(),
      milestones: [],
      skills_to_acquire: [],
      timeline: {
        short_term: [],
        medium_term: [],
        long_term: []
      }
    };
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
                    <Select 
                      defaultValue="fullstack" 
                      onValueChange={(value) => setCareerGoal(value)}
                    >
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
                    <Select 
                      defaultValue="intermediate"
                      onValueChange={(value) => setExperienceLevel(value)}
                    >
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
                    <Select 
                      defaultValue="6months"
                      onValueChange={(value) => setTimeline(value)}
                    >
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
                      onChange={(e) => setCurrentSkills(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interests">Specific Interests</Label>
                    <Input
                      id="interests"
                      placeholder="Any specific technologies or areas you're interested in..."
                      defaultValue="Cloud computing, React Native, GraphQL"
                      onChange={(e) => setInterests(e.target.value)}
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
                  <h3 className="font-medium">Your Personalized {getTitle()} Roadmap</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getContent()}
                </p>
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills Path</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {roadmapData && typeof roadmapData.roadmap_content === 'object' && 
                       Array.isArray(roadmapData.roadmap_content.phases) && 
                       roadmapData.roadmap_content.phases.length > 0 ? (
                        roadmapData.roadmap_content.phases.map((phase: Phase, index: number) => (
                          <Card key={index}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg flex items-center gap-2">
                                {phase.icon && <phase.icon className="h-5 w-5 text-blue-500" />}
                                Phase {index + 1}
                              </CardTitle>
                              <CardDescription>{phase.duration || `Phase ${index + 1}`}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 text-sm">
                                {Array.isArray(phase.skills) && phase.skills.map((skill: string, index: number) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span>{skill}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card className="col-span-3">
                          <CardContent className="p-6 text-center text-muted-foreground">
                            No phases defined in this roadmap.
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Milestones</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {roadmapData && typeof roadmapData.roadmap_content === 'object' && 
                           Array.isArray(roadmapData.roadmap_content.milestones) && 
                           roadmapData.roadmap_content.milestones.length > 0 ? (
                            roadmapData.roadmap_content.milestones.map((milestone: Milestone, index: number) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                                  <span className="text-sm">{index + 1}</span>
                                </div>
                                <div>
                                  <h4 className="font-medium">{milestone.title}</h4>
                                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="text-center text-muted-foreground">
                              No milestones defined in this roadmap.
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="skills" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills to Acquire</CardTitle>
                      <CardDescription>Prioritized skills based on your career goals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {roadmapData && typeof roadmapData.roadmap_content === 'object' && 
                         Array.isArray(roadmapData.roadmap_content.skills) && 
                         roadmapData.roadmap_content.skills.length > 0 ? (
                          roadmapData.roadmap_content.skills.map((skillCategory: SkillCategory, index: number) => (
                            <div key={index}>
                              <h3 className="font-medium mb-2">{skillCategory.category}</h3>
                              <div className="space-y-3">
                                {Array.isArray(skillCategory.skills) && skillCategory.skills.map((skill: Skill, index: number) => (
                                  <div key={index}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm">{skill.name}</span>
                                      <span className="text-sm text-muted-foreground">{skill.priority}</span>
                                    </div>
                                    <Progress value={skill.progress || 0} className="h-2" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            {Array.isArray(roadmapData?.skills_to_acquire) && roadmapData.skills_to_acquire.length > 0 ? (
                              <div>
                                <h3 className="font-medium mb-2">Skills to Acquire</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {roadmapData.skills_to_acquire.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <p>No skills defined in this roadmap.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="projects" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Projects</CardTitle>
                      <CardDescription>Hands-on projects to build your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {roadmapData && typeof roadmapData.roadmap_content === 'object' && 
                         Array.isArray(roadmapData.roadmap_content.projects) && 
                         roadmapData.roadmap_content.projects.length > 0 ? (
                          roadmapData.roadmap_content.projects.map((project: Project, index: number) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h3 className="font-medium mb-2">{project.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                              <div className="text-sm">
                                <p className="font-medium mb-1">Key Features:</p>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                  {Array.isArray(project.features) && project.features.map((feature: string, index: number) => (
                                    <li key={index}>{feature}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            No projects defined in this roadmap.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="resources" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Resources</CardTitle>
                      <CardDescription>Recommended courses, books, and tutorials</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {roadmapData && typeof roadmapData.roadmap_content === 'object' && 
                         Array.isArray(roadmapData.roadmap_content.resources) && 
                         roadmapData.roadmap_content.resources.length > 0 ? (
                          roadmapData.roadmap_content.resources.map((resourceCategory: ResourceCategory, index: number) => (
                            <div key={index}>
                              <h3 className="font-medium mb-2">{resourceCategory.category}</h3>
                              <ul className="space-y-2">
                                {Array.isArray(resourceCategory.resources) && resourceCategory.resources.map((resource: Resource, index: number) => (
                                  <li key={index} className="p-3 border rounded-lg">
                                    <h4 className="font-medium">{resource.title}</h4>
                                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            No resources defined in this roadmap.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="timeline" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Short-term</CardTitle>
                        <CardDescription>0-6 months</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {roadmapData && roadmapData.timeline && Array.isArray(roadmapData.timeline.short_term) && 
                           roadmapData.timeline.short_term.length > 0 ? (
                            roadmapData.timeline.short_term.map((goal: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <span>{goal}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-center text-muted-foreground">
                              No short-term goals defined.
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Medium-term</CardTitle>
                        <CardDescription>6-18 months</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {roadmapData && roadmapData.timeline && Array.isArray(roadmapData.timeline.medium_term) && 
                           roadmapData.timeline.medium_term.length > 0 ? (
                            roadmapData.timeline.medium_term.map((goal: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <span>{goal}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-center text-muted-foreground">
                              No medium-term goals defined.
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Long-term</CardTitle>
                        <CardDescription>18+ months</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {roadmapData && roadmapData.timeline && Array.isArray(roadmapData.timeline.long_term) && 
                           roadmapData.timeline.long_term.length > 0 ? (
                            roadmapData.timeline.long_term.map((goal: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <span>{goal}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-center text-muted-foreground">
                              No long-term goals defined.
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsGenerated(false)}>Edit Goals</Button>
                <div className="flex gap-2">
                  <Button variant="outline">Customize Roadmap</Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" /> Download Roadmap
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
