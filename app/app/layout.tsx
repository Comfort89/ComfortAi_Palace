import type { Metadata } from "next";
import "./globals.css";
import { BagProvider } from "@/lib/bag";
import { WishlistProvider } from "@/lib/wishlist";
import SessionProviders from "@/components/SessionProviders";

export const metadata: Metadata = {
  title: "ComfortZone Palace — Luxury that feels like you",
  description: "Modern African luxury fashion for women."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SessionProviders>
          <BagProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </BagProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
