"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceNaira = parseInt(String(formData.get("priceNaira") ?? "0"), 10);
  const categoryId = String(formData.get("categoryId") ?? "");
  const size = String(formData.get("size") ?? "M").trim() || "M";
  const colour = String(formData.get("colour") ?? "Black").trim() || "Black";
  const stock = parseInt(String(formData.get("stock") ?? "0"), 10);
  const isNew = formData.get("isNew") === "on";
  const isBestSeller = formData.get("isBestSeller") === "on";

  if (!name || !description || !categoryId || Number.isNaN(priceNaira)) {
    throw new Error("Name, description, price and category are required.");
  }
  const slug = slugRaw || slugify(name);

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      priceNaira,
      categoryId,
      isNew,
      isBestSeller,
      images: { create: [{ url: "/uploads/placeholder.jpg", alt: name, position: 0 }] },
      variants: { create: [{ size, colour, stock: Number.isNaN(stock) ? 0 : stock }] }
    }
  });

  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceNaira = parseInt(String(formData.get("priceNaira") ?? "0"), 10);
  const available = formData.get("available") === "on";
  const isNew = formData.get("isNew") === "on";
  const isBestSeller = formData.get("isBestSeller") === "on";

  if (!name || !description || Number.isNaN(priceNaira)) {
    throw new Error("Name, description and price are required.");
  }

  await prisma.product.update({
    where: { id },
    data: { name, description, priceNaira, available, isNew, isBestSeller }
  });

  revalidatePath("/");
  revalidatePath(`/products/${id}`);
  redirect("/admin");
}

export async function toggleAvailability(id: string, available: boolean) {
  await prisma.product.update({ where: { id }, data: { available } });
  revalidatePath("/");
  revalidatePath("/admin");
}
