"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type WishCtx = {
  ids: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

const Ctx = createContext<WishCtx | null>(null);
const KEY = "cz-wishlist-v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const value = useMemo<WishCtx>(
    () => ({
      ids,
      has: (slug) => ids.includes(slug),
      toggle: (slug) => setIds((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
    }),
    [ids]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
