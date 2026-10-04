import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { deleteReview } from "@/lib/admin-ops";

export default async function AdminReviews() {
  await requireAdmin();
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { product: { select: { name: true, slug: true } } } });

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <Link href="/admin" className="text-sm text-wine">← Admin</Link>
        <h1 className="mt-2 font-serif text-3xl">Reviews</h1>
        <div className="mt-6 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-line bg-white p-4">
              <p className="text-sm"><strong>{"★".repeat(r.rating)}</strong> {r.product.name} • {r.name}{r.fit ? ` • Fit: ${r.fit}` : ""}</p>
              <p className="mt-1 text-sm">{r.text}</p>
              <form action={deleteReview.bind(null, r.id)} className="mt-2">
                <button className="text-sm text-wine">Delete</button>
              </form>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-sm text-muted">No reviews yet.</p>}
        </div>
      </div>
    </main>
  );
}
