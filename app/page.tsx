"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Users, Briefcase, Calendar, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">Connect. Create. Collaborate.</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            The professional network designed specifically for film industry creatives. Showcase your work, find
            collaborators, and discover opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Everything you need to grow your film career
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From networking to job hunting, CineCraft Connect provides all the tools you need to succeed in the film
            industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Camera className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Showcase Your Work</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create a stunning portfolio with your best projects, reels, and behind-the-scenes content.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Find Collaborators</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with directors, producers, cinematographers, and other creatives for your next project.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Briefcase className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Discover Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Browse opportunities from indie films to major productions, tailored to your craft and experience.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <CardTitle>Industry Events</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Stay updated on film festivals, workshops, networking events, and industry screenings.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Crafts Section */}
      <section className="container mx-auto px-4 py-16 bg-white dark:bg-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Built for Every Film Craft</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Whether you're behind the camera, in post-production, or managing the business side, find your community
            here.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {[
            "Director",
            "Producer",
            "Cinematographer",
            "Editor",
            "Sound Engineer",
            "Production Designer",
            "Costume Designer",
            "Makeup Artist",
            "VFX Artist",
            "Colorist",
            "Composer",
            "Sound Designer",
            "Gaffer",
            "Camera Operator",
            "Script Supervisor",
            "Assistant Director",
            "Casting Director",
            "Location Scout",
            "Motion Graphics",
            "Stunt Coordinator",
            "Drone Operator",
            "Photographer",
          ].map((craft) => (
            <Badge key={craft} variant="secondary" className="text-sm py-1 px-3">
              {craft}
            </Badge>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ready to elevate your film career?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of film professionals who are already using CineCraft Connect to grow their careers and
            create amazing projects.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/signup">
              Join CineCraft Connect <Star className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 CineCraft Connect. Built for film industry professionals.</p>
        </div>
      </footer>
    </div>
  )
}
