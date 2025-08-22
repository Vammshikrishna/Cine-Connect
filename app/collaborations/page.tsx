"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CollaborationCard } from "@/components/collaborations/collaboration-card"
import { Loader2, Plus, Users } from "lucide-react"
import Link from "next/link"

interface Collaboration {
  id: string
  creator_id: string
  title: string
  description: string
  project_type?: string
  needed_crafts: string[]
  timeline?: string
  budget_range?: string
  location?: string
  remote_allowed: boolean
  status: "open" | "in-progress" | "completed" | "cancelled"
  max_collaborators?: number
  current_collaborators: number
  created_at: string
  creator: {
    name: string
    username: string
    avatar_url?: string
    primary_craft: string
    verified: boolean
  }
}

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin")
    }
  }, [user, authLoading, router])

  const fetchCollaborations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/collaborations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCollaborations(data.collaborations || [])
      }
    } catch (error) {
      console.error("Fetch collaborations error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCollaborations()
    }
  }, [user])

  const handleJoin = async (collaborationId: string) => {
    try {
      const response = await fetch(`/api/collaborations/${collaborationId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        // Refresh collaborations to update participant count
        fetchCollaborations()
      }
    } catch (error) {
      console.error("Join collaboration error:", error)
    }
  }

  if (authLoading) {
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
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">CineCraft Connect</h1>
            </Link>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold">Collaboration Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/collaborations/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start Project
              </Button>
            </Link>
            <span className="text-sm text-slate-600 dark:text-slate-400">Welcome, {user.name}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {loading ? "Loading..." : `${collaborations.length} Active Collaborations`}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find creative partners and join exciting film projects in your area
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : collaborations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">No active collaborations found.</p>
              <p className="text-sm text-gray-400 mb-6">
                Be the first to start a collaboration and find creative partners for your project.
              </p>
              <Link href="/collaborations/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {collaborations.map((collaboration) => (
              <CollaborationCard key={collaboration.id} collaboration={collaboration} onJoin={handleJoin} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
