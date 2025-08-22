"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, X } from "lucide-react"

const createCollaborationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  project_type: z.string().optional(),
  timeline: z.string().optional(),
  budget_range: z.string().optional(),
  location: z.string().optional(),
  remote_allowed: z.boolean().default(false),
  max_collaborators: z.number().min(1).max(20).optional(),
})

type CreateCollaborationData = z.infer<typeof createCollaborationSchema>

const PROJECT_TYPES = [
  { value: "short-film", label: "Short Film" },
  { value: "feature", label: "Feature Film" },
  { value: "commercial", label: "Commercial" },
  { value: "music-video", label: "Music Video" },
  { value: "documentary", label: "Documentary" },
  { value: "web-series", label: "Web Series" },
  { value: "animation", label: "Animation" },
  { value: "experimental", label: "Experimental" },
]

const CRAFTS = [
  "Director",
  "Producer",
  "Screenwriter",
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
  "Social Media Manager",
]

export function CreateCollaborationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [neededCrafts, setNeededCrafts] = useState<string[]>([])
  const { user } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCollaborationData>({
    resolver: zodResolver(createCollaborationSchema),
    defaultValues: {
      remote_allowed: false,
    },
  })

  const remoteAllowed = watch("remote_allowed")

  const addCraft = (craft: string) => {
    if (!neededCrafts.includes(craft) && neededCrafts.length < 10) {
      setNeededCrafts([...neededCrafts, craft])
    }
  }

  const removeCraft = (craft: string) => {
    setNeededCrafts(neededCrafts.filter((c) => c !== craft))
  }

  const onSubmit = async (data: CreateCollaborationData) => {
    if (neededCrafts.length === 0) {
      setError("Please select at least one craft you need help with")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/collaborations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...data,
          needed_crafts: neededCrafts,
        }),
      })

      const result = await response.json()

      if (result.success) {
        router.push("/collaborations")
      } else {
        setError(result.error || "Failed to create collaboration")
      }
    } catch (error) {
      setError("Network error occurred")
    }

    setIsLoading(false)
  }

  const availableCrafts = CRAFTS.filter((craft) => !neededCrafts.includes(craft))

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Start a New Collaboration</CardTitle>
        <CardDescription>Find creative partners to bring your project to life</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="e.g., Indie Horror Short Film - 'Midnight'"
              {...register("title")}
              disabled={isLoading}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project, vision, story, and what you're looking to create. Include any specific requirements or expectations..."
              className="min-h-[120px]"
              {...register("description")}
              disabled={isLoading}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select onValueChange={(value) => setValue("project_type", value)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_collaborators">Max Collaborators</Label>
              <Input
                id="max_collaborators"
                type="number"
                min="1"
                max="20"
                placeholder="5"
                {...register("max_collaborators", { valueAsNumber: true })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Needed Skills</Label>
            <p className="text-sm text-gray-500">Select the crafts you need help with for this project</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {neededCrafts.map((craft) => (
                <Badge key={craft} variant="secondary" className="flex items-center gap-1">
                  {craft}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCraft(craft)} />
                </Badge>
              ))}
            </div>
            {neededCrafts.length < 10 && availableCrafts.length > 0 && (
              <Select onValueChange={addCraft} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Add needed skills" />
                </SelectTrigger>
                <SelectContent>
                  {availableCrafts.map((craft) => (
                    <SelectItem key={craft} value={craft}>
                      {craft}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                placeholder="e.g., 3 months, Summer 2024"
                {...register("timeline")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_range">Budget Range</Label>
              <Input
                id="budget_range"
                placeholder="e.g., $1,000-$5,000, No budget"
                {...register("budget_range")}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Los Angeles, CA" {...register("location")} disabled={isLoading} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label htmlFor="remote">Remote Collaboration</Label>
              <p className="text-sm text-gray-500">Can collaborators work remotely on this project?</p>
            </div>
            <Switch
              id="remote"
              checked={remoteAllowed}
              onCheckedChange={(checked) => setValue("remote_allowed", checked)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Collaboration
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
