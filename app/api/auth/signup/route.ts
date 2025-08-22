import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const { email, password, name, username, primary_craft, experience_level } = userData

    if (!email || !password || !name || !username || !primary_craft || !experience_level) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    const result = await createUser({
      email,
      password,
      name,
      username,
      primary_craft,
      experience_level,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
        token: result.token,
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Sign up API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
