# MACH1 Logistics

Next.js 16 site for [www.mach1logistics.com.au](https://www.mach1logistics.com.au), with Prismic CMS and locales `en-us`, `zh-cn`, and `hi-in`.

## Setup

1. Copy `.env.example` to `.env.local` and fill in Resend, Prismic, Mapbox, and Turnstile keys.
2. Use Node 20 (`nvm use`).
3. Run `npm install` then `npm run dev`.

For production form protection, set `CLOUDFLARE_TURNSTILE_SITE_KEY` and `CLOUDFLARE_TURNSTILE_SECRET_KEY`. Rate limits use Vercel Redis via `MACH1_REDIS_URL`.

Prismic webhooks should POST the secret in the JSON body to `/api/revalidate`. Do not put the secret in the query string.
