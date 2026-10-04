import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const orders = userId
    ? await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 })
    : [];

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Home</Link>
        <h1 className="mt-2 font-serif text-3xl">My Orders</h1>
        {!userId ? (
          <p className="mt-4 text-sm text-muted">
            <Link href="/login" className="text-wine underline">Log in</Link> to see your orders here. Guest orders are reachable from their confirmation link.
          </p>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No orders yet. <Link href="/search" className="text-wine underline">Shop new arrivals</Link></p>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((o) => (
              <Link key={o.id} href={`/orders/${o.id}`} className="flex justify-between rounded-2xl border border-line bg-white px-4 py-3">
                <span><span className="font-serif">{o.orderNo}</span> <span className="text-sm text-muted">• {o.status}</span></span>
                <span className="font-bold">{naira(o.total)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
