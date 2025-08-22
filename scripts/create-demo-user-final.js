import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

// Use the DATABASE_URL environment variable
const sql = neon(process.env.DATABASE_URL)

async function createDemoUser() {
  try {
    console.log("Creating demo user...")

    // Demo user credentials
    const email = "demo@cinecrafter.com"
    const password = "Demo123!"
    const name = "Demo User"

    // Check if demo user already exists
    const existingUser = await sql`
      SELECT id FROM neon_auth.users_sync WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("Demo user already exists!")
      console.log("You can sign in with:")
      console.log("Email: demo@cinecrafter.com")
      console.log("Password: Demo123!")
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create demo user
    const result = await sql`
      INSERT INTO neon_auth.users_sync (
        id, email, name, password_hash, is_profile_complete, 
        primary_craft, experience_level, bio, created_at, updated_at
      ) VALUES (
        gen_random_uuid()::text, 
        ${email}, 
        ${name}, 
        ${hashedPassword}, 
        true,
        'Director',
        'Intermediate',
        'Demo user for testing CineCraft Connect platform',
        NOW(), 
        NOW()
      ) RETURNING id, email, name
    `

    console.log("Demo user created successfully!")
    console.log("User details:", result[0])
    console.log("")
    console.log("=== DEMO USER CREDENTIALS ===")
    console.log("Email: demo@cinecrafter.com")
    console.log("Password: Demo123!")
    console.log("=============================")
  } catch (error) {
    console.error("Error creating demo user:", error)
  }
}

createDemoUser()
