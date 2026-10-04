import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleAvailability } from "@/lib/admin-actions";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function AdminHome() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Storefront</Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl">Store Admin</h1>
            <p className="text-sm text-muted">Phase 1 — products only. No login yet (Phase 3).</p>
          </div>
          <Link href="/admin/products/new" className="rounded-full bg-espresso px-6 py-3 text-sm font-bold text-[#FFF8EC]">
            + Add product
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {products.map((p) => {
            const stock = p.variants.reduce((s, v) => s + v.stock, 0);
            return (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                <div>
                  <p className="font-serif text-lg">{p.name}</p>
                  <p className="text-sm text-muted">
                    {p.category.name} • {naira(p.priceNaira)} • {stock} in stock • {p.available ? "Available" : "Hidden"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${p.id}`} className="rounded-full border border-line px-4 py-2 text-sm">
                    Edit
                  </Link>
                  <Link href={`/products/${p.slug}`} className="rounded-full border border-line px-4 py-2 text-sm">
                    View
                  </Link>
                  <form action={toggleAvailability.bind(null, p.id, !p.available)}>
                    <button className="rounded-full border border-line px-4 py-2 text-sm" type="submit">
                      {p.available ? "Hide" : "Show"}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
        {products.length === 0 && <p className="mt-6 text-muted">No products yet.</p>}
      </div>
    </main>
  );
}
