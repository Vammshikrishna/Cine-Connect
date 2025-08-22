"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    primary_craft: z.string().min(1, "Please select your primary craft"),
    experience_level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignUpFormData = z.infer<typeof signUpSchema>

const CRAFTS = [
  { value: "Director", label: "Director" },
  { value: "Producer", label: "Producer" },
  { value: "Screenwriter", label: "Screenwriter" },
  { value: "Cinematographer", label: "Cinematographer" },
  { value: "Editor", label: "Editor" },
  { value: "Sound Engineer", label: "Sound Engineer" },
  { value: "Production Designer", label: "Production Designer" },
  { value: "Costume Designer", label: "Costume Designer" },
  { value: "Makeup Artist", label: "Makeup Artist" },
  { value: "VFX Artist", label: "VFX Artist" },
  { value: "Colorist", label: "Colorist" },
  { value: "Composer", label: "Composer" },
  { value: "Sound Designer", label: "Sound Designer" },
  { value: "Gaffer", label: "Gaffer" },
  { value: "Camera Operator", label: "Camera Operator" },
  { value: "Script Supervisor", label: "Script Supervisor" },
  { value: "Assistant Director", label: "Assistant Director" },
  { value: "Casting Director", label: "Casting Director" },
  { value: "Location Scout", label: "Location Scout" },
  { value: "Motion Graphics", label: "Motion Graphics" },
  { value: "Stunt Coordinator", label: "Stunt Coordinator" },
  { value: "Drone Operator", label: "Drone Operator" },
  { value: "Photographer", label: "Photographer" },
  { value: "Social Media Manager", label: "Social Media Manager" },
]

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setError("")

    const result = await signUp({
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      primary_craft: data.primary_craft,
      experience_level: data.experience_level,
    })

    if (result.success) {
      router.push("/onboarding")
    } else {
      setError(result.error || "Sign up failed")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Join CineCraft Connect</CardTitle>
        <CardDescription className="text-center">
          Connect with film industry professionals and showcase your work
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} disabled={isLoading} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="johndoe" {...register("username")} disabled={isLoading} />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" {...register("email")} disabled={isLoading} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create password"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_craft">Primary Craft</Label>
            <Select onValueChange={(value) => setValue("primary_craft", value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select your main specialization" />
              </SelectTrigger>
              <SelectContent>
                {CRAFTS.map((craft) => (
                  <SelectItem key={craft.value} value={craft.value}>
                    {craft.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.primary_craft && <p className="text-sm text-red-500">{errors.primary_craft.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select onValueChange={(value) => setValue("experience_level", value as any)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
