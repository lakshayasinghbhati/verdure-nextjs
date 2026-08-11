# Verdure — Premium Grocery E-commerce

A full Next.js 14 (App Router) storefront: real MongoDB-backed catalog,
NextAuth (email/password + Google), Razorpay checkout, order tracking, and
an admin dashboard with inventory management. Animations run on real
Framer Motion; the hero fruits are a real React Three Fiber scene.

## 1. Install

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

- **MONGODB_URI** — a MongoDB Atlas connection string (free tier is fine:
  https://www.mongodb.com/cloud/atlas/register). Create a database user and
  allow your IP (or `0.0.0.0/0` for local dev).
- **NEXTAUTH_SECRET** — generate with `openssl rand -base64 32`.
- **GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET** — from
  https://console.cloud.google.com/apis/credentials. Add
  `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
- **RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET** — test keys from
  https://dashboard.razorpay.com/app/keys (test mode is free, no real money moves).
  Mirror the key id into `NEXT_PUBLIC_RAZORPAY_KEY_ID` too — the checkout
  widget needs it client-side.

## 3. Seed the catalog

```bash
npm run seed
```

This clears and repopulates the `products` collection with 20 starter items
across 6 categories.

## 4. Run it

```bash
npm run dev
```

Visit http://localhost:3000.

## 5. Make yourself an admin

Sign up normally through the app, then in MongoDB (Atlas UI, or `mongosh`)
flip your user's role:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Reload — the dashboard icon appears in the nav, and `/admin` and
`/admin/inventory` become accessible (guarded by `middleware.ts`).

## How it's wired together

| Concern              | Where |
|-----------------------|-------|
| Product catalog        | `models/Product.ts`, `app/api/products/*` |
| Cart / wishlist state  | `store/useCartStore.ts`, `store/useWishlistStore.ts` (Zustand, persisted to localStorage) |
| Auth                   | `lib/authOptions.ts`, `app/api/auth/*`, `middleware.ts` |
| Payments                | `app/api/payments/create-order`, `app/api/payments/verify` — the server always recomputes prices from the DB and verifies Razorpay's HMAC signature before marking an order paid or touching stock |
| Order tracking          | `models/Order.ts`, `app/orders/[id]/page.tsx` (polls every 5s), `app/api/orders/[id]/status` (admin-only mutation) |
| Admin dashboard          | `app/admin/page.tsx`, `app/admin/inventory/page.tsx` |
| 3D hero                | `components/three/FloatingFruits.tsx` (React Three Fiber + drei, loaded client-only via `next/dynamic`) |
| Animated basket          | `components/BasketIcon.tsx` (Framer Motion) |

## Notes on production-readiness

This is a solid, runnable foundation — not a finished production system.
Before shipping for real, you'd still want to add: rate limiting on the auth
and payment routes, a Razorpay webhook (in addition to client-side
verification) to handle payment confirmations that happen outside the
browser session, image uploads for products (currently emoji placeholders),
pagination on the catalog and admin order list, and tests around the
payment-verification path specifically, since that's the part that touches
real money.
