import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword } from '@/lib/crypto'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { giftId, password, senderName, recipientName, message, theme, links } = body

    if (!giftId || !password || !senderName || !recipientName || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (giftId.length < 4 || giftId.length > 100) {
      return NextResponse.json({ error: 'Gift ID must be 4-100 characters' }, { status: 400 })
    }

    const cleanGiftId = giftId.toLowerCase().replace(/[^a-z0-9-_]/g, '-')

    const existing = await sql`
      SELECT id FROM gift_boxes WHERE gift_id = ${cleanGiftId}
    ` as any[]
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'This Gift Box ID is already taken. Please choose another.' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    await sql`
      INSERT INTO gift_boxes (gift_id, password_hash, sender_name, recipient_name, message, theme)
      VALUES (${cleanGiftId}, ${passwordHash}, ${senderName}, ${recipientName}, ${message}, ${theme || 'romantic'})
    `

    if (links && links.length > 0) {
      for (const link of links) {
        if (link.title && link.url) {
          await sql`
            INSERT INTO gift_links (gift_box_id, title, url)
            VALUES (${cleanGiftId}, ${link.title}, ${link.url})
          `
        }
      }
    }

    return NextResponse.json({ giftId: cleanGiftId, success: true }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating gift:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
