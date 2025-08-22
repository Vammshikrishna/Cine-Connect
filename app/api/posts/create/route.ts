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

    const formData = await request.formData()
    const content = formData.get("content") as string
    const project_title = formData.get("project_title") as string
    const location = formData.get("location") as string
    const collaboration_open = formData.get("collaboration_open") === "true"
    const visibility = formData.get("visibility") as string
    const craft_tags = JSON.parse((formData.get("craft_tags") as string) || "[]")

    if (!content) {
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 })
    }

    // Handle media files (for now, we'll store placeholder URLs)
    const media_urls: string[] = []
    const media_types: string[] = []

    // In a real app, you'd upload files to a storage service like Vercel Blob
    for (let i = 0; i < 4; i++) {
      const file = formData.get(`media_${i}`) as File
      if (file) {
        // Placeholder - in production, upload to storage service
        media_urls.push(`/placeholder.svg?height=400&width=400&query=${encodeURIComponent(file.name)}`)
        media_types.push(file.type.startsWith("image/") ? "image" : "video")
      }
    }

    const postId = crypto.randomUUID()

    // Insert post into database
    await sql`
      INSERT INTO posts (
        id, user_id, content, media_urls, media_types, project_title,
        craft_tags, location, collaboration_open, visibility
      ) VALUES (
        ${postId}, ${decoded.userId}, ${content}, ${media_urls}, ${media_types},
        ${project_title || null}, ${craft_tags}, ${location || null},
        ${collaboration_open}, ${visibility}
      )
    `

    return NextResponse.json({ success: true, post_id: postId })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
