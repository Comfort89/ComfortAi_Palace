import type { Metadata } from "next";
import "./globals.css";
import { BagProvider } from "@/lib/bag";
import { WishlistProvider } from "@/lib/wishlist";

export const metadata: Metadata = {
  title: "ComfortZone Palace — Luxury that feels like you",
  description: "Modern African luxury fashion for women."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <BagProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </BagProvider>
      </body>
    </html>
  );
}
