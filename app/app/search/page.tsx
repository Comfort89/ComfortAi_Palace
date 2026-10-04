import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string; category?: string; maxPrice?: string; size?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const category = searchParams.category ?? "";
  const maxPrice = parseInt(searchParams.maxPrice ?? "", 10);
  const size = searchParams.size ?? "";

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const products = await prisma.product.findMany({
    where: {
      available: true,
      ...(q
        ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }
        : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(!Number.isNaN(maxPrice) && searchParams.maxPrice ? { priceNaira: { lte: maxPrice } } : {}),
      ...(size ? { variants: { some: { size, stock: { gt: 0 } } } } : {})
    },
    include: { category: true, variants: true },
    orderBy: { createdAt: "asc" },
    take: 24
  });

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-3xl">Search</h1>

        <form method="get" action="/search" className="mt-4 grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="Black dress, Ankara, two-piece…" className="rounded-xl border border-line px-3 py-2 md:col-span-2" />
          <select name="category" defaultValue={category} className="rounded-xl border border-line px-3 py-2">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <input name="maxPrice" defaultValue={searchParams.maxPrice ?? ""} placeholder="Max ₦" type="number" min={0} className="rounded-xl border border-line px-3 py-2" />
          <input name="size" defaultValue={size} placeholder="Size (S, M, L…)" className="rounded-xl border border-line px-3 py-2" />
          <button type="submit" className="rounded-full bg-espresso px-6 py-2 text-sm font-bold text-[#FFF8EC] md:col-span-4">Search</button>
        </form>

        <p className="mt-4 text-sm text-muted">{products.length} result{products.length === 1 ? "" : "s"}{q ? ` for “${q}”` : ""}</p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_32px_rgba(43,33,24,0.10)]">
              <div className="h-44 bg-gradient-to-b from-rose via-rosedeep to-espresso" />
              <div className="p-4">
                <h3 className="font-serif text-lg">{p.name}</h3>
                <p className="mt-1 text-[13px] text-muted">{p.category.name}</p>
                <p className="mt-2 font-extrabold">{naira(p.priceNaira)}</p>
              </div>
            </Link>
          ))}
        </div>
        {products.length === 0 && <p className="mt-6 text-muted">No pieces match. Try a different search.</p>}
      </div>
    </main>
  );
}
