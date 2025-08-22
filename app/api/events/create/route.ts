import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      event_type,
      date,
      time,
      location,
      is_virtual,
      max_attendees,
      price,
      craft_focus,
      organizer_id,
    } = body

    // Validate required fields
    if (!title || !description || !event_type || !date || !time || !organizer_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the event
    const result = await sql`
      INSERT INTO events (
        title, description, event_type, date, time, location, 
        is_virtual, max_attendees, price, craft_focus, organizer_id
      )
      VALUES (
        ${title}, ${description}, ${event_type}, ${date}, ${time}, 
        ${location || null}, ${is_virtual}, ${max_attendees}, ${price}, 
        ${JSON.stringify(craft_focus)}, ${organizer_id}
      )
      RETURNING id, title, created_at
    `

    return NextResponse.json({
      success: true,
      event: result[0],
    })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
