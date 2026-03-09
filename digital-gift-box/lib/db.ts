import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = neon(process.env.DATABASE_URL)

export async function setupDatabase() {
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

  await sql`
    CREATE TABLE IF NOT EXISTS gift_links (
      id SERIAL PRIMARY KEY,
      gift_box_id VARCHAR(100) NOT NULL REFERENCES gift_boxes(gift_id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      url TEXT NOT NULL,
      icon VARCHAR(50) DEFAULT 'gift'
    )
  `
}

export type GiftBox = {
  id: number
  gift_id: string
  password_hash: string
  sender_name: string
  recipient_name: string
  message: string
  theme: string
  created_at: string
}

export type GiftLink = {
  id: number
  gift_box_id: string
  title: string
  url: string
  icon: string
}

export type GiftBoxWithLinks = GiftBox & { links: GiftLink[] }
