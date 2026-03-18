# SnapOG

Generate beautiful Open Graph images in seconds. No design skills required.

![SnapOG Editor](https://via.placeholder.com/1200x630/0a0a0a/00ff88?text=SnapOG)

## Features

- **10 Professional Templates** — Tech Dark, Tech Light, Blog Clean, Blog Card, Gradient, Minimal, Startup, Code Style, and more
- **Visual Editor** — Real-time preview with live editing
- **Custom Fonts** — Inter, Roboto, Playfair Display, JetBrains Mono (all open-source)
- **Per-field Styling** — Set color, font, and size individually for Title, Description, Author, Date, and Site Name
- **Logo Upload** — Drag & drop with square / rounded / circle shape options
- **Custom Dimensions** — From 400×200 to 2400×1260, with presets for OG Standard, Twitter Card, Facebook, LinkedIn, Square, and Story
- **Watermark Control** — Toggle on/off with custom text, position, and opacity
- **URL Extractor** — Auto-fill title and description from any URL
- **API Access** — Generate OG images programmatically via REST API (Pro/Business)
- **PayPal Subscriptions** — Integrated billing for Pro and Business plans
- **Google OAuth + Email Auth** — Powered by Supabase

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Rendering | Satori + @resvg/resvg-js |
| Auth & DB | Supabase |
| Payments | PayPal Subscriptions |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Fonts | @fontsource (Inter, Roboto, Playfair Display, JetBrains Mono) |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [PayPal Developer](https://developer.paypal.com) account (for payments)

### Installation

```bash
git clone https://github.com/tianhongTina/snapog.git
cd snapog
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID=your-pro-plan-id
NEXT_PUBLIC_PAYPAL_BUSINESS_PLAN_ID=your-business-plan-id
PAYPAL_PRO_PLAN_ID=your-pro-plan-id
PAYPAL_BUSINESS_PLAN_ID=your-business-plan-id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
APP_SECRET=your-random-secret
```

### Database Setup

Run the SQL schema in your Supabase SQL editor:

```bash
# Copy the contents of supabase/schema.sql and run it in Supabase Dashboard → SQL Editor
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## API Usage

Generate OG images via GET request:

```
GET /api/og?title=Hello+World&template=tech-dark&primaryColor=%2300ff88
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | string | **Required.** Main heading text |
| `description` | string | Subtitle or description |
| `author` | string | Author name |
| `date` | string | Date string (e.g. March 18, 2026) |
| `siteUrl` | string | Site name or domain |
| `template` | string | Template ID (see list below) |
| `font` | string | `inter` / `roboto` / `playfair` / `mono` |
| `primaryColor` | string | Hex color (e.g. `%23ff0000`) |
| `backgroundColor` | string | Hex color |
| `width` | number | Image width (400–2400, default 1200) |
| `height` | number | Image height (200–1260, default 630) |
| `titleStyle` | JSON | `{"color":"#fff","font":"roboto","size":64}` |
| `logoUrl` | string | Public URL to logo image |

**Available Templates:**

`tech-dark` · `tech-light` · `blog-clean` · `blog-card` · `gradient-1` · `gradient-2` · `minimal-dark` · `minimal-light` · `startup` · `code-style`

**Example:**

```html
<meta property="og:image" content="https://your-domain.com/api/og?title=My+Blog+Post&template=blog-clean&author=Jane+Doe" />
```

## Pricing

| Plan | Price | Requests | Features |
|------|-------|----------|---------|
| Free | $0/mo | 50/mo | 3 templates, visual editor |
| Pro | $9/mo | 1,000/mo | All templates, API access, custom fonts, no watermark |
| Business | $29/mo | 10,000/mo | Everything in Pro, high volume |

## Project Structure

```
snapog/
├── src/
│   ├── app/
│   │   ├── api/og/          # OG image generation endpoint
│   │   ├── editor/          # Visual editor page
│   │   ├── pricing/         # Pricing page
│   │   ├── dashboard/       # User dashboard (API keys, usage, history)
│   │   └── login/           # Auth page
│   ├── components/
│   │   ├── editor/          # Editor panel components
│   │   ├── landing/         # Homepage sections
│   │   └── layout/          # Navbar, Footer
│   ├── lib/
│   │   └── og/
│   │       ├── render.ts    # Satori + resvg rendering pipeline
│   │       └── templates.tsx # 10 OG image templates
│   ├── store/               # Zustand editor state
│   └── types/               # TypeScript types
├── public/fonts/            # Open-source woff font files
└── supabase/schema.sql      # Database schema
```

## Deployment

### Cloudflare Pages

1. Connect your GitHub repository in [Cloudflare Pages](https://dash.cloudflare.com)
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add all environment variables from `.env.local`
5. Deploy

## License

MIT
