import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { jobId: string } }) {
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

    const { jobId } = params

    // Check if already applied
    const existingApplication = await sql`
      SELECT id FROM job_applications 
      WHERE job_id = ${jobId} AND applicant_id = ${decoded.userId}
    `

    if (existingApplication.length > 0) {
      return NextResponse.json({ success: false, error: "You have already applied to this job" }, { status: 400 })
    }

    // Check if job exists and is open
    const [job] = await sql`
      SELECT status FROM jobs WHERE id = ${jobId}
    `

    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    if (job.status !== "open") {
      return NextResponse.json(
        { success: false, error: "This job is no longer accepting applications" },
        { status: 400 },
      )
    }

    const applicationId = crypto.randomUUID()

    // Create application
    await sql`
      INSERT INTO job_applications (id, job_id, applicant_id) 
      VALUES (${applicationId}, ${jobId}, ${decoded.userId})
    `

    // Update applications count
    await sql`
      UPDATE jobs 
      SET applications_count = applications_count + 1 
      WHERE id = ${jobId}
    `

    return NextResponse.json({ success: true, application_id: applicationId })
  } catch (error) {
    console.error("Apply to job error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
