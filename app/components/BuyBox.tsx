"use client";

import { useState } from "react";
import { useBag } from "@/lib/bag";
import { useWishlist } from "@/lib/wishlist";

type Variant = { id: string; size: string; colour: string; stock: number };

export default function BuyBox({
  product
}: {
  product: { id: string; slug: string; name: string; priceNaira: number; variants: Variant[] };
}) {
  const { add } = useBag();
  const { has, toggle } = useWishlist();
  const [variantId, setVariantId] = useState(product.variants.find((v) => v.stock > 0)?.id ?? product.variants[0]?.id);
  const [added, setAdded] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId);
  const saved = has(product.slug);

  return (
    <div>
      <div className="space-y-2">
        {product.variants.map((v) => (
          <label
            key={v.id}
            className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-2 text-sm ${v.id === variantId ? "border-espresso bg-white" : "border-line bg-white"}`}
          >
            <span>
              <input type="radio" name="variant" checked={v.id === variantId} onChange={() => setVariantId(v.id)} className="mr-2" disabled={v.stock <= 0} />
              {v.size} • {v.colour}
            </span>
            <span className="text-muted">{v.stock > 0 ? `${v.stock} in stock` : "Sold out"}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          disabled={!variant || variant.stock <= 0}
          onClick={() => {
            if (!variant) return;
            add(
              { productId: product.id, slug: product.slug, name: product.name, size: variant.size, colour: variant.colour, priceNaira: product.priceNaira },
              1
            );
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC] disabled:opacity-40"
        >
          {added ? "Added ✓" : "Add to Bag"}
        </button>
        <button onClick={() => toggle(product.slug)} className="rounded-full border border-espresso px-6 py-3 font-bold">
          {saved ? "♥ Saved" : "♡ Save"}
        </button>
      </div>
    </div>
  );
}
