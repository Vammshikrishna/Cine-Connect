import { CreateEventForm } from "@/components/events/create-event-form"

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Event</h1>
          <p className="text-slate-600">
            Organize workshops, networking events, and learning opportunities for the film community
          </p>
        </div>

        <CreateEventForm />
      </div>
    </div>
  )
}
