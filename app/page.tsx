"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Code,
  Users,
  Trophy,
  Target,
  BookOpen,
  Zap,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Why CodePVG Section */}
      <WhyCodePVGSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Contact Section */}
      <ContactSection />

    </div>
  )
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-accent/20 to-secondary/15 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-secondary/20 to-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-br from-accent/15 to-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "6s" }}
        ></div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="flex items-center gap-3 mb-8">
                <Badge
                  variant="secondary"
                  className="text-sm font-medium bg-accent/10 text-accent border-accent/20 px-4 py-2"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Learning
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-secondary/5 text-secondary/80 border-secondary/20 px-3 py-1"
                >
                  For Students
                </Badge>
              </div>

              {/* Main heading with better typography */}
              <div className="space-y-6 mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-foreground leading-[1.1]">
                  Master{" "}
                  <span className="relative inline-block">
                    <span className="text-accent">DSA</span>
                    <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-accent/60 to-secondary/40 rounded-full"></div>
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-secondary to-accent">
                    with CodePVG
                  </span>
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
                Built exclusively for PVGCOE and SSDIOM students, this platform helps you stay consistent, motivated, and ahead in your coding journey. 
                </p>
              </div>

              {/* Action buttons with better spacing */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    Start Learning Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="relative">
                {/* Main hero image */}
                <div className="relative bg-gradient-to-br from-accent/10 via-secondary/5 to-accent/5 rounded-3xl p-8 border border-border/30 backdrop-blur-sm">
                  <img
                    src="/placeholder.svg?height=500&width=600"
                    alt="CodePVG Platform Interface"
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-xl shadow-lg font-semibold text-sm animate-bounce">
                    Live Coding!
                  </div>

                  <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl shadow-lg font-semibold text-sm animate-pulse">
                    Track Progress
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-3xl blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Made for PVGCOE, Nashik
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">About CodePVG</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Empowering PVGCOE's students with personalized learning in Competitive Programming & DSA.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">Built for Students, By Students</h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            CodePVG is not just another coding platform, it’s a community driven initiative created exclusively for PVGCOE's students. We know the real struggles of learning Data Structures & Algorithms (DSA), from building strong fundamentals to cracking placement level problems. That’s why we designed CodePVG to guide you at every step.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Our platform combines the best features of LeetCode, HackerRank, and GeeksforGeeks while adding
              personalized learning paths, detailed progress tracking, and student-focused features that make learning
              DSA engaging and effective.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">Personalized Learning</Badge>
              <Badge variant="secondary">Progress Tracking</Badge>
              <Badge variant="secondary">Student-Focused</Badge>
              <Badge variant="secondary">Competitive Programming</Badge>
            </div>
          </div>
          <div className="relative">
            <img
              src="/placeholder.svg?height=500&width=600"
              alt="Students learning to code"
              className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyCodePVGSection() {
  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Personalized Learning Paths",
      description: "AI-driven recommendations based on your skill level, learning pace, and career goals.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Detailed analytics and insights to monitor your improvement and identify areas for growth.",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Comprehensive Content",
      description: "Curated problems from easy to advanced, covering all important DSA topics and patterns.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Support",
      description: "Connect with fellow students, share solutions, and learn from peer discussions.",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Feedback",
      description: "Instant code evaluation with detailed explanations and optimization suggestions.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Multiple Languages",
      description: "Practice in your preferred programming language with support for C++, Java, Python, and more.",
      color: "bg-secondary/10 text-secondary",
    },
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">
            Why CodePVG
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Why Choose <span className="text-accent">CodePVG</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the difference with our student-centric approach to competitive programming education.Unlike generic platforms, CodePVG blends the best of LeetCode, HackerRank, and GeeksforGeeks with unique features tailored for our students
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-accent/10 via-secondary/5 to-accent/10 rounded-2xl p-8 border border-border/30 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2">
              Trusted by Students Worldwide
            </h3>
            <p className="text-muted-foreground">
              Join thousands of students who have transformed their coding journey with CodePVG
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: "10K+", label: "Active Students", icon: <Users className="h-5 w-5" /> },
              { number: "500+", label: "Practice Problems", icon: <BookOpen className="h-5 w-5" /> },
              { number: "95%", label: "Success Rate", icon: <Trophy className="h-5 w-5" /> },
              { number: "24/7", label: "Support Available", icon: <Zap className="h-5 w-5" /> },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-2">
                    <div className="bg-accent/10 p-2 rounded-lg text-accent">{stat.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-accent mb-1 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(1)
  const carouselRef = useRef<HTMLDivElement>(null)

  const galleryItems = [
    {
      title: "Interactive Dashboard",
      description: "Track your progress with beautiful visualizations and detailed analytics",
      image: "/placeholder.svg?height=400&width=600",
      category: "Dashboard",
    },
    {
      title: "Problem Solving Interface",
      description: "Clean, distraction-free coding environment with syntax highlighting",
      image: "/placeholder.svg?height=400&width=600",
      category: "Editor",
    },
    {
      title: "Learning Paths",
      description: "Structured roadmaps for different skill levels and career goals",
      image: "/placeholder.svg?height=400&width=600",
      category: "Learning",
    },
    {
      title: "Community Features",
      description: "Connect and learn with fellow programmers in discussion forums",
      image: "/placeholder.svg?height=400&width=600",
      category: "Community",
    },
    {
      title: "Performance Analytics",
      description: "Detailed insights into your coding journey and improvement areas",
      image: "/placeholder.svg?height=400&width=600",
      category: "Analytics",
    },
    {
      title: "Mobile Experience",
      description: "Learn on the go with our fully responsive mobile design",
      image: "/placeholder.svg?height=400&width=600",
      category: "Mobile",
    },
  ]

  const maxIndex = Math.max(0, galleryItems.length - slidesPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1))
  }

  useEffect(() => {
    const updateSlides = () => {
      if (typeof window === "undefined") return
      const w = window.innerWidth
      if (w >= 1024) setSlidesPerView(3)
      else if (w >= 640) setSlidesPerView(2)
      else setSlidesPerView(1)
    }
    updateSlides()
    window.addEventListener("resize", updateSlides)
    return () => window.removeEventListener("resize", updateSlides)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [slidesPerView])

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Platform Gallery
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Explore Our <span className="text-accent">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the interface and features that make CodePVG the perfect learning companion
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }}
            >
              {galleryItems.map((item, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2">
                  <Card className="overflow-hidden border-border hover:shadow-xl transition-all duration-300 group bg-card/80 backdrop-blur-sm">
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-background/90 text-foreground">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg font-heading group-hover:text-accent transition-colors duration-300">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <Button
            variant="outline"
            size="icon"
            className="hidden sm:inline-flex absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden sm:inline-flex absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-accent scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Contact Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Get in <span className="text-accent">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions or suggestions? We'd love to hear from you and help you on your coding journey!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-8">Let's Connect</h3>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-4 rounded-xl">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Email Us</p>
                    <p className="text-muted-foreground">atharva.rahate374@gmail.com</p>
                    <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 p-4 rounded-xl">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Call Us</p>
                    <p className="text-muted-foreground">+91 8149812710</p>
                    <p className="text-sm text-muted-foreground mt-1">Ready to help 24/7</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-4 rounded-xl">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Visit Us</p>
                    <p className="text-muted-foreground">Nashik, Maharashtra</p>
                    <p className="text-muted-foreground">India</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">24h</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">99%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-heading flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-accent" />
                  Send us a Message
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and we'll get back to you as soon as possible. All fields are required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">First Name *</label>
                    <Input
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Last Name *</label>
                    <Input
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email Address *</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Subject *</label>
                  <Input
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message *</label>
                  <Textarea
                    name="message"
                    placeholder="Tell us more about your inquiry, suggestions, or how we can help you succeed..."
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Send Message
                  <Mail className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  By sending this message, you agree to our terms of service and privacy policy.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
