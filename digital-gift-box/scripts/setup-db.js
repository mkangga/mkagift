#!/usr/bin/env node
// Run: node scripts/setup-db.js
// This script creates the database tables needed for Digital Gift Box

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.local')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function setup() {
  console.log('🔧 Setting up database...\n')

  try {
    // Create gift_boxes table
    await sql`
      CREATE TABLE IF NOT EXISTS gift_boxes (
        id SERIAL PRIMARY KEY,
        gift_id VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        theme VARCHAR(50) NOT NULL DEFAULT 'romantic',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✅ Created gift_boxes table')

    // Create gift_links table
    await sql`
      CREATE TABLE IF NOT EXISTS gift_links (
        id SERIAL PRIMARY KEY,
        gift_box_id VARCHAR(100) NOT NULL REFERENCES gift_boxes(gift_id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        icon VARCHAR(50) DEFAULT 'gift'
      )
    `
    console.log('✅ Created gift_links table')

    console.log('\n🎉 Database setup complete! You can now run: npm run dev\n')
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

setup()
