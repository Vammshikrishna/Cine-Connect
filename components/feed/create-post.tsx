"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { Camera, Video, X, Loader2, Plus } from "lucide-react"

const createPostSchema = z.object({
  content: z.string().min(1, "Please write something").max(2000, "Post is too long"),
  project_title: z.string().optional(),
  location: z.string().optional(),
  collaboration_open: z.boolean().default(false),
  visibility: z.enum(["public", "followers", "private"]).default("public"),
})

type CreatePostData = z.infer<typeof createPostSchema>

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

interface CreatePostProps {
  onPostCreated?: () => void
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      visibility: "public",
      collaboration_open: false,
    },
  })

  const collaborationOpen = watch("collaboration_open")

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + mediaFiles.length <= 4) {
      setMediaFiles([...mediaFiles, ...files])
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CreatePostData) => {
    setIsLoading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("content", data.content)
      formData.append("project_title", data.project_title || "")
      formData.append("location", data.location || "")
      formData.append("collaboration_open", data.collaboration_open.toString())
      formData.append("visibility", data.visibility)
      formData.append("craft_tags", JSON.stringify(selectedTags))

      // Add media files
      mediaFiles.forEach((file, index) => {
        formData.append(`media_${index}`, file)
      })

      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        reset()
        setSelectedTags([])
        setMediaFiles([])
        onPostCreated?.()
      }
    } catch (error) {
      console.error("Create post error:", error)
    }

    setIsLoading(false)
  }

  const availableTags = CRAFTS.filter((craft) => !selectedTags.includes(craft))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Share Your Work
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What are you working on? Share your latest project, behind-the-scenes moments, or industry insights..."
              className="min-h-[100px] resize-none"
              {...register("content")}
              disabled={isLoading}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_title">Project Title (Optional)</Label>
              <Input
                id="project_title"
                placeholder="e.g., Short Film: The Journey"
                {...register("project_title")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" placeholder="e.g., Los Angeles, CA" {...register("location")} disabled={isLoading} />
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label>Media (Up to 4 files)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaUpload}
                disabled={isLoading || mediaFiles.length >= 4}
                className="hidden"
                id="media-upload"
              />
              <Label
                htmlFor="media-upload"
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Add Photos/Videos
              </Label>
            </div>

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {file.type.startsWith("image/") ? (
                        <Camera className="h-8 w-8 text-gray-400" />
                      ) : (
                        <Video className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Craft Tags */}
          <div className="space-y-2">
            <Label>Craft Tags (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            {selectedTags.length < 5 && (
              <Select onValueChange={addTag} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Add craft tags" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((craft) => (
                    <SelectItem key={craft} value={craft}>
                      {craft}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="collaboration">Open for Collaboration</Label>
                <p className="text-sm text-gray-500">Let others know you're looking for collaborators</p>
              </div>
              <Switch
                id="collaboration"
                checked={collaborationOpen}
                onCheckedChange={(checked) => setValue("collaboration_open", checked)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select onValueChange={(value) => setValue("visibility", value as any)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Who can see this post?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see</SelectItem>
                  <SelectItem value="followers">Followers - Only your followers</SelectItem>
                  <SelectItem value="private">Private - Only you</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Share Post
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
