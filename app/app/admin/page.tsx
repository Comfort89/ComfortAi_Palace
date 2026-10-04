import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleAvailability } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = 'force-dynamic';

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function AdminHome() {
  await requireAdmin();
  const [products, orderCount, revenue, openSupport, reviewCount, customerCount] = await Promise.all([
    prisma.product.findMany({ include: { category: true, variants: true }, orderBy: { createdAt: "desc" } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "paid" } }),
    prisma.supportMessage.count({ where: { handled: false } }),
    prisma.review.count(),
    prisma.user.count()
  ]);

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Storefront</Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl">Store Admin</h1>
            <p className="text-sm text-muted">Login required. First user becomes ADMIN automatically.</p>
          </div>
          <Link href="/admin/products/new" className="rounded-full bg-espresso px-6 py-3 text-sm font-bold text-[#FFF8EC]">
            + Add product
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-line bg-white p-4"><p className="text-xs text-muted">Revenue (paid)</p><p className="font-serif text-xl">{naira(revenue._sum.total ?? 0)}</p></div>
          <div className="rounded-2xl border border-line bg-white p-4"><p className="text-xs text-muted">Orders</p><p className="font-serif text-xl">{orderCount}</p></div>
          <div className="rounded-2xl border border-line bg-white p-4"><p className="text-xs text-muted">Customers</p><p className="font-serif text-xl">{customerCount}</p></div>
          <div className="rounded-2xl border border-line bg-white p-4"><p className="text-xs text-muted">Open messages</p><p className="font-serif text-xl">{openSupport}</p></div>
        </div>

        <nav className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/admin/orders" className="rounded-full border border-line bg-white px-4 py-2">Orders</Link>
          <Link href="/admin/customers" className="rounded-full border border-line bg-white px-4 py-2">Customers</Link>
          <Link href="/admin/reviews" className="rounded-full border border-line bg-white px-4 py-2">Reviews ({reviewCount})</Link>
          <Link href="/admin/support" className="rounded-full border border-line bg-white px-4 py-2">Support inbox</Link>
        </nav>

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
                  <Link href={`/admin/products/${p.id}`} className="rounded-full border border-line px-4 py-2 text-sm">Edit</Link>
                  <Link href={`/products/${p.slug}`} className="rounded-full border border-line px-4 py-2 text-sm">View</Link>
                  <form action={toggleAvailability.bind(null, p.id, !p.available)}>
                    <button className="rounded-full border border-line px-4 py-2 text-sm" type="submit">{p.available ? "Hide" : "Show"}</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
