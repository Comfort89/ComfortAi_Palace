import Link from "next/link";
import { addSupportMessage } from "@/lib/review-actions";

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-3xl">Chat With Us</h1>
        <p className="mt-1 text-sm text-muted">Orders, payment, delivery, sizing, returns & exchanges.</p>
        <form action={addSupportMessage} className="mt-4 space-y-3 rounded-2xl border border-line bg-white p-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Name<input name="name" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="text-sm">Email<input name="email" type="email" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          </div>
          <label className="block text-sm">Topic
            <select name="topic" className="mt-1 w-full rounded-xl border border-line px-3 py-2">
              <option>Order</option><option>Payment</option><option>Delivery</option>
              <option>Size</option><option>Returns</option><option>Exchange</option><option>General</option>
            </select>
          </label>
          <label className="block text-sm">Message<textarea name="message" required rows={4} className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <button className="rounded-full bg-espresso px-6 py-2 text-sm font-bold text-[#FFF8EC]">Send message</button>
        </form>
      </div>
    </main>
  );
}
