"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { analyzeResume, reviewATS } from "@/lib/api"

interface AnalysisResult {
  score: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  ats_analysis: {
    score: number;
    keyword_analysis: {
      matched_keywords: string[];
      missing_keywords: string[];
      keyword_density: { [key: string]: number };
    };
    format_analysis: {
      is_ats_friendly: boolean;
      format_issues: string[];
      recommendations: string[];
    };
    content_analysis: {
      section_completeness: { [key: string]: number };
      content_quality: { [key: string]: string };
      improvement_suggestions: string[];
    };
    optimization_tips: string[];
  };
}

export default function ResumeChecker() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size should not exceed 5MB",
          variant: "destructive",
        })
        return
      }
      
      if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/rtf"].includes(file.type)) {
        toast({
          title: "Error",
          description: "Please upload a PDF, DOC, DOCX, or RTF file",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to analyze",
        variant: "destructive",
      })
      return
    }

    if (!jobDescription) {
      toast({
        title: "Error",
        description: "Please enter a job description for ATS analysis",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setProgress(0)

    try {
      // Start progress animation
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 500)

      // Prepare form data
      const formData = new FormData()
      formData.append('resume', selectedFile)

      // Call both analysis endpoints
      const [analysisResponse, atsResponse] = await Promise.all([
        analyzeResume(formData),
        reviewATS(formData, jobDescription)
      ])

      // Combine results
      const result: AnalysisResult = {
        score: analysisResponse.score,
        feedback: {
          strengths: analysisResponse.strengths,
          weaknesses: analysisResponse.weaknesses,
          improvements: analysisResponse.improvements,
        },
        ats_analysis: {
          score: atsResponse.score,
          keyword_analysis: atsResponse.keyword_analysis,
          format_analysis: atsResponse.format_analysis,
          content_analysis: atsResponse.content_analysis,
          optimization_tips: atsResponse.optimization_tips
        }
      }

      setResult(result)
      setProgress(100)
      setIsAnalyzed(true)

      clearInterval(interval)
    } catch (error) {
      console.error('Error analyzing resume:', error)
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resume Checker</CardTitle>
          <CardDescription>
            Upload your resume to get AI-powered feedback and ATS compatibility analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Section */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.rtf"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold">Upload Resume</h3>
            <p className="mt-1 text-xs text-gray-500">
              PDF, DOC, DOCX or RTF up to 5MB
            </p>
            {selectedFile && (
              <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                <FileText className="mr-2 h-4 w-4" />
                {selectedFile.name}
              </div>
            )}
          </div>

          {/* Job Description Input */}
          <div className="space-y-2">
            <label htmlFor="jobDescription" className="block text-sm font-medium">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              rows={5}
              className="w-full p-2 border rounded-md"
              placeholder="Paste the job description here for ATS analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Analysis Button */}
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={isAnalyzing || !selectedFile || !jobDescription}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </Button>

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-gray-500">
                Analyzing your resume...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {isAnalyzed && result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">General Analysis</TabsTrigger>
                <TabsTrigger value="ats">ATS Analysis</TabsTrigger>
              </TabsList>

              {/* General Analysis Tab */}
              <TabsContent value="general" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Overall Score</h3>
                  <span className="text-2xl font-bold">{result.score}%</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Strengths
                    </h4>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      {result.feedback.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      Areas for Improvement
                    </h4>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      {result.feedback.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      Recommendations
                    </h4>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      {result.feedback.improvements.map((improvement, i) => (
                        <li key={i}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* ATS Analysis Tab */}
              <TabsContent value="ats" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
                  <span className="text-2xl font-bold">{result.ats_analysis.score}%</span>
                </div>

                <div className="space-y-4">
                  {/* Keyword Analysis */}
                  <div>
                    <h4 className="font-semibold">Keyword Analysis</h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-600">Matched Keywords</h5>
                        <ul className="mt-1 space-y-1 list-disc list-inside">
                          {result.ats_analysis.keyword_analysis.matched_keywords.map((keyword, i) => (
                            <li key={i}>{keyword}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-red-600">Missing Keywords</h5>
                        <ul className="mt-1 space-y-1 list-disc list-inside">
                          {result.ats_analysis.keyword_analysis.missing_keywords.map((keyword, i) => (
                            <li key={i}>{keyword}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Format Analysis */}
                  <div>
                    <h4 className="font-semibold">Format Analysis</h4>
                    <div className="mt-2">
                      <p className={`text-sm ${result.ats_analysis.format_analysis.is_ats_friendly ? 'text-green-600' : 'text-red-600'}`}>
                        {result.ats_analysis.format_analysis.is_ats_friendly ? 'Your resume is ATS-friendly' : 'Your resume needs formatting improvements'}
                      </p>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        {result.ats_analysis.format_analysis.format_issues.map((issue, i) => (
                          <li key={i} className="text-red-600">{issue}</li>
                        ))}
                      </ul>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        {result.ats_analysis.format_analysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-blue-600">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Content Analysis */}
                  <div>
                    <h4 className="font-semibold">Content Analysis</h4>
                    <div className="mt-2 space-y-2">
                      {Object.entries(result.ats_analysis.content_analysis.section_completeness).map(([section, score]) => (
                        <div key={section}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{section}</span>
                            <span className="text-sm">{score}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optimization Tips */}
                  <div>
                    <h4 className="font-semibold">Optimization Tips</h4>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      {result.ats_analysis.optimization_tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
