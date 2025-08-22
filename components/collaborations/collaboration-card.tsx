"use client"

import Link from "next/link"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Users, Calendar, Clock, Film } from "lucide-react"

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

interface CollaborationCardProps {
  collaboration: Collaboration
  onJoin?: (collaborationId: string) => void
  showJoinButton?: boolean
}

const formatDistanceToNow = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export function CollaborationCard({ collaboration, onJoin, showJoinButton = true }: CollaborationCardProps) {
  const getProjectTypeColor = (type?: string) => {
    switch (type) {
      case "short-film":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "feature":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "commercial":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "music-video":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      case "documentary":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const spotsRemaining = collaboration.max_collaborators
    ? collaboration.max_collaborators - collaboration.current_collaborators
    : null

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={collaboration.creator.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {collaboration.creator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{collaboration.creator.name}</h3>
                {collaboration.creator.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>@{collaboration.creator.username}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs py-0">
                  {collaboration.creator.primary_craft}
                </Badge>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(collaboration.created_at))}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(collaboration.status)}>{collaboration.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">{collaboration.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{collaboration.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {collaboration.project_type && (
            <Badge className={getProjectTypeColor(collaboration.project_type)}>
              <Film className="h-3 w-3 mr-1" />
              {collaboration.project_type.replace("-", " ")}
            </Badge>
          )}
          {collaboration.needed_crafts.slice(0, 3).map((craft) => (
            <Badge key={craft} variant="secondary">
              {craft}
            </Badge>
          ))}
          {collaboration.needed_crafts.length > 3 && (
            <Badge variant="outline">+{collaboration.needed_crafts.length - 3} more</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {collaboration.current_collaborators}
            {collaboration.max_collaborators && `/${collaboration.max_collaborators}`} collaborators
          </div>

          {collaboration.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {collaboration.location}
              {collaboration.remote_allowed && <span className="text-green-600 ml-1">(Remote OK)</span>}
            </div>
          )}

          {collaboration.timeline && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {collaboration.timeline}
            </div>
          )}

          {collaboration.budget_range && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Budget: {collaboration.budget_range}
            </div>
          )}
        </div>

        {spotsRemaining !== null && spotsRemaining > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>{spotsRemaining}</strong> spot{spotsRemaining !== 1 ? "s" : ""} remaining
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <Link href={`/collaborations/${collaboration.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>

          {showJoinButton && collaboration.status === "open" && spotsRemaining !== 0 && (
            <Button onClick={() => onJoin?.(collaboration.id)} size="sm">
              Join Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
