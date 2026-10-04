"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type BagItem = {
  productId: string;
  slug: string;
  name: string;
  size: string;
  colour: string;
  priceNaira: number;
  qty: number;
};

type BagCtx = {
  items: BagItem[];
  add: (item: Omit<BagItem, "qty">, qty?: number) => void;
  remove: (productId: string, size: string, colour: string) => void;
  setQty: (productId: string, size: string, colour: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const Ctx = createContext<BagCtx | null>(null);
const KEY = "cz-bag-v1";

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<BagCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.priceNaira * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return {
      items,
      subtotal,
      count,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find(
            (p) => p.productId === item.productId && p.size === item.size && p.colour === item.colour
          );
          if (found) {
            return prev.map((p) =>
              p.productId === item.productId && p.size === item.size && p.colour === item.colour
                ? { ...p, qty: p.qty + qty }
                : p
            );
          }
          return [...prev, { ...item, qty }];
        }),
      remove: (productId, size, colour) =>
        setItems((prev) => prev.filter((p) => !(p.productId === productId && p.size === size && p.colour === colour))),
      setQty: (productId, size, colour, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => !(p.productId === productId && p.size === size && p.colour === colour))
            : prev.map((p) =>
                p.productId === productId && p.size === size && p.colour === colour ? { ...p, qty } : p
              )
        ),
      clear: () => setItems([])
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBag() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBag must be used inside BagProvider");
  return ctx;
}
