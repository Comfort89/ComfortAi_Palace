import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComfortZone Palace — Luxury that feels like you",
  description: "Modern African luxury fashion for women."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
