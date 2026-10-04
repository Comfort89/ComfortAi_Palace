# ComfortZone Palace — PRD (Technology Decision Record)

> Full product requirements remain in `Docs/ComfortZone.md`.
> This file records technology decisions only and does not replace the existing PRD.

## Technology Decision

- **Decision:** PostgreSQL

- **Alternatives considered:** SQLite, MySQL/MariaDB, MongoDB, Firebase/Supabase

- **Why PostgreSQL was chosen for ComfortZone Palace:**
  The store needs related data to stay correct across Product, Variants (size/colour/stock), Bag, Order, Payment, and Delivery status. PostgreSQL enforces this with foreign keys and ACID transactions, so checkout (reduce stock + create order + record payment) succeeds or rolls back together. It also handles catalog filtering by category, price, size, colour, and availability.

- **The main advantages for this project:**
  - Data integrity for orders and stock.
  - Relational model fits products, images, variants, customers, addresses, orders, reviews.
  - Strong filtering, sorting, and search for shop and admin views.
  - Works well with Prisma ORM for migrations.
  - Same database design works now and in production.

- **The main disadvantage considered:**
  Heavier than a file database for Day 1. Requires a running service (Docker or local install), database user/password, volumes, and explicit migrations. Uses more resources than SQLite.

- **Why it is suitable for local development:**
  PostgreSQL 16 runs locally via Docker Compose alongside the application. Data persists in a local Docker volume and behaves the same as production, avoiding a later rewrite.

- **Local run statement:**
  Both the application and database will run locally for now.

- **Future move:**
  PostgreSQL can later be moved to a cloud/production environment without changing the overall database design.

## Design Refinement

The primary "Shop New Arrivals" button in `design.html` was refined to have:

- A more premium and luxurious appearance
- Better padding and visual prominence
- A subtle hover effect
- Clear and readable text

This refinement was made to better match the luxury, feminine, and elegant identity of ComfortZone Palace.
