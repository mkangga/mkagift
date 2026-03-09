import { neon } from '@neondatabase/serverless'

function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}

export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof neon>]
  },
  apply(_target, _thisArg, args) {
    return (getDb() as unknown as (...a: unknown[]) => unknown)(...args)
  },
}) as unknown as ReturnType<typeof neon>

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
