import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  email: string
  name: string
  primary_craft?: string
  experience_level?: string
  location?: string
  bio?: string
  skills?: string[]
  portfolio_url?: string
  is_profile_complete?: boolean
  created_at: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "7d",
  })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(userData: {
  email: string
  password: string
  name: string
  primary_craft?: string
  experience_level?: string
}): Promise<AuthResult> {
  try {
    console.log("[v0] Creating user with data:", { ...userData, password: "[HIDDEN]" })

    if (!process.env.DATABASE_URL) {
      console.error("[v0] DATABASE_URL environment variable is not set")
      return { success: false, error: "Database configuration error" }
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM neon_auth.users_sync WHERE email = ${userData.email}
    `
    console.log("[v0] Existing user check result:", existingUser.length)

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists with this email" }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)
    console.log("[v0] Password hashed successfully")

    // Generate user ID
    const userId = crypto.randomUUID()
    console.log("[v0] Generated user ID:", userId)

    // Insert user into database
    await sql`
      INSERT INTO neon_auth.users_sync (
        id, email, name, password_hash, primary_craft, experience_level, is_profile_complete, created_at
      ) VALUES (
        ${userId}, ${userData.email}, ${userData.name}, ${hashedPassword}, 
        ${userData.primary_craft || null}, ${userData.experience_level || null}, false, NOW()
      )
    `
    console.log("[v0] User inserted into database")

    // Get created user
    const [user] = await sql`
      SELECT id, email, name, primary_craft, experience_level, location, bio, 
             skills, portfolio_url, is_profile_complete, created_at
      FROM neon_auth.users_sync WHERE id = ${userId}
    `
    console.log("[v0] Retrieved created user:", user)

    return {
      success: true,
      user: user as User,
    }
  } catch (error) {
    console.error("[v0] Create user error:", error)
    return { success: false, error: `Failed to create user: ${error}` }
  }
}

export async function signInUser(email: string, password: string): Promise<AuthResult> {
  try {
    console.log("[v0] Signing in user with email:", email)

    if (!process.env.DATABASE_URL) {
      console.error("[v0] DATABASE_URL environment variable is not set")
      return { success: false, error: "Database configuration error" }
    }

    // Get user with password
    const [userWithPassword] = await sql`
      SELECT id, email, name, primary_craft, experience_level, location, bio, 
             skills, portfolio_url, is_profile_complete, created_at, password_hash
      FROM neon_auth.users_sync WHERE email = ${email}
    `
    console.log("[v0] User found:", !!userWithPassword)

    if (!userWithPassword) {
      return { success: false, error: "Invalid email or password" }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, userWithPassword.password_hash)
    console.log("[v0] Password valid:", isValidPassword)

    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" }
    }

    // Remove password from user object
    const { password_hash, ...user } = userWithPassword

    return {
      success: true,
      user: user as User,
    }
  } catch (error) {
    console.error("[v0] Sign in error:", error)
    return { success: false, error: `Failed to sign in: ${error}` }
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const [user] = await sql`
      SELECT id, email, name, primary_craft, experience_level, location, bio, 
             skills, portfolio_url, is_profile_complete, created_at
      FROM neon_auth.users_sync WHERE id = ${userId}
    `

    return (user as User) || null
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}
