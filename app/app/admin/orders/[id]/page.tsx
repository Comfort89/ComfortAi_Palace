import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, } from "@/lib/require-admin";
import { updateOrderStatus } from "@/lib/admin-ops";
import { ORDER_STATUSES } from "@/lib/order-status";

export const dynamic = 'force-dynamic';

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true, payments: true } });
  if (!order) notFound();

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/admin/orders" className="text-sm text-wine">← Orders</Link>
        <h1 className="mt-2 font-serif text-3xl">{order.orderNo}</h1>
        <p className="text-sm text-muted">{order.fullName} • {order.address}, {order.city}, {order.state} • {order.phone}</p>
        <p className="mt-1 text-sm">Status: <strong>{order.status}</strong> • Payment: {order.paymentMethod}/{order.paymentStatus} • Total: <strong>{naira(order.total)}</strong></p>

        <form action={updateOrderStatus.bind(null, order.id, "")} className="hidden" />
        <div className="mt-4 flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <form key={s} action={updateOrderStatus.bind(null, order.id, s)}>
              <button className={`rounded-full border px-4 py-2 text-sm ${s === order.status ? "border-espresso bg-espresso text-white" : "border-line bg-white"}`}>
                {s}
              </button>
            </form>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between rounded-xl border border-line bg-white px-4 py-2 text-sm">
              <span>{i.name} • {i.size}/{i.colour} × {i.qty}</span>
              <span>{naira(i.priceNaira * i.qty)}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
