# 🎁 Digital Gift Box

A magical, animated digital gift experience. Send a surprise to someone special with animated reveals, personal messages, and beautiful themes.

---

## ✨ Features

- **5 Beautiful Themes**: Romantic 💕, Birthday 🎂, Cute 🌸, Minimal 🤍, Galaxy 🌌
- **Animated Gift Reveal** with Framer Motion & confetti
- **Password Protected** gift boxes
- **Gift Links** — share multiple links as gift cards
- **Live Preview** while creating
- **Mobile-first** responsive design

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your **Neon DB** connection string:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Get Neon DB for free:** [neon.tech](https://neon.tech) → Create a project → Copy connection string

### 3. Set up the database

```bash
npm run db:setup
```

This creates the required tables (`gift_boxes`, `gift_links`).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
digital-gift-box/
├── app/
│   ├── page.tsx              # 🏠 Home page
│   ├── create/page.tsx       # 🎁 Create gift box
│   ├── open/page.tsx         # 🔑 Open/login page
│   ├── reveal/[giftId]/      # ✨ Gift reveal experience
│   │   └── page.tsx
│   ├── api/
│   │   └── gifts/
│   │       ├── route.ts              # POST create gift
│   │       └── [giftId]/
│   │           ├── route.ts          # GET gift data
│   │           └── verify/
│   │               └── route.ts      # POST verify password
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── db.ts                 # Neon DB connection
│   └── themes.ts             # Theme system
├── scripts/
│   └── setup-db.js           # DB initialization
├── .env.example
└── package.json
```

---

## 🗄️ Database Schema

### `gift_boxes`
| Column          | Type      | Description              |
|----------------|-----------|--------------------------|
| id             | SERIAL    | Auto-increment primary key |
| gift_id        | VARCHAR   | Unique gift box ID (slug) |
| password_hash  | TEXT      | bcrypt hashed password   |
| sender_name    | VARCHAR   | Name of gift creator     |
| recipient_name | VARCHAR   | Name of recipient        |
| message        | TEXT      | Personal message         |
| theme          | VARCHAR   | Theme key                |
| created_at     | TIMESTAMP | Creation time            |

### `gift_links`
| Column      | Type    | Description              |
|------------|---------|--------------------------|
| id         | SERIAL  | Auto-increment primary key |
| gift_box_id| VARCHAR | FK → gift_boxes.gift_id  |
| title      | VARCHAR | Link display title       |
| url        | TEXT    | Full URL                 |
| icon       | VARCHAR | Icon name                |

---

## 🎨 Theme System

Themes are defined in `lib/themes.ts`:

| Key      | Name     | Emoji | Style                  |
|---------|----------|-------|------------------------|
| romantic | Romantic | 💕   | Rose pink gradient     |
| birthday | Birthday | 🎂   | Violet/purple festive  |
| cute     | Cute     | 🌸   | Pastel pink/orange     |
| minimal  | Minimal  | 🤍   | Dark zinc clean layout |
| galaxy   | Galaxy   | 🌌   | Deep blue/violet space |

---

## ☁️ Deployment on Cloudflare Pages

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Connect your GitHub repo
4. Set build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Output directory**: `.next`
5. Add environment variables in Cloudflare dashboard:
   - `DATABASE_URL` — your Neon connection string
   - `NEXT_PUBLIC_APP_URL` — your Cloudflare Pages URL

> Note: For Cloudflare Edge Runtime, you may need the `@cloudflare/next-on-pages` adapter. See [Cloudflare Next.js docs](https://developers.cloudflare.com/pages/framework-guides/nextjs/).

---

## 🔊 Optional Background Music

Place a file at `public/music/gift-music.mp3` to enable the music toggle on the reveal page. Any royalty-free ambient or gentle music works great.

---

## 🛠️ Tech Stack

| Layer     | Technology            |
|----------|-----------------------|
| Framework | Next.js 14 (App Router) |
| Styling   | Tailwind CSS          |
| Animation | Framer Motion         |
| Icons     | React Icons           |
| Confetti  | Canvas Confetti       |
| Database  | Neon PostgreSQL       |
| Auth      | bcryptjs (password hash) |

---

## 📱 Pages

| Route           | Description                    |
|----------------|--------------------------------|
| `/`            | Home page with animated hero   |
| `/create`      | Create a gift box with form    |
| `/open`        | Enter Gift ID + password       |
| `/reveal/[id]` | Full animated reveal experience|

---

Made with 💕 — Digital Gift Box
