import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyPassword } from '@/lib/crypto'

export const runtime = 'edge'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ giftId: string }> }
) {
  try {
    const { giftId: rawId } = await params
    const giftId = decodeURIComponent(rawId).toLowerCase().trim()
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const boxes = await sql`
      SELECT id, gift_id, password_hash
      FROM gift_boxes
      WHERE gift_id = ${giftId}
    `

    if (boxes.length === 0) {
      return NextResponse.json({ error: 'Gift Box ID not found' }, { status: 404 })
    }

    const box = boxes[0]
    const isValid = await verifyPassword(password, box.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    return NextResponse.json({ success: true, giftId: box.gift_id })
  } catch (error) {
    console.error('Error verifying gift:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
