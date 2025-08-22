import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    // Get user from JWT token
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    const eventId = params.eventId

    // Check if event exists and has space
    const event = await sql`
      SELECT 
        e.*,
        COALESCE(
          (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id),
          0
        ) as current_attendees
      FROM events e
      WHERE e.id = ${eventId}
    `

    if (event.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const eventData = event[0]
    if (eventData.current_attendees >= eventData.max_attendees) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 })
    }

    // Check if user already registered
    const existingRegistration = await sql`
      SELECT id FROM event_registrations 
      WHERE event_id = ${eventId} AND user_id = ${userId}
    `

    if (existingRegistration.length > 0) {
      return NextResponse.json({ error: "Already registered" }, { status: 400 })
    }

    // Create registration
    await sql`
      INSERT INTO event_registrations (event_id, user_id)
      VALUES (${eventId}, ${userId})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error with RSVP:", error)
    return NextResponse.json({ error: "Failed to process RSVP" }, { status: 500 })
  }
}
