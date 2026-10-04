import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function AdminOrders() {
  await requireAdmin();
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <Link href="/admin" className="text-sm text-wine">← Admin</Link>
        <h1 className="mt-2 font-serif text-3xl">Orders</h1>
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex justify-between rounded-2xl border border-line bg-white px-4 py-3">
              <span><span className="font-serif">{o.orderNo}</span> <span className="text-sm text-muted">• {o.status} • {o.paymentStatus}</span></span>
              <span className="font-bold">{naira(o.total)}</span>
            </Link>
          ))}
          {orders.length === 0 && <p className="text-sm text-muted">No orders yet.</p>}
        </div>
      </div>
    </main>
  );
}
