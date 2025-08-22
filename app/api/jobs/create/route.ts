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

    const jobData = await request.json()

    const {
      title,
      description,
      craft_required,
      additional_crafts,
      experience_level,
      job_type,
      location,
      remote_allowed,
      budget_min,
      budget_max,
      currency,
      deadline,
    } = jobData

    if (!title || !description || !craft_required || !experience_level || !job_type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const jobId = crypto.randomUUID()

    // Insert job into database
    await sql`
      INSERT INTO jobs (
        id, posted_by, title, description, craft_required, additional_crafts,
        experience_level, job_type, location, remote_allowed, budget_min,
        budget_max, currency, deadline
      ) VALUES (
        ${jobId}, ${decoded.userId}, ${title}, ${description}, ${craft_required},
        ${additional_crafts || []}, ${experience_level}, ${job_type}, ${location || null},
        ${remote_allowed}, ${budget_min || null}, ${budget_max || null}, ${currency},
        ${deadline || null}
      )
    `

    return NextResponse.json({ success: true, job_id: jobId })
  } catch (error) {
    console.error("Create job error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
