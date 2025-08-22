import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { collaborationId: string } }) {
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

    const { collaborationId } = params

    // Check if already participating
    const existingParticipation = await sql`
      SELECT id FROM collaboration_participants 
      WHERE collaboration_id = ${collaborationId} AND user_id = ${decoded.userId}
    `

    if (existingParticipation.length > 0) {
      return NextResponse.json({ success: false, error: "You are already part of this collaboration" }, { status: 400 })
    }

    // Check if collaboration exists and is open
    const [collaboration] = await sql`
      SELECT status, max_collaborators, current_collaborators FROM collaborations 
      WHERE id = ${collaborationId}
    `

    if (!collaboration) {
      return NextResponse.json({ success: false, error: "Collaboration not found" }, { status: 404 })
    }

    if (collaboration.status !== "open") {
      return NextResponse.json(
        { success: false, error: "This collaboration is no longer accepting new members" },
        { status: 400 },
      )
    }

    if (collaboration.max_collaborators && collaboration.current_collaborators >= collaboration.max_collaborators) {
      return NextResponse.json({ success: false, error: "This collaboration is full" }, { status: 400 })
    }

    // Get user's primary craft for the role
    const [user] = await sql`
      SELECT primary_craft FROM profiles WHERE id = ${decoded.userId}
    `

    const participantId = crypto.randomUUID()

    // Add participant
    await sql`
      INSERT INTO collaboration_participants (id, collaboration_id, user_id, craft_role, status) 
      VALUES (${participantId}, ${collaborationId}, ${decoded.userId}, ${user.primary_craft}, 'accepted')
    `

    // Update collaborators count
    await sql`
      UPDATE collaborations 
      SET current_collaborators = current_collaborators + 1 
      WHERE id = ${collaborationId}
    `

    return NextResponse.json({ success: true, participant_id: participantId })
  } catch (error) {
    console.error("Join collaboration error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
