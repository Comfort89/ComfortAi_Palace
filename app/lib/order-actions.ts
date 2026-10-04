"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deliveryFeeFor } from "@/lib/delivery";

export type CheckoutItem = { productId: string; size: string; colour: string; qty: number };

function orderNo() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CZ-${stamp}-${rand}`;
}

export async function createOrder(input: {
  items: CheckoutItem[];
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  instructions?: string;
  paymentMethod: string;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const clean = input.items.filter((i) => i.qty > 0).slice(0, 50);
  if (clean.length === 0) throw new Error("Your bag is empty.");
  if (!input.fullName.trim() || !input.phone.trim() || !input.address.trim() || !input.city.trim() || !input.state.trim()) {
    throw new Error("Full name, phone, address, city and state are required.");
  }

  const productIds = Array.from(new Set(clean.map((i) => i.productId)));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, available: true },
    include: { variants: true }
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const lines: { product: (typeof products)[number]; variant: (typeof products)[number]["variants"][number]; qty: number }[] = [];
  for (const item of clean) {
    const p = byId.get(item.productId);
    if (!p) throw new Error("A product in your bag is no longer available.");
    const variant = p.variants.find((v) => v.size === item.size && v.colour === item.colour);
    if (!variant) throw new Error(`${p.name} (${item.size}/${item.colour}) is no longer available.`);
    if (variant.stock < item.qty) throw new Error(`Only ${variant.stock} left for ${p.name} (${item.size}/${item.colour}).`);
    subtotal += p.priceNaira * item.qty;
    lines.push({ product: p, variant, qty: item.qty });
  }

  const deliveryFee = deliveryFeeFor(subtotal);
  const total = subtotal + deliveryFee;
  const no = orderNo();
  const reference = `PSK-TEST-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNo: no,
        userId,
        email: session?.user?.email ?? null,
        status: "Confirmed",
        subtotal,
        deliveryFee,
        total,
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        address: input.address.trim(),
        city: input.city.trim(),
        state: input.state.trim(),
        instructions: input.instructions?.trim() || null,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "pay-on-delivery" ? "pending" : "paid",
        items: {
          create: lines.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            size: l.variant.size,
            colour: l.variant.colour,
            priceNaira: l.product.priceNaira,
            qty: l.qty
          }))
        },
        payments: {
          create: {
            provider: "paystack-test",
            reference,
            amount: total,
            status: input.paymentMethod === "pay-on-delivery" ? "pending" : "paid"
          }
        }
      }
    });
    for (const l of lines) {
      await tx.variant.update({
        where: { id: l.variant.id },
        data: { stock: { decrement: l.qty } }
      });
    }
    return created;
  });

  return { orderId: order.id, orderNo: order.orderNo };
}
