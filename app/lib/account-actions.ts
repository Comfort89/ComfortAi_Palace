"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function signup(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  if (!name || !email || password.length < 6) {
    throw new Error("Name, valid email and 6+ character password required.");
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.passwordHash) throw new Error("An account with this email already exists.");
  const passwordHash = await bcrypt.hash(password, 10);
  if (existing) {
    await prisma.user.update({ where: { email }, data: { name, passwordHash } });
  } else {
    await prisma.user.create({ data: { name, email, passwordHash } });
  }
  redirect("/login?created=1");
}
