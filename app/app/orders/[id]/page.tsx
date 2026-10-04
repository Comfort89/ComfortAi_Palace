import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

const STEPS = ["Confirmed", "Preparing", "Ready", "On the Way", "Delivered"];

export default async function OrderPage({ params, searchParams }: { params: { id: string }; searchParams: { fresh?: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payments: true }
  });
  if (!order) notFound();
  const stepIdx = Math.max(0, STEPS.indexOf(order.status));

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Home</Link>
        {searchParams.fresh && (
          <div className="mt-3 rounded-2xl bg-emerald p-4 text-[#F3ECE2]">
            <p className="font-serif text-xl">Your order has been placed successfully.</p>
            <p className="text-sm">Order {order.orderNo} • {naira(order.total)} • {order.paymentStatus}</p>
          </div>
        )}
        <h1 className="mt-4 font-serif text-3xl">Order {order.orderNo}</h1>
        <p className="text-sm text-muted">{order.fullName} • {order.address}, {order.city}, {order.state} • {order.phone}</p>

        <ol className="mt-6 space-y-2">
          {STEPS.map((s, i) => (
            <li key={s} className={`rounded-xl border px-4 py-2 text-sm ${i <= stepIdx ? "border-emerald bg-white font-bold" : "border-line bg-white text-muted"}`}>
              {i <= stepIdx ? "✓ " : ""}{s}
            </li>
          ))}
        </ol>

        <div className="mt-6 space-y-2">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between rounded-xl border border-line bg-white px-4 py-2 text-sm">
              <span>{i.name} • {i.size}/{i.colour} × {i.qty}</span>
              <span>{naira(i.priceNaira * i.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-white p-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{naira(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{order.deliveryFee === 0 ? "Free" : naira(order.deliveryFee)}</span></div>
          <div className="flex justify-between font-extrabold"><span>Total</span><span>{naira(order.total)}</span></div>
          <p className="mt-2 text-xs text-muted">Expected: 2–5 working days (Nigeria). Payment: {order.paymentMethod} / {order.paymentStatus}.</p>
        </div>

        <Link href="/orders" className="mt-4 inline-block text-sm text-wine">View My Orders →</Link>
      </div>
    </main>
  );
}
