"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, Code, Briefcase, BookOpen, Save, Clock } from "lucide-react"

export default function InterviewPrep() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hi there! I'm your AI interview preparation assistant. How can I help you prepare for your interviews today?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: inputValue,
      },
    ])

    setInputValue("")
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: getAIResponse(inputValue),
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (message: string) => {
    if (message.toLowerCase().includes("react")) {
      return "React is a popular JavaScript library for building user interfaces. Some common interview questions about React include:\n\n1. What is the virtual DOM and how does it work?\n2. Explain the component lifecycle in React.\n3. What are hooks in React and how do they work?\n4. What's the difference between state and props?\n\nWould you like me to explain any of these concepts in more detail?"
    } else if (message.toLowerCase().includes("javascript")) {
      return "JavaScript is a versatile programming language. Here are some common JavaScript interview questions:\n\n1. Explain closures in JavaScript.\n2. What is the difference between let, const, and var?\n3. How does prototypal inheritance work?\n4. Explain event delegation.\n\nWould you like me to explain any of these concepts in more detail?"
    } else if (message.toLowerCase().includes("mock interview")) {
      return "I'd be happy to conduct a mock interview with you! Let's start with a common question:\n\nCan you explain how you would optimize the performance of a React application? Please describe specific techniques and tools you would use."
    } else {
      return "I can help you prepare for technical interviews by providing practice questions, explaining concepts, or conducting mock interviews. What specific technology or role are you interviewing for?"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chatbot">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <Bot className="h-4 w-4" /> AI Chatbot
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Practice Questions
          </TabsTrigger>
          <TabsTrigger value="mock" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Mock Interviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chatbot" className="space-y-4 mt-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Interview Coach</CardTitle>
              <CardDescription>Chat with our AI assistant to prepare for your technical interviews.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8">
                        {message.role === "bot" ? (
                          <>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                            <AvatarFallback>AI</AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                            <AvatarFallback>You</AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full items-center gap-2">
                <Input
                  placeholder="Ask about interview questions, concepts, or request a mock interview..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="questions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Practice Questions</CardTitle>
              <CardDescription>Browse and practice common interview questions by category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="frontend">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Development</SelectItem>
                    <SelectItem value="backend">Backend Development</SelectItem>
                    <SelectItem value="fullstack">Full Stack Development</SelectItem>
                    <SelectItem value="algorithms">Data Structures & Algorithms</SelectItem>
                    <SelectItem value="system">System Design</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="react">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="html">HTML/CSS</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="intermediate">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Explain React's Virtual DOM</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" /> 5-10 min
                      </div>
                    </div>
                    <CardDescription>Intermediate • React • Concepts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      The Virtual DOM is a key concept in React. Explain what it is, how it works, and why it's
                      beneficial for performance.
                    </p>
                    <Textarea placeholder="Type your answer here..." className="min-h-[120px]" />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="gap-1">
                      <Save className="h-4 w-4" /> Save Answer
                    </Button>
                    <Button>View Sample Answer</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Implement a Custom Hook</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" /> 10-15 min
                      </div>
                    </div>
                    <CardDescription>Intermediate • React • Coding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Create a custom React hook called useLocalStorage that persists state to localStorage and syncs
                      between tabs.
                    </p>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      <Code className="h-4 w-4 inline-block mr-2" />
                      <span className="text-muted-foreground">// Implement the useLocalStorage hook below</span>
                      <pre className="mt-2">
                        {`function useLocalStorage(key, initialValue) {
  // Your implementation here
}`}
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="gap-1">
                      <Save className="h-4 w-4" /> Save Code
                    </Button>
                    <Button>View Solution</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">React Performance Optimization</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" /> 5-10 min
                      </div>
                    </div>
                    <CardDescription>Advanced • React • Best Practices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Describe the techniques and tools you would use to optimize the performance of a React
                      application.
                    </p>
                    <Textarea placeholder="Type your answer here..." className="min-h-[120px]" />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="gap-1">
                      <Save className="h-4 w-4" /> Save Answer
                    </Button>
                    <Button>View Sample Answer</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mock" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mock Interviews</CardTitle>
              <CardDescription>
                Practice with simulated interview sessions for different roles and companies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="frontend">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                    <SelectItem value="mobile">Mobile Developer</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="tech">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tech Giants</SelectItem>
                    <SelectItem value="startup">Startups</SelectItem>
                    <SelectItem value="finance">Financial Services</SelectItem>
                    <SelectItem value="ecommerce">E-Commerce</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="45">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Technical Interview</CardTitle>
                    <CardDescription>Frontend Developer • 45 minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A technical interview focusing on React, JavaScript, and frontend concepts. Includes coding
                      challenges and system design questions.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <span className="text-sm">Coding challenges</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">Conceptual questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-sm">Experience-based questions</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Start Mock Interview</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Behavioral Interview</CardTitle>
                    <CardDescription>Frontend Developer • 45 minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A behavioral interview focusing on your past experiences, teamwork, problem-solving, and cultural
                      fit.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-sm">STAR method questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">Situational scenarios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-sm">AI-powered feedback</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Start Mock Interview</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">System Design Interview</CardTitle>
                    <CardDescription>Frontend Developer • 45 minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A system design interview focusing on architecture, scalability, and frontend design patterns.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <span className="text-sm">Architecture design</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">Component structure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-sm">Performance considerations</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Start Mock Interview</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Full Interview Loop</CardTitle>
                    <CardDescription>Frontend Developer • 2 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A complete interview loop simulating a real company's interview process with multiple rounds.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <span className="text-sm">Technical screening</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">Coding challenge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-sm">Behavioral interview</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-sm">System design discussion</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Start Interview Loop</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

