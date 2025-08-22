import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get("event_type")
    const craft = searchParams.get("craft")
    const upcoming = searchParams.get("upcoming")

    let query = `
      SELECT 
        e.*,
        u.name as organizer_name,
        COALESCE(
          (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id),
          0
        ) as current_attendees
      FROM events e
      JOIN users u ON e.organizer_id = u.id
    `

    const conditions = []
    const params = []

    if (eventType) {
      conditions.push(`e.event_type = $${params.length + 1}`)
      params.push(eventType)
    }

    if (craft) {
      conditions.push(`e.craft_focus::text LIKE $${params.length + 1}`)
      params.push(`%"${craft}"%`)
    }

    if (upcoming === "true") {
      conditions.push(`e.date >= CURRENT_DATE`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY e.date ASC, e.time ASC`

    const events = await sql(query, params)

    // Parse craft_focus JSON for each event
    const eventsWithParsedCrafts = events.map((event) => ({
      ...event,
      craft_focus: typeof event.craft_focus === "string" ? JSON.parse(event.craft_focus) : event.craft_focus || [],
    }))

    return NextResponse.json(eventsWithParsedCrafts)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
