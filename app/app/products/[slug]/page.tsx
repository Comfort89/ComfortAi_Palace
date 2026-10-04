import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, images: true, variants: true }
  });
  if (!product || !product.available) notFound();

  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const stockLabel = totalStock <= 0 ? "Sold Out" : totalStock <= 3 ? `Only ${totalStock} Left` : "In Stock";

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="flex h-96 items-end justify-center rounded-2xl bg-gradient-to-b from-rose via-rosedeep to-espresso p-4">
            <span className="rounded-full bg-espresso px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-[#F6EDDD]">
              {product.name}
            </span>
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-golddark">{product.category.name}</p>
            <h1 className="mt-1 font-serif text-4xl">{product.name}</h1>
            <p className="mt-2 text-2xl font-extrabold">{naira(product.priceNaira)}</p>
            <p className="mt-1 text-sm text-muted">{stockLabel}</p>
            <p className="mt-4">{product.description}</p>
            <dl className="mt-4 space-y-1 text-sm">
              {product.fabric && <div><dt className="inline font-semibold">Fabric: </dt><dd className="inline">{product.fabric}</dd></div>}
              {product.fit && <div><dt className="inline font-semibold">Fit: </dt><dd className="inline">{product.fit}</dd></div>}
              {product.care && <div><dt className="inline font-semibold">Care: </dt><dd className="inline">{product.care}</dd></div>}
              {product.deliveryEstimate && <div><dt className="inline font-semibold">Delivery: </dt><dd className="inline">{product.deliveryEstimate}</dd></div>}
            </dl>
            <h2 className="mt-6 font-serif text-xl">Select Size & Colour</h2>
            <div className="mt-2 space-y-2">
              {product.variants.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-2 text-sm">
                  <span>{v.size} • {v.colour}</span>
                  <span className="text-muted">{v.stock > 0 ? `${v.stock} in stock` : "Sold out"}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC]">Add to Bag</button>
              <button className="rounded-full border border-espresso px-8 py-3 font-bold">Buy Now</button>
            </div>
            <p className="mt-3 text-xs text-muted">Checkout & payment arrive in Phase 4 — buttons are visual only.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
