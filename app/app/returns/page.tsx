import Link from "next/link";

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-3xl">Returns & Exchanges</h1>
        <div className="mt-4 space-y-3 rounded-2xl border border-line bg-white p-5 text-sm">
          <p><strong>Window:</strong> request within 7 days of delivery.</p>
          <p><strong>Qualifies:</strong> unworn pieces with tags, in original condition.</p>
          <p><strong>Does not qualify:</strong> worn, altered or damaged pieces.</p>
          <p><strong>Exchange:</strong> choose a different size/colour where stock allows.</p>
          <p><strong>Refund:</strong> approved returns refunded to the original payment method.</p>
          <p><strong>Return delivery:</strong> buyer covers return delivery unless the piece arrived wrong or faulty.</p>
          <p className="text-muted">Start a return via <Link href="/help" className="underline">Chat With Us</Link> with your order number.</p>
        </div>
      </div>
    </main>
  );
}
