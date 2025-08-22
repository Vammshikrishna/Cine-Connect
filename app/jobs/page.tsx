"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { JobCard } from "@/components/jobs/job-card"
import { Loader2, Plus, Briefcase } from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  posted_by: string
  title: string
  description: string
  craft_required: string
  additional_crafts?: string[]
  experience_level: "beginner" | "intermediate" | "advanced" | "expert"
  job_type: "full-time" | "part-time" | "contract" | "freelance" | "internship"
  location?: string
  remote_allowed: boolean
  budget_min?: number
  budget_max?: number
  currency: string
  deadline?: string
  status: "open" | "closed" | "filled"
  applications_count: number
  created_at: string
  poster: {
    name: string
    username: string
    avatar_url?: string
    primary_craft: string
    verified: boolean
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    craft: "",
    experience_level: "",
    job_type: "",
    location: "",
    remote_only: false,
    budget_min: 0,
    budget_max: 0,
  })
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin")
    }
  }, [user, authLoading, router])

  const fetchJobs = async (currentFilters: any = {}) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/jobs?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error("Fetch jobs error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchJobs(filters)
    }
  }, [user, filters])

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleApply = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        // Refresh jobs to update application count
        fetchJobs(filters)
      }
    } catch (error) {
      console.error("Apply to job error:", error)
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
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">Job Board</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/jobs/post">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </Link>
            <span className="text-sm text-slate-600 dark:text-slate-400">Welcome, {user.name}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">{/* JobFilters component should be imported and used here */}</div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{loading ? "Loading..." : `${jobs.length} Jobs Available`}</h2>
              <p className="text-gray-600 dark:text-gray-400">Find your next opportunity in the film industry</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-4">No jobs found matching your criteria.</p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your filters or check back later for new opportunities.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onApply={handleApply} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
