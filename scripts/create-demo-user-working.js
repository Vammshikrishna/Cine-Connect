const { neon } = require("@neondatabase/serverless")

async function createDemoUser() {
  console.log("Starting demo user creation...")

  // Check if DATABASE_URL is available
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set")
    return
  }

  console.log("Database URL found, connecting...")

  try {
    const sql = neon(databaseUrl)

    // Test database connection
    console.log("Testing database connection...")
    await sql`SELECT 1 as test`
    console.log("Database connection successful!")

    // Check if demo user already exists
    console.log("Checking if demo user exists...")
    const existingUser = await sql`
      SELECT id FROM neon_auth.users_sync 
      WHERE email = 'demo@cinecrafter.com'
    `

    if (existingUser.length > 0) {
      console.log("Demo user already exists!")
      return
    }

    // Create demo user
    console.log("Creating demo user...")
    const hashedPassword = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // Demo123!

    const result = await sql`
      INSERT INTO neon_auth.users_sync (
        name, username, email, password_hash, primary_craft, 
        experience_level, bio, location, verified, created_at
      ) VALUES (
        'Demo User',
        'demouser',
        'demo@cinecrafter.com',
        ${hashedPassword},
        'Director',
        'intermediate',
        'Demo user for testing CineCraft Connect platform',
        'Los Angeles, CA',
        true,
        NOW()
      )
      RETURNING id, name, email
    `

    console.log("Demo user created successfully:", result[0])
    console.log("\nDemo User Credentials:")
    console.log("Email: demo@cinecrafter.com")
    console.log("Password: Demo123!")
  } catch (error) {
    console.error("Error creating demo user:", error)
  }
}

createDemoUser()
