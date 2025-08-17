"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Mail, Users, Heart, Target } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              Meet Our Team
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
              The People Behind <span className="text-accent">CodePVG</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              A passionate group of students and educators dedicated to revolutionizing how students learn Data
              Structures and Algorithms.
            </p>
          </div>
        </div>
      </section>

      {/* Team Values */}
      <TeamValues />

      {/* Leadership Team */}
      <CoreTeam />

      {/* Development Team */}
      <DevelopmentTeam />

      {/* Footer */}
    </div>
  )
}

function TeamValues() {
  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Student-First",
      description: "Every decision we make is centered around what's best for student learning and growth.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion-Driven",
      description: "We're not just building a platform; we're pursuing our passion for education and technology.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Excellence-Focused",
      description: "We strive for excellence in everything we do, from code quality to user experience.",
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The principles that guide everything we do at CodePVG
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="border-border text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="text-accent mb-4 flex justify-center">{value.icon}</div>
                <CardTitle className="text-xl font-heading">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed text-base">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoreTeam() {
  const leadership: Array<{
    name: string
    role: string
    bio: string
    image: string
    expertise: string[]
    social?: { linkedin?: string; email?: string }
  }> = [
    {
      name: "Dr. Manoj V. Bhalerao",
      role: "Principal",
      bio: "Experienced educator with 15+ years in computer science education. Passionate about innovative learning methodologies and student success.",
      image: "/Principal.jpeg",
      expertise: ["Educational Leadership", "Leadership", "Innovation"],
    },
    {
      name: "Prof. Indrajit Sonawane",
      role: "Training & Placement Officer",
      bio: "Senior TPO with expertise in industry connections and student career development. Helps bridge the gap between academia and industry.",
      image: "/Tpo1.jpeg",
      expertise: ["Industry Relations", "Student Development"],
    },
    {
      name: "Prof. Lalit Patil",
      role: "Training & Placement Officer",
      bio: "Dedicated TPO focused on technical skill development and placement preparation. Strong background in competitive programming.",
      image: "/Tpo2.jpeg",
      expertise: ["Technical Training", "Placement Strategy"],
    }
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Leadership Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The academic leadership guiding CodePVG's vision and student success
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
          {leadership.map((member, index) => (
            <Card
              key={index}
              className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-accent/20"
                  />
                </div>
                <CardTitle className="text-xl font-heading">{member.name}</CardTitle>
                <CardDescription className="text-accent font-medium">{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.expertise.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-center space-x-3">
                  {member.social?.linkedin ? (
                    <Button variant="ghost" size="sm" className="p-2" asChild>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="p-2" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                  {member.social?.email ? (
                    <Button variant="ghost" size="sm" className="p-2" asChild>
                      <a href={`mailto:${member.social.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="p-2" aria-label="Email">
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function DevelopmentTeam() {
  const devTeam: Array<{
    name: string
    role: string
    bio: string
    image: string
    expertise: string[]
    social?: { github?: string; linkedin?: string; email?: string; twitter?: string }
  }> = [
    {
      name: "Atharva Rahate",
      role: "Frontend & AI Developer",
      bio: "Final Year Computer Engineering Student, specializing in frontend technologies and AI integration. Creates intuitive user experiences and implements intelligent features.",
      image: "/Atharva.jpg",
      social: {
        github: "https://github.com/CrazAr374",
        linkedin: "https://www.linkedin.com/in/atharva-rahate-272390269/",
        email: "atharva.rahate374@gmail.com",
      },
      expertise: ["React", "TypeScript", "AI/ML", "Frontend Development"],
    },
    {
      name: "Shivam Thorat",
      role: "Backend Developer",
      bio: "Final Year Computer Engineering Studen, Backend specialist focused on building robust and scalable server-side applications. Ensures smooth data flow and system reliability.",
      image: "/Shivam.jpeg",
      expertise: ["Java SpringBoot", "Database Design", "API Development", "System Architecture"],
      social: {
        github: "https://github.com/shivammm21",
        linkedin: "https://www.linkedin.com/in/shivamthorat/",
        email: "shivamthorat2103@gmail.com",
      }
    },
    {
      name: "Rameshwar Bhumbhar",
      role: "FullStack Developer",
      bio: "Final Year Computer Engineering Student, specializing in FullStack Development focused on building React apps and Java based backend, Creates intuitive user experiences.",
      image: "/Ram.jpeg",
      expertise: ["React", "Java", "Backend", "Frontend Development"],
      social: {
        github: "https://github.com/RameshwarB26",
        linkedin: "https://www.linkedin.com/in/rameshwarbhumbar/",
        email: "ram26.bhumbar@gmail.com",
      }
    }
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Development Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The talented developers who bring CodePVG to life through innovative technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-8xl mx-auto">
          {devTeam.map((member, index) => (
            <Card
              key={index}
              className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-3">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-accent/20"
                  />
                </div>
                <CardTitle className="text-xl font-heading">{member.name}</CardTitle>
                <CardDescription className="text-accent font-medium">{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.expertise.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {member.social && (
                  <div className="flex justify-center gap-3 pt-2">
                    {member.social.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.social.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.social.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.social.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${member.social.email}`}>
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Header and Footer are now provided globally via app/layout.tsx
