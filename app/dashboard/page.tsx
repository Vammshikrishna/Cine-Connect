"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Feed } from "@/components/feed/feed"
import { MapPin, Calendar, Users, Briefcase, CalendarIcon } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">CineCraft Connect</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">Welcome, {user.name}</span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {user.primary_craft}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.bio && <p className="text-sm text-slate-600 dark:text-slate-400">{user.bio}</p>}

                <div className="space-y-2">
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    {user.experience_level} level
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CalendarIcon className="h-4 w-4" />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>

                {user.secondary_crafts && user.secondary_crafts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Additional Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.secondary_crafts.map((craft) => (
                        <Badge key={craft} variant="outline" className="text-xs">
                          {craft}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="w-full bg-transparent" variant="outline">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-6 space-y-4">
              <Link href="/collaborations">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-medium text-sm">Find Collaborators</h3>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/jobs">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Briefcase className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <h3 className="font-medium text-sm">Browse Jobs</h3>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/events">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <CalendarIcon className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <h3 className="font-medium text-sm">Events</h3>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            <Feed />
          </div>
        </div>
      </div>
    </div>
  )
}
