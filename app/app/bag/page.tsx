"use client";

import Link from "next/link";
import { useBag } from "@/lib/bag";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

const FREE_OVER = 150000;
const FLAT_FEE = 3500;

export default function BagPage() {
  const { items, setQty, remove, subtotal } = useBag();
  const delivery = items.length === 0 || subtotal >= FREE_OVER ? 0 : FLAT_FEE;

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Continue shopping</Link>
        <h1 className="mt-2 font-serif text-3xl">Shopping Bag</h1>

        {items.length === 0 ? (
          <p className="mt-6 text-muted">
            Your bag is empty. <Link href="/search" className="text-wine underline">Search pieces</Link>
          </p>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}-${i.colour}`} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                  <div>
                    <Link href={`/products/${i.slug}`} className="font-serif text-lg">{i.name}</Link>
                    <p className="text-sm text-muted">{i.size} • {i.colour} • {naira(i.priceNaira)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(i.productId, i.size, i.colour, i.qty - 1)} className="rounded-full border border-line px-3 py-1">−</button>
                    <span className="w-6 text-center">{i.qty}</span>
                    <button onClick={() => setQty(i.productId, i.size, i.colour, i.qty + 1)} className="rounded-full border border-line px-3 py-1">+</button>
                    <button onClick={() => remove(i.productId, i.size, i.colour)} className="ml-2 text-sm text-wine">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
              <div className="mt-1 flex justify-between"><span>Delivery</span><span>{delivery === 0 ? "Free" : naira(delivery)}</span></div>
              <div className="mt-2 flex justify-between font-extrabold text-base"><span>Total</span><span>{naira(subtotal + delivery)}</span></div>
              <p className="mt-2 text-xs text-muted">Checkout & payment arrive in Phase 4.</p>
              <button className="mt-4 w-full rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC]">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
