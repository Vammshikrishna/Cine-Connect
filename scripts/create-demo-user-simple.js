import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL)

async function createDemoUser() {
  try {
    console.log("Creating demo user...")

    // Test connection first
    const testResult = await sql`SELECT 1 as test`
    console.log("Database connection successful:", testResult)

    // Check if demo user already exists
    const existingUser = await sql`
      SELECT id FROM neon_auth.users_sync WHERE email = 'demo@cinecrafter.com'
    `

    if (existingUser.length > 0) {
      console.log("Demo user already exists!")
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash("Demo123!", 12)
    console.log("Password hashed successfully")

    // Create demo user
    const result = await sql`
      INSERT INTO neon_auth.users_sync (
        email, 
        password_hash, 
        name, 
        username, 
        primary_craft, 
        experience_level, 
        created_at
      )
      VALUES (
        'demo@cinecrafter.com',
        ${passwordHash},
        'Demo User',
        'demouser',
        'Director',
        'Intermediate',
        NOW()
      )
      RETURNING id, email, name
    `

    console.log("Demo user created successfully:", result[0])
    console.log("Demo credentials:")
    console.log("Email: demo@cinecrafter.com")
    console.log("Password: Demo123!")
  } catch (error) {
    console.error("Error creating demo user:", error)
  }
}

createDemoUser()
