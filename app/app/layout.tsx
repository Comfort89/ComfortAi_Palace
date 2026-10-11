import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BagProvider } from "@/lib/bag";
import { WishlistProvider } from "@/lib/wishlist";
import SessionProviders from "@/components/SessionProviders";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "ComfortZone Palace — Luxury that feels like you",
  description: "Modern African luxury fashion for women.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ComfortZone"
  }
};

export const viewport: Viewport = {
  themeColor: "#2B2118"
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
