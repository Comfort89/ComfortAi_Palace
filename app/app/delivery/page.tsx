import Link from "next/link";

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-3xl">Delivery</h1>
        <div className="mt-4 space-y-3 rounded-2xl border border-line bg-white p-5 text-sm">
          <p><strong>Fee:</strong> ₦3,500 flat. Free on orders over ₦150,000.</p>
          <p><strong>Timing:</strong> 2–4 working days in Lagos, 3–5 working days elsewhere in Nigeria.</p>
          <p><strong>Coverage (v1):</strong> Nigeria only. International delivery comes later.</p>
          <p className="text-muted">You always see the full amount, including delivery, before confirming your order.</p>
        </div>
      </div>
    </main>
  );
}
