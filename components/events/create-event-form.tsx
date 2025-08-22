"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"

const CRAFT_OPTIONS = [
  "Director",
  "Producer",
  "Screenwriter",
  "Cinematographer",
  "Editor",
  "Sound Designer",
  "Production Designer",
  "Costume Designer",
  "Makeup Artist",
  "VFX Artist",
  "Composer",
  "Actor",
  "Casting Director",
  "Location Manager",
  "Script Supervisor",
  "Gaffer",
  "Camera Operator",
  "Boom Operator",
  "Art Director",
  "Set Decorator",
  "Stunt Coordinator",
  "Colorist",
  "Foley Artist",
  "Music Supervisor",
]

export function CreateEventForm() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "",
    date: "",
    time: "",
    location: "",
    is_virtual: false,
    max_attendees: "",
    price: "",
    craft_focus: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          max_attendees: Number.parseInt(formData.max_attendees),
          price: Number.parseFloat(formData.price) || 0,
          organizer_id: user.id,
        }),
      })

      if (response.ok) {
        // Reset form
        setFormData({
          title: "",
          description: "",
          event_type: "",
          date: "",
          time: "",
          location: "",
          is_virtual: false,
          max_attendees: "",
          price: "",
          craft_focus: [],
        })
        alert("Event created successfully!")
      }
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCraftToggle = (craft: string) => {
    setFormData((prev) => ({
      ...prev,
      craft_focus: prev.craft_focus.includes(craft)
        ? prev.craft_focus.filter((c) => c !== craft)
        : [...prev.craft_focus, craft],
    }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900">Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, event_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="masterclass">Masterclass</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_attendees">Max Attendees</Label>
              <Input
                id="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData((prev) => ({ ...prev, max_attendees: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_virtual"
              checked={formData.is_virtual}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_virtual: !!checked }))}
            />
            <Label htmlFor="is_virtual">Virtual Event</Label>
          </div>

          {!formData.is_virtual && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Enter venue address"
                required={!formData.is_virtual}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="0 for free events"
            />
          </div>

          <div className="space-y-2">
            <Label>Craft Focus (Select relevant crafts)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {CRAFT_OPTIONS.map((craft) => (
                <div key={craft} className="flex items-center space-x-2">
                  <Checkbox
                    id={craft}
                    checked={formData.craft_focus.includes(craft)}
                    onCheckedChange={() => handleCraftToggle(craft)}
                  />
                  <Label htmlFor={craft} className="text-sm">
                    {craft}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800">
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
