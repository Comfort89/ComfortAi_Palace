# ComfortZone Palace — Local Run Guide (V1)

Luxury fashion store for women. Next.js + TypeScript + Tailwind + PostgreSQL + Prisma.
App + DB run locally. Payments in test mode (no real money).

## 1. Requirements
- Docker Desktop (running) — for PostgreSQL 16
- Node.js 20+ (or the portable Node already used on this PC)

## 2. Start the database
From repo root:
```
docker compose up -d db
```
Postgres: `postgresql://comfortzone:comfortzone@localhost:5432/comfortzone`

## 3. Configure the app
```
cd app
cp .env.example .env
```
`.env` needs:
```
DATABASE_URL="postgresql://comfortzone:comfortzone@localhost:5432/comfortzone"
NEXTAUTH_SECRET="<random 64-hex chars>"
NEXTAUTH_URL="http://localhost:3000"
```

## 4. Install, migrate, seed
```
npm install
npx prisma migrate dev
npx tsx prisma/seed.ts
```
Seed creates 3 categories, 2 collections, 3 products (Amara ₦85,000 / Zuri ₦72,500 / Adaeze ₦98,000).
Reset demo data any time by re-running the seed (it clears catalog tables first).

## 5. Run
```
npm run dev
```
Open http://localhost:3000

Production check:
```
npm run build
npm start
```

## 6. Happy-path QA (local)
1. `/` shows “Live from PostgreSQL”.
2. `/search?q=dress` filters; category links work.
3. `/products/amara-dress` → pick variant → Add to Bag + Save.
4. `/bag` → qty controls → Proceed to Checkout.
5. `/signup` → `/login` → `/account` → add address.
6. `/checkout` → pay with `card-test` (no real charge) → confirmation at `/orders/[id]` with timeline.
7. `/orders` lists your orders (logged in).
8. Product page → submit review with fit feedback.
9. `/admin` (first logged-in user becomes ADMIN): products, orders + status buttons, customers + roles, reviews moderation, support inbox, revenue summary.

## 7. Test data
- No real payment keys needed. Methods: `card-test`, `transfer-test`, `pay-on-delivery`.
- Delivery: ₦3,500 flat, free over ₦150,000. Nigeria only (v1).

## 8. Notes / next steps
- Bag + wishlist are device-local (localStorage); account linking is a later pass.
- Admin guard: login required; first user auto-promotes to ADMIN (tighten for production).
- Deferred per PRD: personalization / “Made For You”, loyalty (ComfortZone Circle), AI shopping, international delivery, Paystack live keys.
