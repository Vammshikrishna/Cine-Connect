// Simple demo user creation script
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import crypto from "crypto"

console.log("Starting demo user creation...")

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function createDemoUser() {
  try {
    const email = "demo@cinecrafter.com"
    const password = "Demo123!"
    const name = "Demo User"

    console.log("Creating demo user with email:", email)

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM neon_auth.users_sync WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("Demo user already exists!")
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = crypto.randomUUID()

    // Insert demo user
    await sql`
      INSERT INTO neon_auth.users_sync (
        id, email, name, password_hash, primary_craft, experience_level, is_profile_complete, created_at
      ) VALUES (
        ${userId}, ${email}, ${name}, ${hashedPassword}, 
        'Director', 'Intermediate', false, NOW()
      )
    `

    console.log("Demo user created successfully!")
    console.log("Email:", email)
    console.log("Password:", password)
  } catch (error) {
    console.error("Error creating demo user:", error)
  }
}

createDemoUser()
