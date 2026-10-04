import Link from "next/link";
import { addReview } from "@/lib/review-actions";

export default function Reviews({
  productId,
  reviews
}: {
  productId: string;
  reviews: { id: string; name: string; rating: number; text: string; fit: string | null }[];
}) {
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl">
        Reviews {reviews.length > 0 && <span className="text-base text-muted">★ {avg.toFixed(1)} ({reviews.length})</span>}
      </h2>
      <div className="mt-4 space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm font-bold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} <span className="font-normal text-muted">— {r.name}{r.fit ? ` • Fit: ${r.fit}` : ""}</span></p>
            <p className="mt-1 text-sm">{r.text}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-muted">No reviews yet — be the first.</p>}
      </div>

      <form action={addReview.bind(null, productId)} className="mt-4 space-y-3 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-serif text-lg">Write a review</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Stars (1–5)<input name="rating" type="number" min={1} max={5} defaultValue={5} className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="text-sm">How did it fit?
            <select name="fit" className="mt-1 w-full rounded-xl border border-line px-3 py-2">
              <option value="">—</option>
              <option>Smaller than expected</option>
              <option>True to size</option>
              <option>Larger than expected</option>
            </select>
          </label>
        </div>
        <label className="block text-sm">Review<textarea name="text" required rows={3} className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
        <button className="rounded-full bg-espresso px-6 py-2 text-sm font-bold text-[#FFF8EC]">Submit review</button>
      </form>
      <p className="mt-2 text-xs text-muted">Sign in to attach your name; guests post as “Verified buyer”. <Link href="/login" className="underline">Log in</Link></p>
    </section>
  );
}
