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

    // Get posts with user information and like status
    const posts = await sql`
      SELECT 
        p.*,
        u.name as user_name,
        u.username as user_username,
        u.avatar_url as user_avatar_url,
        u.primary_craft as user_primary_craft,
        u.verified as user_verified,
        CASE WHEN pl.user_id IS NOT NULL THEN true ELSE false END as is_liked
      FROM posts p
      JOIN profiles u ON p.user_id = u.id
      LEFT JOIN post_likes pl ON p.id = pl.post_id AND pl.user_id = ${decoded.userId}
      WHERE p.visibility = 'public'
      ORDER BY p.created_at DESC
      LIMIT 20
    `

    // Transform the data to match our interface
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      media_urls: post.media_urls,
      media_types: post.media_types,
      project_title: post.project_title,
      craft_tags: post.craft_tags,
      location: post.location,
      collaboration_open: post.collaboration_open,
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      shares_count: post.shares_count,
      created_at: post.created_at,
      is_liked: post.is_liked,
      user: {
        name: post.user_name,
        username: post.user_username,
        avatar_url: post.user_avatar_url,
        primary_craft: post.user_primary_craft,
        verified: post.user_verified,
      },
    }))

    return NextResponse.json({ success: true, posts: transformedPosts })
  } catch (error) {
    console.error("Feed error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
