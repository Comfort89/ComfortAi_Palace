import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

type Card = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  price: string;
  sizes: string;
  badge: string;
  gradient: string;
};

const fallback: Card[] = [
  { id: "amara", slug: "amara-dress", name: "The Amara Dress", tag: "Evening • African-inspired", price: "₦85,000", sizes: "XS – XL", badge: "New", gradient: "from-rose via-rosedeep to-espresso" },
  { id: "zuri", slug: "zuri-luxury-set", name: "Zuri Luxury Set", tag: "Two-piece • Weekend Edit", price: "₦72,500", sizes: "S – XXL", badge: "Only 3 Left", gradient: "from-emerald via-cocoa to-gold" },
  { id: "adaeze", slug: "adaeze-dinner-gown", name: "Adaeze Dinner Gown", tag: "Occasion wear • Statement", price: "₦98,000", sizes: "XS – L", badge: "Best Seller", gradient: "from-cream via-wine to-espresso" }
];

const gradients = [
  "from-rose via-rosedeep to-espresso",
  "from-emerald via-cocoa to-gold",
  "from-cream via-wine to-espresso"
];

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

async function getProducts(): Promise<{ cards: Card[]; live: boolean }> {
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      include: { category: true, variants: true },
      orderBy: { createdAt: "asc" },
      take: 6
    });
    if (products.length === 0) return { cards: fallback, live: false };
    const cards: Card[] = products.map((p, i) => {
      const sizes = Array.from(new Set(p.variants.map((v) => v.size))).join(" • ") || "One size";
      const badge = p.isNew ? "New" : p.isBestSeller ? "Best Seller" : p.trending ? "Trending" : p.category.name;
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        tag: `${p.category.name} • ${p.fit ?? "True to size"}`,
        price: naira(p.priceNaira),
        sizes,
        badge,
        gradient: gradients[i % gradients.length]
      };
    });
    return { cards, live: true };
  } catch {
    return { cards: fallback, live: false };
  }
}

export default async function Home() {
  const { cards, live } = await getProducts();

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="bg-espresso text-center text-[12px] uppercase tracking-[0.15em] text-[#F6EDDD] px-4 py-2">
        Complimentary delivery in Lagos on orders over ₦150,000
      </div>

      <header className="sticky top-0 z-10 border-b border-line bg-ivory/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <div className="font-serif text-xl tracking-wide">
            ComfortZone <span className="italic text-golddark">Palace</span>
          </div>
          <nav className="hidden gap-5 text-sm text-cocoa md:flex">
            <a href="#new-arrivals" className="hover:text-espresso">New Arrivals</a>
            <Link href="/categories/dresses" className="hover:text-espresso">Dresses</Link>
            <Link href="/categories/two-piece" className="hover:text-espresso">Two-Piece</Link>
            <Link href="/categories/occasion-wear" className="hover:text-espresso">Occasion Wear</Link>
            <Link href="/search" className="hover:text-espresso">Search</Link>
          </nav>
          <div className="flex gap-2 text-sm">
            <Link href="/wishlist" className="rounded-full border border-line bg-white px-3 py-2">♡</Link>
            <Link href="/bag" className="rounded-full border border-line bg-white px-3 py-2">👜</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5">
        <section className="mt-6 grid overflow-hidden rounded-2xl bg-espresso text-[#FFF8EC] md:grid-cols-2">
          <div className="p-8 md:p-12">
            <span className="mb-4 inline-block rounded-full border border-gold/60 px-3 py-1 text-[12px] uppercase tracking-[0.18em] text-gold">
              Modern African Luxury
            </span>
            <h1 className="font-serif text-4xl leading-tight md:text-5xl">
              Welcome to <em className="text-gold">ComfortZone Palace</em>
              <br />
              Where luxury meets comfort.
            </h1>
            <p className="mt-4 max-w-md text-[#EDE2CF]">
              Carefully selected dresses, two-piece sets and occasion wear —
              beautiful, comfortable, and made to make you feel confident.
            </p>
            <div className="mt-6">
              <a
                href="#new-arrivals"
                className="inline-block rounded-full border border-[#EAD9A8] bg-gradient-to-br from-[#E3C888] via-gold to-golddark px-9 py-4 text-[15px] font-bold uppercase tracking-[0.08em] text-[#241A10] shadow-[0_8px_24px_rgba(198,166,100,0.45)] transition hover:brightness-105"
              >
                Shop New Arrivals
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center bg-gradient-to-br from-cocoa to-espresso p-8">
            <div className="w-full max-w-[280px] overflow-hidden rounded-2xl bg-ivory text-espresso shadow-xl">
              <div className="flex h-56 items-end justify-center bg-gradient-to-b from-rose via-rosedeep to-espresso pb-3">
                <span className="rounded-full bg-espresso px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-[#F6EDDD]">
                  The Amara Dress
                </span>
              </div>
              <div className="p-4">
                <p className="font-serif font-semibold">THE AMARA DRESS</p>
                <p className="text-sm text-muted">
                  <em>Elegance made effortless.</em> ₦85,000
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="new-arrivals" className="py-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl">New Arrivals</h2>
              <p className="text-sm text-muted">{live ? "Live from PostgreSQL" : "Sample data — DB not connected"}</p>
            </div>
            <span className="text-sm font-semibold text-wine">View all →</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_32px_rgba(43,33,24,0.10)]"
              >
                <div className={`relative h-52 bg-gradient-to-b ${p.gradient}`}>
                  <span className="absolute left-3 top-3 rounded-full bg-espresso px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#F6EDDD]">
                    {p.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg">{p.name}</h3>
                  <p className="mt-1 text-[13px] text-muted">{p.tag}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-extrabold">{p.price}</span>
                    <span className="rounded-full border border-line px-3 py-1 text-xs text-cocoa">
                      {p.sizes}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-line px-5 py-6 text-center text-[13px] text-muted">
        <p>ComfortZone Palace • Luxury that feels like you</p>
        <p className="mt-2">
          <Link href="/delivery" className="underline">Delivery</Link> •{" "}
          <Link href="/returns" className="underline">Returns & Exchanges</Link> •{" "}
          <Link href="/size-guide" className="underline">Size Guide</Link> •{" "}
          <Link href="/help" className="underline">Chat With Us</Link> •{" "}
          <Link href="/orders" className="underline">My Orders</Link>
        </p>
      </footer>
    </main>
  );
}
