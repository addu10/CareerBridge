"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ResumeChecker() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = () => {
    setIsAnalyzing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setIsAnalyzed(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Checker</CardTitle>
          <CardDescription>Upload your resume and get AI-powered feedback to improve it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAnalyzed ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Your Resume</h3>
              <p className="text-muted-foreground mb-4">Supported formats: PDF, DOCX, RTF (Max size: 5MB)</p>
              <Button onClick={handleUpload} className="gap-2">
                <Upload className="h-4 w-4" /> Upload Resume
              </Button>
              {isAnalyzing && (
                <div className="w-full mt-6 space-y-2">
                  <p className="text-sm text-muted-foreground">Analyzing your resume...</p>
                  <Progress value={progress} className="h-2 w-full" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">resume_john_smith.pdf</span>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Upload className="h-4 w-4" /> Upload New
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                      <h3 className="font-medium">Overall Score</h3>
                      <p className="text-3xl font-bold text-green-500">82%</p>
                      <p className="text-sm text-muted-foreground">Good resume with room for improvement</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                      <h3 className="font-medium">Areas to Improve</h3>
                      <p className="text-3xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Critical issues to address</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Info className="h-8 w-8 text-blue-500 mb-2" />
                      <h3 className="font-medium">ATS Compatibility</h3>
                      <p className="text-3xl font-bold text-blue-500">90%</p>
                      <p className="text-sm text-muted-foreground">Your resume is ATS-friendly</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="feedback">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords Analysis</TabsTrigger>
                  <TabsTrigger value="suggestions">Improvement Suggestions</TabsTrigger>
                </TabsList>
                <TabsContent value="feedback" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-amber-500/10 border-amber-500/20">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" /> Work Experience Section
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your work experience lacks quantifiable achievements. Add metrics and results to make your
                        impact clearer.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-amber-500/10 border-amber-500/20">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" /> Skills Section
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your skills section is too generic. Add specific technologies, frameworks, and tools you're
                        proficient in.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-amber-500/10 border-amber-500/20">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" /> Summary Statement
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your summary is too long. Keep it concise (2-3 sentences) and highlight your most relevant
                        qualifications.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" /> Education Section
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your education section is well-structured and includes relevant coursework and GPA.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="keywords" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Keyword Analysis</CardTitle>
                      <CardDescription>How well your resume matches job descriptions in your field.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Technical Skills</span>
                            <span className="text-sm text-muted-foreground">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Industry Buzzwords</span>
                            <span className="text-sm text-muted-foreground">60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Action Verbs</span>
                            <span className="text-sm text-muted-foreground">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Soft Skills</span>
                            <span className="text-sm text-muted-foreground">50%</span>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="suggestions" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI-Generated Suggestions</CardTitle>
                      <CardDescription>Specific improvements to enhance your resume.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Work Experience Improvements</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                            <li>
                              Add metrics to your achievements (e.g., "Increased website traffic by 45%" instead of
                              "Increased website traffic")
                            </li>
                            <li>Use more powerful action verbs (e.g., "Spearheaded" instead of "Led")</li>
                            <li>Focus on results rather than responsibilities</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Skills Section Improvements</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                            <li>Group skills by category (e.g., Programming Languages, Frameworks, Tools)</li>
                            <li>Add proficiency levels for technical skills</li>
                            <li>Include relevant soft skills with examples</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Summary Statement Improvements</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                            <li>Shorten to 2-3 impactful sentences</li>
                            <li>Include your years of experience and specialization</li>
                            <li>Mention your most impressive achievement</li>
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
          {isAnalyzed && <Button variant="outline">Download Full Report</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}

