"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { useEffect, useState } from "react";

type Item = { slug: string; name: string; priceNaira: number };

export default function WishlistPage() {
  const { ids, toggle } = useWishlist();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/wishlist-items?slugs=" + encodeURIComponent(ids.join(",")))
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .catch(() => setItems([]));
  }, [ids]);

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-3xl">My Wishlist</h1>
        <p className="mt-1 text-sm text-muted">Saved on this device. Accounts arrive in Phase 3.</p>
        {ids.length === 0 ? (
          <p className="mt-6 text-muted">Nothing saved yet. Tap ♡ on a product.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((p) => (
              <div key={p.slug} className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3">
                <Link href={`/products/${p.slug}`} className="font-serif text-lg">{p.name}</Link>
                <button onClick={() => toggle(p.slug)} className="text-sm text-wine">Remove ♥</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
