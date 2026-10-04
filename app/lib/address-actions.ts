"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function userId() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) throw new Error("Not signed in.");
  return id;
}

export async function addAddress(formData: FormData) {
  const id = await userId();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  if (!fullName || !phone || !address || !city || !state) throw new Error("All address fields are required.");
  await prisma.address.create({
    data: {
      userId: id,
      label: String(formData.get("label") ?? "Home"),
      fullName, phone, address, city, state,
      instructions: String(formData.get("instructions") ?? "") || null
    }
  });
  revalidatePath("/account/addresses");
}

export async function deleteAddress(addressId: string) {
  const id = await userId();
  await prisma.address.deleteMany({ where: { id: addressId, userId: id } });
  revalidatePath("/account/addresses");
}
