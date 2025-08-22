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

const postJobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  craft_required: z.string().min(1, "Please select the required craft"),
  experience_level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  job_type: z.enum(["full-time", "part-time", "contract", "freelance", "internship"]),
  location: z.string().optional(),
  remote_allowed: z.boolean().default(false),
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().min(0).optional(),
  currency: z.string().default("USD"),
  deadline: z.string().optional(),
})

type PostJobData = z.infer<typeof postJobSchema>

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

export function PostJobForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [additionalCrafts, setAdditionalCrafts] = useState<string[]>([])
  const { user } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostJobData>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      currency: "USD",
      remote_allowed: false,
    },
  })

  const remoteAllowed = watch("remote_allowed")
  const craftRequired = watch("craft_required")

  const addAdditionalCraft = (craft: string) => {
    if (!additionalCrafts.includes(craft) && craft !== craftRequired && additionalCrafts.length < 5) {
      setAdditionalCrafts([...additionalCrafts, craft])
    }
  }

  const removeAdditionalCraft = (craft: string) => {
    setAdditionalCrafts(additionalCrafts.filter((c) => c !== craft))
  }

  const onSubmit = async (data: PostJobData) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...data,
          additional_crafts: additionalCrafts,
        }),
      })

      const result = await response.json()

      if (result.success) {
        router.push("/jobs")
      } else {
        setError(result.error || "Failed to post job")
      }
    } catch (error) {
      setError("Network error occurred")
    }

    setIsLoading(false)
  }

  const availableCrafts = CRAFTS.filter((craft) => craft !== craftRequired && !additionalCrafts.includes(craft))

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>Find the perfect creative professional for your project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g., Cinematographer for Short Film"
              {...register("title")}
              disabled={isLoading}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the project, requirements, timeline, and what you're looking for in a candidate..."
              className="min-h-[120px]"
              {...register("description")}
              disabled={isLoading}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Craft Required</Label>
              <Select onValueChange={(value) => setValue("craft_required", value)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select required craft" />
                </SelectTrigger>
                <SelectContent>
                  {CRAFTS.map((craft) => (
                    <SelectItem key={craft} value={craft}>
                      {craft}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.craft_required && <p className="text-sm text-red-500">{errors.craft_required.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select onValueChange={(value) => setValue("experience_level", value as any)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                  <SelectItem value="expert">Expert (10+ years)</SelectItem>
                </SelectContent>
              </Select>
              {errors.experience_level && <p className="text-sm text-red-500">{errors.experience_level.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Skills (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {additionalCrafts.map((craft) => (
                <Badge key={craft} variant="secondary" className="flex items-center gap-1">
                  {craft}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeAdditionalCraft(craft)} />
                </Badge>
              ))}
            </div>
            {additionalCrafts.length < 5 && availableCrafts.length > 0 && (
              <Select onValueChange={addAdditionalCraft} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Add additional skills" />
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
              <Label>Job Type</Label>
              <Select onValueChange={(value) => setValue("job_type", value as any)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              {errors.job_type && <p className="text-sm text-red-500">{errors.job_type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g., Los Angeles, CA" {...register("location")} disabled={isLoading} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label htmlFor="remote">Remote Work Allowed</Label>
              <p className="text-sm text-gray-500">Can this position be done remotely?</p>
            </div>
            <Switch
              id="remote"
              checked={remoteAllowed}
              onCheckedChange={(checked) => setValue("remote_allowed", checked)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <Label>Budget Range (Optional)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min">Minimum</Label>
                <Input
                  id="budget_min"
                  type="number"
                  min="0"
                  placeholder="1000"
                  {...register("budget_min", { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_max">Maximum</Label>
                <Input
                  id="budget_max"
                  type="number"
                  min="0"
                  placeholder="5000"
                  {...register("budget_max", { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select onValueChange={(value) => setValue("currency", value)} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline (Optional)</Label>
            <Input id="deadline" type="date" {...register("deadline")} disabled={isLoading} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Job
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
