import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const collaborationData = await request.json()

    const {
      title,
      description,
      project_type,
      needed_crafts,
      timeline,
      budget_range,
      location,
      remote_allowed,
      max_collaborators,
    } = collaborationData

    if (!title || !description || !needed_crafts || needed_crafts.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const collaborationId = crypto.randomUUID()

    // Insert collaboration into database
    await sql`
      INSERT INTO collaborations (
        id, creator_id, title, description, project_type, needed_crafts,
        timeline, budget_range, location, remote_allowed, max_collaborators
      ) VALUES (
        ${collaborationId}, ${decoded.userId}, ${title}, ${description}, ${project_type || null},
        ${needed_crafts}, ${timeline || null}, ${budget_range || null}, ${location || null},
        ${remote_allowed}, ${max_collaborators || null}
      )
    `

    // Add creator as first participant
    await sql`
      INSERT INTO collaboration_participants (collaboration_id, user_id, craft_role, status)
      VALUES (${collaborationId}, ${decoded.userId}, 'Creator', 'accepted')
    `

    return NextResponse.json({ success: true, collaboration_id: collaborationId })
  } catch (error) {
    console.error("Create collaboration error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
