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

    const { searchParams } = new URL(request.url)

    // Build dynamic query based on filters
    const whereConditions = ["j.status = 'open'"]
    const queryParams: any[] = []
    let paramIndex = 1

    // Search filter
    const search = searchParams.get("search")
    if (search) {
      whereConditions.push(`(j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex})`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    // Craft filter
    const craft = searchParams.get("craft")
    if (craft) {
      whereConditions.push(`j.craft_required = $${paramIndex}`)
      queryParams.push(craft)
      paramIndex++
    }

    // Experience level filter
    const experienceLevel = searchParams.get("experience_level")
    if (experienceLevel) {
      whereConditions.push(`j.experience_level = $${paramIndex}`)
      queryParams.push(experienceLevel)
      paramIndex++
    }

    // Job type filter
    const jobType = searchParams.get("job_type")
    if (jobType) {
      whereConditions.push(`j.job_type = $${paramIndex}`)
      queryParams.push(jobType)
      paramIndex++
    }

    // Location filter
    const location = searchParams.get("location")
    if (location) {
      whereConditions.push(`j.location ILIKE $${paramIndex}`)
      queryParams.push(`%${location}%`)
      paramIndex++
    }

    // Remote only filter
    const remoteOnly = searchParams.get("remote_only")
    if (remoteOnly === "true") {
      whereConditions.push("j.remote_allowed = true")
    }

    // Budget filters
    const budgetMin = searchParams.get("budget_min")
    if (budgetMin) {
      whereConditions.push(`j.budget_max >= $${paramIndex}`)
      queryParams.push(Number.parseInt(budgetMin))
      paramIndex++
    }

    const budgetMax = searchParams.get("budget_max")
    if (budgetMax) {
      whereConditions.push(`j.budget_min <= $${paramIndex}`)
      queryParams.push(Number.parseInt(budgetMax))
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Execute query with dynamic parameters
    const jobs = await sql`
      SELECT 
        j.*,
        p.name as poster_name,
        p.username as poster_username,
        p.avatar_url as poster_avatar_url,
        p.primary_craft as poster_primary_craft,
        p.verified as poster_verified
      FROM jobs j
      JOIN profiles p ON j.posted_by = p.id
      ${sql.unsafe(whereClause)}
      ORDER BY j.created_at DESC
      LIMIT 50
    `.values(queryParams)

    // Transform the data
    const transformedJobs = jobs.map((job: any) => ({
      id: job[0],
      posted_by: job[1],
      title: job[2],
      description: job[3],
      craft_required: job[4],
      additional_crafts: job[5],
      experience_level: job[6],
      job_type: job[7],
      location: job[8],
      remote_allowed: job[9],
      budget_min: job[10],
      budget_max: job[11],
      currency: job[12],
      deadline: job[13],
      status: job[14],
      applications_count: job[15],
      created_at: job[16],
      updated_at: job[17],
      poster: {
        name: job[18],
        username: job[19],
        avatar_url: job[20],
        primary_craft: job[21],
        verified: job[22],
      },
    }))

    return NextResponse.json({ success: true, jobs: transformedJobs })
  } catch (error) {
    console.error("Fetch jobs error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
