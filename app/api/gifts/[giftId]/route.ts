import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'edge'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ giftId: string }> }
) {
  try {
    const { giftId: rawId } = await params
    const giftId = decodeURIComponent(rawId).toLowerCase().trim()

    const boxes = await sql`
      SELECT id, gift_id, sender_name, recipient_name, message, theme, created_at
      FROM gift_boxes
      WHERE gift_id = ${giftId}
    `as any[]

    if (boxes.length === 0) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 })
    }

    const box = boxes[0]

    const links = await sql`
      SELECT id, title, url, icon
      FROM gift_links
      WHERE gift_box_id = ${giftId}
      ORDER BY id ASC
    `as any[]

    return NextResponse.json({ ...box, links })
  } catch (error) {
    console.error('Error fetching gift:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
