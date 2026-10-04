"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBag } from "@/lib/bag";
import { createOrder } from "@/lib/order-actions";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

const FREE_OVER = 150000;
const FLAT_FEE = 3500;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useBag();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const delivery = items.length === 0 || subtotal >= FREE_OVER ? 0 : FLAT_FEE;

  async function onSubmit(formData: FormData) {
    setError("");
    setBusy(true);
    try {
      const res = await createOrder({
        items: items.map((i) => ({ productId: i.productId, size: i.size, colour: i.colour, qty: i.qty })),
        fullName: String(formData.get("fullName")),
        phone: String(formData.get("phone")),
        address: String(formData.get("address")),
        city: String(formData.get("city")),
        state: String(formData.get("state")),
        instructions: String(formData.get("instructions") ?? ""),
        paymentMethod: String(formData.get("paymentMethod") ?? "card-test")
      });
      clear();
      router.push(`/orders/${res.orderId}?fresh=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <Link href="/bag" className="text-sm text-wine">← Back to bag</Link>
        <h1 className="mt-2 font-serif text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-muted">Test mode — no real money moves. Paystack live keys plug in later.</p>

        {items.length === 0 ? (
          <p className="mt-6 text-muted">Your bag is empty. <Link href="/search" className="text-wine underline">Find pieces</Link></p>
        ) : (
          <>
            <div className="mt-4 rounded-2xl border border-line bg-white p-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{delivery === 0 ? "Free" : naira(delivery)}</span></div>
              <div className="flex justify-between font-extrabold"><span>Total due now</span><span>{naira(subtotal + delivery)}</span></div>
            </div>

            <form action={onSubmit} className="mt-4 space-y-3 rounded-2xl border border-line bg-white p-5">
              <label className="block text-sm">Full name<input name="fullName" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
              <label className="block text-sm">Phone<input name="phone" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
              <label className="block text-sm">Delivery address<input name="address" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm">City<input name="city" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
                <label className="text-sm">State<input name="state" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
              </div>
              <label className="block text-sm">Delivery instructions (optional)<input name="instructions" className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
              <label className="block text-sm">Payment method
                <select name="paymentMethod" className="mt-1 w-full rounded-xl border border-line px-3 py-2">
                  <option value="card-test">Card (test)</option>
                  <option value="transfer-test">Bank transfer (test)</option>
                  <option value="pay-on-delivery">Pay on delivery</option>
                </select>
              </label>
              {error && <p className="text-sm text-wine">{error}</p>}
              <button disabled={busy} className="w-full rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC] disabled:opacity-50">
                {busy ? "Placing order…" : `Pay ${naira(subtotal + delivery)} (test)`}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
