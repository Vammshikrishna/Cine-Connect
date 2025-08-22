const { neon } = require("@neondatabase/serverless")
const bcrypt = require("bcryptjs")

const sql = neon(process.env.DATABASE_URL)

async function createDemoUser() {
  try {
    console.log("Creating demo user...")

    const email = "demo@cinecrafter.com"
    const password = "Demo123!"
    const name = "Demo User"
    const primary_craft = "Director"
    const experience_level = "Intermediate"

    // Check if demo user already exists
    const existingUser = await sql`
      SELECT id FROM neon_auth.users_sync WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("Demo user already exists!")
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate user ID
    const userId = crypto.randomUUID()

    // Insert demo user
    await sql`
      INSERT INTO neon_auth.users_sync (
        id, email, name, password_hash, primary_craft, experience_level, 
        is_profile_complete, bio, location, created_at
      ) VALUES (
        ${userId}, ${email}, ${name}, ${hashedPassword}, 
        ${primary_craft}, ${experience_level}, true,
        'Experienced director passionate about storytelling and visual narratives. Available for collaborations on indie films and commercial projects.',
        'Los Angeles, CA', NOW()
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
