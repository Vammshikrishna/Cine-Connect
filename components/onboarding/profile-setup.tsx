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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, X } from "lucide-react"

const profileSetupSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  portfolio_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  reel_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  years_experience: z.number().min(0).max(50).optional(),
  secondary_crafts: z.array(z.string()).optional(),
})

type ProfileSetupData = z.infer<typeof profileSetupSchema>

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

export function ProfileSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([])
  const { user } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileSetupData>({
    resolver: zodResolver(profileSetupSchema),
  })

  const addCraft = (craft: string) => {
    if (!selectedCrafts.includes(craft) && selectedCrafts.length < 5) {
      const newCrafts = [...selectedCrafts, craft]
      setSelectedCrafts(newCrafts)
      setValue("secondary_crafts", newCrafts)
    }
  }

  const removeCraft = (craft: string) => {
    const newCrafts = selectedCrafts.filter((c) => c !== craft)
    setSelectedCrafts(newCrafts)
    setValue("secondary_crafts", newCrafts)
  }

  const onSubmit = async (data: ProfileSetupData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...data,
          secondary_crafts: selectedCrafts,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Profile update error:", error)
    }

    setIsLoading(false)
  }

  const availableCrafts = CRAFTS.filter((craft) => craft !== user?.primary_craft && !selectedCrafts.includes(craft))

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>Help other creatives discover you by adding more details to your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your experience, and what drives your passion for filmmaking..."
              className="min-h-[100px]"
              {...register("bio")}
              disabled={isLoading}
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Los Angeles, CA" {...register("location")} disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                max="50"
                placeholder="5"
                {...register("years_experience", { valueAsNumber: true })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourwebsite.com"
              {...register("website")}
              disabled={isLoading}
            />
            {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio URL</Label>
              <Input
                id="portfolio_url"
                type="url"
                placeholder="https://portfolio.com"
                {...register("portfolio_url")}
                disabled={isLoading}
              />
              {errors.portfolio_url && <p className="text-sm text-red-500">{errors.portfolio_url.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reel_url">Demo Reel URL</Label>
              <Input
                id="reel_url"
                type="url"
                placeholder="https://vimeo.com/your-reel"
                {...register("reel_url")}
                disabled={isLoading}
              />
              {errors.reel_url && <p className="text-sm text-red-500">{errors.reel_url.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Additional Skills</Label>
              <p className="text-sm text-muted-foreground">
                Add up to 5 additional crafts you're skilled in (Primary: {user?.primary_craft})
              </p>
            </div>

            {selectedCrafts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCrafts.map((craft) => (
                  <Badge key={craft} variant="secondary" className="flex items-center gap-1">
                    {craft}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeCraft(craft)} />
                  </Badge>
                ))}
              </div>
            )}

            {selectedCrafts.length < 5 && (
              <Select onValueChange={addCraft} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Add a skill" />
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

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isLoading}>
              Skip for now
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
