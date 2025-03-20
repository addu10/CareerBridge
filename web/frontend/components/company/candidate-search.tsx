"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, BookmarkPlus, Send, Download, GraduationCap, Briefcase } from "lucide-react"

const candidates = [
  {
    id: 1,
    name: "Priya Sharma",
    college: "Indian Institute of Technology, Delhi",
    degree: "B.Tech in Computer Science",
    graduationYear: 2024,
    skills: ["React", "JavaScript", "Node.js", "MongoDB"],
    experience: "Internship at StartupX",
    matchScore: 92,
  },
  {
    id: 2,
    name: "Rahul Verma",
    college: "National Institute of Technology, Trichy",
    degree: "B.Tech in Information Technology",
    graduationYear: 2023,
    skills: ["Python", "Django", "SQL", "AWS"],
    experience: "Internship at TechCorp",
    matchScore: 85,
  },
  {
    id: 3,
    name: "Ananya Patel",
    college: "BITS Pilani",
    degree: "B.E. in Computer Science",
    graduationYear: 2024,
    skills: ["Java", "Spring Boot", "React", "MySQL"],
    experience: "Web Developer at College Tech Club",
    matchScore: 78,
  },
  {
    id: 4,
    name: "Vikram Singh",
    college: "Delhi Technological University",
    degree: "B.Tech in Electronics",
    graduationYear: 2023,
    skills: ["C++", "MATLAB", "Python", "Data Analysis"],
    experience: "Research Assistant",
    matchScore: 65,
  },
  {
    id: 5,
    name: "Neha Gupta",
    college: "VIT Vellore",
    degree: "B.Tech in Computer Science",
    graduationYear: 2024,
    skills: ["Flutter", "Firebase", "JavaScript", "UI/UX Design"],
    experience: "Mobile App Developer Intern",
    matchScore: 88,
  },
]

export default function CandidateSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    graduationYear: "all",
    skills: [] as string[],
  })

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesGradYear =
      filters.graduationYear === "all" || candidate.graduationYear.toString() === filters.graduationYear

    const matchesSkills =
      filters.skills.length === 0 || filters.skills.every((skill) => candidate.skills.includes(skill))

    return matchesSearch && matchesGradYear && matchesSkills
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Candidate Search</CardTitle>
          <CardDescription>Find the perfect candidates for your job openings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, college, or skills..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={filters.graduationYear}
                  onValueChange={(value) => setFilters({ ...filters, graduationYear: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Graduation Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2">
                  {["React", "JavaScript", "Python", "Java", "Node.js"].map((skill) => (
                    <Badge
                      key={skill}
                      variant={filters.skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (filters.skills.includes(skill)) {
                          setFilters({
                            ...filters,
                            skills: filters.skills.filter((s) => s !== skill),
                          })
                        } else {
                          setFilters({
                            ...filters,
                            skills: [...filters.skills, skill],
                          })
                        }
                      }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <Card
                      key={candidate.id}
                      className={`cursor-pointer transition-all hover:border-primary/50 ${
                        selectedCandidate === candidate.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedCandidate(candidate.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={candidate.name} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{candidate.name}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <GraduationCap className="h-3 w-3" /> {candidate.degree}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-primary/20 text-primary border-primary/20">
                            {candidate.matchScore}% Match
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {candidate.college} • Graduating {candidate.graduationYear}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {candidate.experience}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {candidate.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="font-normal">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCandidate(candidate.id)
                          }}
                        >
                          View Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No candidates found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/3">
              {selectedCandidate ? (
                <Card className="sticky top-4">
                  {candidates
                    .filter((candidate) => candidate.id === selectedCandidate)
                    .map((candidate) => (
                      <div key={candidate.id}>
                        <CardHeader>
                          <div className="flex flex-col items-center text-center">
                            <Avatar className="h-20 w-20 mb-2">
                              <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={candidate.name} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <CardTitle>{candidate.name}</CardTitle>
                            <CardDescription className="mt-1">{candidate.degree}</CardDescription>
                            <div className="flex items-center gap-1 mt-2">
                              <Badge className="bg-primary/20 text-primary border-primary/20">
                                {candidate.matchScore}% Match
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-1">Education</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4" /> {candidate.college}
                              </div>
                              <div>{candidate.degree}</div>
                              <div>Graduating in {candidate.graduationYear}</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">Experience</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" /> {candidate.experience}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="font-normal">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">Match Analysis</h4>
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Skills Match</span>
                                <span className="text-sm font-medium">{Math.round(candidate.matchScore * 0.7)}%</span>
                              </div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Education Match</span>
                                <span className="text-sm font-medium">{Math.round(candidate.matchScore * 0.2)}%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Experience Match</span>
                                <span className="text-sm font-medium">{Math.round(candidate.matchScore * 0.1)}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button className="flex-1 gap-1">
                            <Send className="h-4 w-4" /> Contact
                          </Button>
                          <Button variant="outline" className="gap-1">
                            <Download className="h-4 w-4" /> Resume
                          </Button>
                          <Button variant="outline" size="icon">
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </div>
                    ))}
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Candidate Profile</CardTitle>
                    <CardDescription>Select a candidate to view their profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Click on a candidate to view their detailed profile.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

