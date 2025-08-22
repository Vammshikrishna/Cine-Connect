"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventCard } from "@/components/events/event-card"
import { ResourceCard } from "@/components/learning/resource-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [resources, setResources] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [craftFilter, setCraftFilter] = useState("all")

  useEffect(() => {
    fetchEvents()
    fetchResources()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchResources = async () => {
    // Mock learning resources for now
    const mockResources = [
      {
        id: "1",
        title: "Cinematography Fundamentals",
        description: "Learn the basics of camera work, lighting, and composition for film.",
        resource_type: "video",
        craft_focus: ["Cinematographer", "Director"],
        difficulty_level: "beginner",
        url: "#",
        author: "Roger Deakins",
        duration: "2 hours",
      },
      {
        id: "2",
        title: "Advanced Color Grading Techniques",
        description: "Master professional color correction and grading workflows.",
        resource_type: "course",
        craft_focus: ["Colorist", "Editor"],
        difficulty_level: "advanced",
        url: "#",
        author: "Stefan Sonnenfeld",
        duration: "8 hours",
      },
      {
        id: "3",
        title: "Sound Design for Horror Films",
        description: "Create terrifying soundscapes that enhance the horror experience.",
        resource_type: "article",
        craft_focus: ["Sound Designer", "Foley Artist"],
        difficulty_level: "intermediate",
        url: "#",
        author: "Ben Burtt",
      },
    ]
    setResources(mockResources)
  }

  const handleRSVP = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
      })
      if (response.ok) {
        fetchEvents() // Refresh events
        alert("RSVP successful!")
      }
    } catch (error) {
      console.error("Error with RSVP:", error)
    }
  }

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = eventTypeFilter === "all" || event.event_type === eventTypeFilter
    const matchesCraft = craftFilter === "all" || event.craft_focus.includes(craftFilter)
    return matchesSearch && matchesType && matchesCraft
  })

  const filteredResources = resources.filter((resource: any) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCraft = craftFilter === "all" || resource.craft_focus.includes(craftFilter)
    return matchesSearch && matchesCraft
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Events & Learning</h1>
            <p className="text-slate-600">Discover workshops, networking events, and learning resources</p>
          </div>
          <Link href="/events/create">
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search events and resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="masterclass">Masterclass</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
              </SelectContent>
            </Select>
            <Select value={craftFilter} onValueChange={setCraftFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Craft Focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crafts</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
                <SelectItem value="Cinematographer">Cinematographer</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Sound Designer">Sound Designer</SelectItem>
                <SelectItem value="VFX Artist">VFX Artist</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setEventTypeFilter("all")
                setCraftFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Events ({filteredEvents.length})</TabsTrigger>
            <TabsTrigger value="learning">Learning Resources ({filteredResources.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No events found matching your criteria.</p>
                <Link href="/events/create">
                  <Button className="bg-slate-900 hover:bg-slate-800">Create the First Event</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event: any) => (
                  <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource: any) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
