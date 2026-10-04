import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { products: { where: { available: true }, include: { variants: true }, orderBy: { createdAt: "asc" } } }
  });
  if (!category) notFound();

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-4xl">{category.name}</h1>
        {category.description && <p className="mt-2 text-muted">{category.description}</p>}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {category.products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_32px_rgba(43,33,24,0.10)]"
            >
              <div className="h-44 bg-gradient-to-b from-rose via-rosedeep to-espresso" />
              <div className="p-4">
                <h3 className="font-serif text-lg">{p.name}</h3>
                <p className="mt-1 text-[13px] text-muted">
                  {Array.from(new Set(p.variants.map((v) => v.size))).join(" • ") || "One size"}
                </p>
                <p className="mt-2 font-extrabold">{naira(p.priceNaira)}</p>
              </div>
            </Link>
          ))}
        </div>
        {category.products.length === 0 && (
          <p className="mt-6 text-muted">No pieces in this category yet.</p>
        )}
      </div>
    </main>
  );
}
