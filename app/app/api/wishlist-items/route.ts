import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slugs = (searchParams.get("slugs") ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 50);
  if (slugs.length === 0) return NextResponse.json([]);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, available: true },
    select: { slug: true, name: true, priceNaira: true }
  });
  return NextResponse.json(products);
}
