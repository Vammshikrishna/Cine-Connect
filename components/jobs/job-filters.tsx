"use client"

import { Switch } from "@/components/ui/switch"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"

interface JobFilters {
  search?: string
  craft?: string
  experience_level?: string
  job_type?: string
  location?: string
  remote_only?: boolean
  budget_min?: number
  budget_max?: number
}

interface JobFiltersProps {
  onFiltersChange: (filters: JobFilters) => void
  loading?: boolean
}

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

export function JobFilters({ onFiltersChange, loading }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>({})

  const updateFilter = (key: keyof JobFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilter = (key: keyof JobFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  const activeFiltersCount = Object.keys(filters).filter((key) => filters[key as keyof JobFilters]).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All ({activeFiltersCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Jobs</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by title, description..."
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Craft */}
        <div className="space-y-2">
          <Label>Craft</Label>
          <Select
            value={filters.craft || "Any craft"}
            onValueChange={(value) => updateFilter("craft", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any craft" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any craft">Any craft</SelectItem>
              {CRAFTS.map((craft) => (
                <SelectItem key={craft} value={craft}>
                  {craft}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select
            value={filters.experience_level || "Any level"}
            onValueChange={(value) => updateFilter("experience_level", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any level">Any level</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <Label>Job Type</Label>
          <Select
            value={filters.job_type || "Any type"}
            onValueChange={(value) => updateFilter("job_type", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any type">Any type</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State or Country"
            value={filters.location || ""}
            onChange={(e) => updateFilter("location", e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Remote Only */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="remote">Remote Only</Label>
            <p className="text-sm text-gray-500">Show only remote positions</p>
          </div>
          <Switch
            id="remote"
            checked={filters.remote_only || false}
            onCheckedChange={(checked) => updateFilter("remote_only", checked)}
            disabled={loading}
          />
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label>Budget Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.budget_min || ""}
              onChange={(e) => updateFilter("budget_min", e.target.value ? Number.parseInt(e.target.value) : undefined)}
              disabled={loading}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.budget_max || ""}
              onChange={(e) => updateFilter("budget_max", e.target.value ? Number.parseInt(e.target.value) : undefined)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.craft && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.craft}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("craft")} />
                </Badge>
              )}
              {filters.experience_level && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.experience_level}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("experience_level")} />
                </Badge>
              )}
              {filters.job_type && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.job_type}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("job_type")} />
                </Badge>
              )}
              {filters.remote_only && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Remote
                  <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("remote_only")} />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
