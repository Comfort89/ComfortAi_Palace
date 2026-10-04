"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function addReview(productId: string, formData: FormData) {
  const rating = parseInt(String(formData.get("rating") ?? "5"), 10);
  const text = String(formData.get("text") ?? "").trim();
  const fit = String(formData.get("fit") ?? "") || null;
  if (!text || Number.isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("A 1–5 star rating and written review are required.");
  }
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  await prisma.review.create({
    data: {
      productId,
      userId,
      name: session?.user?.name ?? "Verified buyer",
      rating,
      text,
      fit
    }
  });
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
  if (product) revalidatePath(`/products/${product.slug}`);
}

export async function addSupportMessage(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "General");
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !email || !message) throw new Error("Name, email and message are required.");
  await prisma.supportMessage.create({ data: { name, email, topic, message } });
}
