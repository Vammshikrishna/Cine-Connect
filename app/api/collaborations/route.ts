import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
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

    // Get collaborations with creator information
    const collaborations = await sql`
      SELECT 
        c.*,
        p.name as creator_name,
        p.username as creator_username,
        p.avatar_url as creator_avatar_url,
        p.primary_craft as creator_primary_craft,
        p.verified as creator_verified
      FROM collaborations c
      JOIN profiles p ON c.creator_id = p.id
      WHERE c.status IN ('open', 'in-progress')
      ORDER BY c.created_at DESC
      LIMIT 50
    `

    // Transform the data
    const transformedCollaborations = collaborations.map((collab: any) => ({
      id: collab.id,
      creator_id: collab.creator_id,
      title: collab.title,
      description: collab.description,
      project_type: collab.project_type,
      needed_crafts: collab.needed_crafts,
      timeline: collab.timeline,
      budget_range: collab.budget_range,
      location: collab.location,
      remote_allowed: collab.remote_allowed,
      status: collab.status,
      max_collaborators: collab.max_collaborators,
      current_collaborators: collab.current_collaborators,
      created_at: collab.created_at,
      creator: {
        name: collab.creator_name,
        username: collab.creator_username,
        avatar_url: collab.creator_avatar_url,
        primary_craft: collab.creator_primary_craft,
        verified: collab.creator_verified,
      },
    }))

    return NextResponse.json({ success: true, collaborations: transformedCollaborations })
  } catch (error) {
    console.error("Fetch collaborations error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
