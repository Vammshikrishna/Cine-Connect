"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  event_type: string
  date: string
  time: string
  location: string
  is_virtual: boolean
  max_attendees: number
  current_attendees: number
  price: number
  organizer_name: string
  craft_focus: string[]
}

interface EventCardProps {
  event: Event
  onRSVP: (eventId: string) => void
}

export function EventCard({ event, onRSVP }: EventCardProps) {
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()
  const isFull = event.current_attendees >= event.max_attendees

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-slate-900">{event.title}</CardTitle>
          <Badge variant={event.event_type === "workshop" ? "default" : "secondary"}>{event.event_type}</Badge>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">{event.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{eventDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{event.is_virtual ? "Virtual" : event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-4 h-4" />
            <span>
              {event.current_attendees}/{event.max_attendees}
            </span>
          </div>
        </div>

        {event.craft_focus.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.craft_focus.map((craft) => (
              <Badge key={craft} variant="outline" className="text-xs">
                {craft}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <div className="text-lg font-semibold text-amber-600">{event.price === 0 ? "Free" : `$${event.price}`}</div>
          <Button
            onClick={() => onRSVP(event.id)}
            disabled={!isUpcoming || isFull}
            className="bg-slate-900 hover:bg-slate-800"
          >
            {isFull ? "Full" : isUpcoming ? "RSVP" : "Past Event"}
          </Button>
        </div>

        <p className="text-xs text-slate-500">Organized by {event.organizer_name}</p>
      </CardContent>
    </Card>
  )
}
