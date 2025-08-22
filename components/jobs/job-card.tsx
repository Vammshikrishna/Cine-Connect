"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, DollarSign, Users, Calendar, Briefcase } from "lucide-react"
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

interface JobCardProps {
  job: Job
  onApply?: (jobId: string) => void
  showApplyButton?: boolean
}

const formatDistanceToNow = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export function JobCard({ job, onApply, showApplyButton = true }: JobCardProps) {
  const formatBudget = () => {
    if (!job.budget_min && !job.budget_max) return null

    if (job.budget_min && job.budget_max) {
      return `${job.currency} ${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}`
    } else if (job.budget_min) {
      return `${job.currency} ${job.budget_min.toLocaleString()}+`
    } else if (job.budget_max) {
      return `Up to ${job.currency} ${job.budget_max.toLocaleString()}`
    }
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "part-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "contract":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "freelance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "internship":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={job.poster.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {job.poster.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{job.poster.name}</h3>
                {job.poster.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>@{job.poster.username}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs py-0">
                  {job.poster.primary_craft}
                </Badge>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(job.created_at))}</span>
              </div>
            </div>
          </div>
          <Badge variant={job.status === "open" ? "default" : "secondary"}>{job.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">{job.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{job.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getJobTypeColor(job.job_type)}>
            <Briefcase className="h-3 w-3 mr-1" />
            {job.job_type.replace("-", " ")}
          </Badge>
          <Badge className={getExperienceColor(job.experience_level)}>
            <Users className="h-3 w-3 mr-1" />
            {job.experience_level}
          </Badge>
          <Badge variant="secondary">{job.craft_required}</Badge>
          {job.additional_crafts &&
            job.additional_crafts.slice(0, 2).map((craft) => (
              <Badge key={craft} variant="outline" className="text-xs">
                +{craft}
              </Badge>
            ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
              {job.remote_allowed && <span className="text-green-600 ml-1">(Remote OK)</span>}
            </div>
          )}

          {formatBudget() && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {formatBudget()}
            </div>
          )}

          {job.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </div>
          )}

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {job.applications_count} applications
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Link href={`/jobs/${job.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>

          {showApplyButton && job.status === "open" && (
            <Button onClick={() => onApply?.(job.id)} size="sm">
              Apply Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
