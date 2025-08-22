import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
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

    const { postId } = params

    // Check if already liked
    const existingLike = await sql`
      SELECT id FROM post_likes 
      WHERE post_id = ${postId} AND user_id = ${decoded.userId}
    `

    let liked = false

    if (existingLike.length > 0) {
      // Unlike
      await sql`
        DELETE FROM post_likes 
        WHERE post_id = ${postId} AND user_id = ${decoded.userId}
      `

      await sql`
        UPDATE posts 
        SET likes_count = likes_count - 1 
        WHERE id = ${postId}
      `
    } else {
      // Like
      await sql`
        INSERT INTO post_likes (post_id, user_id) 
        VALUES (${postId}, ${decoded.userId})
      `

      await sql`
        UPDATE posts 
        SET likes_count = likes_count + 1 
        WHERE id = ${postId}
      `
      liked = true
    }

    // Get updated likes count
    const [post] = await sql`
      SELECT likes_count FROM posts WHERE id = ${postId}
    `

    return NextResponse.json({
      success: true,
      liked,
      likes_count: post.likes_count,
    })
  } catch (error) {
    console.error("Like post error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
