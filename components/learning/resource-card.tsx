"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, FileText, ExternalLink } from "lucide-react"

interface LearningResource {
  id: string
  title: string
  description: string
  resource_type: string
  craft_focus: string[]
  difficulty_level: string
  url: string
  author: string
  duration?: string
}

interface ResourceCardProps {
  resource: LearningResource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const getIcon = () => {
    switch (resource.resource_type) {
      case "video":
        return <Video className="w-5 h-5" />
      case "article":
        return <FileText className="w-5 h-5" />
      case "course":
        return <BookOpen className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  const getDifficultyColor = () => {
    switch (resource.difficulty_level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-lg font-semibold text-slate-900">{resource.title}</CardTitle>
          </div>
          <Badge className={getDifficultyColor()}>{resource.difficulty_level}</Badge>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">{resource.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {resource.craft_focus.map((craft) => (
            <Badge key={craft} variant="outline" className="text-xs">
              {craft}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>By {resource.author}</span>
          {resource.duration && <span>{resource.duration}</span>}
        </div>

        <Button onClick={() => window.open(resource.url, "_blank")} className="w-full bg-amber-600 hover:bg-amber-700">
          <ExternalLink className="w-4 h-4 mr-2" />
          Access Resource
        </Button>
      </CardContent>
    </Card>
  )
}
