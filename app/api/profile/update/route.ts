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

    const updateData = await request.json()

    await sql`
      UPDATE neon_auth.users_sync 
      SET 
        bio = ${updateData.bio || null},
        location = ${updateData.location || null},
        portfolio_url = ${updateData.portfolio_url || null},
        primary_craft = ${updateData.primary_craft || null},
        experience_level = ${updateData.experience_level || null},
        skills = ${updateData.skills || []},
        is_profile_complete = ${updateData.is_profile_complete || false},
        updated_at = NOW()
      WHERE id = ${decoded.userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
